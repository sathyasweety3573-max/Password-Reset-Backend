import User from "../models/user.schema.js";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

async function Login(req, res) {
  try {

    const { email, password } = req.body;

    // convert email to lowercase
    const lowerCaseEmail = email.toLowerCase();

    // find user
    const user = await User.findOne({
      email: lowerCaseEmail,
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      user: user._id,
    });

  } catch (error) {

    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Error authenticating user",
    });
  }
}

async function forgotPassword(req, res) {
  try {

    const { email } = req.body;

    console.log("EMAIL FROM FRONTEND:", email);

    // lowercase email
    const lowerCaseEmail = email.toLowerCase();

    // check user
    const user = await User.findOne({
      email: lowerCaseEmail,
    });

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User with this email does not exist",
      });
    }

    // generate token
    const token = crypto
      .randomBytes(20)
      .toString("hex");

    console.log("GENERATED TOKEN:", token);

    // save token in database
    user.resetPasswordToken = token;

    user.resetPasswordExpires =
      Date.now() + 3600000;

    await user.save();

    console.log(
      "TOKEN SAVED SUCCESSFULLY"
    );

    // send email
    const emailResponse = await sendEmail(
      token,
      lowerCaseEmail
    );

    console.log(
      "EMAIL RESPONSE:",
      emailResponse
    );

    // email failed
    if (!emailResponse.success) {

      console.log(
        "EMAIL SENDING FAILED"
      );

      return res.status(500).json({
        success: false,
        message: "Email sending failed",
        error: emailResponse.error,
      });
    }

    console.log(
      "EMAIL SENT SUCCESSFULLY"
    );

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

async function verifyResetToken(req, res) {
  try {

    const { token } = req.params;

    console.log(
      "VERIFY TOKEN:",
      token
    );

    const user = await User.findOne({
      resetPasswordToken: token,

      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {

      return res.status(400).json({
        success: false,
        message:
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
      message: "Server error",
    });
  }
}

async function resetPassword(req, res) {
  try {

    const { token } = req.params;

    const {
      newPassword,
      confirmPassword,
    } = req.body;

    console.log(
      "RESET TOKEN:",
      token
    );

    // check passwords
    if (
      newPassword !== confirmPassword
    ) {

      return res.status(400).json({
        success: false,
        error:
          "Passwords do not match",
      });
    }

    // find user
    const user = await User.findOne({
      resetPasswordToken: token,

      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    console.log(
      "USER FOR RESET:",
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
        confirmPassword,
        salt
      );

    // remove token
    user.resetPasswordToken = null;

    user.resetPasswordExpires = null;

    await user.save();

    console.log(
      "PASSWORD RESET SUCCESS"
    );

    return res.status(200).json({
      success: true,
      message:
        "Password reset successful",
    });

  } catch (error) {

    console.log(
      "RESET PASSWORD ERROR:",
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