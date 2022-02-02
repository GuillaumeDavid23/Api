import { body, validationResult } from 'express-validator'

export default (req, res, next) => {
	body('id_agent').notEmpty().isMongoId()
	body('inOut').notEmpty().isBoolean()
	body('userReference')
		.notEmpty()
		.isAlphanumeric()
		.isLength({ min: 10, max: 10 })
	body('date').notEmpty().isDate()
	body('previousBuyerRef').isAlphanumeric().isLength({ min: 10, max: 10 })
	body('lst_statsMeters').notEmpty().isArray()
	body('lst_roomDetails').notEmpty().isArray()

	if (!validationResult(req).isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	} else {
		next()
	}
}
