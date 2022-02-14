import { body } from 'express-validator'

export default () => {
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

		body('effectiveEndDate')
			.isDate()
			.withMessage(
				'La date de fin effective doit être au format date (YYYY-MM-DD).'
			),

		body('amount')
			.notEmpty()
			.withMessage(
				'Vous devez indiquer le montant mensuel de la location.'
			),
		body('amount')
			.if(body('amount').notEmpty())
			.isInt()
			.withMessage(
				'Le montant mensuel de la location doit-être une valeur numérique entière.'
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
			.isInt()
			.withMessage(
				'Le nombre de clés fourni au nouveau locataire doit-être une valeur numérique entière.'
			),
	]
}
