import { body } from 'express-validator'

export default () => {
	return [body('id_buyer').isMongoId(), body('id_property').isMongoId()]
}
