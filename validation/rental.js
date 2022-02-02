import { body, validationResult } from 'express-validator'

export default (req, res, next) => {
	body('startDate').notEmpty().isDate()
	body('endDate').notEmpty().isDate()
	body('effectiveEndDate').isDate()
	body('amount').notEmpty().isInt()
	body('status').notEmpty().isBoolean()
	body('keysNumber').notEmpty().isInt()

	if (!validationResult(req).isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	} else {
		next()
	}
}
