import { body } from 'express-validator'

export default () => {
	return [
		body('id_agent').notEmpty().isMongoId(),
		body('inOut').notEmpty().isBoolean(),
		body('userReference')
			.notEmpty()
			.isAlphanumeric()
			.isLength({ min: 10, max: 10 }),
		body('date').notEmpty().isDate(),
		body('previousBuyerRef')
			.isAlphanumeric()
			.isLength({ min: 10, max: 10 }),
		body('lst_statsMeters').notEmpty().isArray(),
		body('lst_roomDetails').notEmpty().isArray(),
	]
}
