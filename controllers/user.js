import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

//CREATE USER
/**
 * @api {post} /user Créer un utilisateur
 * @apiName create
 * @apiGroup User
 *
 * @apiBody {String} firstname
 * @apiBody {String} lastname
 * @apiBody {String} email
 * @apiBody {String} password
 * @apiBody {String} [phone]
 * @apiBody {Boolean} [newsletter]
 * @apiBody {Boolean} status
 * @apiBody {String} [ref]
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
	console.log(req.body)
	let datas = Object.keys(req.body).length === 0 ? req.query : req.body

	const user = new User({
		...datas,
		newsletter: datas.newsletter == 'on' ? true : false,
		status: datas.status == 'on' ? true : false,
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
 * @api {put} /api/user/:_id Mettre à jour une propriété
 * @apiName update
 * @apiGroup User
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id
 *
 * @apiParam {String} firstname="Jean"
 * @apiParam {String} lastname="Dupont"
 * @apiParam {String} email="jean-dupont@email.Fr"
 * @apiParam {String} password="123456789"
 * @apiParam {String} phone="0322325669"
 * @apiParam {Boolean} newsletter="true"
 * @apiParam {Boolean} status="true"
 * @apiParam {String} ref="152GD15J"
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
const update = (req, res) => {
	let datas = Object.keys(req.body).length === 0 ? req.query : req.body

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
 * @api {get} /user/:_id Récupérer un utilisateur
 * @apiName getOne
 * @apiGroup User
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
 * @api {get} /user/ Récupérer tout les utilisateurs
 * @apiName getAll
 * @apiGroup User
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
 * @api {DELETE} /user/:_id Récupérer tout les utilisateurs
 * @apiName deleteOne
 * @apiGroup User
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
 * @api {post} /user/signup Créer un utilisateur
 * @apiName signup
 * @apiGroup User
 *
 * @apiParam {String} firstname="Jean"
 * @apiParam {String} lastname="Dupont"
 * @apiParam {String} email="jean-dupont@email.Fr"
 * @apiParam {String} password="123456789"
 * @apiParam {String} phone="0322325669"
 * @apiParam {Boolean} newsletter="true"
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
const signup = async (req, res) => {
	let datas = Object.keys(req.body).length === 0 ? req.query : req.body
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
		.catch((error) =>
			res.status(500).json({
				error,
			})
		)
}

//LOGIN USER
/**
 * @api {post} /user/login Authentification d'un utilisateur
 * @apiName login
 * @apiGroup User
 *
 * @apiParam {String} email
 * @apiParam {String} password
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
 * @api {post} /api/forgot Création du token
 * @apiName update
 * @apiGroup User
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id
 *
 * @apiParam {String} firstname="Jean"
 * @apiParam {String} lastname="Dupont"
 * @apiParam {String} email="jean-dupont@email.Fr"
 * @apiParam {String} password="123456789"
 * @apiParam {String} phone="0322325669"
 * @apiParam {Boolean} newsletter="true"
 * @apiParam {Boolean} status="true"
 * @apiParam {String} ref="152GD15J"
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
		.catch((error) =>
			res.status(500).json({
				error,
			})
		)
}

//CHECK RESEST PASSWORD TOKEN
/**
 * @api {get} /user/check/:token Récupérer un utilisateur
 * @apiName checkResetToken
 * @apiGroup User
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
	const user = await User.findOne({ token: req.params.token })
	if (user) {
		res.status(200).json(user)
	} else {
		res.status(204).json({ message: 'Aucun utilisateur' })
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
}
