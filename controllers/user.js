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
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": 'Utilisateur enregistrée !',
 *     }
 *
 * @apiError ServerError Erreur serveur.
 * @apiError UserAlreadyExists Un compte avec cette adresse email existe déjà !
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Utilisateur non crée !"
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
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Utilisateur non modifié !"
 *     }
 */
const update = async (req, res) => {
	let datas = req.body
	await User.findOneAndUpdate(
		{ _id: req.params._id },
		{ kind: 'Seller' },
		{ new: true }
	)
	User.updateOne(
		{
			_id: req.params._id,
		},
		{
			...datas,
		}
	)
		.then((response) => {
			res.status(201).json({
				message: 'Utilisateur modifié !',
			})
		})
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

//GET ONE USER
/**
 * @api {get} /api/user/:_id Récupérer un utilisateur
 * @apiName getOne
 * @apiGroup Utilisateur
 *
 * @apiParam {Number} _id ID de l'utilisateur.
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
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Utilisateur non trouvé !"
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
			res.status(204).json({ message: 'Aucun utilisateur' })
		}
	} catch (error) {
		console.log(error)
		res.status(400).json({
			error: error,
			message: 'Utilisateur non trouvé !',
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
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Aucun utilisateur trouvé !"
 *     }
 */
const getAll = async (req, res) => {
	try {
		const user = await User.find({ status: true })
		if (user) {
			res.status(200).json(user)
		} else {
			res.status(204).json({ message: 'Aucun utilisateur' })
		}
	} catch (error) {
		console.log(error)
		res.status(400).json(error)
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
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Impossible de désactiver cet utilisateur !"
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
		.then((response) => {
			res.status(201).json({
				message: 'Utilisateur désactivé !',
			})
		})
		.catch((error) =>
			res.status(400).json({
				error,
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
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Compte non crée !"
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
							message: 'Compte créé !',
						})
					)
					.catch((error) =>
						res.status(400).json({
							error,
						})
					)
			})
			.catch((error) => {
				console.log(error)
				res.status(500).json({
					error,
				})
			})
	} else {
		res.status(400).json({
			message: 'Mot de passe incorrect',
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
				error: 'Compte utilisateur désactivé !',
			})
		}
		bcrypt
			.compare(datas.password, user.password)
			.then(async (valid) => {
				if (!valid) {
					return res.status(401).json({
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
		console.log(error)
		return res.status(401).json({
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
		.catch((error) => res.status(500).json({ error }))
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
			res.status(200).json(user)
		} else {
			res.status(204).json({ message: 'Aucun utilisateur' })
		}
	} catch (error) {
		res.status(500).json({ error })
	}
}

// SETNEWSLETTER
const setNewsletter = async (req, res) => {
	try {
		const user = await findById(req.params._id)
		if (!user)
			return res.status(400).json({ message: 'Utilisateur inexistant' })
		User.updateOne({ _id: req.params._id }, { newsletter: true }).then(
			res
				.status(200)
				.json({ message: 'Utilisateur inscrit à la newsletter !' })
		)
	} catch (error) {
		res.status(500).json({ error })
	}
}

// UNSETNEWSLETTER
const unsetNewsletter = async (req, res) => {
	try {
		const user = await findById(req.params._id)
		if (!user)
			return res.status(400).json({ message: 'Utilisateur inexistant' })
		User.updateOne({ _id: req.params._id }, { newsletter: false }).then(
			res
				.status(200)
				.json({ message: 'Utilisateur désinscrit à la newsletter !' })
		)
	} catch (error) {
		res.status(500).json({ error })
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
}
