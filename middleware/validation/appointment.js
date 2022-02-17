import { body, param } from 'express-validator'
import User from '../../models/User.js'
import Appointment from '../../models/Appointment.js'

const checkAppointmentBody = () => {
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
		// On check si la date de début est bien antérieure à la date de fin:
		body('dateEnd')
			.if(body('dateEnd').notEmpty().isISO8601().toDate())
			.custom((dateEnd, { req }) => {
				if (dateEnd <= req.body.dateBegin)
					return Promise.reject(
						'Date de fin antérieure à la date de début.'
					)
				return true
			}),

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
		// On check l'existence de l'acheteur:
		body('id_buyer')
			.if(body('id_buyer').notEmpty().isMongoId())
			.custom(async (id_buyer) => {
				let buyer = await User.findOne({
					id: id_buyer,
					buyer: { $exists: true },
				})
				if (!buyer) return Promise.reject('Acheteur inexistant.')
				return true
			}),

		body('id_agent')
			.notEmpty()
			.withMessage("Vous devez indiquer l'identifiant de l'agent."),
		body('id_agent')
			.if(body('id_agent').notEmpty())
			.isMongoId()
			.withMessage(
				"L'identifiant de l'agent renseigné doit-être de type MongoId."
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
	]
}

const checkAppointmentExistence = () => {
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
				let appointment = await Appointment.findOne({ _id })
				if (!appointment)
					return Promise.reject('Rendez-vous non trouvé.')
				return true
			}),
	]
}

export { checkAppointmentBody, checkAppointmentExistence }
