import { body } from 'express-validator'

export default () => {
	return [
		body('id_agent')
			.notEmpty()
			.withMessage("Vous devez indiquer l'identifiant de l'agent."),
		body('id_agent')
			.if(body('id_agent').notEmpty())
			.isMongoId()
			.withMessage(
				"L'identifiant de l'agent renseigné doit être de type MongoId."
			),

		body('inOut')
			.notEmpty()
			.withMessage(
				'Vous devez indiquer si le locataire est entrant ou sortant.'
			),
		body('inOut')
			.if(body('inOut').notEmpty())
			.isBoolean()
			.withMessage(
				'La valeur "entrant/sortant" doit-être de type booléen (0/1 ou false/true).'
			),

		body('userReference')
			.notEmpty()
			.withMessage('Vous devez indiquer la référence client.'),
		body('userReference')
			.if(body('userReference').notEmpty())
			.isAlphanumeric()
			.withMessage(
				'La référence client doit-être composé uniquement de lettres et de chiffres.'
			),
		body('userReference')
			.if(body('userReference').notEmpty())
			.if(body('userReference').isAlphanumeric())
			.isAlphanumeric()
			.isLength({ min: 10, max: 10 })
			.withMessage(
				'La référence client doit faire exactement 10 caractères.'
			),

		body('date')
			.notEmpty()
			.withMessage("Vous devez indiquer la date de l'inventaire."),
		body('date')
			.if(body('date').notEmpty())
			.isISO8601()
			.toDate()
			.withMessage(
				"Vous devez indiquer une date d'inventaire valide (YYYY-MM-DD hh:mm:ss)."
			),

		body('previousBuyerRef')
			.if(body('previousBuyerRef').notEmpty())
			.isAlphanumeric()
			.withMessage(
				'La référence du précédent locataire doit-être composé uniquement de lettres et de chiffres.'
			),
		body('previousBuyerRef')
			.if(body('previousBuyerRef').notEmpty())
			.if(body('previousBuyerRef').isAlphanumeric())
			.isLength({ min: 10, max: 10 })
			.withMessage(
				'La référence client doit faire exactement 10 caractères.'
			),

		body('lst_statsMeters')
			.notEmpty()
			.withMessage('Vous devez renseigner les statistiques métriques.'),
		body('lst_statsMeters')
			.if(body('lst_statsMeters').notEmpty())
			.isArray()
			.withMessage(
				"Les statistiques doivent être sous la forme d'un tableau."
			),

		body('lst_roomDetails')
			.notEmpty()
			.withMessage('Vous devez renseigner les détails des pièces.'),
		body('lst_roomDetails')
			.if(body('lst_roomDetails').notEmpty())
			.isArray()
			.withMessage(
				"Les détails des pièces doivent être sous la forme d'un tableau."
			),
	]
}
