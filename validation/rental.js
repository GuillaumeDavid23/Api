import { body } from 'express-validator'

export default () => {
	return [
		body('startDate').notEmpty().isDate(),
		body('endDate').notEmpty().isDate(),
		body('effectiveEndDate').isDate(),
		body('amount').notEmpty().isInt(),
		body('status').notEmpty().isBoolean(),
		body('keysNumber').notEmpty().isInt(),
	]
}
