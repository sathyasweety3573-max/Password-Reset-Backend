import sgMail from "@sendgrid/mail";

async function sendEmail(token, email) {
  try {

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const resetLink = `https://e-mart-web.netlify.app/reset-password/${token}`;

    const msg = {
      to: email,

      from: {
        email: process.env.EMAIL_USER,
        name: "E-Mart Support",
      },

      subject: "Reset Your Password",

      text: `Click this link to reset your password: ${resetLink}`,

      html: `
        <h2>Password Reset</h2>
        <p>Click below link:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    };

    const response = await sgMail.send(msg);

    console.log("SENDGRID RESPONSE:", response);

    return {
      success: true,
    };

  } catch (error) {

    console.log("SENDGRID ERROR:", error.response?.body || error.message);

    return {
      success: false,
      error: error.message,
    };
  }
}

export default sendEmail;