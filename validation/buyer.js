import { body, validationResult } from 'express-validator'

export default (req, res, next) => {
	body('budgetMin').isInt()
	body('budgetMax').isInt()
	body('city').isAlpha()
	body('surfaceMin').isInt()
	body('surfaceMax').isInt()
	body('type').isAlpha()

	if (!validationResult(req).isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	} else {
		next()
	}
}
