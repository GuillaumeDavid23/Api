import { body, param } from 'express-validator'
import Rental from '../../models/Rental.js'

const checkRentalBody = () => {
	return [
		body('startDate')
			.notEmpty()
			.withMessage(
				'Vous devez indiquer la date de début de la location.'
			),
		body('startDate')
			.if(body('startDate').notEmpty())
			.isDate()
			.withMessage(
				'La date de début doit être au format date (YYYY-MM-DD).'
			),

		body('endDate')
			.notEmpty()
			.withMessage('Vous devez indiquer la date de fin de la location.'),
		body('endDate')
			.if(body('endDate').notEmpty())
			.isDate()
			.withMessage(
				'La date de fin doit être au format date (YYYY-MM-DD).'
			),
		// On check si la date de début est bien antérieure à la date de fin:
		body('endDate')
			.if(body('endDate').notEmpty().isDate())
			.custom((endDate, { req }) => {
				if (endDate <= req.body.startDate)
					return Promise.reject(
						'Date de fin antérieure à la date de début.'
					)
				return true
			}),

		body('effectiveEndDate')
			.if(body('endDate').notEmpty())
			.isDate()
			.withMessage(
				'La date de fin effective doit être au format date (YYYY-MM-DD).'
			),
		// On check si la date de début est bien antérieure à la date de fin effective:
		body('endDate')
			.if(body('endDate').notEmpty().isDate())
			.custom((endDate, { req }) => {
				if (endDate <= req.body.startDate)
					return Promise.reject(
						'Date de fin effective antérieure à la date de début.'
					)
				return true
			}),

		body('amount')
			.notEmpty()
			.withMessage(
				'Vous devez indiquer le montant mensuel de la location.'
			),
		body('amount')
			.if(body('amount').notEmpty())
			.isInt({ min: 0 })
			.withMessage(
				'Le montant mensuel de la location doit-être une valeur numérique entière positive.'
			),

		body('status')
			.notEmpty()
			.withMessage('Vous devez indiquer le statut de la location.'),
		body('status')
			.if(body('status').notEmpty())
			.isBoolean()
			.withMessage(
				'Le statut doit-être de type booléen (0/1 ou false/true).'
			),

		body('keysNumber')
			.notEmpty()
			.withMessage(
				'Vous devez indiquer le nombre de clés fourni au nouveau locataire.'
			),
		body('keysNumber')
			.if(body('keysNumber').notEmpty())
			.isInt({ min: 1 })
			.withMessage(
				'Le nombre de clés fourni au nouveau locataire doit-être une valeur numérique entière positive.'
			),
	]
}

const checkRentalExistence = () => {
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
				let rental = await Rental.findOne({ _id })
				if (!rental) return Promise.reject('Location non trouvé !')
				return true
			}),
	]
}

export { checkRentalBody, checkRentalExistence }
