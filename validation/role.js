import { body, validationResult } from 'express-validator'

export default (req, res, next) => {
	body('name').isAlpha()

	if (!validationResult(req).isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	} else {
		next()
	}
}
