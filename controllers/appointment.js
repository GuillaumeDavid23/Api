import Appointment from '../models/Appointment.js'
import User from '../models/User.js'
import { asyncForEach } from '../util/functions.js'
import moment from 'moment'
import 'moment/locale/fr.js'
moment.locale('fr')

/**
 * @api {post} /api/appointment Créer un rendez-vous
 * @apiName create
 * @apiGroup Rendez-vous
 *
 * @apiHeader {String} Authorization
 *
 * @apiBody {Datetime} dateBegin="2022-02-10 10:00:00"
 * @apiBody {Datetime} dateEnd="2022-02-10 10:30:00"
 * @apiBody {String} adress="16 rue des Jacobins 80000 Amiens"
 * @apiBody {Boolean} outdoor="true"
 * @apiBody {String} id_buyer="61fa4b6976ee39da9692d563"
 * @apiBody {String} id_agent="61fa4b6976ee39da9692d562"
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       	"status_code": 201,
 *		"message": "Rendez-vous enregistré.",
 *     }
 *
 * @apiError DateValidationError Date de fin antérieure à la date de début.
 * @apiError BuyerValidationError Acheteur inexistant.
 * @apiError AgentValidationError Agent inexistant.
 * @apiError BodyValidationError Erreurs générales sur les formats de données.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample dateEndError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 *		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"dateEnd": "Date de fin antérieure à la date de début."
 * 				}
 * 			]
 *     }
 *
 * @apiErrorExample id_buyerError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 *		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"id_buyer": "Acheteur inexistant."
 * 				}
 * 			]
 *     }
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
 */
const create = async (req, res) => {
	let { id_agent, dateBegin, fromDesktop } = req.body

	try {
		// On bloque si rendez-vous déjà existant:
		let appointment = await Appointment.findOne({ id_agent, dateBegin })
		if (appointment) {
			return res.status(400).json({
				status_code: 400,
				message: 'Plage horraire déjà prise..',
			})
		}

		appointment = new Appointment({
			...req.body,
			dateBegin,
			id_agent: fromDesktop ? id_agent : req.auth.user._id,
		})

		await appointment.save()
		res.status(201).json({
			status_code: 201,
			message: 'Rendez-vous enregistré.',
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {put} /api/appointment/:id Modifier un rendez-vous
 * @apiName update
 * @apiGroup Rendez-vous
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {String} _id ID du rendez-vous.
 *
 * @apiBody {Datetime} dateBegin="2022-02-10 10:00:00"
 * @apiBody {Datetime} dateEnd="2022-02-10 10:30:00"
 * @apiBody {String} adress="16 rue des Jacobins 80000 Amiens"
 * @apiBody {Boolean} outdoor="true"
 * @apiBody {String} id_buyer="61fa4b6976ee39da9692d563"
 * @apiBody {String} id_agent="61fa4b6976ee39da9692d562"
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       	"status_code": 200,
 *		"message": "Rendez-vous modifié.",
 *     }
 *
 * @apiError DateValidationError Date de fin antérieure à la date de début.
 * @apiError BuyerValidationError Acheteur inexistant.
 * @apiError AgentValidationError Agent inexistant.
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError BodyValidationError Erreurs générales sur les formats de données.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample dateEndError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 *		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"dateEnd": "Date de fin antérieure à la date de début."
 * 				}
 * 			]
 *     }
 *
 * @apiErrorExample id_buyerError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 *		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"id_buyer": "Acheteur inexistant."
 * 				}
 * 			]
 *     }
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
 */
const update = async (req, res) => {
	try {
		await Appointment.updateOne({ _id: req.params._id }, { ...req.body })
		res.status(200).json({
			status_code: 200,
			message: 'Rendez-vous modifié.',
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {delete} /api/appointment/:id Supprimer un rendez-vous
 * @apiName delete
 * @apiGroup Rendez-vous
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {String} _id ID du rendez-vous.
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       	"status_code": 200,
 *		"message": "Rendez-vous supprimé.",
 *     }
 *
 * @apiError AppointmentValidationError Rendez-vous non trouvé.
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
 * 					"_id": "Rendez-vous non trouvé."
 * 				}
 * 			]
 *     }
 */
const erase = async (req, res) => {
	try {
		await Appointment.deleteOne({ _id: req.params._id })
		res.status(200).json({
			status_code: 200,
			message: 'Rendez-vous supprimé.',
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {get} /api/appointment Récupérer tout les rendez-vous
 * @apiName getAll
 * @apiGroup Rendez-vous
 *
 * @apiSuccess {Array} appointments Liste de rendez-vous
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		"status_code": 200,
 *		"message": "Rendez-vous récupérés.",
 *		"appointments": {appointments}
 *     }
 *
 * @apiError ServerError Erreur Serveur.
 */
const getAll = async (req, res) => {
	try {
		let appointments = await Appointment.find(),
			formattedAppointments = []

		await asyncForEach(appointments, async (appointment) => {
			appointment = appointment.toObject()
			let buyer = await User.findById(appointment.id_buyer),
				agent = await User.findById(appointment.id_agent)
			formattedAppointments.push({ ...appointment, buyer, agent })
		})

		res.status(200).json({
			status_code: 200,
			message: 'Rendez-vous récupérés.',
			appointments: formattedAppointments,
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {get} /api/property/:_id Récupérer un rendez-vous
 * @apiName getOne
 * @apiGroup Rendez-vous
 *
 * @apiParam {String} _id ID du rendez-vous.
 *
 * @apiSuccess {Property} appointment Objet Rendez-vous.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		"status_code": 200,
 *		"message": "Rendez-vous récupéré.",
 *		"appointment": {appointment},
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
		let appointment = await Appointment.findById(req.params._id)
		if (appointment) {
			res.status(200).json({
				status_code: 200,
				message: 'Rendez-vous récupéré.',
				appointment,
			})
		} else {
			res.status(204)
		}
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

const getAllForAnAgent = async (req, res) => {
	try {
		// Récupération des rendez-vous:
		let appointments = await Appointment.find({
			id_agent: req.auth.user._id,
		})

		// Récupération de l'utilisateur:
		let formattedAppointments = []
		await asyncForEach(appointments, async (appointment) => {
			let buyer = await User.findById(appointment.id_buyer)
			let { _id, dateBegin, dateEnd, outdoor, address } = appointment
			formattedAppointments.push({
				_id,
				dateBegin,
				dateEnd,
				outdoor,
				address,
				buyer,
			})
		})

		res.status(200).json({
			status_code: 200,
			message: 'Rendez-vous pour un agent récupérés.',
			datas: formattedAppointments,
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {get} /api/property/:_id Récupérer les participants d'un rendez-vous
 * @apiName getParticipants
 * @apiGroup Rendez-vous
 *
 * @apiParam {String} _id ID du rendez-vous.
 *
 * @apiSuccess {Property} appointment Objet Rendez-vous.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		"status_code": 200,
 *		"message": "Partcipants récupérés.",
 *		"buyer": {buyer},
 *		"agent": {agent},
 *     }
 *
 * @apiError AppointmentValidationError Rendez-vous non trouvé !
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
 * 					"_id": "Rendez-vous non trouvé !"
 * 				}
 * 			]
 *     }
 */
const getParticipants = async (req, res) => {
	try {
		let appointment = await Appointment.findOne({ _id: req.params._id })
		let buyer = await Buyer.findOne({ _id: appointment.id_buyer })
		let agent = await Agent.findOne({ _id: appointment.id_agent })
		res.status(200).json({
			status_code: 200,
			message: 'Partcipants récupérés.',
			buyer: buyer,
			agent: agent,
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

export {
	create,
	update,
	erase,
	getAll,
	getOne,
	getAllForAnAgent,
	getParticipants,
}
