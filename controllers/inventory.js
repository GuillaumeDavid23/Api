import Inventory from '../models/Inventory.js'

/**
 * @api {post} /api/inventory Créer un Etat des lieux
 * @apiName create
 * @apiGroup Etat des lieux
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiBody {ObejectId} id_agent ID de l'agent
 * @apiBody {Boolean} inOut Etat des lieux de sortie ou d'entrée
 * @apiBody {String} userReference Référence client
 * @apiBody {Date} date DAte de l'état des lieux
 * @apiBody {String} previousBuyerRef Référence du précédent client
 * @apiBody {Array} lst_statsMeters Liste des relevés compteurs
 * @apiBody {Array} lst_roomDetails	Liste de l'état des pièces
 *
 * @apiSuccess {String} message Message de completion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": "Etat des lieux enregistré !"",
 *     }
 *
 * @apiError ValidationError Agent inexistant.
 * @apiError ValidationError Utilisateur inexistant.
 * @apiError ValidationError Utilisateur précédent inexistant.
 * @apiError ValidationError Erreurs générales sur les formats de données.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample id_agentError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "errors": [
 * 			{
 * 				"id_agent": "Agent inexistant."
 * 			}
 * 		]
 *     }
 *
 * @apiErrorExample userReferenceError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "errors": [
 * 			{
 * 				"userReference": "Utilisateur inexistant."
 * 			}
 * 		]
 *     }
 *
 * @apiErrorExample previousBuyerRefError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "errors": [
 * 			{
 * 				"userReference": "Utilisateur précédent inexistant."
 * 			}
 * 		]
 *     }
 */
const create = async (req, res) => {
	try {
		const inventory = new Inventory({
			...req.body,
		})
		await inventory.save()
		res.status(201).json({
			status_code: 201,
			message: 'Etat des lieux enregistrée !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {put} /api/inventory/:_id Modifier un etat des lieux
 * @apiName update
 * @apiGroup Etat des lieux
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiBody {ObejectId} id_agent ID de l'agent
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
 *       "message": 'Etat des lieux modifiée !',
 *     }
 *
 * @apiError ValidationError Agent inexistant.
 * @apiError ValidationError Utilisateur inexistant.
 * @apiError ValidationError Utilisateur précédent inexistant.
 * @apiError ValidationError Erreurs générales sur les formats de données.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample id_agentError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "errors": [
 * 			{
 * 				"id_agent": "Agent inexistant."
 * 			}
 * 		]
 *     }
 *
 * @apiErrorExample userReferenceError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "errors": [
 * 			{
 * 				"userReference": "Utilisateur inexistant."
 * 			}
 * 		]
 *     }
 *
 * @apiErrorExample previousBuyerRefError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "errors": [
 * 			{
 * 				"userReference": "Utilisateur précédent inexistant."
 * 			}
 * 		]
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
			message: 'Etat des lieux modifiée !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

// DELETE
/**
 * @api {delete} /api/appointment Supprimer un état des lieux
 * @apiName delete
 * @apiGroup Etat des lieux
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {String} _id ID de l'etat des lieux.
 *
 * @apiSuccess {String} message Message de completion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Etat des lieux supprimé !",
 *     }
 *
 * @apiError ValidationError Etat des lieux non trouvé !
 * @apiError ValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample _idError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "errors": [
 * 			{
 * 				"_id": "Etat des lieux non trouvé !"
 * 			}
 * 		]
 *     }
 */
const erase = async (req, res) => {
	try {
		await Inventory.deleteOne({ _id: req.params.id })
		res.status(200).json({
			status_code: 200,
			message: 'Etat des lieux supprimée !',
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {get} /api/transaction/ Récupérer tous les états des lieux
 * @apiName getAll
 * @apiGroup Etat des lieux
 * 
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiSuccess {Inventory} inventory Objet Etat des lieux.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'Etat des lieux récupéré !',
		"data": inventories,
 *     }
 *
 * @apiError ServerError Erreur Serveur.
 */
const getAll = async () => {
	try {
		let inventories = await Inventory.find()
		res.status(200).json(inventories)
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {get} /api/transaction/:_id Récupérer un état des lieux
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
 *      "message": 'Etat des lieux récupéré !',
		"data": inventory,
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
		let inventory = await Inventory.findById(req.params._id)
		if (inventory) {
			res.status(200).json({
				status_code: 200,
				data: inventory,
			})
		} else {
			res.status(204).json({
				status_code: 204,
				message: 'Aucun Etat des lieux',
			})
		}
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

// READ ONE JOIN
/**
 * @api {get} /api/inventory/:id Récupérer les inventaires d'un utilisateur
 * @apiName getAllForOneUser
 * @apiGroup Etat des lieux
 *
 * @apiParam {String} _id ID de l'état des lieux.
 *
 * @apiSuccess {Array} appointment Objet Etat des lieux.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 	   		status_code: 200,
 * 			datas: {inventories}
 *     }
 *
 * @apiError ValidationError Utilisateur non trouvé !
 * @apiError ValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample _idError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "errors": [
 * 			{
 * 				"_id": "Utilisateur non trouvé !"
 * 			}
 * 		]
 *     }
 */
const getAllForOneUser = async (req, res) => {
	try {
		let inventories = await Inventory.find({
			where: { id_buyer: req.params.id },
		})
		res.status(200).json({
			status_code: 200,
			datas: inventories,
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

export { create, update, erase, getAll, getOne, getAllForOneUser }
