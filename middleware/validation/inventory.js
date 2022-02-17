import { body, param } from 'express-validator'
import Inventory from '../../models/Inventory.js'
import User from '../../models/User.js'

const checkInventoryBody = () => {
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
		// On check l'existence de l'agent:
		body('id_agent')
			.if(body('id_agent').notEmpty().isMongoId())
			.custom(async (id_agent) => {
				let agent = await User.findOne({
					id: id_agent,
					agent: { $exists: true },
				})
				if (!agent) return Promise.reject('Agent inexistant.')
				return true
			}),

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
			.if(body('userReference').notEmpty().isAlphanumeric())
			.isLength({ min: 10, max: 10 })
			.withMessage(
				'La référence client doit faire exactement 10 caractères.'
			),
		// On check l'existence de l'utilisateur:
		body('userReference')
			.if(
				body('userReference')
					.notEmpty()
					.isAlphanumeric()
					.isLength({ min: 10, max: 10 })
			)
			.custom(async (userReference) => {
				let user = await User.findOne({ ref: userReference })
				if (!user) return Promise.reject('Utilisateur inexistant.')
				return true
			}),

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
			.if(body('previousBuyerRef').notEmpty().isAlphanumeric())
			.isLength({ min: 10, max: 10 })
			.withMessage(
				'La référence client doit faire exactement 10 caractères.'
			),
		// On check l'existence de l'utilisateur:
		body('previousBuyerRef')
			.if(
				body('previousBuyerRef')
					.notEmpty()
					.isAlphanumeric()
					.isLength({ min: 10, max: 10 })
			)
			.custom(async (previousBuyerRef) => {
				let user = await User.findOne({ ref: previousBuyerRef })
				if (!user)
					return Promise.reject('Utilisateur précédent inexistant.')
				return true
			}),

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

const checkInventoryExistence = () => {
	return [
		param('_id')
			.notEmpty()
			.withMessage("Vous devez indiquer l'identifiant en paramètres."),
		param('_id')
			.if(param('_id').notEmpty())
			.isMongoId()
			.withMessage("L'identifiant renseigné doit-être de type MongoId."),
		param('_id')
			.if(param('_id').notEmpty().isMongoId())
			.custom(async (_id) => {
				let inventory = await Inventory.findOne({ _id })
				if (!inventory)
					return Promise.reject('Etat des lieux non trouvé.')
				return true
			}),
	]
}

export { checkInventoryBody, checkInventoryExistence }
