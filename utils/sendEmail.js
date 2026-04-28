import sgMail from "@sendgrid/mail";

async function sendEmail(token, email) {

  try {

    // SENDGRID API KEY
    sgMail.setApiKey(
      process.env.SENDGRID_API_KEY
    );

    // FRONTEND RESET URL
    const resetLink =
      `https://e-mart-web.netlify.app/reset-password/${token}`;

    console.log(
      "RESET LINK:",
      resetLink
    );

    // EMAIL CONTENT
    const msg = {

      to: email,

      // VERIFIED SENDER
      from:
        "sathyasweety3573@gmail.com",

      subject:
        "Reset Your Password",

      text:
        `Reset your password using this link: ${resetLink}`,

      html: `
        <h2>Password Reset</h2>

        <p>
          Click the link below
          to reset your password
        </p>

        <a href="${resetLink}">
          Reset Password
        </a>

        <br /><br />

        <p>
          ${resetLink}
        </p>
      `,
    };

    // SEND EMAIL
    const response =
      await sgMail.send(msg);

    console.log(
      "SENDGRID RESPONSE:",
      response
    );

    return {

      success: true,
    };

  } catch (error) {

    console.log(
      "SENDGRID ERROR:",
      error.response?.body ||
      error.message
    );

    return {

      success: false,

      error:
        error.message,
    };
  }
}

export default sendEmail;