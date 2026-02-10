import crypto from "crypto"
import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { sendError, sendSuccess } from "../utils/response.js"
import { sendEmail } from "../utils/sendEmail.js"
import {
  generatePasswordResetEmail,
  generateVerificationEmail,
} from "../utils/emailTemplate.js"

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) {
      return sendError(res, "Name, email, and password are required")
    }

    const userExists = await User.findOne({ email })
    if (userExists) return sendError(res, "User already exists")

    // Determine role
    let userRole = "user" // default
    if (req.user && req.user.role === "admin" && role) {
      // Admin can set a custom role
      userRole = role
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      isVerified: false,
    })

    // Generate verification token
    const rawToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex")

    user.verificationToken = hashedToken
    user.verificationTokenExpires = Date.now() + 1000 * 60 * 60 // 1 hour
    await user.save({ validateBeforeSave: false })

    // Send verification email
    const verifyURL = `${process.env.EMAIL_FRONTEND_URL}/verify-email?token=${rawToken}`
    const { htmlContent, textContent } = generateVerificationEmail(
      user.name,
      verifyURL,
    )

    sendEmail(user.email, "Verify your email", htmlContent, textContent)

    return sendSuccess(
      res,
      "Registration successful. Please verify your email.",
      201,
      {
        userCreated: true,
      },
    )
  } catch (error) {
    return sendError(res, `registerUser Error :: ${error}`)
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return sendError(res, "Email and Password are required")

    const user = await User.findOne({ email })

    if (!user)
      return sendError(res, "User not found", 404, {
        message: "NOT FOUND",
      })

    const isMatch = await user.matchPassword(password)

    if (!isMatch) return sendError(res, "Invalid credentials")

    if (!user.isVerified) {
      return sendError(res, "Please verify your email", 403, {
        verificationMessage: "NOT VERIFIED",
      })
    }

    if (user?.status !== "active") {
      return sendError(res, "Your account is blocked", 403)
    }

    const token = generateToken(user?._id, user?.role)

    return sendSuccess(res, "User Logged In successfully", 200, {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    return sendError(res, error.message, 500)
  }
}

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" })
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link" })
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpires = undefined

    await user.save()

    return sendSuccess(res, "Email verified successfully", 200, {
      emailVerified: true,
    })
  } catch (error) {
    console.error("verifyEmail error:", error)
    return sendError(res, "Something went wrong", 500, {
      emailVerified: false,
    })
  }
}

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) return sendError(res, "Email is required")

    const user = await User.findOne({ email })

    if (!user) return sendError(res, "User not found", 404)

    if (user.isVerified) return sendError(res, "Email is already verified")

    // Generate new token
    const rawToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex")

    user.verificationToken = hashedToken
    user.verificationTokenExpires = Date.now() + 60 * 60 * 1000 // 1 hour
    await user.save({ validateBeforeSave: false })

    const verificationURL = `${process.env.EMAIL_FRONTEND_URL}/verify-email?token=${rawToken}`

    const { htmlContent, textContent } = generateVerificationEmail(
      user.name,
      verificationURL,
    )

    sendEmail(
      user.email,
      "Verify your email",
      htmlContent,
      textContent
    )

    return sendSuccess(res, "Verification email resent")
  } catch (error) {
    return sendError(res, error.message, 500)
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) return sendError(res, "Email is required")

    const user = await User.findOne({ email })

    if (!user) return sendError(res, "No user with that email", 404)

    const rawToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex")

    user.resetPasswordToken = hashedToken
    user.resetPasswordTokenExpires = Date.now() + 15 * 60 * 1000 // 15 min
    await user.save()

    const resetURL = `${process.env.EMAIL_FRONTEND_URL}/reset-password?token=${rawToken}`

    const { htmlContent, textContent } = generatePasswordResetEmail(
      user?.name,
      resetURL,
    )

    sendEmail(user.email, "Password Reset Request", htmlContent, textContent)

    return sendSuccess(res, "Password reset email sent")
  } catch (error) {
    return sendError(res, error.message, 500)
  }
}

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    if (!password) return sendError(res, "Password is required")

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpires: { $gt: Date.now() },
    })

    if (!user) return sendError(res, "Invalid or expired reset link", 400)

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordTokenExpires = undefined

    await user.save()

    return sendSuccess(res, "Password reset successful")
  } catch (error) {
    return sendError(res, error.message, 500)
  }
}

export {
  registerUser,
  login,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
}
