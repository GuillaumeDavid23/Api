import { body, validationResult } from 'express-validator'

export default (req, res, next) => {
	body('dateBegin').notEmpty().isDate()
	body('dateEnd').notEmpty().isDate()
	body('adress').notEmpty().isString()
	body('outdoor').notEmpty().isBoolean()
	body('id_buyer').notEmpty().isMongoId()
	body('id_buyer').notEmpty().isMongoId()

	if (!validationResult(req).isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	} else {
		next()
	}
}
