import Appointment from '../models/Appointment.js'

// CREATE
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
 * @apiSuccess {String} message Message de completion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": "Rendez-vous enregistré !"",
 *     }
 *
 * @apiError ServerError Rendez-vous non crée.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Rendez-vous non crée !"
 *     }
 */
const create = (req, res) => {
	const appointment = new Appointment({ ...req.body })

	appointment
		.save()
		.then(() =>
			res.status(201).json({
				status_code: 201,
				message: 'Rendez-vous enregistré !',
			})
		)
		.catch((error) =>
			res.status(500).json({
				status_code: 500,
				error,
			})
		)
}

// UPDATE
/**
 * @api {post} /api/appointment Modifier un rendez-vous
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
 *       "message": "Rendez-vous modifié !"",
 *     }
 *
 * @apiError ServerError Rendez-vous non modifié.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Rendez-vous non modifié !"
 *     }
 */
const update = (req, res) => {
	Appointment.updateOne(
		{ _id: req.params.id },
		{ ...req.body, _id: req.params.id }
	)
		.then(() =>
			res.status(200).json({
				status_code: 200,
				message: 'Rendez-vous modifié !',
			})
		)
		.catch((error) =>
			res.status(500).json({
				status_code: 500,
				error,
			})
		)
}

// DELETE
/**
 * @api {post} /api/appointment Supprimer un rendez-vous
 * @apiName delete
 * @apiGroup Rendez-vous
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {String} _id ID du rendez-vous.
 *
 * @apiSuccess {String} message Message de completion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Rendez-vous supprimé !"",
 *     }
 *
 * @apiError ServerError Rendez-vous non supprimé.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Rendez-vous non supprimé !"
 *     }
 */
const erase = async (req, res) => {
	try {
		// On check la transaction a supprimer:
		let appointment = await Appointment.findOne({ _id: req.params.id })
		if (!appointment) {
			return res.status(404).json({
				status_code: 404,
				error: 'Rendez-vous non trouvé !',
			})
		}
		if (appointment.userId !== req.auth.userId) {
			return res.status(401).json({
				status_code: 401,
				error: 'Requête non autorisée !',
			})
		}

		// On éxecute:
		Appointment.deleteOne({ _id: req.params.id }).then(() =>
			res
				.status(200)
				.json({ status_code: 200, message: 'Rendez-vous supprimé !' })
		)
	} catch (error) {
		res.status(400).json({ status_code: 400, error })
	}
}

// READ
/**
 * @api {get} /api/appointment Récupérer tout les rendez-vous
 * @apiName getAll
 * @apiGroup Rendez-vous
 *
 * @apiSuccess {Array} appointments Liste de rendez-vbus
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Liste de Rendez-vous récupérée !",
 *       "data": appointments,
 *     }
 *
 * @apiError ServerError Erreur Serveur
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Erreur serveur !"
 *     }
 */
const getAll = (req, res) => {
	Appointment.find()
		.then((appointments) => res.status(200).json(appointments))
		.catch((error) =>
			res.status(400).json({
				status_code: 400,
				error,
			})
		)
}

// READ ONE
/**
 * @api {get} /api/property/:id Récupérer un rendez-vous
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
 *       "message": "Rendez-vous récupéré !",
 *       "data": appointment,
 *     }
 *
 * @apiError AppointmentNotFound Rendez-vous non trouvée.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 204 Not Found
 *     {
 *       "error": "Rendez-vous non trouvée !"
 *     }
 */
const getOne = async (req, res) => {
	try {
		let appointment = await Appointment.findById(req.params._id)
		if (appointment) {
			res.status(200).json({
				status_code: 200,
				datas: appointment,
			})
		} else {
			res.status(204).json({
				status_code: 204,
				message: 'Aucun rendez-vous',
			})
		}
	} catch (error) {
		res.status(400).json({
			status_code: 400,
			error,
		})
	}
}

// READ ONE JOIN
/**
 * @api {get} /api/property/:id Récupérer les participants d'un rendez-vous
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
 *       "message": "Participants récupérés !",
 *       "data": users,
 *     }
 *
 * @apiError AppointmentNotFound Rendez-vous non trouvée.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 204 Not Found
 *     {
 *       "error": "Participants non récupérés !"
 *     }
 */
const getParticipants = async (req, res) => {
	try {
		let appointment = await Appointment.findOne({ _id: req.params._id })
		let buyer = await Buyer.findOne({ _id: appointment.id_buyer })
		let agent = await Agent.findOne({ _id: appointment.id_agent })
		res.status(200).json({
			status_code: 200,
			buyer: buyer,
			agent: agent,
		})
	} catch (error) {
		res.status(400).json({
			status_code: 400,
			error,
		})
	}
}

export { create, update, erase, getAll, getOne, getParticipants }
