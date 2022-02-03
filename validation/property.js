import { body } from 'express-validator'

export default () => {
	return [
		body('title').notEmpty().isAlphanumeric(),
		body('description').notEmpty().isString(),
		body('amount').notEmpty().isInt(),
		body('localisation').notEmpty().isString(),
		body('propertyType').notEmpty().isAlpha(),
		body('surface').notEmpty().isInt(),
		body('roomNumber').notEmpty().isInt(),
		body('transactionType').notEmpty().isAlpha(),
		body('lst_equipment').notEmpty().isArray(),
		body('lst_heater').notEmpty().isArray(),
		body('lst_water').notEmpty().isArray(),
		body('electricMeterRef').notEmpty().isAlphanumeric(),
		body('gasMeterRef').notEmpty().isAlphanumeric(),
		body('isToSell').notEmpty().isBoolean(),
		body('propertyRef')
			.notEmpty()
			.isAlphanumeric()
			.isLength({ min: 10, max: 10 }),
	]
}
