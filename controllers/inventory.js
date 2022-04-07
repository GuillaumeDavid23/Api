import Inventory from '../models/Inventory.js'

/**
 * @api {post} /api/inventory 1 - Créer un Etat des lieux
 * @apiName create
 * @apiGroup Etat des lieux
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiBody {ObjectId} id_agent ID de l'agent
 * @apiBody {Boolean} inOut Etat des lieux de sortie ou d'entrée
 * @apiBody {String} userReference Référence client
 * @apiBody {Date} date Date de l'état des lieux
 * @apiBody {String} previousBuyerRef Référence du précédent client
 * @apiBody {Array} lst_statsMeters Liste des relevés compteurs
 * @apiBody {Array} lst_roomDetails	Liste de l'état des pièces
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 * 		"status_code": 201,
 *       	"message": "Etat des lieux enregistré.",
 *     }
 *
 * @apiError AgentValidationError Agent inexistant.
 * @apiError UserValidationError Utilisateur inexistant.
 * @apiError PreviousUserValidationError Utilisateur précédent inexistant.
 * @apiError BodyValidationError Erreurs générales sur les formats de données.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample id_agentError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 *		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"id_agent": "Agent inexistant."
 * 				}
 * 			]
 *     }
 *
 * @apiErrorExample userReferenceError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 *		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"userReference": "Utilisateur inexistant."
 * 				}
 * 			]
 *     }
 *
 * @apiErrorExample previousBuyerRefError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 *		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"userReference": "Utilisateur précédent inexistant."
 * 				}
 * 			]
 *     }
 */
const create = async (req, res) => {
	try {
		const inventory = new Inventory({ ...req.body })
		await inventory.save()
		res.status(201).json({
			status_code: 201,
			message: 'Etat des lieux enregistré.',
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {put} /api/inventory/:_id 2 - Modifier un etat des lieux
 * @apiName update
 * @apiGroup Etat des lieux
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiBody {ObjectId} id_agent ID de l'agent
 * @apiBody {Boolean} inOut Etat des lieux de sortie ou d'entrée
 * @apiBody {String} userReference Référence client
 * @apiBody {Date} date Date de l'état des lieux
 * @apiBody {String} previousBuyerRef Référence du précédent client
 * @apiBody {Array} lst_statsMeters Liste des relevés compteurs
 * @apiBody {Array} lst_roomDetails	Liste de l'état des pièces
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 * 		"status_code": 200,
 *       	"message": "Etat des lieux modifié.",
 *     }
 *
 * @apiError AgentValidationError Agent inexistant.
 * @apiError UserValidationError Utilisateur inexistant.
 * @apiError PreviousUserValidationError Utilisateur précédent inexistant.
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError BodyValidationError Erreurs générales sur les formats de données.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample id_agentError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 *		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"id_agent": "Agent inexistant."
 * 				}
 * 			]
 *     }
 *
 * @apiErrorExample userReferenceError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 *		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"userReference": "Utilisateur inexistant."
 * 				}
 * 			]
 *     }
 *
 * @apiErrorExample previousBuyerRefError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 *		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"userReference": "Utilisateur précédent inexistant."
 * 				}
 * 			]
 *     }
 */
const update = async (req, res) => {
	try {
		await Inventory.updateOne(
			{ _id: req.params.id },
			{ ...req.body, _id: req.params.id }
		)
		res.status(200).json({
			status_code: 200,
			message: 'Etat des lieux modifié.',
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {delete} /api/appointment 5 - Supprimer un état des lieux
 * @apiName delete
 * @apiGroup Etat des lieux
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {String} _id ID de l'etat des lieux.
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		"status_code": 200,
 *       	"message": "Etat des lieux supprimé.",
 *     }
 *
 * @apiError InventoryValidationError Etat des lieux non trouvé !
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample _idError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 *		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"_id": "Etat des lieux non trouvé."
 * 				}
 * 			]
 *     }
 */
const erase = async (req, res) => {
	try {
		await Inventory.deleteOne({ _id: req.params.id })
		res.status(200).json({
			status_code: 200,
			message: 'Etat des lieux supprimé !',
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {get} /api/transaction/ 3 - Récupérer tous les états des lieux
 * @apiName getAll
 * @apiGroup Etat des lieux
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiSuccess {Inventory} inventory Objet Etats des lieux.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		"status_code": 200,
 *      	"message": "Etats des lieux récupérés.",
 *		"inventories": {inventories},
 *     }
 *
 * @apiError ServerError Erreur Serveur.
 */
const getAll = async () => {
	try {
		let inventories = await Inventory.find()
		res.status(200).json({
			status_code: 200,
			message: 'Etats des lieux récupérés.',
			inventories,
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {get} /api/transaction/:_id 3.1 - Récupérer un état des lieux
 * @apiName getOne
 * @apiGroup Etat des lieux
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiSuccess {Inventory} inventory Objet Etat des lieux.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		"status_code": 200,
 *      	"message": "Etat des lieux récupéré.",
 *		"inventory": {inventory},
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 204 OK
 *
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 */
const getOne = async (req, res) => {
	try {
		let inventory = await Inventory.findById(req.params._id)
		if (inventory) {
			res.status(200).json({
				status_code: 200,
				message: 'Etat des lieux récupéré.',
				inventory,
			})
		} else {
			res.status(204)
		}
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {get} /api/inventory/getAllForOneUser/:_id Récupérer les inventaires d'un utilisateur
 * @apiName getAllForOneUser
 * @apiGroup Etat des lieux
 *
 * @apiParam {String} _id ID de l'état des lieux.
 *
 * @apiSuccess {Array} appointment Objet Etats des lieux.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 	   	"status_code": 200,
 * 		"message": "Etats des lieux récupérés.",
 * 		"inventories": {inventories}
 *     }
 *
 * @apiError UserValidationError Utilisateur non trouvé !
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample _idError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 *		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"_id": "Utilisateur non trouvé."
 * 				}
 * 			]
 *     }
 */
const getAllForOneUser = async (req, res) => {
	try {
		let inventories = await Inventory.find({
			where: { id_buyer: req.params.id },
		})
		res.status(200).json({
			status_code: 200,
			message: 'Etats des lieux récupérés.',
			inventories,
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {put} /api/inventory/room/:_id 8 - Ajouter l'état d'une pièce
 * @apiName addRoomDetails
 * @apiGroup Etat des lieux
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id id de l'état des lieux
 * @apiBody {String} name nom de la pièce à ajouter
 * @apiBody {String} condition état de la pièce à ajouter
 *
 * @apiSuccess {String} message état de la pièce ajouté !
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Etat de la pièce ajouté !',
 *     }
 *
 * @apiError InventoryValidationError Etat des lieux non trouvé !
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample _idError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 *		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"_id": "Etat des lieux non trouvé."
 * 				}
 * 			]
 *     }
 */
const addRoomDetails = async (req, res) => {
	try {
		await Inventory.updateOne(
			{ _id: req.params._id },
			{
				$push: {
					lst_roomDetails: {
						name: req.body.name,
						condition: req.body.condition,
					},
				},
			}
		)
		res.status(200).json({
			status_code: 200,
			message: 'Etat de la piece ajouté à la liste !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {delete} /api/inventory/room/:_id 9 - Supprimer l'état d'une pièce
 * @apiName removeRoomDetails
 * @apiGroup Etat des lieux
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id id de l'état des lieux
 *
 * @apiBody {String} name nom de la pièce à supprimer
 *
 * @apiSuccess {String} message vendeur supprimé de la liste
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Etat de la pièce supprimé de la liste',
 *     }
 *
 * @apiError InventoryValidationError Inventaire non trouvé !
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample _idError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 *		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"_id": "Etat des lieux non trouvé."
 * 				}
 * 			]
 *     }
 */
const removeRoomDetails = async (req, res) => {
	try {
		await Inventory.updateOne(
			{ _id: req.params._id },
			{
				$pull: {
					lst_roomDetails: { name: { $eq: req.body.name } },
				},
			}
		)
		res.status(200).json({
			status_code: 200,
			message: 'Etat de la pièce supprimé de la liste !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {put} /api/inventory/statsmeters/:_id 6 - Ajouter un relevé de compteur
 * @apiName addStatsMeters
 * @apiGroup Etat des lieux
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id id de l'état des lieux
 * @apiBody {String} name nom de la pièce à ajouter
 * @apiBody {String} condition état de la pièce à ajouter
 *
 * @apiSuccess {String} message relevé ajouté à la liste !
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Relevé ajouté à la liste !',
 *     }
 *
 * @apiError InventoryValidationError Inventaire non trouvé !
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample _idError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 *		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"_id": "Etat des lieux non trouvé."
 * 				}
 * 			]
 *     }
 */
const addStatsMeters = async (req, res) => {
	try {
		await Inventory.updateOne(
			{ _id: req.params._id },
			{
				$push: {
					lst_statsMeters: {
						name: req.body.name,
						amount: req.body.amount,
					},
				},
			}
		)
		res.status(200).json({
			status_code: 200,
			message: 'Relevé ajouté à la liste !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {delete} /api/inventory/statsmeters/:_id 7 - Supprimer un relevé de compteur
 * @apiName removeStatsMeters
 * @apiGroup Etat des lieux
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id id de l'état des lieux
 *
 * @apiBody {String} name nom du relevé à supprimer
 *
 * @apiSuccess {String} message relevé supprimé de la liste !
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Relevé supprimé de la liste !',
 *     }
 *
 * @apiError InventoryValidationError Inventaire non trouvé !
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample _idError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 *		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"_id": "Etat des lieux non trouvé."
 * 				}
 * 			]
 *     }
 */
const removeStatsMeters = async (req, res) => {
	try {
		await Inventory.updateOne(
			{ _id: req.params._id },
			{
				$pull: {
					lst_statsMeters: { name: { $eq: req.body.name } },
				},
			}
		)
		res.status(200).json({
			status_code: 200,
			message: 'Relevé supprimé de la liste !',
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
	getAllForOneUser,
	addRoomDetails,
	removeRoomDetails,
	addStatsMeters,
	removeStatsMeters,
}
