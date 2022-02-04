import { body } from 'express-validator'

export default () => {
	return [
		body('firstname').if(body('firstname').exists()).notEmpty().isAlpha(),
		body('lastname').if(body('lastname').exists()).notEmpty().isAlpha(),
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

		// Agent:
		body('phonePro')
			.if(body('phonePro').exists())
			.notEmpty()
			.isMobilePhone(['fr-FR', []]),

		// Buyer:
		body('budgetMin').if(body('budgetMin').exists()).isInt(),
		body('budgetMax').if(body('budgetMax').exists()).isInt(),
		body('city').if(body('city').exists()).isAlpha(),
		body('surfaceMin').if(body('surfaceMin').exists()).isInt(),
		body('surfaceMax').if(body('surfaceMax').exists()).isInt(),
		body('type').if(body('type').exists()).isAlpha(),

		// Seller:
		body('isSelling').if(body('isSelling').exists()).notEmpty().isBoolean(),
	]
}
