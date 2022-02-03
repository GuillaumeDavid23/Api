import { validationResult } from 'express-validator'

const asyncForEach = async (array, callback) => {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array)
	}
}

const validation = (req, res, next) => {
	const errors = validationResult(req)
	if (errors.isEmpty()) {
		return next()
	}
	const extractedErrors = []
	errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }))

	return res.status(422).json({
		errors: extractedErrors,
	})
}

export { asyncForEach, validation }
