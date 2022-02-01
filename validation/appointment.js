import { body, validationResult } from 'express-validator'

export default (req, res, next) => {
	body('slot').isDate()
	body('adress').isString()
	body('outdoor').isBoolean()
	body('duration').isInt()

	if (!validationResult(req).isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	} else {
		next()
	}
}
