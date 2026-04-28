import User from "../models/user.schema.js";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";


// LOGIN
async function Login(req, res) {

  try {

    const { email, password } =
      req.body;

    const lowerCaseEmail =
      email.toLowerCase().trim();

    const user =
      await User.findOne({

        email: {
          $regex: new RegExp(
            "^" +
            lowerCaseEmail +
            "$",
            "i"
          ),
        },

      });

    if (!user) {

      return res.status(400).json({

        success: false,

        error:
          "Invalid credentials",

      });

    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordValid) {

      return res.status(400).json({

        success: false,

        error:
          "Invalid credentials",

      });

    }

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
        "Server error",

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

    const lowerCaseEmail =
      email.toLowerCase().trim();

    const user =
      await User.findOne({

        email: {
          $regex: new RegExp(
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

    if (!user) {

      return res.status(400).json({

        success: false,

        error:
          "User not found",

      });

    }

    const token =
      crypto
        .randomBytes(20)
        .toString("hex");

    user.resetPasswordToken =
      token;

    user.resetPasswordExpires =
      Date.now() + 3600000;

    await user.save();

    console.log(
      "TOKEN SAVED:",
      token
    );

    await sendEmail(
      token,
      lowerCaseEmail
    );

    return res.status(200).json({

      success: true,

      message:
        "Reset email sent",

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

    const user =
      await User.findOne({

        resetPasswordToken:
          token,

      });

    if (!user) {

      return res.status(400).json({

        success: false,

        error:
          "Invalid token",

      });

    }

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

    const token =
      req.params.token.trim();

    const {
      newPassword,
      confirmPassword,
    } = req.body;

    console.log(
      "TOKEN FROM FRONTEND:",
      token
    );

    const allUsers =
      await User.find();

    console.log(
      "ALL USERS TOKENS:"
    );

    allUsers.forEach((user) => {

      console.log({

        email: user.email,

        token:
          user.resetPasswordToken,

      });

    });

    const user =
      await User.findOne({

        resetPasswordToken:
          token,

      });

    console.log(
      "MATCH USER:",
      user
    );

    if (!user) {

      return res.status(400).json({

        success: false,

        error:
          "Invalid token",

      });

    }

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

    const salt =
      await bcrypt.genSalt(10);

    user.password =
      await bcrypt.hash(
        newPassword,
        salt
      );

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