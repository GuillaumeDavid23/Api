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
 *     HTTP/1.1 201 OK
 *     {
 * 			"status_code": 201,
 *       "message": "Transaction enregistrée.",
 *     }
 *
 * @apiError ValidationError Erreurs générales sur les formats de données.
 * @apiError ServerError Erreur serveur.
 */
const create = async (req, res) => {
	try {
		const transaction = new Transaction({
			...req.body,
		})
		transaction.save()
		res.status(201).json({
			status_code: 201,
			message: 'Transaction enregistrée.',
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
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
 *     HTTP/1.1 200 OK
 *     {
 * 		"status_code": 200,
 *       	"message": "Transaction modifiée.",
 *     }
 *
 * @apiError ValidationError Transaction non trouvé.
 * @apiError ValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ValidationError Erreurs générales sur les formats de données.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample _idError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *  		"status_code": 422,
 * 			"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"_id": "Transaction non trouvé."
 * 				}
 * 			]
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
			message: 'Transaction modifiée.',
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {DELETE} /api/transaction/:_id Supprimer une transaction
 * @apiName erase
 * @apiGroup Transaction
 *
 * @apiHeader {String} Authorization Token d'authentification
 * @apiSuccess {String} message Transaction supprimée..
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		"status_code": 200,
 *      	"message": "Transaction supprimée.",
 *     }
 *
 * @apiError ValidationError Transaction non trouvé.
 * @apiError ValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample _idError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *  	"status_code": 422,
 * 		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"_id": "Transaction non trouvé."
 * 				}
 * 			]
 *     }
 */
const erase = async (req, res) => {
	try {
		// On éxecute:
		await Transaction.deleteOne({ _id: req.params.id })
		res.status(200).json({
			status_code: 200,
			message: 'Transaction supprimée.',
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
 * 			"status_code": 200,
 *      	"message": "Transaction récupérées.",
 *			"transactions": {transactions},
 *     }
 *
 * @apiError ServerError Erreur Serveur.
 */
const getAll = async (req, res) => {
	try {
		let transactions = await Transaction.find()
		res.status(200).json({
			status_code: 200,
			message: 'Transactions récupérées.',
			transactions,
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
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
 * 		"status_code": 200,
 *      	"message": 'Transaction récupérée.',
 *			"transaction": {transaction},
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 204 OK
 *
 * @apiError ValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 */
const getOne = async (req, res) => {
	try {
		let transaction = await Transaction.findById(req.params._id)
		if (transaction) {
			res.status(200).json({
				status_code: 200,
				message: 'Transaction récupérée.',
				transaction,
			})
		} else {
			res.status(204)
		}
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

export { create, update, erase, getAll, getOne }
