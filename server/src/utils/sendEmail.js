import axios from "axios"

export const sendEmail = async (to, subject, html) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        to: [{ email: to }],
        sender: {
          name: "Column Blog",
          email: process.env.EMAIL_FROM,
        },
        subject: subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    )

    console.log("Email sent via Brevo API:", response.data.messageId)
    return response.data
  } catch (error) {
    console.error("Brevo email error:", error.response?.data || error.message)
    throw error
  }
}