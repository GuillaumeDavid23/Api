import { body, validationResult } from 'express-validator'

export default (req, res, next) => {
	body('startDate').isDate()
	body('endDate').isDate()
	body('effectiveEndDate').isDate()
	body('amount').isInt()
	body('status').isBoolean()
	body('keysNumber').isInt()

	if (!validationResult(req).isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	} else {
		next()
	}
}
