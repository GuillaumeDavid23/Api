import { body } from 'express-validator'

export default () => {
	return [
		body('budgetMin').if(body('budgetMin').notEmpty()).isInt(),
		body('budgetMax').if(body('budgetMax').notEmpty()).isInt(),
		body('city').if(body('city').notEmpty()).isAlpha(),
		body('surfaceMin').if(body('surfaceMin').notEmpty()).isInt(),
		body('surfaceMax').if(body('surfaceMax').notEmpty()).isInt(),
		body('type').if(body('type').notEmpty()).isAlpha(),
	]
}
