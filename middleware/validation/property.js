import { body, param } from 'express-validator'
import Property from '../../models/Property.js'

const checkPropertyBody = () => {
	return [
		body('title')
			.notEmpty()
			.withMessage('Vous devez indiquer le titre de la propriété.'),
		body('title')
			.if(body('title').notEmpty())
			.isString()
			.withMessage(
				'Le titre de la propriété ne doit contenir que des lettres et des chiffres.'
			),

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
			.isInt({ min: 0 })
			.withMessage(
				'Le prix doit être une valeur numérique entière positive.'
			),

		body('location')
			.notEmpty()
			.withMessage(
				'Vous devez indiquer la localisation de la propriété.'
			),
		body('location')
			.if(body('location').notEmpty())
			.isString()
			.withMessage(
				"L'adresse doit correspondre à une chaine de caractères."
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
			.isInt({ min: 1 })
			.withMessage(
				'La surface doit être une valeur numérique entière positive.'
			),

		body('roomNumber')
			.notEmpty()
			.withMessage(
				'Vous devez indiquer le nombre de pièces de la propriété.'
			),
		body('roomNumber')
			.if(body('roomNumber').notEmpty())
			.isInt({ min: 1 })
			.withMessage(
				'Le nombre de pièces doit être une valeur numérique entière positive.'
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

		body('list_equipments')
			.if(body('list_equipments').notEmpty())
			.isString()
			.withMessage(
				'La liste des équipements doit-être une chaine de caractères.'
			),

		body('list_heater')
			.if(body('list_heater').notEmpty())
			.isString()
			.withMessage(
				"Les paramètres de chauffage doivent-être sous la forme d'une chaine de caractères."
			),

		body('electricMeterRef')
			.if(body('electricMeterRef').notEmpty())
			.isAlphanumeric()
			.withMessage(
				'La référence du compteur éléctrique ne doit contenir que des lettres et des chiffres.'
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

		// body('propertyRef')
		// 	.notEmpty()
		// 	.withMessage('Vous devez indiquer la référence de la propriété.'),
		body('propertyRef')
			.if(body('propertyRef').notEmpty())
			.isAlphanumeric()
			.withMessage(
				'La référence de la propriété ne doit contenir que des lettres et des chiffres.'
			),
		body('propertyRef')
			.if(body('propertyRef').notEmpty().isAlphanumeric())
			.isLength({ min: 10, max: 10 })
			.withMessage(
				'La référence de la propriété doit faire exactement 10 caractères.'
			),
		// body('propertyRef')
		// 	.if(
		// 		body('propertyRef')
		// 			.notEmpty()
		// 			.isAlphanumeric()
		// 			.isLength({ min: 10, max: 10 })
		// 	)
		// 	.custom(async (propertyRef) => {
		// 		let property = await Property.findOne({ propertyRef })
		// 		if (property)
		// 			return Promise.reject(
		// 				'La référence de la propriété doit-être unique.'
		// 			)
		// 		return true
		// 	}),
	]
}

const checkPropertyExistence = () => {
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
				let property = await Property.findOne({ _id })
				if (!property) return Promise.reject('Propriété non trouvé.')
				return true
			}),
	]
}

export { checkPropertyBody, checkPropertyExistence }
