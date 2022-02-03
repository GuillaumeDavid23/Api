import Seller from '../models/Seller.js'

// CREATE
/**
 * @api {post} /api/seller Créer un Vendeur
 * @apiName create
 * @apiGroup Vendeur
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiBody {String} firstname Prénom du vendeur
 * @apiBody {String} lastname Nom du vendeur
 * @apiBody {String} email Email du vendeur
 * @apiBody {String} password Mot de passe du vendeur
 * @apiBody {String} [phone] Numéro de téléphone du vendeur
 * @apiBody {Boolean} newsletter="false" Accord des newsletters du vtilisateur
 * @apiBody {Boolean} status="true" Status actif ou non
 * @apiBody {String} [ref] Référence client
 *
 *
 * @apiSuccess {String} message Message de complétion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": 'Vendeur enregistrée !',
 *     }
 *
 * @apiError ServerError Erreur serveur.
 * @apiError sellerAlreadyExists Un compte avec cette adresse email existe déjà !
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Vendeur non crée !"
 *     }
 */
const create = (req, res) => {
	const seller = new Seller({
		...req.body,
	})

	seller
		.save()
		.then(() => {
			res.status(201).json({
				status_code: 201,
				message: 'Vendeur enregistré !',
			})
		})
		.catch((error) => {
			res.status(400).json({
				status_code: 400,
				message: error,
			})
		})
}

/**
 * @api {get} /api/seller/:_id Récupérer un vendeur
 * @apiName getOne
 * @apiGroup Vendeur
 * 
 * @apiHeader {String} Authorization Token d'authentification
 * @apiParam {ObjectId} _id ID de l'acheteur.
 *
 * @apiSuccess {Seller} seller Objet Vendeur.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'Vendeur récupéré !',
		"data": seller,
 *     }
 *
 * @apiError SellerNotFound Aucun Vendeur.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Aucun Vendeur trouvé !"
 *     }
 */
const getOne = async (req, res) => {
	try {
		const seller = await Seller.findById(req.params.id)
		console.log(seller)
		if (seller) {
			res.status(200).json(seller)
		} else {
			console.log('yes')

			res.status(204).json({ message: 'Aucun utilisateur' })
		}
	} catch (error) {
		console.log(error)
		res.status(400).json(error)
	}
}

/**
 * @api {get} /api/seller/ Récupérer tous les vendeurs
 * @apiName getAll
 * @apiGroup Vendeur
 * 
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiSuccess {Seller} seller Objet Vendeur.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'Vendeur récupéré !',
		"data": seller,
 *     }
 *
 * @apiError SellerNotFound Aucun Vendeur.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Aucun Vendeur trouvé !"
 *     }
 */
const getAll = async (req, res) => {
	try {
		const seller = await Seller.find()
		if (seller) {
			res.status(200).json(seller)
		} else {
			res.status(204).json({ message: 'Aucun utilisateur' })
		}
	} catch (error) {
		console.log(error)
		res.status(400).json(error)
	}
}

export { create, getOne, getAll }
