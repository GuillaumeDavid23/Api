import { body, validationResult } from 'express-validator'

export default (req, res, next) => {
	body('title').notEmpty().isAlphanumeric()
	body('description').notEmpty().isString()
	body('amount').notEmpty().isInt()
	body('localisation').notEmpty().isString()
	body('propertyType').notEmpty().isAlpha()
	body('surface').notEmpty().isInt()
	body('roomNumber').notEmpty().isInt()
	body('transactionType').notEmpty().isAlpha()
	body('lst_equipment').notEmpty().isArray()
	body('lst_heater').notEmpty().isArray()
	body('lst_water').notEmpty().isArray()
	body('electricMeterRef').notEmpty().isAlphanumeric()
	body('gasMeterRef').notEmpty().isAlphanumeric()
	body('isToSell').notEmpty().isBoolean()
	body('propertyRef')
		.notEmpty()
		.isAlphanumeric()
		.isLength({ min: 10, max: 10 })

	if (!validationResult(req).isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	} else {
		next()
	}
}
