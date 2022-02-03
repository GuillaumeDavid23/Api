import { body, validationResult } from 'express-validator'
const userValidationRules = () => {
	return [
		body('firstname').notEmpty().isAlpha(),
		body('lastname').notEmpty().isAlpha(),
		body('email').notEmpty().isEmail(),
		body('password').notEmpty().matches(process.env.passwordRegex),
		body('token').if(body('token').notEmpty()).isAlphanumeric(),
		body('phone').if(body('phone').notEmpty()).isMobilePhone(['fr-FR', []]),
		body('newsletter')
			.if(body('newsletter').notEmpty())
			.notEmpty()
			.isBoolean(),
		body('status').if(body('status').notEmpty()).isBoolean(),
		body('ref')
			.if(body('ref').notEmpty())
			.isAlphanumeric()
			.isLength({ min: 10, max: 10 }),
	]
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

export { userValidationRules, validation }
