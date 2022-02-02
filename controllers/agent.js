import Agent from '../models/Agent.js'
import Appointment from '../models/Appointment.js'
import Transaction from '../models/Transaction.js'

//CREATE AGENT
/**
 * @api {post} /api/agent Créer un agent
 * @apiName create
 * @apiGroup Agent
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiBody {String} firstname Prénom de l'agent
 * @apiBody {String} lastname Nom de l'agent
 * @apiBody {String} email Email de l'agent
 * @apiBody {String} password Mot de passe de l'agent
 * @apiBody {String} [phone] Numéro de téléphone de l'agent
 * @apiBody {Boolean} newsletter="false" Accord des newsletters de l'agent
 * @apiBody {String} pro_phone_number Téléphone professionel
 * @apiBody {Boolean} status="true" Status actif ou non
 * @apiBody {String} [ref] Référence client
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": 'Agent enregistrée !',
 *     }
 *
 * @apiError ServerError Erreur serveur.
 * @apiError UserAlreadyExists Un compte avec cette adresse email existe déjà !
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Agent non crée !"
 *     }
 */
const create = async (req, res) => {
	let datas = req.body
	const ag = new Agent({
		...datas,
	})
	const mailCheck = await Agent.findOne({ email: ag.email })
	if (mailCheck) {
		return res.status(403).json({
			error: 'Un compte avec cette adresse email existe déjà !',
		})
	}
	bcrypt.hash(ag.password, saltRounds, function (err, hash) {
		ag.password = hash
		ag.save()
			.then(() =>
				res.status(201).json({
					message: 'Utilisateur créé !',
				})
			)
			.catch((error) =>
				res.status(400).json({
					error,
				})
			)
	})
}

//GET ALL AGENT
/**
 * @api {get} /api/agent/ Récupérer tous les agents
 * @apiName getAllAgents
 * @apiGroup Agent
 *
 * @apiSuccess {User} user Objet Agent.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'Tous les agents : récupérés !',
		"data": ags,
 *     }
 *
 * @apiError UserNotFound Aucun utilisateur.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Aucun agent trouvé !"
 *     }
 */
const getAllAgents = (req, res) => {
	Agent.find()
		.then((ags) => {
			res.status(200).json({
				status_code: 200,
				message: 'Tous les agents : récupérés !',
				data: ags,
			})
		})
		.catch((err) => {
			res.status_code(400)
		})
}

//GET ONE AGENT
/**
 * @api {get} /api/agent/:_id Récupérer un agent
 * @apiName getAgent
 * @apiGroup Agent
 *
 * @apiParam {Number} _id ID de l'agent.
 *
 * @apiSuccess {User} user Objet Agent.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'Utilisateur récupéré !',
		"data": agent,
 *     }
 *
 * @apiError UserNotFound Aucun agent.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "agent non trouvé !"
 *     }
 */
const getAgent = async (req, res) => {
	try {
		const agent = await Agent.findById(req.params._id)
		if (agent) {
			res.status(200).json(agent)
		} else {
			res.status(204).json({ message: 'Aucun utilisateur' })
		}
	} catch (error) {
		console.log(error)
		res.status(400).json(error)
	}
}

//Check AVAILABILITIES OF AGENT
/**
 * @api {post} /api/agent/availabilities Vérifier ses disponibilités
 * @apiName checkAvailabilities
 * @apiGroup Agent
 *
 * @apiBody {Date} date Date de test des disponibilités
 * @apiBody {ObjectId} id_agent Id de l'agent
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "Availabilities": availableArray,
 *     }
 *
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": error
 *     }
 */
const checkAvailabilities = async (req, res) => {
	let datas = req.body

	try {
		let begin = new Date(datas.date)
		let end = new Date(datas.date)
		begin.setUTCHours(8)
		end.setUTCHours(19)

		let appointments = await Appointment.find({
			id_agent: datas.id_agent,
		}).sort({ dateBegin: 'asc' })

		let availableArray = [
			'9h-9h30',
			'9h30-10h',
			'10h-10h30',
			'10h30-11h',
			'11h-11h30',
			'11h30-12h',
			'12h-12h30',
			'12h30-13h',
			'13h-13h30',
			'13h30-14h',
			'14h-14h30',
			'14h30-15h',
			'15h-15h30',
			'15h30-16h',
			'16h-16h30',
			'16h30-17h',
			'17h-17h30',
			'17h30-18h',
			'18h-18h30',
			'18h30-19h',
		]
		let index = 0
		appointments.forEach((appoint) => {
			if (appoint.dateBegin >= begin && appoint.dateEnd <= end) {
				let hourBegin = appoint.dateBegin.getUTCHours()
				let hourEnd = appoint.dateEnd.getUTCHours()
				while (hourBegin < hourEnd) {
					let slot = hourBegin + 0.5
					if (hourBegin % 1 === 0) {
						slot -= 0.5
						let result = hourBegin + 'h-' + slot + 'h30'
						index = availableArray.indexOf(result)
					} else {
						index = availableArray.indexOf(
							hourBegin - 0.5 + 'h30-' + slot + 'h'
						)
					}
					availableArray.splice(index, 1)
					hourBegin += 0.5
				}
			}
		})
		res.status(200).json({
			Availabilities: availableArray,
		})
	} catch (error) {
		console.log(error)
		res.status(400).json(error)
	}
}

//MAKE ONE TRANSACTION
/**
 * @api {post} /api/agent/transaction Faire une transaction
 * @apiName makeTransaction
 * @apiGroup Agent
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
const makeTransaction = (req, res) => {
	let datas = Object.keys(req.body).length === 0 ? req.query : req.body

	const transaction = new Transaction({
		...datas,
	})

	transaction
		.save()
		.then(() => {
			res.status(201).json({
				status_code: 201,
				message: 'Transaction enregistré !',
			})
		})
		.catch((error) => {
			res.status(400).json({
				status_code: 400,
				message: error,
			})
		})
}

export { create, getAllAgents, getAgent, checkAvailabilities, makeTransaction }
