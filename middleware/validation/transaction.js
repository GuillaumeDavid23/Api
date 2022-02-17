import { body, param } from 'express-validator'
import Transaction from '../../models/Transaction.js'

const checkTransactionBody = () => {
	return [
		body('lst_buyer')
			.notEmpty()
			.withMessage('Vous devez indiquer le/les acheteur(s).'),
		body('lst_buyer')
			.if(body('lst_buyer').notEmpty())
			.isArray()
			.withMessage('La liste des acheteurs doit-être un tableau.'),

		body('lst_seller')
			.notEmpty()
			.withMessage('Vous devez indiquer le/les vendeur(s).'),
		body('lst_seller')
			.if(body('lst_seller').notEmpty())
			.isArray()
			.withMessage('La liste des vendeurs doit-être un tableau.'),

		body('id_agent')
			.notEmpty()
			.withMessage("Vous devez indiquer l'identifiant de l'agent."),
		body('id_agent')
			.if(body('id_agent').notEmpty())
			.isMongoId()
			.withMessage("L'identifiant de l'agent doit-être de type MongoId."),

		body('amount')
			.notEmpty()
			.withMessage('Vous devez indiquer le montant de la transaction.'),
		body('amount')
			.if(body('amount').notEmpty())
			.isInt()
			.withMessage(
				'Le montant de la transaction doit-être une valeur numérique entière.'
			),

		body('date')
			.notEmpty()
			.withMessage('Vous devez indiquer la date de la transaction.'),
		body('date')
			.if(body('date').notEmpty())
			.isDate()
			.withMessage(
				'La date de la transaction doit être au format date (YYYY-MM-DD).'
			),

		body('status')
			.notEmpty()
			.withMessage('Vous devez indiquer le statut de la transaction.'),
		body('status')
			.if(body('status').notEmpty())
			.isBoolean()
			.withMessage(
				'Le statut doit-être de type booléen (0/1 ou false/true).'
			),
	]
}

const checkTransactionExistence = () => {
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
				let transaction = await Transaction.findOne({ _id })
				if (!transaction)
					return Promise.reject('Transaction non trouvé.')
				return true
			}),
	]
}

export { checkTransactionBody, checkTransactionExistence }
