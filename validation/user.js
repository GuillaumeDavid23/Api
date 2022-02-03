import { body } from 'express-validator'

export default () => {
	return [
		body('firstname').notEmpty().isAlpha(),
		body('lastname').notEmpty().isAlpha(),
		body('email').notEmpty().isEmail(),
		body('password').notEmpty().matches(process.env.passwordRegex),
		body('token').if(body('token').notEmpty()).isAlphanumeric(),
		body('phone').if(body('phone').notEmpty()).isMobilePhone(['fr-FR', []]),
		body('newsletter').notEmpty().isBoolean(),
		body('status').isBoolean(),
		body('ref')
			.if(body('ref').notEmpty())
			.isAlphanumeric()
			.isLength({ min: 10, max: 10 }),
	]
}
