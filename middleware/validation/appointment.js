import { body } from 'express-validator'

export default () => {
	return [
		body('dateBegin')
			.notEmpty()
			.withMessage('Vous devez indiquer une date de début.'),
		body('dateBegin')
			.if(body('dateBegin').notEmpty())
			.isISO8601()
			.toDate()
			.withMessage(
				'Vous devez indiquer une date de début valide (YYYY-MM-DD hh:mm:ss).'
			),

		body('dateEnd')
			.notEmpty()
			.withMessage('Vous devez indiquer une date de fin.'),
		body('dateEnd')
			.if(body('dateEnd').notEmpty())
			.isISO8601()
			.toDate()
			.withMessage(
				'Vous devez indiquer une date de fin valide (YYYY-MM-DD hh:mm:ss).'
			),

		body('address')
			.notEmpty()
			.withMessage('Vous devez indiquer une adresse.'),
		body('address')
			.if(body('address').notEmpty())
			.isString()
			.withMessage(
				'Vous devez indiquer une adresse valide: chaine de caractères alphanumérique sans caractères spéciaux.'
			),

		body('outdoor')
			.notEmpty()
			.withMessage(
				'Vous devez indiquer si le rendez-vous se passe en extérieur ou non.'
			),
		body('outdoor')
			.if(body('outdoor').notEmpty())
			.isBoolean()
			.withMessage(
				'La valeur "en extérieur" doit-être de type booléen (0/1 ou false/true).'
			),

		body('id_buyer')
			.notEmpty()
			.withMessage("Vous devez indiquer l'identifiant de l'acheteur."),
		body('id_buyer')
			.if(body('id_buyer').notEmpty())
			.isMongoId()
			.withMessage(
				"L'identifiant de l'acheteur renseigné doit être de type MongoId."
			),

		body('id_agent')
			.notEmpty()
			.withMessage("Vous devez indiquer l'identifiant de l'agent."),
		body('id_agent')
			.if(body('id_agent').notEmpty())
			.isMongoId()
			.withMessage(
				"L'identifiant de l'agent renseigné doit-être de type MongoId."
			),
	]
}
