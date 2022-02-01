import { body, validationResult } from 'express-validator'

export default (req, res, next) => {
	body('title').isAlphanumeric()
	body('description').isString()
	body('amount').isInt()
	body('localisation').isString()
	body('propertyType').isAlpha()
	body('surface').isInt()
	body('roomNumber').isInt()
	body('transactionType').isAlpha()
	// body('lst_equipment').is
	// body('lst_heater').is
	// body('lst_water').is
	body('electricMeterRef').isAlphanumeric()
	body('gasMeterRef').isAlphanumeric()
	body('isToSell').isBoolean()
	body('propertyRef').isAlphanumeric()

	if (!validationResult(req).isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	} else {
		next()
	}
}
