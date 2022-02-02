import { body, validationResult } from 'express-validator'

export default (req, res, next) => {
	body('id_agent').isMongoId()
	body('amount').isInt()
	body('date').isDate()
	body('status').isBoolean()

	if (!validationResult(req).isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	} else {
		next()
	}
}
