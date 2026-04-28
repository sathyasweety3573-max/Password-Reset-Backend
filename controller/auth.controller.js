import User from "../models/user.schema.js";

import bcrypt from "bcrypt";

import sendEmail from "../utils/sendEmail.js";

import crypto from "crypto";



// LOGIN
async function Login(
  req,
  res
) {

  try {

    const {
      email,
      password,
    } = req.body;

    const lowerCaseEmail =
      email
        .toLowerCase()
        .trim();

    // find user
    const user =
      await User.findOne({

        email: {
          $regex:
            new RegExp(
              "^" +
              lowerCaseEmail +
              "$",
              "i"
            ),
        },
      });

    console.log(
      "LOGIN USER:",
      user
    );

    // user not found
    if (!user) {

      return res.status(400).json({

        success: false,

        error:
          "Invalid credentials",
      });
    }

    // compare password
    const isPasswordValid =
      await bcrypt.compare(

        password,

        user.password
      );

    // invalid password
    if (
      !isPasswordValid
    ) {

      return res.status(400).json({

        success: false,

        error:
          "Invalid credentials",
      });
    }

    // success
    return res.status(200).json({

      success: true,

      message:
        "Authentication successful",

      user: user._id,
    });

  } catch (error) {

    console.log(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      error:
        "Error authenticating user",
    });
  }
}




// FORGOT PASSWORD
async function forgotPassword(
  req,
  res
) {

  try {

    const { email } =
      req.body;

    console.log(
      "EMAIL FROM FRONTEND:",
      email
    );

    const lowerCaseEmail =
      email
        .toLowerCase()
        .trim();

    // find user
    const user =
      await User.findOne({

        email: {
          $regex:
            new RegExp(
              "^" +
              lowerCaseEmail +
              "$",
              "i"
            ),
        },
      });

    console.log(
      "FOUND USER:",
      user
    );

    // user not found
    if (!user) {

      return res.status(400).json({

        success: false,

        error:
          "User with this email does not exist",
      });
    }

    // generate token
    const token =
      crypto
        .randomBytes(20)
        .toString("hex");

    console.log(
      "GENERATED TOKEN:",
      token
    );

    // save token
    user.resetPasswordToken =
      token;

    // 1 hour expiry
    user.resetPasswordExpires =
      new Date(
        Date.now() + 3600000
      );

    await user.save();

    console.log(
      "TOKEN SAVED:",
      user.resetPasswordToken
    );

    console.log(
      "TOKEN EXPIRES:",
      user.resetPasswordExpires
    );

    // send email
    const emailResponse =
      await sendEmail(
        token,
        lowerCaseEmail
      );

    console.log(
      "EMAIL RESPONSE:",
      emailResponse
    );

    // email failed
    if (
      !emailResponse.success
    ) {

      return res.status(500).json({

        success: false,

        error:
          "Email sending failed",
      });
    }

    // success
    return res.status(200).json({

      success: true,

      message:
        "Password reset email sent successfully",
    });

  } catch (error) {

    console.log(
      "FORGOT PASSWORD ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      error:
        "Server error",
    });
  }
}




// VERIFY TOKEN
async function verifyResetToken(
  req,
  res
) {

  try {

    const token =
      req.params.token.trim();

    console.log(
      "VERIFY TOKEN:",
      token
    );

    // find user
    const user =
      await User.findOne({

        resetPasswordToken:
          token,

      });

    console.log(
      "VERIFY USER:",
      user
    );

    // token invalid
    if (!user) {

      return res.status(400).json({

        success: false,

        error:
          "Invalid token",
      });
    }

    // token expired
    if (
      user.resetPasswordExpires <
      Date.now()
    ) {

      return res.status(400).json({

        success: false,

        error:
          "Token expired",
      });
    }

    // success
    return res.status(200).json({

      success: true,

      message:
        "Token valid",
    });

  } catch (error) {

    console.log(
      "VERIFY TOKEN ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      error:
        "Server error",
    });
  }
}




// RESET PASSWORD
async function resetPassword(
  req,
  res
) {

  try {

    const rawToken =
      req.params.token;

    const token =
      decodeURIComponent(
        rawToken
      ).trim();

    const {
      newPassword,
      confirmPassword,
    } = req.body;

    console.log(
      "RAW TOKEN:",
      rawToken
    );

    console.log(
      "DECODED TOKEN:",
      token
    );

    // password check
    if (
      newPassword !==
      confirmPassword
    ) {

      return res.status(400).json({

        success: false,

        error:
          "Passwords do not match",
      });
    }

    // get all users
    const users =
      await User.find();

    console.log(
      "ALL TOKENS:"
    );

    users.forEach((u) => {

      console.log(
        u.email,
        u.resetPasswordToken
      );

    });

    // find matching user
    const user =
      await User.findOne({

        resetPasswordToken:
          token,
      });

    console.log(
      "MATCHED USER:",
      user
    );

    if (!user) {

      return res.status(400).json({

        success: false,

        error:
          "Invalid or expired token",
      });
    }

    // hash password
    const salt =
      await bcrypt.genSalt(10);

    user.password =
      await bcrypt.hash(
        newPassword,
        salt
      );

    // clear token
    user.resetPasswordToken =
      null;

    user.resetPasswordExpires =
      null;

    await user.save();

    return res.status(200).json({

      success: true,

      message:
        "Password reset successful",
    });

  } catch (error) {

    console.log(
      "RESET ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      error:
        "Server error",
    });
  }
}

export {

  Login,

  forgotPassword,

  verifyResetToken,

  resetPassword,
};