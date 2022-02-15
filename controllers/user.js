import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

//CREATE USER
/**
 * @api {post} /api/user Créer un utilisateur
 * @apiName create
 * @apiGroup Utilisateur
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
 * @apiBody {Object} [agent] Informations de l'agent ({String} pro_phone_tel)
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
	const user = new User({
		...datas,
	})
	const mailCheck = await User.findOne({ email: user.email })
	if (mailCheck) {
		return res.status(403).json({
			error: 'Un compte avec cette adresse email existe déjà !',
		})
	}
	bcrypt.hash(user.password, saltRounds, function (err, hash) {
		user.password = hash
		user.save()
			.then(() =>
				res.status(201).json({
					message: 'Utilisateur enregistré !',
				})
			)
			.catch((error) => {
				res.status(500).json({
					error: 'Utilisateur non créé !',
				})
			})
	})
}

//UPDATE USER
/**
 * @api {put} /api/user/:_id Mettre à jour un utilisateur
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
 * @apiError ServerError Utilisateur non modifié.
 *
 * @apiErrorExample ServerError:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Utilisateur non modifié !"
 *     }
 */
const update = async (req, res) => {
	let datas = req.body

	try {
		await User.findOneAndUpdate(
			{
				_id: req.params._id,
			},
			{
				...datas,
			},
			{ returnDocument: 'after' }
		)
		let buyer = await User.find({ buyer: null })
		buyer.forEach(async (element) => {
			await User.updateOne(
				{ _id: element._id },
				{ $unset: { buyer: '' } },
				{ new: true }
			)
		})

		let seller = await User.find({ seller: null })
		seller.forEach(async (element) => {
			await User.updateOne(
				{ _id: element._id },
				{ $unset: { seller: '' } },
				{ new: true }
			)
		})

		let agent = await User.find({ agent: null })
		agent.forEach(async (element) => {
			await User.updateOne(
				{ _id: element._id },
				{ $unset: { agent: '' } },
				{ new: true }
			)
		})

		res.status(201).json({
			message: 'Utilisateur modifié !',
		})
	} catch (error) {
		res.status(500).json({
			error: error.message,
		})
	}
}

//GET ONE USER
/**
 * @api {get} /api/user/:_id Récupérer un utilisateur
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
			message: 'Erreur serveur.',
			error: error.message,
		})
	}
}

//GET ALL USER
/**
 * @api {get} /api/user/ Récupérer tous les utilisateurs
 * @apiName getAll
 * @apiGroup Utilisateur
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
		const users = await User.find({ status: true })
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

//GET DELETE
/**
 * @api {DELETE} /api/user/:_id Supprimer un utilisateur
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
	User.updateOne(
		{
			_id: req.params._id,
		},
		{
			status: 0,
		}
	)
		.then(() => {
			res.status(201).json({
				status_code: 201,
				message: 'Utilisateur désactivé !',
			})
		})
		.catch((error) =>
			res.status(400).json({
				status_code: 400,
				error: error.message,
			})
		)
}

//SIGNUP USER
/**
 * @api {post} /api/user/signup Inscrire un utilisateur
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
const signup = (req, res) => {
	let datas = req.body

	if (datas.password != null) {
		bcrypt
			.hash(datas.password, 10)
			.then((hash) => {
				const user = new User({
					...datas,
					password: hash,
				})
				user.save()
					.then(() =>
						res.status(201).json({
							status_code: 201,
							message: 'Compte créé !',
						})
					)
					.catch((error) =>
						res.status(400).json({
							status_code: 400,
							error: error.message,
						})
					)
			})
			.catch((error) => {
				res.status(500).json({
					status_code: 500,
					error: error.message,
				})
			})
	} else {
		res.status(400).json({
			status_code: 400,
			message: 'Mot de passe vide',
		})
	}
}

//LOGIN USER
/**
 * @api {post} /api/user/login Authentifier un utilisateur
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
		const user = await User.findOne({ email: datas.email })
		if (user.status == false) {
			return res.status(403).json({
				status_code: 403,
				error: 'Compte utilisateur désactivé !',
			})
		}
		bcrypt
			.compare(datas.password, user.password)
			.then(async (valid) => {
				if (!valid) {
					return res.status(401).json({
						status_code: 401,
						error: 'Mot de passe incorrect !',
					})
				}
				const token = jwt.sign(
					{ userId: user._id },
					process.env.SECRET_TOKEN,
					{ expiresIn: '24h' }
				)
				await User.updateOne({ _id: user._id }, { token: token })
				res.status(200).json({
					status_code: 200,
					userId: user._id,
					token: token,
					message: 'Utilisateur connecté !',
				})
			})
			.catch((error) =>
				res.status(500).json({
					error,
				})
			)
	} catch (error) {
		return res.status(401).json({
			status_code: 401,
			error: 'Utilisateur non trouvé !',
		})
	}
}
//USER FORGOT PASSWORD
/**
 * @api {post} /api/forgot Créer un token de réinitilisation
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
const forgotPass = (req, res) => {
	let datas = Object.keys(req.body).length === 0 ? req.query : req.body
	User.findOne({ email: datas.email })
		.then((user) => {
			if (user.status == false) {
				return res.status(403).json({
					status_code: 403,
					error: 'Compte utilisateur désactivé !',
				})
			}
			User.updateOne(
				{ _id: user.id },
				{
					token: jwt.sign(
						{ userId: user._id },
						process.env.SECRET_TOKEN,
						{ expiresIn: '5h' }
					),
				}
			)
		})
		.catch((error) =>
			res.status(500).json({
				status_code: 500,
				error: error.message,
			})
		)
}

//CHECK RESEST PASSWORD TOKEN
/**
 * @api {get} /api/user/check/:token Vérifier le token utilisateur
 * @apiName checkResetToken
 * @apiGroup Utilisateur
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
		const user = await User.findOne({ token: req.params.token })
		if (user) {
			res.status(200).json({
				status_code: 200,
				data: user,
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

// SETNEWSLETTER
const setNewsletter = async (req, res) => {
	try {
		const user = await findById(req.params._id)
		if (!user)
			return res
				.status(400)
				.json({ status_code: 400, message: 'Utilisateur inexistant' })
		if (user.newsletter)
			return res.status(200).json({
				status_code: 200,
				message: 'Vous êtes déjà inscrit à la newsletter.',
			})
		User.updateOne({ _id: req.params._id }, { newsletter: true }).then(
			res.status(200).json({
				status_code: 200,
				message: 'Utilisateur inscrit à la newsletter !',
			})
		)
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

// UNSETNEWSLETTER
const unsetNewsletter = async (req, res) => {
	try {
		const user = await findById(req.params._id)
		if (!user)
			return res
				.status(400)
				.json({ status_code: 400, message: 'Utilisateur inexistant' })
		if (!user.newsletter)
			return res.status(200).json({
				status_code: 200,
				message: "Vous n'êtes pas inscrit à la newsletter.",
			})
		User.updateOne({ _id: req.params._id }, { newsletter: false }).then(
			res.status(200).json({
				status_code: 200,
				message: 'Utilisateur désinscrit à la newsletter !',
			})
		)
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

//GET ALL AGENTS
/**
 * @api {get} /api/user/agents Récupérer tous les agents
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
const getAgents = (req, res) => {
	User.find({ role: 'Agent' })
		.then((agents) =>
			res.status(200).json({
				status_code: 200,
				datas: agents,
			})
		)
		.catch((error) =>
			res.status(400).json({
				status_code: 400,
				error: error.message,
			})
		)
}

//Check AVAILABILITIES OF AGENT
/**
 * @api {post} /api/user/agentAvailabilities Vérifier ses disponibilités
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
			status_code: 200,
			Availabilities: availableArray,
		})
	} catch (error) {
		res.status(400).json({
			status_code: 400,
			error: error.message,
		})
	}
}

//GET ALL BUYERS
/**
 * @api {get} /api/user/buyers Récupérer tous les acheteurs
 * @apiName getBuyers
 * @apiGroup Utilisateur
 * 
 * @apiHeader {String} Authorization Token d'Authentification
 *
 * @apiSuccess {User} user Objet Buyers.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'Tous les acheteurs : récupérés !',
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
const getBuyers = async (req, res) => {
	try {
		const user = await User.find({ status: true, buyer: { $exists: true } })
		if (user) {
			res.status(200).json(user)
		} else {
			res.status(204).json({ message: 'Aucun utilisateur' })
		}
	} catch (error) {
		res.status(400).json(error)
	}
}

const addToWishlist = async (req, res) => {
	try {
		const wishlist = await User.findById(req.auth).wishlist
		wishlist.push(req.body.idProperty)
		User.updateOne({ _id: req.auth }, { wishlist }).then(() => {
			res.status(200).json({
				status_code: 200,
				message: 'Propriété ajouté à la wishlist !',
			})
		})
	} catch (error) {
		res.status(400).json({
			status_code: 400,
			error: error.message,
		})
	}
}

const removeOfWishlist = async (req, res) => {
	try {
		const wishlist = await User.findById(req.auth).wishlist
		wishlist = wishlist.filter((wish) => wish !== req.body.idProperty)
		User.updateOne({ _id: req.auth }, { wishlist }).then(() => {
			res.status(200).json({
				status_code: 200,
				message: 'Propriété retiré à la wishlist !',
			})
		})
	} catch (error) {
		res.status(400).json({
			status_code: 400,
			error: error.message,
		})
	}
}

//GET ALL SELLERS
/**
 * @api {get} /api/user/sellers Récupérer tous les vendeurs
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
		res.status(400).json(error)
	}
}

//CHECK ADMIN ACCESS
/**
 * @api {get} /api/user/checkAccess/:_id Vérifier les droits
 * @apiName checkAccess
 * @apiGroup Utilisateur
 *
 * @apiParam {ObjectId} _id ID de l'utilisateur.
 *
 * @apiSuccess role role de l'utilisateur.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "role" : "Agent"
 *     }
 *
 * @apiError message Message de retour associé.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       message: "Aucun utilisateur"
 *     }
 */
const checkAccess = async (req, res) => {
	let id = req.params._id
	try {
		const user = await User.findOne({
			status: true,
			_id: id,
		})
		if (user) {
			// On check la permission du compte:
			if (!user.$isEmpty('buyer') && !user.$isEmpty('seller')) {
				res.status(200).json({ role: 'Buyer, Seller' })
			} else if (!user.$isEmpty('buyer')) {
				res.status(200).json({ role: 'Buyer' })
			} else if (!user.$isEmpty('seller')) {
				res.status(200).json({ role: 'Seller' })
			} else if (!user.$isEmpty('agent')) {
				res.status(200).json({ role: 'Agent' })
			} else {
				res.status(200).json({
					role: 'aucun',
				})
			}
		} else {
			res.status(400).json({ message: 'Aucun utilisateur' })
		}
	} catch (error) {
		res.status(500).json(error)
	}
}

export {
	getOne,
	getAll,
	create,
	update,
	deleteOne,
	login,
	signup,
	forgotPass,
	checkResetToken,
	setNewsletter,
	unsetNewsletter,
	getAgents,
	checkAgentAvailabilities,
	getBuyers,
	addToWishlist,
	removeOfWishlist,
	getSellers,
	checkAccess,
}
