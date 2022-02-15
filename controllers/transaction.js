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
const create = async (req, res) => {
	try {
		const transaction = new Transaction({
			...req.body,
		})
		transaction.save()
		res.status(201).json({
			status_code: 201,
			message: 'Transaction enregistrée !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {put} /api/transaction/:_id Modifier une transaction
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
const update = async (req, res) => {
	try {
		await Transaction.updateOne(
			{
				_id: req.params.id,
			},
			{
				...req.body,
				_id: req.params.id,
			}
		)
		res.status(201).json({
			status_code: 201,
			message: 'Transaction modifiée !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
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
				status_code: 404,
				error: 'Transaction non trouvée !',
			})
		}
		if (transaction.userId !== req.auth.userId) {
			return res.status(401).json({
				status_code: 401,
				error: 'Requête non autorisée !',
			})
		}

		// On éxecute:
		await Transaction.deleteOne({ _id: req.params.id })
		res.status(200).json({
			status_code: 200,
			message: 'Transaction supprimée !',
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
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
const getAll = async (req, res) => {
	try {
		let transactions = await Transaction.find()
		res.status(200).json({
			status_code: 200,
			datas: transactions,
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
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
		let transaction = await Transaction.findById(req.params._id)
		if (transaction) {
			res.status(200).json({
				status_code: 200,
				data: transaction,
			})
		} else {
			res.status(204).json({
				status_code: 204,
				message: 'Aucune transaction',
			})
		}
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

export { create, update, erase, getAll, getOne }
