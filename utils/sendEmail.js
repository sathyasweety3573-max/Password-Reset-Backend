import sgMail from "@sendgrid/mail";

async function sendEmail(token, email) {
  try {

    // check token
    console.log("TOKEN:", token);

    // validate token
    if (!token) {
      throw new Error(
        "Reset token is missing"
      );
    }

    // validate email
    if (!email) {
      throw new Error(
        "Recipient email is missing"
      );
    }

    // set sendgrid api key
    sgMail.setApiKey(
      process.env.SENDGRID_API_KEY
    );

    // reset link
    const resetLink =
      `https://e-mart-web.netlify.app/reset-password/${token}`;

    console.log(
      "RESET LINK:",
      resetLink
    );

    // email message
    const msg = {

      to: email,

      from: {
        email:
          process.env.EMAIL_USER,

        name: "E-Mart Support",
      },

      subject:
        "Reset Your Password",

      replyTo:
        "sathyapandi3573@gmail.com",

      html: `
        <div
          style="
            font-family: Arial;
            padding: 20px;
          "
        >

          <h2>
            Password Reset Request
          </h2>

          <p>
            We received a request
            to reset your password.
          </p>

          <p>
            Click the button below
            to reset your password:
          </p>

          <a
            href="${resetLink}"

            style="
              background-color: black;
              color: white;
              padding: 12px 20px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
              margin-top: 10px;
            "
          >
            Reset Password
          </a>

          <p
            style="
              margin-top: 20px;
            "
          >
            This link will expire
            in 1 hour.
          </p>

          <p>
            If you did not request
            this, please ignore
            this email.
          </p>

          <br />

          <p>
            Regards,
            <br />
            E-Mart Support Team
          </p>

        </div>
      `,
    };

    // send email
    const response =
      await sgMail.send(msg);

    console.log(
      "EMAIL SENT SUCCESSFULLY"
    );

    console.log(
      "SENDGRID RESPONSE:",
      response
    );

    return {
      success: true,

      message:
        "Email sent successfully",

      response,
    };

  } catch (error) {

    console.error(
      "EMAIL SENDING FAILED:",
      error.response?.body ||
      error.message
    );

    return {

      success: false,

      message:
        "Failed to send email",

      error:
        error.response?.body ||
        error.message,
    };
  }
}

export default sendEmail;