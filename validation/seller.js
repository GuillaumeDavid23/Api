import { body } from 'express-validator'

export default () => {
	return [body('isSelling').notEmpty().isBoolean()]
}
