import User from "../models/user.schema.js";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";


// LOGIN
async function Login(req, res) {

  try {

    const { email, password } = req.body;

    if (!email || !password) {

      return res.status(400).json({

        success: false,

        error: "Email and password are required",

      });

    }

    const lowerCaseEmail =
      email.toLowerCase().trim();

    const user =
      await User.findOne({

        email: lowerCaseEmail,

      });

    if (!user) {

      return res.status(400).json({

        success: false,

        error: "Invalid credentials",

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

        error: "Invalid credentials",

      });

    }

    return res.status(200).json({

      success: true,

      message: "Login successful",

      user: user._id,

    });

  } catch (error) {

    console.log(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      error: "Server error",

    });

  }

}



// FORGOT PASSWORD
async function forgotPassword(
  req,
  res
) {

  try {

    const { email } = req.body;

    if (!email) {

      return res.status(400).json({

        success: false,

        error: "Email is required",

      });

    }

    const lowerCaseEmail =
      email.toLowerCase().trim();

    const user =
      await User.findOne({

        email: lowerCaseEmail,

      });

    console.log(
      "FOUND USER:",
      user
    );

    if (!user) {

      return res.status(400).json({

        success: false,

        error: "User not found",

      });

    }

    const token =
      crypto
        .randomBytes(32)
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

    const emailResponse =
      await sendEmail(
        token,
        lowerCaseEmail
      );

    if (!emailResponse.success) {

      return res.status(500).json({

        success: false,

        error: "Email sending failed",

      });

    }

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

      error: "Server error",

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

        resetPasswordToken: token,

        resetPasswordExpires: {
          $gt: Date.now(),
        },

      });

    if (!user) {

      return res.status(400).json({

        success: false,

        error:
          "Invalid or expired token",

      });

    }

    return res.status(200).json({

      success: true,

      message: "Token valid",

    });

  } catch (error) {

    console.log(
      "VERIFY TOKEN ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      error: "Server error",

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

    if (
      !newPassword ||
      !confirmPassword
    ) {

      return res.status(400).json({

        success: false,

        error:
          "All fields are required",

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

    const user =
      await User.findOne({

        resetPasswordToken: token,

        resetPasswordExpires: {
          $gt: Date.now(),
        },

      });

    console.log(
      "MATCH USER:",
      user
    );

    if (!user) {

      return res.status(400).json({

        success: false,

        error:
          "Invalid or expired token",

      });

    }

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        salt
      );

    user.password =
      hashedPassword;

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

      error: "Server error",

    });

  }

}


export {

  Login,

  forgotPassword,

  verifyResetToken,

  resetPassword,

};