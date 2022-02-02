import { body, validationResult } from 'express-validator'

export default (req, res, next) => {
	body('id_agent').notEmpty().isMongoId()
	body('amount').notEmpty().isInt()
	body('date').notEmpty().isDate()
	body('status').notEmpty().isBoolean()

	if (!validationResult(req).isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	} else {
		next()
	}
}
