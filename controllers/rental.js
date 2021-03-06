import Rental from '../models/Rental.js'

/**
 * @api {post} /api/rental 1 - Créer une Location
 * @apiName create
 * @apiGroup Location
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiBody {ObejectId} id_agent ID de l'agent
 * @apiBody {Boolean} inOut Location de sortie ou d'entrée
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
 * 		"status_code": 201,
 *       	"message": "Location enregistré !"",
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
 *  		"status_code": 422,
 * 		"message": "La validation à échouée.",
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
 *  		"status_code": 422,
 * 		"message": "La validation à échouée.",
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
 *   		"status_code": 422,
 * 		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"userReference": "Utilisateur précédent inexistant."
 * 				}
 * 			]
 *     }
 */
const create = async (req, res) => {
	try {
		const rental = new Rental({
			...req.body,
		})
		await rental.save()
		res.status(201).json({
			status_code: 201,
			message: 'Location enregistrée.',
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {put} /api/inventory/:_id 2 - Modifier une location
 * @apiName update
 * @apiGroup Location
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiBody {ObejectId} id_agent ID de l'agent
 * @apiBody {Boolean} inOut Location de sortie ou d'entrée
 * @apiBody {String} userReference Référence client
 * @apiBody {Date} date Date de l'état des lieux
 * @apiBody {String} previousBuyerRef Référence du précédent client
 * @apiBody {Array} lst_statsMeters Liste des relevés compteurs
 * @apiBody {Array} lst_roomDetails	Liste de l'état des pièces
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		"status_code": 200,
 *       	"message": 'Location modifiée.',
 *     }
 *
 * @apiError AgentValidationError Agent inexistant.
 * @apiError UserValidationError Utilisateur inexistant.
 * @apiError PreviousUserValidationError Utilisateur précédent inexistant.
 * @apiError RentalValidationError Location non trouvé.
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError BodyValidationError Erreurs générales sur les formats de données.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample id_agentError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *  		"status_code": 422,
 * 		"message": "La validation à échouée.",
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
 *   		"status_code": 422,
 * 		"message": "La validation à échouée.",
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
 *  		"status_code": 422,
 * 		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"userReference": "Utilisateur précédent inexistant."
 * 				}
 * 			]
 *     }
 */
const update = async (req, res) => {
	try {
		await Rental.updateOne(
			{
				_id: req.params.id,
			},
			{
				...req.body,
				_id: req.params.id,
			}
		)
		res.status(200).json({
			status_code: 200,
			message: 'Location modifiée.',
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {delete} /api/appointment 3 - Supprimer une location
 * @apiName delete
 * @apiGroup Location
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {String} _id ID de l'Location.
 *
 * @apiSuccess {String} message Message de completion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		"status_code": 200,
 *       	"message": "Location supprimé.",
 *     }
 *
 * @apiError RentalValidationError Location non trouvé.
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample _idError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *   		"status_code": 422,
 * 		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"_id": "Location non trouvé."
 * 				}
 * 			]
 *     }
 */
const erase = async (req, res) => {
	try {
		let rental = await Rental.findOne({
			_id: req.params.id,
		})
		if (!rental) {
			return res.status(404).json({
				status_code: 404,
				error: 'Location non trouvée.',
			})
		}
		if (rental.userId !== req.auth.userId) {
			return res.status(401).json({
				status_code: 401,
				error: 'Requête non autorisée.',
			})
		}
		await Rental.deleteOne({
			_id: req.params.id,
		})
		res.status(200).json({
			status_code: 200,
			message: 'Location supprimée.',
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {get} /api/rental/ 4 - Récupérer toutes les locations
 * @apiName getAll
 * @apiGroup Rental
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiSuccess {Rental} rental Objet Location.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		"status_code": 200,
 *      	"message": "Locations récupérées.",
 *		"rentals": {rentals},
 *     }
 *
 * @apiError PropertyValidationError Location non trouvé.
 * @apiError ServerError Erreur Serveur.
 */
const getAll = async (req, res) => {
	try {
		let rentals = await Rental.find()
		res.status(200).json({
			status_code: 200,
			message: 'Locations récupérées.',
			rentals,
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {get} /api/rental/:_id 5 - Récupérer un état des lieux
 * @apiName getOne
 * @apiGroup Rental
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiSuccess {Rental} rental Objet Location.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		"status_code": 200,
 *      	"message": "Location récupérée.",
 *		"rental": {rental},
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
		let rental = await Rental.findById(req.params._id)
		if (rental) {
			res.status(200).json({
				status_code: 200,
				message: 'Location récupérée.',
				rental,
			})
		} else {
			res.status(204).json({
				status_code: 204,
				message: 'Location inexistante.',
			})
		}
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

export { create, update, erase, getAll, getOne }
