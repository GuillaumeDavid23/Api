import Buyer from '../models/Buyer.js'
import bcrypt from 'bcrypt'

//CREATE BUYER
/**
 * @api {post} /api/buyer Créer un acheteur
 * @apiName create
 * @apiGroup Acheteur
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiBody {String} firstname Prénom de l'acheteur
 * @apiBody {String} lastname Nom de l'acheteur
 * @apiBody {String} email Email de l'acheteur
 * @apiBody {String} password Mot de passe de l'acheteur
 * @apiBody {String} [phone] Numéro de téléphone de l'acheteur
 * @apiBody {Boolean} newsletter="false" Accord des newsletters de l'utilisateur
 * @apiBody {Boolean} status="true" Status actif ou non
 * @apiBody {String} [ref] Référence client
 *
 * @apiBody {Number} [budgetMin] Budget minimum de recherche
 * @apiBody {Number} [budgetMax] Budget maximum de recherche
 * @apiBody {String} [city] Ville de recherche
 * @apiBody {Number} [surfaceMin] Suface minimum de recherche
 * @apiBody {Number} [surfaceMax] Surface maximum de recherche
 * @apiBody {String} [type] Type de bien
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": 'Acheteur enregistrée !',
 *     }
 *
 * @apiError ServerError Erreur serveur.
 * @apiError BuyerAlreadyExists Un compte avec cette adresse email existe déjà !
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Acheteur non crée !"
 *     }
 */
const create = async (req, res) => {
	const saltRounds = 10

	const buyer = new Buyer({
		...req.body,
	})
	const mailCheck = await Buyer.findOne({ email: buyer.email })
	if (mailCheck) {
		return res.status(403).json({
			error: 'Un compte avec cette adresse email existe déjà !',
		})
	}
	bcrypt.hash(buyer.password, saltRounds, function (err, hash) {
		buyer.password = hash
		buyer
			.save()
			.then(() =>
				res.status(201).json({
					message: 'Acheteur créé !',
				})
			)
			.catch((error) =>
				res.status(400).json({
					error,
				})
			)
	})
}

/**
 * @api {get} /api/buyer/ Récupérer tous les acheteurs
 * @apiName getAll
 * @apiGroup Acheteur
 * 
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiSuccess {Buyer} buyer Objet Acheteur.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'Acheteur récupéré !',
		"data": buyer,
 *     }
 *
 * @apiError BuyerNotFound Aucun Acheteur.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Aucun Acheteur trouvé !"
 *     }
 */
const getAll = () => {
	Buyer.find()
		.then((buyers) => res.status(200).json(buyers))
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

/**
 * @api {get} /api/buyer/:_id Récupérer un utilisateur
 * @apiName getOne
 * @apiGroup Acheteur
 * 
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiParam {Number} _id ID de l'acheteur.
 *
 * @apiSuccess {User} user Objet acheteur.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'acheteur récupéré !',
		"data": user,
 *     }
 *
 * @apiError UserNotFound Aucun acheteur.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "acheteur non trouvé !"
 *     }
 */
const getOne = async () => {
	try {
		const buyer = await Buyer.findById(req.params._id)
		if (buyer) {
			res.status(200).json(buyer)
		} else {
			res.status(204).json({ message: 'Aucun acheteur' })
		}
	} catch (error) {
		console.log(error)
		res.status(400).json(error)
	}
}

/**
 * @api {get} /api/buyer/:_id/wishlist Récupère la liste de souhait d'un acheteur
 * @apiName getWishlist
 * @apiGroup Acheteur
 *
 * @apiHeader {String} Authorization Token d'Authentification
 *
 * @apiParam {ObjectId} _id="61f93c440e15ba1e37772e03" ID de l'acheteur.
 *
 */
const getWishlist = async (req, res) => {
	let data = Object.keys(req.params).length === 0 ? req.query : req.params
	console.log(data)

	try {
		const buyer = await Buyer.findById(data._id).exec()
		console.log(buyer)

		res.status(200).json({
			message: "Wishlist d'utilisateur trouvé",
			data: buyer.wishlist,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Erreur serveur',
			error: error.message,
		})
	}
}

export { getAll, getOne, create, getWishlist }
