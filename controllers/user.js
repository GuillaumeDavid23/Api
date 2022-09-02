import User from '../models/User.js'
import Appointment from '../models/Appointment.js'
import Inventory from '../models/Inventory.js'
import Property from '../models/Property.js'
import Rental from '../models/Rental.js'
import Transaction from '../models/Transaction.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import sendMail from '../util/mail.js'
import moment from 'moment'
import 'moment/locale/fr.js'
moment.locale('fr')
dotenv.config()

/**
 * * PARTIE UTILISATEUR
 */

/**
 * @api {post} /api/user/signup 1 - Inscription utilisateur
 * @apiName signup
 * @apiGroup Utilisateur
 *
 * @apiBody {String} firstname Prénom de l'utilisateur
 * @apiBody {String} lastname Nom de l'utilisateur
 * @apiBody {String} email Email de l'utilisateur
 * @apiBody {String} password Mot de passe de l'utilisateur
 * @apiBody {String} [phone] Numéro de téléphone de l'utilisateur
 * @apiBody {Boolean} newsletter="false" Accord des newsletters de l'utilisateur
 * @apiBody {Object} [buyer] Informations de l'acheteur ({Object} wishlist, {Number} budgetMin, {Number} budgetMax, {String} city, {Number} surfaceMin, {Number} surfaceMax, {String} type)
 * @apiBody {Object} [seller] Informations du vendeur ({Object} propertiesList)
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Compte créé  !',
 *     }
 *
 * @apiError ServerError Erreur serveur.
 * @apiError UserAlreadyExists Un compte avec cette adresse email existe déjà !
 *
 * @apiErrorExample ServerError:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Utilisateur non créé !"
 *     }
 * @apiErrorExample UserAlreadyExists:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "Un compte avec cette adresse email existe déjà !"
 *     }
 */
const signup = async (req, res) => {
	let datas = req.body

	if (datas.password != null) {
		try {
			let mailCheck = await User.findOne({ email: req.body.email })
			// On check si le compte existe (et pas seulement pour la newsletter)
			if (mailCheck && mailCheck.password) {
				return res.status(403).json({
					status_code: 403,
					message: 'Cet email est déjà utilisé !',
				})
			}

			let hash = await bcrypt.hash(datas.password, 10)
			// Cas ou à un compte à été crée pour la newsletter:
			var user
			if (mailCheck && !mailCheck.password) {
				await User.replaceOne(
					{ email: req.body.email },
					{
						...req.body,
						password: hash,
						roles: ['user'],
					}
				)
			} else {
				user = new User({
					...datas,
					password: hash,
					roles: ['user'],
				})
				await user.save()
			}
			user = await User.findOne({ email: req.body.email })
			sendVerificationMail(user._id, user.email)
			const token = jwt.sign({ user }, process.env.SECRET_TOKEN, {
				expiresIn: '5h',
			})
			res.status(201).json({
				status_code: 201,
				message: 'Compte créé !',
				token,
			})
		} catch (error) {
			console.log(error)
			res.status(500).json({
				status_code: 500,
				error: error.message,
			})
		}
	} else {
		res.status(400).json({
			status_code: 400,
			message: 'Mot de passe vide',
		})
	}
}

/**
 * @api {post} /api/user/login 2 - Authentification utilisateur
 * @apiName login
 * @apiGroup Utilisateur
 *
 * @apiBody {String} email
 * @apiBody {String} password
 *
 * @apiSuccess 200 Utilisateur connecté
 *
 * @apiError 401 Mot de passe incorrect
 * @apiError 403 Compte désactivé
 *
 */
const login = async (req, res) => {
	let datas = Object.keys(req.body).length === 0 ? req.query : req.body
	try {
		datas.email = datas.email.toLowerCase()
		const user = await User.findOne({ email: datas.email }).populate({
			path: 'buyer.agent',
			select: 'firstname lastname agent.phonePro email',
		})
		if (!user)
			return res.status(401).json({
				status_code: 401,
				error: 'Utilisateur non trouvé !',
			})
		if (user.status == false && user.deletedAt != undefined) {
			return res.status(403).json({
				status_code: 403,
				error: 'Compte utilisateur désactivé.',
			})
		}
		let valid = await bcrypt.compare(datas.password, user.password)
		if (!valid) {
			return res.status(401).json({
				status_code: 401,
				error: 'Mot de passe incorrect !',
			})
		}
		const token = jwt.sign({ user }, process.env.SECRET_TOKEN, {
			expiresIn: '8h',
		})
		// Insertion ou non du RefreshToken:
		if (datas.rememberMe) {
			const refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN, {
				expiresIn: '1y',
			})
			if (user.status == false && user.deletedAt == undefined) {
				sendVerificationMail(user._id, user.email)
				return res.status(200).json({
					status_code: 200,
					message: 'Vous devez vérifier votre email.',
					token,
					refreshToken,
				})
			}
			res.status(200).json({
				status_code: 200,
				userId: user._id,
				token,
				refreshToken,
				message: 'Utilisateur connecté !',
			})
		} else {
			if (user.status == false && user.deletedAt == undefined) {
				sendVerificationMail(user._id, user.email)
				return res.status(200).json({
					status_code: 200,
					message: 'Vous devez vérifier votre email.',
					token,
				})
			}
			res.status(200).json({
				status_code: 200,
				userId: user._id,
				token,
				message: 'Utilisateur connecté !',
			})
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {put} /api/user/:_id 3 - Mettre à jour un utilisateur
 * @apiName update
 * @apiGroup Utilisateur
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id
 *
 * @apiBody {String} firstname Prénom de l'utilisateur
 * @apiBody {String} lastname Nom de l'utilisateur
 * @apiBody {String} email Email de l'utilisateur
 * @apiBody {String} password Mot de passe de l'utilisateur
 * @apiBody {String} [phone] Numéro de téléphone de l'utilisateur
 * @apiBody {Boolean} newsletter="false" Accord des newsletters de l'utilisateur
 * @apiBody {Boolean} status="true" Status actif ou non
 * @apiBody {String} [ref] Référence client
 * @apiBody {Object} [buyer] Informations de l'acheteur ({Object} wishlist, {Number} budgetMin, {Number} budgetMax, {String} city, {Number} surfaceMin, {Number} surfaceMax, {String} type)
 * @apiBody {Object} [seller] Informations du vendeur ({Object} propertiesList)
 * @apiBody {Object} [agent] Informations de l'agent ({String} pro_phone_tel)
 *
 * @apiSuccess {String} message Utilisateur modifié !.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Utilisateur modifié !',
 *     }
 *
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample ServerError:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Utilisateur non modifié !"
 *     }
 */
const update = async (req, res) => {
	try {
		if (
			req.params._id !== req.auth.user._id &&
			!req.auth.user.roles === 'agent'
		) {
			return res.status(403).json({
				status_code: 403,
				message: 'Pas autorisé !',
			})
		}
		// On check si le mail est déjà pris:
		let user = await User.findOne({ email: req.body.email })

		if (user && user._id.toString() !== req.params._id) {
			return res.status(403).json({
				status_code: 403,
				message: 'Email déjà utilisé !',
			})
		}

		await User.updateOne({ _id: req.params._id }, { ...req.body })

		res.status(201).json({
			status_code: 201,
			message: 'Utilisateur modifié !',
		})
	} catch (error) {
		res.status(500).json({
			error: error.message,
		})
	}
}

/**
 * @api {PUT} /api/user/delete/:_id 4 - Supprimer un utilisateur
 * @apiName deleteOne
 * @apiGroup Utilisateur
 *
 * @apiSuccess {String} message Utilisateur désactivé !.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *      "message": 'Utilisateur désactivé !',
 *     }
 *
 * @apiError UserNotFound Aucun utilisateur.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample UserNotFound:
 *     HTTP/1.1 204 No Content
 *     {
 *       "error": "Action impossible !"
 *     }
 *
 * @apiErrorExample ServerError:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Erreur serveur !"
 *     }
 */
const deleteOne = async (req, res) => {
	try {
		await User.updateOne(
			{
				_id: req.params._id,
			},
			{
				status: 0,
				deletedAt: new Date(),
			}
		)
		res.status(201).json({
			status_code: 201,
			message: 'Utilisateur désactivé !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {get} /api/user/:_id 5 - Récupérer un utilisateur
 * @apiName getOne
 * @apiGroup Utilisateur
 *
 * @apiParam {ObjectId} _id ID de l'utilisateur.
 *
 * @apiSuccess {User} user Objet Utilisateur.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'Utilisateur récupéré !',
		"data": user,
 *     }
 *
 * @apiError UserNotFound Aucun utilisateur.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample UserNotFound:
 *     HTTP/1.1 204 Internal Server Error
 *     {
 *       "message": "Aucun utilisateur"
 *     }
 * @apiErrorExample ServerError:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Erreur Serveur."
 *     }
 */
const getOne = async (req, res) => {
	try {
		const user = await User.findById(req.params._id)
			.populate({
				path: 'buyer.agent',
				select: 'firstname lastname agent.phonePro email',
			})
			.populate({
				path: 'agent.customers',
				select: 'firstname lastname phone email',
			})
		if (user) {
			res.status(200).json({
				message: 'Utilissateur récupéré !',
				data: user,
			})
		} else {
			res.status(204).json({
				message: 'Aucun utilisateur',
			})
		}
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {get} /api/user/agents 5.1 - Récupérer tous les agents
 * @apiName getAgents
 * @apiGroup Utilisateur
 *
 * @apiHeader {String} Authorization Token d'Authentification
 *
 * @apiSuccess {User} datas Objet Agents.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'Tous les agents : récupérés !',
		"datas": {...},
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
const getAgents = async (req, res) => {
	try {
		let agents = await User.find({ agent: { $exists: true } })
		// let agents = await User.find({ agent: { $exists: true }, 'agent.phonePro': {$exists:true} }).populate('agent.customers')
		res.status(200).json({
			status_code: 200,
			datas: agents,
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {get} /api/user/sellers  5.2 - Récupérer tous les vendeurs
 * @apiName getSellers
 * @apiGroup Utilisateur
 *
 * @apiHeader {String} Authorization Token d'Authentification
 *
 * @apiSuccess {User} user Objet Sellers.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'Tous les vendeurs : récupérés !',
		"data": {...},
 *     }
 *
 * @apiError UserNotFound Aucun utilisateur.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Aucun vendeur trouvé !"
 *     }
 */
const getSellers = async (req, res) => {
	try {
		const user = await User.find({
			status: true,
			seller: { $exists: true },
		})
		if (user) {
			res.status(200).json(user)
		} else {
			res.status(204).json({ message: 'Aucun utilisateur' })
		}
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

/**
 * @api {post} /api/user/agentAvailabilities 6 - Vérifier les disponibilités d'un agent
 * @apiName checkAgentAvailabilities
 * @apiGroup Utilisateur
 *
 * @apiHeader {String} Authorization Token d'Authentification
 *
 * @apiBody {Date} date Date de test des disponibilités
 * @apiBody {ObjectId} id_agent Id de l'agent
 *
 * @apiSuccess {Array} Availabilities Tableau des créneaux disponibles.
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
const checkAgentAvailabilities = async (req, res) => {
	let datas = req.body

	// let availableArray = [
	// 	'9h-9h30',
	// 	'9h30-10h',
	// 	'10h-10h30',
	// 	'10h30-11h',
	// 	'11h-11h30',
	// 	'11h30-12h',
	// 	'12h-12h30',
	// 	'12h30-13h',
	// 	'13h-13h30',
	// 	'13h30-14h',
	// 	'14h-14h30',
	// 	'14h30-15h',
	// 	'15h-15h30',
	// 	'15h30-16h',
	// 	'16h-16h30',
	// 	'16h30-17h',
	// 	'17h-17h30',
	// 	'17h30-18h',
	// 	'18h-18h30',
	// 	'18h30-19h',
	// ]

	let availableArray = [
		'09h00-9h30',
		'09h30-10h00',
		'10h00-10h30',
		'10h30-11h00',
		'11h00-11h30',
		'11h30-12h00',
		'12h00-12h30',
		'12h30-13h00',
		'13h00-13h30',
		'13h30-14h00',
		'14h00-14h30',
		'14h30-15h00',
		'15h00-15h30',
		'15h30-16h00',
		'16h00-16h30',
		'16h30-17h00',
		'17h00-17h30',
		'17h30-18h00',
		'18h00-18h30',
		'18h30-19h00',
	]

	try {
		// let begin = new Date(datas.date)
		// let end = new Date(datas.date)
		// begin.setUTCHours(8)
		// end.setUTCHours(19)

		// let appointments = await Appointment.find({
		// 	id_agent: datas.id_agent,
		// }).sort({ dateBegin: 'asc' })

		// let index = 0
		// appointments.forEach((appoint) => {
		// 	if (appoint.dateBegin >= begin && appoint.dateEnd <= end) {
		// 		let hourBegin = appoint.dateBegin.getUTCHours()
		// 		let hourEnd = appoint.dateEnd.getUTCHours()
		// 		while (hourBegin < hourEnd) {
		// 			let slot = hourBegin + 0.5
		// 			if (hourBegin % 1 === 0) {
		// 				slot -= 0.5
		// 				let result = hourBegin + 'h-' + slot + 'h30'
		// 				index = availableArray.indexOf(result)
		// 			} else {
		// 				index = availableArray.indexOf(
		// 					hourBegin - 0.5 + 'h30-' + slot + 'h'
		// 				)
		// 			}
		// 			availableArray.splice(index, 1)
		// 			hourBegin += 0.5
		// 		}
		// 	}
		// })

		// ? TEST 1:
		let { date, id_agent } = datas

		let startDate = new Date(date + ' 00:00:00'),
			endDate = new Date(date + ' 23:59:59')
		startDate = moment(startDate)
		endDate = moment(endDate)

		let appointments = await Appointment.find({
			id_agent,
			dateBegin: { $gte: startDate, $lte: endDate },
		}).sort({ dateBegin: 'asc' })

		let filteredAvailableArray = []

		for (let i = 0; i < availableArray.length; i++) {
			let hourBeginInArray = availableArray[i]
				.split('-')[0]
				.replace('h', ':')

			let availableHour = true

			appointments.forEach((appointment) => {
				if (
					moment(appointment.dateBegin)
						.format()
						.substring(11, 16)
						.includes(hourBeginInArray)
				) {
					availableHour = false
				}
			})
			if (availableHour) {
				filteredAvailableArray.push(availableArray[i].substring(0, 5))
			}
		}

		// ? TEST 2:
		// let datas = req.body

		// 	let begin = new Date(datas.date)
		// 	let end = new Date(datas.date)
		// 	begin.setUTCHours(8)
		// 	end.setUTCHours(19)

		// 	let appointments = await Appointment.find({
		// 		id_agent: datas.id_agent,
		// 	}).sort({ dateBegin: 'asc' })

		// 	let availableArray = [
		// 		'9h-9h30',
		// 		'9h30-10h',
		// 		'10h-10h30',
		// 		'10h30-11h',
		// 		'11h-11h30',
		// 		'11h30-12h',
		// 		'12h-12h30',
		// 		'12h30-13h',
		// 		'13h-13h30',
		// 		'13h30-14h',
		// 		'14h-14h30',
		// 		'14h30-15h',
		// 		'15h-15h30',
		// 		'15h30-16h',
		// 		'16h-16h30',
		// 		'16h30-17h',
		// 		'17h-17h30',
		// 		'17h30-18h',
		// 		'18h-18h30',
		// 		'18h30-19h',
		// 	]
		// 	let index = 0
		// 	console.log('START')
		// 	appointments = JSON.parse(JSON.stringify(appointments))
		// 	appointments.forEach((appoint) => {
		// 		appoint.dateBegin = moment(appoint.dateBegin).format(
		// 			'YYYY-MM-DD hh:mm:ss'
		// 		)
		// 		appoint.dateEnd = moment(appoint.dateEnd).format()
		// 		console.log(appoint.dateBegin)
		// 		console.log('dateBeginTS', moment(appoint.dateBegin))
		// 		console.log('beginTS', moment(begin))
		// 		// appoint.dateBegin = new Date(moment(appoint.dateBegin).format())
		// 		// appoint.dateEnd = new Date(moment(appoint.dateEnd).format())
		// 		// appoint.dateBegin = moment(appoint.dateBegin)
		// 		// 	.format()
		// 		// 	.substring(0, 19)
		// 		// appoint.dateEnd = new Date(
		// 		// 	moment(appoint.dateEnd).format().substring(0, 19)
		// 		// )

		// 		console.log(appoint.dateBegin, begin, ' / ', appoint.dateEnd, end)
		// 		console.log(appoint.dateBegin >= begin, appoint.dateEnd <= end)
		// 		if (appoint.dateBegin >= begin && appoint.dateEnd <= end) {
		// 			let hourBegin = appoint.dateBegin.getUTCHours()
		// 			let minuteBegin = moment(appoint.dateBegin).minutes()
		// 			let hourEnd = appoint.dateEnd.getUTCHours()
		// 			let minuteEnd = moment(appoint.dateEnd).minutes()

		// 			if (minuteBegin == 30) {
		// 				hourBegin += 0.5
		// 			}
		// 			if (minuteEnd == 30) {
		// 				hourEnd += 0.5
		// 			}

		// 			while (hourBegin < hourEnd) {
		// 				let slot = hourBegin + 0.5
		// 				if (hourBegin % 1 === 0) {
		// 					slot -= 0.5
		// 					let result = hourBegin + 'h-' + slot + 'h30'
		// 					index = availableArray.indexOf(result)
		// 				} else {
		// 					index = availableArray.indexOf(
		// 						hourBegin - 0.5 + 'h30-' + slot + 'h'
		// 					)
		// 				}
		// 				availableArray.splice(index, 1)
		// 				hourBegin += 0.5
		// 			}
		// 		}
		// 	})

		res.status(200).json({
			status_code: 200,
			Availabilities: filteredAvailableArray,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {post} /api/user 6.1 - Demander un rendez-vous
 * @apiName askForAppointment
 * @apiGroup Utilisateur
 *
 * @apiBody {String} ref Référence de l'utilisateur
 * @apiBody {String} firstname Prénom de l'utilisateur
 * @apiBody {String} lastname Nom de l'utilisateur
 * @apiBody {String} email Email de l'utilisateur
 * @apiBody {String} reason Raison de la demande de rendez-vous
 * @apiBody {String} infos Infos sur le rendez-vous
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		 "status_code": 200,
 *       "message": 'Envoi réussi  !',
 *     }
 *
 * @apiError ServerError Erreur serveur.
 */
const askForAppointment = async (req, res) => {
	try {
		const details = {
			ref: req.body.ref,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			reason: req.body.reason,
			infos: req.body.infos,
		}

		await sendMail('emailAppointment', {
			to: process.env.mailAmaizon,
			details,
		})
		res.status(200).json({
			status_code: 200,
			message: 'Envoi réussi.',
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

/**
 * @api {get} /api/user/wishlist/:_id 7 - Ajouter un favori
 * @apiName addToWishlist
 * @apiGroup Utilisateur
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id id de la propriété à ajouter
 *
 * @apiSuccess {String} message Favori ajouté !
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Favori ajouté !',
 *     }
 *
 * @apiError ServerError Utilisateur non modifié.
 */
const addToWishlist = async (req, res) => {
	try {
		let exist = false
		let user = await User.findById(req.auth.user._id)
		if (user.buyer.wishlist) {
			user.buyer.wishlist.forEach((element) => {
				if (element.toString() == req.params._id) {
					return (exist = true)
				}
			})
		}
		if (!exist) {
			await User.updateOne(
				{ _id: user._id },
				{ $push: { 'buyer.wishlist': req.params._id } }
			)
		}
		res.status(200).json({
			status_code: 200,
			message: 'Favori ajouté !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {DELETE} /api/user/wishlist/:_id 7.1 - Supprimer un favori
 * @apiName removeOfWishlist
 * @apiGroup Utilisateur
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id id de la propriété à supprimer
 *
 * @apiSuccess {String} message Favori supprimé !
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Favori supprimé !',
 *     }
 *
 * @apiError ServerError Utilisateur non modifié.
 */
const removeOfWishlist = async (req, res) => {
	try {
		let user = await User.findById(req.auth.user._id)

		await User.updateOne(
			{ _id: user._id },
			{
				$pull: {
					'buyer.wishlist': req.params._id,
				},
			}
		)
		res.status(200).json({
			status_code: 200,
			message: 'Favori supprimé !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {post} /api/user 8 - Contacter l'agence
 * @apiName askForAppointment
 * @apiGroup Utilisateur
 *
 * @apiBody {String} firstname Prénom de l'utilisateur
 * @apiBody {String} lastname Nom de l'utilisateur
 * @apiBody {String} email Email de l'utilisateur
 * @apiBody {String} subject Raison de la demande de rendez-vous
 * @apiBody {String} message Infos sur le rendez-vous
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		 "status_code": 200,
 *       "message": 'Message envoyé !',
 *     }
 *
 * @apiError ServerError Erreur serveur.
 */
const sendMessage = (req, res) => {
	try {
		sendMail('sendMessage', req.body)
		res.status(200).json({ status_code: 200, message: 'Message envoyé.' })
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {post} /api/forgot 9 - Envoyer email de réinitialisation
 * @apiName forgotPass
 * @apiGroup Utilisateur
 *
 * @apiParam {ObjectId} _id
 *
 * @apiSuccess {String} message Token créé.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Token créé !',
 *     }
 *
 * @apiError ServerError Token non créé.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Token non créé !"
 *     }
 */
const forgotPass = async (req, res) => {
	let datas = Object.keys(req.body).length === 0 ? req.query : req.body

	try {
		let user = await User.findOne({ email: datas.email })

		if (!user) {
			return res.status(404).json({
				status_code: 404,
				message: 'Adresse email introuvable.',
			})
		}

		if (user.deletedAt !== undefined) {
			return res.status(403).json({
				status_code: 403,
				message: 'Compte utilisateur désactivé !',
			})
		}

		let token = jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN, {
			expiresIn: '5h',
		})

		await User.updateOne({ _id: user._id }, { token })

		await sendMail('forgotPass', {
			to: datas.email,
			userId: user._id,
			token,
		})

		res.status(200).json({
			status_code: 200,
			message: 'Email de réinitialisation envoyé.',
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {get} /api/user 9.1 - Réinitialiser le mot de passe
 * @apiName resetPassword
 * @apiGroup Utilisateur
 *
 * @apiBody {String} id Id de l'utilisateur
 * @apiBody {String} password Mot de passe de l'utilisateur
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		 "status_code": 201,
 *       "message": 'Mot de passe réinitialisé !',
 *     }
 *
 * @apiError ServerError Erreur serveur.
 */
const resetPassword = async (req, res) => {
	try {
		const { id, password } = req.body
		bcrypt.hash(password, 10, async function (err, hash) {
			await User.updateOne({ _id: id }, { password: hash })
			res.status(201).json({
				status_code: 201,
				message: 'Mot de passe réinitialisé !',
			})
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, message: error.message })
	}
}

/**
 * * PARTIE AGENT
 */

/**
 * @api {post} /api/user/loginAgent 1 - Authentification agent
 * @apiName Agent Login
 * @apiGroup Agent
 *
 * @apiBody {String} email
 * @apiBody {String} password
 *
 * @apiSuccess 200 Utilisateur connecté
 *
 * @apiError 401 Mot de passe incorrect
 * @apiError 401 mauvais rôle
 * @apiError 401 Utilisateur non trouvé !
 * @apiError 403 Compte désactivé
 *
 */
const agentLogin = async (req, res) => {
	let datas = Object.keys(req.body).length === 0 ? req.query : req.body
	try {
		datas.email = datas.email.toLowerCase()
		const user = await User.findOne({ email: datas.email }).populate({
			path: 'agent.customers',
			select: 'firstname lastname phone email',
		})

		if (!user) {
			return res.status(401).json({
				status_code: 401,
				error: 'Utilisateur non trouvé !',
			})
		}
		if (user.roles !== 'agent') {
			return res.status(401).json({
				status_code: 401,
				error: 'Mauvais rôle !',
			})
		}
		if (user.status == false && user.deletedAt != undefined) {
			return res.status(403).json({
				status_code: 403,
				error: 'Compte utilisateur désactivé.',
			})
		}
		let valid = await bcrypt.compare(datas.password, user.password)
		if (!valid) {
			return res.status(401).json({
				status_code: 401,
				error: 'Mot de passe incorrect !',
			})
		}
		const token = jwt.sign({ user }, process.env.SECRET_TOKEN, {
			expiresIn: '5h',
		})
		// Insertion ou non du RefreshToken:
		if (datas.rememberMe) {
			const refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN, {
				expiresIn: '1y',
			})
			if (user.status == false && user.deletedAt == undefined) {
				sendVerificationMail(user._id, user.email)
				return res.status(200).json({
					status_code: 200,
					message: 'Vous devez vérifier votre email.',
					token,
					refreshToken,
				})
			}
			res.status(200).json({
				status_code: 200,
				userId: user._id,
				token,
				refreshToken,
				message: 'Utilisateur connecté !',
				data: user,
			})
		} else {
			if (user.status == false && user.deletedAt == undefined) {
				sendVerificationMail(user._id, user.email)
				return res.status(200).json({
					status_code: 200,
					message: 'Vous devez vérifier votre email.',
					token,
				})
			}
			res.status(200).json({
				status_code: 200,
				userId: user._id,
				token,
				message: 'Utilisateur connecté !',
				data: user,
			})
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {post} /api/user 2 - Création utilisateur
 * @apiName create
 * @apiGroup Agent
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiBody {String} firstname Prénom de l'utilisateur
 * @apiBody {String} lastname Nom de l'utilisateur
 * @apiBody {String} email Email de l'utilisateur
 * @apiBody {String} password Mot de passe de l'utilisateur
 * @apiBody {String} [phone] Numéro de téléphone de l'utilisateur
 * @apiBody {Boolean} newsletter="false" Accord des newsletters de l'utilisateur
 * @apiBody {Boolean} status="true" Status actif ou non
 * @apiBody {String} [ref] Référence client
 * @apiBody {Object} [buyer] Informations de l'acheteur ({Object} wishlist, {Number} budgetMin, {Number} budgetMax, {String} city, {Number} surfaceMin, {Number} surfaceMax, {String} type)
 * @apiBody {Object} [seller] Informations du vendeur ({Object} propertiesList)
 * @apiBody {Object} [agent] Informations de l'agent ({String} phonePro)
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": 'Utilisateur enregistré !',
 *     }
 *
 * @apiError ServerError Erreur serveur.
 * @apiError UserAlreadyExists Un compte avec cette adresse email existe déjà !
 *
 * @apiErrorExample ServerError:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Utilisateur non créé !"
 *     }
 * @apiErrorExample UserAlreadyExists:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "Un compte avec cette adresse email existe déjà !"
 *     }
 */
const create = async (req, res) => {
	const saltRounds = 10
	let datas = req.body
	try {
		const user = new User({ ...datas })
		const mailCheck = await User.findOne({ email: user.email })
		if (mailCheck) {
			return res.status(403).json({
				status_code: 403,
				error: 'Un compte avec cette adresse email existe déjà !',
			})
		}
		if (req.auth.user.roles == 'agent' && user.roles == 'user') {
			await User.updateOne(
				{ _id: req.auth.user._id },
				{ $push: { 'agent.customers': user._id } }
			)
			user.buyer.agent = req.auth.user._id
		}

		//On compte le nombre d'utilisateur dans la base
		User.countDocuments({}, function (err, c) {
			let prefix
			//Genération du préfixe pour la référence utilisateur
			if (user.roles === 'user') {
				prefix = 'CL'
			} else {
				prefix = 'AG'
			}

			//On ajoute notre utilisateur sur le count
			c++

			//Génération du nombre de 0
			let number = c.toString()
			while (number.length <= 8) {
				number = '0' + number
			}

			//Création de la ref
			let ref = prefix + number

			//Assignation de la référence
			user.ref = ref
		})
		bcrypt.hash(user.password, saltRounds, async function (err, hash) {
			user.password = hash
			await user.save()
			res.status(201).json({
				status_code: 201,
				message: 'Utilisateur créé !',
				user: user,
			})
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {put} /api/user/createSeller/:userId/:propertyId 3 - Ajouter un vendeur sur une propriété
 * @apiName createSeller
 * @apiGroup Agent
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiParam {ObjectId} userId id du vendeur à ajouter
 * @apiParam {ObjectId} propertyId id de la propriété ciblé
 *
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": 'Valeurs Sellers crée au sein du client !',
 *     }
 *
 * @apiError ServerError Erreur serveur.
 * @apiError UserNotFound Utilisateur introuvable
 *
 * @apiErrorExample ServerError
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Utilisateur non créé !"
 *     }
 * @apiErrorExample UserNotFound
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Utilisateur introuvable.."
 *     }
 */
const createSeller = async (req, res) => {
	try {
		let user = await User.findOne({ _id: req.params.userId })
		let property = await Property.findOne({ _id: req.params.propertyId })

		let seller = {}
		if (user) {
			let userKeys = Object.keys(JSON.parse(JSON.stringify(user)))
			if (userKeys.includes('seller')) {
				let propertiesList = user.seller.propertiesList
				propertiesList.push(property)
				seller = { propertiesList }
			} else {
				seller = { propertiesList: [property] }
			}
		} else {
			return res.status(404).json({
				status_code: 404,
				message: 'Utilisateur introuvable..',
			})
		}

		await User.updateOne(
			{ _id: req.params.userId },
			{ roles: 'seller', seller }
		)

		res.status(200).json({
			status_code: 200,
			message: 'Valeurs Sellers crée au sein du client !',
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ status_code: 500, message: error.message })
	}
}

/**
 * @api {get} /api/user/ 4 - Récupérer tous les utilisateurs
 * @apiName getAll
 * @apiGroup Agent
 *
 * @apiSuccess {User} user Objet Utilisateur.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'Utilisateur récupéré !',
		"data": user,
 *     }
 *
 * @apiError UserNotFound Aucun utilisateur.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample UserNotFound:
 *     HTTP/1.1 204 No Content
 *     {
 *       "error": "Aucun utilisateur trouvé !"
 *     }
 *
 * @apiErrorExample ServerError:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Erreur serveur !"
 *     }
 */
const getAll = async (req, res) => {
	try {
		const users = await User.find({ status: true }).populate({
			path: 'buyer.agent',
			select: 'firstname lastname agent.phonePro email',
		})
		if (users) {
			res.status(200).json({
				status_code: 200,
				datas: users,
			})
		} else {
			res.status(204).json({
				status_code: 204,
				message: 'Aucun utilisateur',
			})
		}
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {get} /api/user/buyers 4.1 - Récupérer tous les clients
 * @apiName getCustomers
 * @apiGroup Agent
 *
 * @apiHeader {String} Authorization Token d'Authentification
 *
 * @apiSuccess {User} user Objet User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'Tous les clients récupérés !',
		"datas": {...},
 *     }
 *
 * @apiError UserNotFound Aucun utilisateur.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Aucun acheteur trouvé !"
 *     }
 */
const getCustomers = async (req, res) => {
	try {
		const user = await User.find({ status: true, roles: 'user' })
		if (user) {
			res.status(200).json({ status_code: 200, user })
		} else {
			res.status(204)
		}
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {get} /api/user/searchClient/:lastname 5 - Rechercher un utilisateur
 * @apiName searchClient
 * @apiGroup Agent
 *
 * @apiParam {ObjectId} lastname nom de famille de l'utilisateur.
 *
 * @apiSuccess {User} user Objet Utilisateur.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		"status_code": 200,
 *      "message": 'Liste des clients filtrés récupérée !',
 *		"datas": users,
 *     }
 *
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample ServerError:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Erreur Serveur."
 *     }
 */
const searchClient = async (req, res) => {
	try {
		let users = await User.find({
			lastname: { $regex: req.params.lastname + '.*' },
		})

		res.status(200).json({
			status_code: 200,
			message: 'Liste des clients filtrés récupérée !',
			datas: users,
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, message: error.message })
	}
}

/**
 * @api {get} /api/user/property/:_id 6 - Ajouter une proprieté dans la liste d'un vendeur
 * @apiName addToPropertyList
 * @apiGroup Agent
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id id de la propriété à ajouter
 *
 * @apiSuccess {String} message Favori ajouté !
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Favori ajouté !',
 *     }
 *
 * @apiError ServerError Utilisateur non modifié.
 */
const addToPropertyList = async (req, res) => {
	try {
		let user = await User.findById(req.auth.user._id)
		await User.updateOne(
			{ _id: user._id },
			{ $push: { 'seller.propertiesList': req.params._id } }
		)
		res.status(200).json({
			status_code: 200,
			message: 'Propriété ajouté à la liste !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {get} /api/user/property/:_id 6.1 - Supprimer une proprieté dans la liste d'un vendeur
 * @apiName removeOfPropertyList
 * @apiGroup Agent
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id id de la propriété à supprimer
 *
 * @apiSuccess {String} message Favori supprimé !
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Favori supprimé !',
 *     }
 *
 * @apiError ServerError Utilisateur non modifié.
 */
const removeOfPropertyList = async (req, res) => {
	try {
		let user = await User.findById(req.auth.user._id)

		await User.updateOne(
			{ _id: user._id },
			{
				$pull: {
					'seller.propertiesList': req.params._id,
				},
			}
		)
		res.status(200).json({
			status_code: 200,
			message: 'Propriété supprimé de la liste !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {get} /api/user/getSellerForOneProperty/:propertyId/ 7 - Récupération du vendeur d'une propriété
 * @apiName getSellerForOneProperty
 * @apiGroup Agent
 *
 * @apiParam {String} _id id de la propriété.
 *
 * @apiSuccess {User} user Objet Utilisateur.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *			status_code: 200,
 *			message: 'Vendeur trouvé !',
 *			datas: user,
 *		}
 *
 * @apiError ServerError.
 */
const getSellerForOneProperty = async (req, res) => {
	try {
		let sellers = await User.find({ seller: { $exists: true } })
		let gotResult = false
		sellers.forEach((seller) => {
			if (
				seller.seller.propertiesList &&
				seller.seller.propertiesList.includes(req.params.propertyId)
			) {
				gotResult = true
				return res.status(200).json({
					status_code: 200,
					message: 'Vendeur trouvé !',
					datas: seller,
				})
			}
		})
		if (gotResult == false) {
			res.status(204).json()
		}
	} catch (error) {
		res.status(500).json({ status_code: 500, message: error.message })
	}
}

// TODO: COMMENTAIRE DE DOC A FAIRE UNE FOIS FINIS
const anonymize = async (req, res) => {
	try {
		// Récupération de l'id et de la ref à anonymiser:
		const userToAnonymize = await User.findOne({ _id: req.params._id })
		const idToAnonymize = userToAnonymize._id
		const refToAnonymize = userToAnonymize.ref

		// Récupération de l'id et de la ref Anonymous:
		const anonymous = await User.findOne({
			lastname: 'Anonymous',
			firstname: 'Anonymous',
		})
		const idAnonymous = anonymous._id
		const refAnonymous = anonymous.ref

		// Update dans les collections Appointment:
		await Appointment.updateMany(
			{ id_buyer: idToAnonymize },
			{ id_buyer: idAnonymous }
		)
		await Appointment.updateMany(
			{ id_agent: idToAnonymize },
			{ id_agent: idAnonymous }
		)

		// Update dans les collections Inventory:
		await Inventory.updateMany(
			{ id_agent: idToAnonymize },
			{ id_agent: idAnonymous }
		)
		await Inventory.updateMany(
			{ userReference: refToAnonymize },
			{ userReference: refAnonymous }
		)
		await Inventory.updateMany(
			{ previousBuyerRef: refToAnonymize },
			{ previousBuyerRef: refAnonymous }
		)

		// Update dans les collections Property:
		await Property.updateMany(
			{ 'buyers._id': idToAnonymize },
			{ $set: { 'buyers.$._id': idAnonymous } }
		)
		await Property.updateMany(
			{ 'wishers._id': idToAnonymize },
			{ $set: { 'wishers.$._id': idAnonymous } }
		)

		// Update dans les collections Rental:
		await Rental.updateMany(
			{ 'id_buyers._id': idToAnonymize },
			{ $set: { 'id_buyers.$._id': idAnonymous } }
		)

		// Update dans les collections Transaction:
		await Transaction.updateMany(
			{ id_agent: refToAnonymize },
			{ id_agent: refAnonymous }
		)
		await Transaction.updateMany(
			{ 'lst_buyer._id': idToAnonymize },
			{ $set: { lst_buyer: idAnonymous } }
		)
		await Transaction.updateMany(
			{ 'lst_seller._id': idToAnonymize },
			{ $set: { lst_seller: idAnonymous } }
		)

		// let transactions = await Transaction.find({
		// 	'lst_seller._id': idToAnonymize,
		// })
		let transactions = await Transaction.find()
		// console.log(transactions)
		transactions.forEach(async (transaction) => {
			var lst_seller = transaction.lst_seller
			lst_seller.forEach((seller) => {
				if (seller.valueOf() == idToAnonymize) {
					// console.log(1)
					seller = ObjectId(idAnonymous)
				}
			})
			await Transaction.updateOne(
				{ _id: transaction._id },
				{ lst_seller }
			)
		})

		// transaction.lst_seller.forEach((seller) => {
		// 	if (seller.valueOf() == idToAnonymize)
		// 		Transaction.updateOne({_id: seller._id}, {$addToSet: {}})
		// })
		// })

		// Transaction.find({ 'lst_seller._id': idToAnonymize }).exec(
		// 	(err, result) => {
		// 		if (err) throw err
		// 		if (result) {
		// 			result.forEach((resul) => {
		// 				resul.lst_seller.idToAnonymize = idAnonymous
		// 				result.save()
		// 			})

		// 			console.log('new value')
		// 		} else {
		// 			console.log('not found')
		// 		}
		// 	}
		// )

		// Suppression du compte utilisateur:

		// Réponse:
		res.status(200).json({
			status_code: 200,
			message: 'Anonymisation réussie.',
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

/**
 * * PARTIE TOKEN
 */

/**
 * @api {post} /api/user/checkBearer 1 - Checker le token Bearer
 * @apiName checkBearer
 * @apiGroup Token
 *
 *
 * @apiSuccess 200 Token Valide
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		 "status_code": 200,
 *       "message": 'Token Valide',
 * 		 "userInfos": {userInfos}
 *     }
 *
 * @apiError 401 Token Expiré
 * @apiError 401 Token Invalide
 *
 * @apiErrorExample Token Expiré:
 *     HTTP/1.1 401 Unauthorized
 *     {
 * 		"status_code": 401,
 * 		"message": "Token Expiré.",
 *     }
 *
 * @apiErrorExample Token Invalide:
 *     HTTP/1.1 401 Unauthorized
 *     {
 * 		"status_code": 401,
 * 		"message": "Token Invalide.",
 *     }
 */
const checkBearer = async (req, res) => {
	const token = req.headers.authorization.split(' ')[1]
	let decodedToken
	try {
		decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)
		const user = await User.findById(decodedToken.user._id)
			.populate({
				path: 'buyer.agent',
				select: 'firstname lastname agent.phonePro email',
			})
			.populate('buyer.wishlist')
		res.status(200).json({
			status_code: 200,
			message: 'Token Valide',
			userInfos: user,
		})
	} catch (error) {
		if (error.TokenExpiredError) {
			res.status(401).json({
				status_code: 401,
				message: 'Token Expiré',
			})
		} else {
			res.status(401).json({
				status_code: 401,
				message: 'Token Invalide',
			})
		}
	}
}

// ? Quelle méthode reset token est utilisé ?
/**
 * @api {get} /api/user/checkResetToken/:token 2 - Vérifier le reset token
 * @apiName checkResetToken
 * @apiGroup Token
 *
 * @apiParam {String} token de l'utilisateur.
 *
 * @apiSuccess {User} user Objet Utilisateur.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'Token OK !',
		"data": user,
 *     }
 *
 * @apiError UserNotFound Aucun utilisateur.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Aucun utilisateur !"
 *     }
 */
const checkResetToken = async (req, res) => {
	try {
		const decodedToken = jwt.verify(
			req.params.token,
			process.env.REFRESH_TOKEN
		)

		const user = await User.findOne({ _id: decodedToken.user._id })
		if (user) {
			const newToken = jwt.sign({ user }, process.env.SECRET_TOKEN, {
				expiresIn: '5h',
			})

			res.status(200).json({
				status_code: 200,
				message: 'Nouveau token généré !',
				token: newToken,
				userInfos: decodedToken,
			})
		} else {
			res.status(204).json({
				status_code: 204,
				message: 'Aucun utilisateur',
			})
		}
	} catch (error) {
		if (error.TokenExpiredError) {
			res.status(401).json({
				status_code: 401,
				message: 'Token Expiré',
			})
		} else {
			res.status(500).json({
				status_code: 500,
				message: 'Erreur survenue',
			})
		}
	}
}
/**
 * @api {get} /api/user 3 - Checker le ResetPassword token
 * @apiName checkTokenResetPassword
 * @apiGroup Token
 *
 * @apiBody {String} id Id de l'utilisateur
 * @apiBody {String} token Token de l'utilisateur enregistré en BDD
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		 "status_code": 200,
 *       "message": 'Vérification OK !',
 *     }
 *
 * @apiError InvalidCredentialsError Id ou Token invalide.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Not Found
 *     {
 *       "error": "Id ou token invalide."
 *     }
 */
const checkTokenResetPassword = async (req, res) => {
	const { id, token } = req.body

	let user = await User.findOne({ _id: id })

	if (user && user.token == token) {
		res.status(200).json({ status_code: 200, message: 'Vérification OK !' })
	} else {
		res.status(403).json({
			status_code: 403,
			message: 'Id ou token invalide.',
		})
	}
}

/**
 * @api {get} /api/user/emailVerification/:token 4 - Vérifier le compte utilisateur
 * @apiName verifyEmail
 * @apiGroup Token
 *
 * @apiParam {String} token de l'utilisateur.
 *
 * @apiSuccess {User} user Objet Utilisateur.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      message: 'Vérification réussie.',
 * 		status_code: 200,
 *     }
 *
 * @apiError UserNotFound Aucun utilisateur.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 204 Empty Content
 *     {
 *       "error": "Aucun utilisateur !"
 *     }
 */
const verifyEmail = async (req, res) => {
	try {
		const decodedToken = jwt.verify(
			req.params.token,
			process.env.SECRET_TOKEN
		)
		const userId = decodedToken.userId.valueOf()

		const user = await User.findOne({ _id: userId })
		if (user) {
			await User.updateOne({ _id: userId }, { status: 1 })
			res.status(200).json({
				status_code: 200,
				message: 'Vérification réussie.',
			})
		} else {
			res.status(204).json({
				status_code: 204,
				message: 'Aucun utilisateur',
			})
		}
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * * PARTIE NEWSLETTERS
 */
/**
 * @api {get} /api/user/setNewsletter/:_id 1 - Activer les newsletters
 * @apiName setNewsletter
 * @apiGroup Newsletters
 *
 * @apiParam {String} _id id de l'utilisateur.
 *
 * @apiSuccess {User} user Objet Utilisateur.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *			status_code: 200,
 *			message: 'Utilisateur inscrit à la newsletter !',
 *		}
 *
 *  @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		    status_code: 200,
 *		    message: 'Vous êtes déjà inscrit à la newsletter.',
 *		}
 * @apiError ServerError.
 *
 * @apiErrorExample Error-Response:
 *     	HTTP/1.1 500 Server Error
 *     	{
 *			status_code: 500,
 *			error: error.message,
 *		}
 */
const setNewsletter = async (req, res) => {
	try {
		const user = await User.findById(req.params._id)
		if (user.newsletter)
			return res.status(200).json({
				status_code: 200,
				message: 'Vous êtes déjà inscrit à la newsletter.',
			})
		await User.updateOne({ _id: req.params._id }, { newsletter: true })
		res.status(200).json({
			status_code: 200,
			message: 'Vous êtes inscrit à la newsletter !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {get} /api/user/unsetNewsletter/:_id 2 - Désactiver les newsletters
 * @apiName unsetNewsletter
 * @apiGroup Newsletters
 *
 * @apiParam {String} _id id de l'utilisateur.
 *
 * @apiSuccess {String} message Utilisateur désinscrit à la newsletter !.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *			status_code: 200,
 *			message: 'Utilisateur désinscrit à la newsletter !',
 *		}
 *
 *  @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		    status_code: 200,
 *		    message: "Vous n'êtes pas inscrit à la newsletter.",
 *		}
 * @apiError ServerError.
 *
 * @apiErrorExample Error-Response:
 *     	HTTP/1.1 500 Server Error
 *     	{
 *			status_code: 500,
 *			error: error.message,
 *		}
 */
const unsetNewsletter = async (req, res) => {
	try {
		const user = await User.findById(req.params._id)
		if (!user.newsletter)
			return res.status(200).json({
				status_code: 200,
				message: "Vous n'êtes pas inscrit à la newsletter.",
			})
		await User.updateOne({ _id: req.params._id }, { newsletter: false })
		res.status(200).json({
			status_code: 200,
			message: 'Vous êtes désinscrit de la newsletter !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {get} /api/user/setNewsletterForUnknown/ 3 - Activer les newsletters pour un non-enregistré
 * @apiName setNewsletterForUnknown
 * @apiGroup Newsletters
 *
 * @apiParam {String} _id id de l'utilisateur.
 *
 * @apiSuccess {User} user Objet Utilisateur.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *			status_code: 200,
 *			message: 'Vous êtes inscrit à la newsletter !',
 *		}
 *
 * @apiError ServerError.
 */
const setNewsletterForUnknown = async (req, res) => {
	try {
		let user = new User({ email: req.body.email, newsletter: true })
		await user.save()
		res.status(200).json({
			status_code: 200,
			message: 'Vous êtes inscrit à la newsletter !',
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, message: error.message })
	}
}

/**
 * * PARTIE METHODE DIVERSE
 * * Méthode intervenants dans d'autres méthodes
 */
const sendVerificationMail = async (id, email) => {
	let token = jwt.sign({ userId: id }, process.env.SECRET_TOKEN, {
		expiresIn: '5h',
	})

	await User.updateOne({ _id: id }, { token })
	return sendMail('emailVerification', { to: email, token })
}

export {
	getOne,
	getAll,
	create,
	update,
	deleteOne,
	login,
	agentLogin,
	signup,
	checkBearer,
	verifyEmail,
	forgotPass,
	checkResetToken,
	setNewsletter,
	unsetNewsletter,
	setNewsletterForUnknown,
	getAgents,
	checkAgentAvailabilities,
	getCustomers,
	addToWishlist,
	removeOfWishlist,
	getSellers,
	addToPropertyList,
	removeOfPropertyList,
	anonymize,
	askForAppointment,
	sendMessage,
	checkTokenResetPassword,
	resetPassword,
	searchClient,
	createSeller,
	getSellerForOneProperty,
}
