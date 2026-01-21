// Success response
const sendSuccess = (res, message = "SUCCESS", status = 200, data = null, meta = null) => {
	return res.status(status).json({
		message,
		data,
		meta,
	})
}

// Error response
const sendError = (res, message = "ERROR", status = 400) => {
	return res.status(status).json({
		message,
		data: null,
		meta: null,
	})
}

export { sendSuccess, sendError }
