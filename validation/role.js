import { body } from 'express-validator'

export default () => {
	return [body('name').notEmpty().isAlpha()]
}
