import { body } from 'express-validator'

export default (req, res, next) => {
	return [
		body('lst_buyer').notEmpty().isArray(),
		body('lst_seller').notEmpty().isArray(),
		body('id_agent').notEmpty().isMongoId(),
		body('amount').notEmpty().isInt(),
		body('date').notEmpty().isDate(),
		body('status').notEmpty().isBoolean(),
	]
}
