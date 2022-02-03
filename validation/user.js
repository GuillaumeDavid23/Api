import { body } from 'express-validator'

export default () => {
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
