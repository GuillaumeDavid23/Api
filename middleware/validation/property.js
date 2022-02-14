import { body } from 'express-validator'

export default () => {
	return [
		body('title')
			.notEmpty()
			.withMessage('Vous devez indiquer le titre de la propriété.'),
		body('title')
			.if(body('title').notEmpty())
			.isAlphanumeric()
			.withMessage(
				'Le titre de la propriété ne doit contenir que des lettres et des chiffres.'
			),

		body('description')
			.notEmpty()
			.withMessage('Vous devez indiquer une description.'),
		body('description')
			.if(body('description').notEmpty())
			.isString()
			.withMessage(
				'La description doit correspondre à une chaine de caractères sans caractères spéciaux.'
			),

		body('amount')
			.notEmpty()
			.withMessage('Vous devez indiquer le prix de la propriété.'),
		body('amount')
			.if(body('amount').notEmpty())
			.isInt()
			.withMessage('Le prix doit être une valeur numérique entière.'),

		body('localisation')
			.notEmpty()
			.withMessage(
				'Vous devez indiquer la localisation de la propriété.'
			),
		body('localisation')
			.if(body('localisation').notEmpty())
			.isString()
			.withMessage(
				"L'adresse doit correspondre à une chaine de caractères sans caractères spéciaux."
			),

		body('propertyType')
			.notEmpty()
			.withMessage('Vous devez indiquer le type de la propriété.'),
		body('propertyType')
			.if(body('propertyType').notEmpty())
			.isAlpha()
			.withMessage(
				'Le type de propriété ne doit contenir que des lettres.'
			),

		body('surface')
			.notEmpty()
			.withMessage('Vous devez indiquer la surface de la propriété.'),
		body('surface')
			.if(body('surface').notEmpty())
			.isInt()
			.withMessage('La surface doit être une valeur numérique entière.'),

		body('roomNumber')
			.notEmpty()
			.withMessage(
				'Vous devez indiquer le nombre de pièces de la propriété.'
			),
		body('roomNumber')
			.if(body('roomNumber').notEmpty())
			.isInt()
			.withMessage(
				'Le nombre de pièces doit être une valeur numérique entière.'
			),

		body('transactionType')
			.notEmpty()
			.withMessage('Vous devez indiquer le type de transaction.'),
		body('transactionType')
			.if(body('transactionType').notEmpty())
			.isAlpha()
			.withMessage(
				'Le type de transaction ne doit contenir que des lettres.'
			),

		body('lst_equipment')
			.notEmpty()
			.withMessage('Vous devez indiquer la liste des équipements.'),
		body('lst_equipment')
			.if(body('lst_equipment').notEmpty())
			.isArray()
			.withMessage('La liste des équipements doit-être un tableau.'),

		body('lst_heater')
			.notEmpty()
			.withMessage(
				'Vous devez indiquer les paramètres de chauffage de la propriété.'
			),
		body('lst_heater')
			.if(body('lst_heater').notEmpty())
			.isArray()
			.withMessage(
				"Les paramètres de chauffage doivent-être sous la forme d'un tableau."
			),

		body('lst_water')
			.notEmpty()
			.withMessage(
				"Vous devez indiquer les paramètres de consommation d'eau de la propriété."
			),
		body('lst_water')
			.if(body('lst_water').notEmpty())
			.isArray()
			.withMessage(
				"Les paramètres de consommation d'eau doivent-être sous la forme d'un tableau."
			),

		body('electricMeterRef')
			.notEmpty()
			.withMessage(
				'Vous devez indiquer la référence du compteur éléctrique.'
			),
		body('electricMeterRef')
			.if(body('electricMeterRef').notEmpty())
			.isAlphanumeric()
			.withMessage(
				'La référence du compteur éléctrique ne doit contenir que des lettres et des chiffres.'
			),

		body('gasMeterRef')
			.notEmpty()
			.withMessage(
				'Vous devez indiquer la référence du compteur de gaz.'
			),
		body('gasMeterRef')
			.if(body('gasMeterRef').notEmpty())
			.isAlphanumeric()
			.withMessage(
				'La référence du compteur de gaz ne doit contenir que des lettres et des chiffres.'
			),

		body('isToSell')
			.notEmpty()
			.withMessage(
				'Vous devez indiquer si la propriété est actuellement à vendre ou non.'
			),
		body('isToSell')
			.if(body('isToSell').notEmpty())
			.isBoolean()
			.withMessage(
				'La valeur "A vendre" doit-être de type booléen (0/1 ou false/true).'
			),

		body('propertyRef')
			.notEmpty()
			.withMessage('Vous devez indiquer la référence de la propriété.'),
		body('propertyRef')
			.if(body('propertyRef').notEmpty())
			.isAlphanumeric()
			.withMessage(
				'La référence de la propriété ne doit contenir que des lettres et des chiffres.'
			),
		body('propertyRef')
			.if(body('propertyRef').notEmpty())
			.if(body('propertyRef').isAlphanumeric())
			.isLength({ min: 10, max: 10 })
			.withMessage(
				'La référence de la propriété doit faire exactement 10 caractères.'
			),
	]
}
