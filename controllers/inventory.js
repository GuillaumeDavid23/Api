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
 * @apiError ServerError Etat des lieux non crée.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Etat des lieux non crée !"
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
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Etat des lieux non modifiée !"
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

const erase = async (req, res) => {
	try {
		// On check la Etat des lieux a supprimer:
		let inventory = await Inventory.findOne({ _id: req.params.id })
		if (!inventory) {
			return res.status(404).json({
				status_code: 404,
				error: 'Etat des lieux non trouvé !',
			})
		}
		if (inventory.userId !== req.auth.userId) {
			return res.status(401).json({
				status_code: 401,
				error: 'Requête non autorisée !',
			})
		}

		// On éxecute:
		await inventory.deleteOne({ _id: req.params.id })
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
 * @apiError InventoryNotFound Aucune Inventory.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Aucune Inventory trouvée !"
 *     }
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
 * @apiError InventoryNotFound Aucune Inventory.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Aucune Inventory trouvée !"
 *     }
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

// /!\ Réussir à recupérer la condition:
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
