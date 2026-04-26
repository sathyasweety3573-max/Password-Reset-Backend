import sgMail from "@sendgrid/mail";

async function sendEmail(token, email) {
  try {

    // check token
    console.log("TOKEN:", token);

    // Validate token
    if (!token) {
      throw new Error("Reset token is missing");
    }

    // Validate email
    if (!email) {
      throw new Error("Recipient email is missing");
    }

    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Reset link
    const resetLink = `https://e-mart-web.netlify.app/reset-password/${token}`;

    console.log("RESET LINK:", resetLink);

    // Email message
    const msg = {
      to: email,

      from: process.env.EMAIL_USER,

      subject: "Password Reset Request",

      replyTo: "sathyapandi3573@gmail.com",

      text: `
Password Reset Request

We received a request to reset your password.

Click the link below to reset your password:

${resetLink}

This link will expire in 1 hour.

If you did not request this request, please ignore this email.

Regards,
E-mart Support Team
      `,

      html: `
        <h2>Password Reset Request</h2>

        <p>We received a request to reset your password.</p>

        <p>
          Click the link below to reset your password:
        </p>

        <a href="${resetLink}">
          Reset Password
        </a>

        <p>
          This link will expire in 1 hour.
        </p>

        <p>
          If you did not request this, please ignore this email.
        </p>

        <br />

        <p>
          Regards,
          <br />
          E-mart Support Team
        </p>
      `,
    };

    // Send email
    const response = await sgMail.send(msg);

    console.log("Email sent successfully");

    return {
      success: true,
      message: "Email sent successfully",
      response,
    };

  } catch (error) {

    console.error(
      "Email sending failed:",
      error.message
    );

    return {
      success: false,
      message: "Failed to send email",
      error: error.message,
    };
  }
}

export default sendEmail;