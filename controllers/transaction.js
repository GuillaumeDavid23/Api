import Transaction from '../models/Transaction.js'

/**
 * @api {post} /api/transaction/ 1 - Créer une transaction
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
 * @api {put} /api/transaction/:_id 2 - Modifier une transaction
 * @apiName update
 * @apiGroup Transaction
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiBody {Array} lst_buyer Liste des ID acheteurs
 * @apiBody {Array} lst_seller Liste des ID vendeurs
 * @apiBody {ObjectId} id_agent ID de l'agent
 * @apiBody {ObjectId} id_property ID de la propriété
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
 * @api {DELETE} /api/transaction/:_id 4 - Supprimer une transaction
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
 * @api {get} /api/transaction/ 3 - Récupérer toutes les transactions
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
 * @api {get} /api/transaction/:_id 2 - Récupérer une transaction
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
//UPDATE SELLER LIST USER
/**
 * @api {put} /api/transaction/seller/:_id 8 - Ajouter un vendeur
 * @apiName addSeller
 * @apiGroup Transaction
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id id de la transaction
 * @apiBody {ObjectId} idSeller id de l'vendeur à ajouter
 *
 * @apiSuccess {String} message Favori ajouté !
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Favori ajouté !',
 *     }
 *
 * @apiError ServerError Transaction non modifié.
 */
const addSeller = async (req, res) => {
	try {
		await Transaction.updateOne(
			{ _id: req.params._id },
			{ $push: { lst_seller: req.body.idSeller } }
		)
		res.status(200).json({
			status_code: 200,
			message: 'vendeur ajouté à la liste !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {delete} /api/transaction/seller/:_id 9 - Supprimer un vendeur
 * @apiName removeSeller
 * @apiGroup Transaction
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id id de la transaction
 *
 * @apiBody {ObjectId} idSeller id de l'vendeur à supprimer
 *
 * @apiSuccess {String} message vendeur supprimé de la liste
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'vendeur supprimé de la liste',
 *     }
 *
 * @apiError ServerError Transaction non modifié.
 */
const removeSeller = async (req, res) => {
	try {
		await Transaction.updateOne(
			{ _id: req.params._id },
			{
				$pull: {
					lst_seller: req.body.idSeller,
				},
			}
		)
		res.status(200).json({
			status_code: 200,
			message: 'vendeur supprimé de la liste !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

//UPDATE BUYER LIST USER
/**
 * @api {put} /api/transaction/buyer/:_id 6 - Ajouter un acheteur
 * @apiName addBuyer
 * @apiGroup Transaction
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id id de la transaction
 * @apiBody {ObjectId} idBuyer id de l'acheteur à ajouter
 *
 * @apiSuccess {String} message Favori ajouté !
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Favori ajouté !',
 *     }
 *
 * @apiError ServerError Transaction non modifié.
 */
const addBuyer = async (req, res) => {
	try {
		await Transaction.updateOne(
			{ _id: req.params._id },
			{ $push: { lst_buyer: req.body.idBuyer } }
		)
		res.status(200).json({
			status_code: 200,
			message: 'Acheteur ajouté à la liste !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {delete} /api/transaction/buyer/:_id 7 - Supprimer un acheteur
 * @apiName removeBuyer
 * @apiGroup Transaction
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id id de la transaction
 *
 * @apiBody {ObjectId} idBuyer id de l'acheteur à supprimer
 *
 * @apiSuccess {String} message Acheteur supprimé de la liste
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Acheteur supprimé de la liste',
 *     }
 *
 * @apiError ServerError Transaction non modifié.
 */
const removeBuyer = async (req, res) => {
	try {
		await Transaction.updateOne(
			{ _id: req.params._id },
			{
				$pull: {
					lst_buyer: req.body.idBuyer,
				},
			}
		)
		res.status(200).json({
			status_code: 200,
			message: 'Acheteur supprimé de la liste !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

export {
	create,
	update,
	erase,
	getAll,
	getOne,
	addBuyer,
	removeBuyer,
	removeSeller,
	addSeller,
}
