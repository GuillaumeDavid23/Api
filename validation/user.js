import { body, validationResult } from 'express-validator'

export default (req, res, next) => {
	body('firstname').notEmpty().isAlpha()
	body('lastname').notEmpty().isAlpha()
	body('email').notEmpty().isEmail()
	body('password').notEmpty().matches(process.env.passwordRegex)
	body('token').notEmpty().isAlphanumeric()
	body('phone').notEmpty().isMobilePhone(['fr-FR', []])
	body('newsletter').notEmpty().isBoolean()
	body('status').notEmpty().isBoolean()
	body('ref').notEmpty().isAlphanumeric().isLength({ min: 10, max: 10 })

	if (!validationResult(req).isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	} else {
		next()
	}
}
