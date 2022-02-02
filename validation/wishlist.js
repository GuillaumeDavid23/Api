import { body, validationResult } from 'express-validator'

export default (req, res, next) => {
	body('id_buyer').isMongoId()
	body('id_property').isMongoId()

	if (!validationResult(req).isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	} else {
		next()
	}
}
