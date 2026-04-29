import sgMail from "@sendgrid/mail";

const sendEmail = async (
  token,
  email
) => {

  try {

    sgMail.setApiKey(
      process.env.SENDGRID_API_KEY
    );

    // IMPORTANT
    // change this to your frontend URL
    const resetLink =

      `https://e-mart-web.netlify.app/reset-password/${token}`;

    console.log(
      "RESET LINK:",
      resetLink
    );

    const msg = {

      to: email,

      from: {

        email:
          "sathyasweety3573@gmail.com",

        name:
          "E-Mart Support",

      },

      subject:
        "Password Reset Request",

      text:
        `Click this link to reset your password: ${resetLink}`,

      html: `
        <div style="font-family: Arial;">

          <h2>
            Reset Your Password
          </h2>

          <p>
            Click the button below
            to reset your password.
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

          <p>
            Or copy this link:
          </p>

          <p>
            ${resetLink}
          </p>

        </div>
      `,

    };

    await sgMail.send(msg);

    console.log(
      "EMAIL SENT SUCCESSFULLY"
    );

    return {

      success: true,

    };

  } catch (error) {

    console.log(
      "SEND EMAIL ERROR:",
      error.response?.body ||
      error.message
    );

    return {

      success: false,

      error:
        error.message,

    };

  }

};

export default sendEmail;