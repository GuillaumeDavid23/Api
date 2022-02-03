import { body } from 'express-validator'

export default () => {
	return [body('phonePro').notEmpty().isMobilePhone(['fr-FR', []])]
}
