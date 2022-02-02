import Transaction from '../models/Transaction.js'

/**
 * @api {post} /api/transaction/ Créer une transaction
 * @apiName create
 * @apiGroup Transaction
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiBody {Array} lst_buyer Liste des ID acheteurs
 * @apiBody {Array} lst_seller Liste des ID vendeurs
 * @apiBody {ObjectId} id_agent ID de l'agent
 * @apiBody {Number} amount Montant de la transaction
 * @apiBody {Date} date Date de la transaction
 * @apiBody {Boolean} status="true" Status actif ou non
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": 'Transaction enregistrée !',
 *     }
 *
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Transaction non créée !"
 *     }
 */
const create = (req, res) => {
	const transaction = new Transaction({
		...req.body,
	})
	transaction
		.save()
		.then(() =>
			res.status(201).json({
				message: 'Transaction enregistrée !',
			})
		)
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

/**
 * @api {put} /api/agent/transaction/:_id Modifier une transaction
 * @apiName update
 * @apiGroup Transaction
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiBody {Array} lst_buyer Liste des ID acheteurs
 * @apiBody {Array} lst_seller Liste des ID vendeurs
 * @apiBody {ObjectId} id_agent ID de l'agent
 * @apiBody {Number} amount Montant de la transaction
 * @apiBody {Date} date Date de la transaction
 * @apiBody {Boolean} status="true" Status actif ou non
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Transaction modifiée !',
 *     }
 *
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Transaction non modifiée !"
 *     }
 */
const update = (req, res) => {
	Transaction.updateOne(
		{
			_id: req.params.id,
		},
		{
			...req.body,
			_id: req.params.id,
		}
	)
		.then(() =>
			res.status(201).json({
				message: 'Transaction modifiée !',
			})
		)
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

/**
 * @api {DELETE} /api/transaction/:_id Supprimer une transaction
 * @apiName erase
 * @apiGroup Transaction
 *
 * @apiHeader {String} Authorization Token d'authentification
 * @apiSuccess {String} message Transaction supprimée !.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *      "message": 'Transaction supprimée !',
 *     }
 *
 * @apiError UserNotFound Aucune transaction.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Impossible de supprimer cette transaction !"
 *     }
 */
const erase = async (req, res) => {
	try {
		// On check la transaction a supprimer:
		let transaction = await Transaction.findOne({ _id: req.params.id })
		if (!transaction) {
			return res.status(404).json({
				error: new Error('Transaction non trouvée !'),
			})
		}
		if (transaction.userId !== req.auth.userId) {
			return res.status(401).json({
				error: new Error('Requête non autorisée !'),
			})
		}

		// On éxecute:
		Transaction.deleteOne({ _id: req.params.id }).then(() =>
			res.status(200).json({ message: 'Transaction supprimée !' })
		)
	} catch (error) {
		res.status(400).json({ error })
	}
}

/**
 * @api {get} /api/transaction/ Récupérer toutes les transactions
 * @apiName getAll
 * @apiGroup Transaction
 * 
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiSuccess {Transaction} transaction Objet Transaction.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'Transaction récupéré !',
		"data": transactions,
 *     }
 *
 * @apiError TransactionNotFound Aucune Transaction.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Aucune Transaction trouvée !"
 *     }
 */
const getAll = (req, res) => {
	Transaction.find()
		.then((transactions) => res.status(200).json(transactions))
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

/**
 * @api {get} /api/transaction/:_id Récupérer une transaction
 * @apiName getOne
 * @apiGroup Transaction
 * 
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiParam {Number} _id ID de la transaction.
 *
 * @apiSuccess {Transaction} transaction Objet Transaction.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'Transaction récupéré !',
		"data": transaction,
 *     }
 *
 * @apiError TransactionNotFound Aucune Transaction.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Transaction non trouvé !"
 *     }
 */
const getOne = async (req, res) => {
	try {
		let transaction = await Transaction.findById(req.body._id)
		if (transaction) {
			res.status(200).json(transaction)
		} else {
			res.status(204).json({ message: 'Aucune transaction' })
		}
	} catch (error) {
		res.status(400).json(error)
	}
}

export { create, update, erase, getAll, getOne }
