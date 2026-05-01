import sgMail from "@sendgrid/mail";

async function sendEmail(
  token,
  email
) {

  try {

    sgMail.setApiKey(
      process.env.SENDGRID_API_KEY
    );

    // RESET PASSWORD PAGE URL
    const resetLink =

      `https://amazing-biscotti-c4fc27.netlify.app/reset-password/${token}`;

    console.log(
      "RESET LINK:",
      resetLink
    );

    const msg = {

      to: email,

      from:
        "sathyasweety3573@gmail.com",

      subject:
        "Reset Password",

      text:
        `Reset your password using this link: ${resetLink}`,

      html: `
        <h2>Reset Password</h2>

        <p>
          Click the button below
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

    await sgMail.send(msg);

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