import User from "../models/user.schema.js";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";


async function Login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // If authentication is successful, return success response
    return res
      .status(200)
      .json({ message: "Authentication successful", user: user._id });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error authenticating user: " + error.message });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    // Check if user exists in database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "User with this email does not exist",
      });
    }

    // Generate secure random reset token
    const token = crypto.randomBytes(20).toString("hex");

    // Save token and expiry time in database
    // expiry set to 1 day
    const updateRes = await User.updateOne(
      { email },
      {
        $set: {
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 3600000,
        },
      },
    );

    console.log(updateRes);

    // Send reset token to user's email
    const emailResponse = await sendEmail(token, email);

    if (!emailResponse.success) {
      return res.status(500).json({
        success: false,
        message: emailResponse.message,
        error: emailResponse.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
      token : token
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

async function verifyResetToken(req, res) {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });

    res.status(200).json({
      success: true,
      message: "Token valid",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

async function resetPassword(req, res) {
  try {
    const { token } = req.params;

    const { confirmPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({
        success: false,
        error: "Invalid or expired token",
      });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(confirmPassword, salt);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
}

export { Login, forgotPassword, verifyResetToken, resetPassword };