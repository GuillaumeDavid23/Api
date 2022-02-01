import { body, validationResult } from 'express-validator'

export default (req, res, next) => {
	body('firstname').isAlpha()
	body('lastname').isAlpha()
	body('email').isEmail()
	body('password').matches(process.env.passwordRegex)
	body('token').isAlphanumeric()
	body('phone').isMobilePhone(['fr-FR', []])
	body('newsletter').isBoolean()
	body('status').isBoolean()
	body('ref').isAlphanumeric()

	if (!validationResult(req).isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	} else {
		next()
	}
}
