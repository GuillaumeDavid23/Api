import { body } from 'express-validator'

export default () => {
	return [
		body('dateBegin').notEmpty().isDate(),
		body('dateEnd').notEmpty().isDate(),
		body('adress').notEmpty().isString(),
		body('outdoor').notEmpty().isBoolean(),
		body('id_buyer').notEmpty().isMongoId(),
		body('id_buyer').notEmpty().isMongoId(),
	]
}
