import sgMail from "@sendgrid/mail";

async function sendEmail(token, email) {

  try {

    sgMail.setApiKey(
      process.env.SENDGRID_API_KEY
    );

    // RESET LINK
    const resetLink =
      `https://e-mart-web.netlify.app/reset-password/${token}`;

    console.log(
      "RESET LINK:",
      resetLink
    );

    const msg = {

      to: email,

      // IMPORTANT
      from: "sathyasweety3573@gmail.com",

      subject:
        "Reset Your Password",

      text:
        `Click this link to reset your password: ${resetLink}`,

      html: `
        <h2>Password Reset</h2>

        <p>
          Click the button below
          to reset your password
        </p>

        <a
          href="${resetLink}"
          style="
            background:black;
            color:white;
            padding:12px 20px;
            text-decoration:none;
            border-radius:5px;
            display:inline-block;
          "
        >
          Reset Password
        </a>

        <br /><br />

        <p>
          Or copy this link:
        </p>

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
        error.response?.body ||
        error.message,
    };
  }
}

export default sendEmail;