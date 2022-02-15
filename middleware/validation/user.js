import { body } from 'express-validator'

export default () => {
	return [
		body('firstname')
			.if(body('firstname').exists())
			.notEmpty()
			.withMessage(),
		body('firstname')
			.if(body('firstname').exists())
			.notEmpty()
			.isAlpha()
			.withMessage(),

		body('lastname').if(body('lastname').exists()).notEmpty().withMessage(),
		body('lastname')
			.if(body('lastname').exists())
			.notEmpty()
			.isAlpha()
			.withMessage(),

		body('email').notEmpty().withMessage(),
		body('email').notEmpty().isEmail().withMessage(),

		body('password').notEmpty().withMessage(),
		body('password')
			.notEmpty()
			.matches(process.env.passwordRegex)
			.withMessage(),

		body('token')
			.if(body('token').notEmpty())
			.isAlphanumeric()
			.withMessage(),
		body('token')
			.if(body('token').notEmpty())
			.isAlphanumeric()
			.withMessage(),

		body('phone')
			.if(body('phone').notEmpty())
			.isMobilePhone(['fr-FR', []])
			.withMessage(),
		body('phone')
			.if(body('phone').notEmpty())
			.isMobilePhone(['fr-FR', []])
			.withMessage(),

		body('newsletter')
			.if(body('newsletter').notEmpty())
			.isBoolean()
			.withMessage(),

		body('status').if(body('status').notEmpty()).isBoolean().withMessage(),

		body('ref')
			.if(body('ref').notEmpty())
			.isAlphanumeric()
			.isLength({ min: 10, max: 10 })
			.withMessage(),

		body('ref')
			.if(body('ref').notEmpty())
			.isAlphanumeric()
			.isLength({ min: 10, max: 10 })
			.withMessage(),

		body('ref')
			.if(body('ref').notEmpty())
			.isAlphanumeric()
			.isLength({ min: 10, max: 10 })
			.withMessage(),

		// Agent:
		body('phonePro')
			.if(body('phonePro').exists())
			.notEmpty()
			.isMobilePhone(['fr-FR', []])
			.withMessage(),

		// Buyer:
		body('budgetMin').if(body('budgetMin').exists()).isInt().withMessage(),
		body('budgetMax').if(body('budgetMax').exists()).isInt().withMessage(),
		body('city').if(body('city').exists()).isAlpha().withMessage(),
		body('surfaceMin')
			.if(body('surfaceMin').exists())
			.isInt()
			.withMessage(),
		body('surfaceMax')
			.if(body('surfaceMax').exists())
			.isInt()
			.withMessage(),
		body('type').if(body('type').exists()).isAlpha().withMessage(),

		// Seller:
		body('isSelling')
			.if(body('isSelling').exists())
			.notEmpty()
			.isBoolean()
			.withMessage(),
	]
}
