import { body } from 'express-validator'

export default () => {
	return [
		body('firstname').if(body('firstname').notEmpty()).notEmpty().isAlpha(),
		body('lastname').if(body('lastname').notEmpty()).notEmpty().isAlpha(),
		body('email').if(body('email').notEmpty()).notEmpty().isEmail(),
		body('password')
			.if(body('password').notEmpty())
			.notEmpty()
			.matches(process.env.passwordRegex),
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
		body('agent.phonePro')
			.if(body('agent.phonePro').exists())
			.notEmpty()
			.isMobilePhone(['fr-FR', []]),

		// Buyer:
		body('buyer.budgetMin').if(body('buyer.budgetMin').exists()).isInt(),
		body('buyer.budgetMax').if(body('buyer.budgetMax').exists()).isInt(),
		body('buyer.city').if(body('buyer.city').exists()).isAlpha(),
		body('buyer.surfaceMin').if(body('buyer.surfaceMin').exists()).isInt(),
		body('buyer.surfaceMax').if(body('buyer.surfaceMax').exists()).isInt(),
		body('buyer.type').if(body('buyer.type').exists()).isAlpha(),

		// Seller:
		body('seller.isSelling')
			.if(body('seller.isSelling').exists())
			.notEmpty()
			.isBoolean(),
	]
}
