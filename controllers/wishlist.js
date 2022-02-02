import Wishlist from '../models/Wishlist.js'

/**
 * @api {post} /api/wishlist Créer une liste de souhait
 * @apiName create
 * @apiGroup ListeSouhait
 *
 * @apiHeader {String} Authorization Token d'Authentification
 *
 * @apiBody {ObjectId} id_buyer="61f93c440e15ba1e37772e03" ID de l'acheteur.
 *
 */
const create = (req, res) => {
	const wishlist = new Wishlist({
		...req.body,
	})
	wishlist
		.save()
		.then(() =>
			res.status(201).json({
				message: 'Liste de souhaits enregistrée !',
			})
		)
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

const update = (req, res) => {
	let data = Object.keys(req.params).length === 0 ? req.query : req.params

	Wishlist.updateOne(
		{
			_id: data._id,
		},
		{
			...req.body,
			_id: data._id,
		}
	)
		.then(() =>
			res.status(200).json({
				message: 'Liste de souhaits modifiée !',
			})
		)
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

const erase = async (req, res) => {
	try {
		// On check la transaction a supprimer:
		let wishlist = await Wishlist.findOne({ _id: req.params.id })
		if (!wishlist) {
			return res.status(404).json({
				error: new Error('Liste de souhaits non trouvé !'),
			})
		}
		if (wishlist.userId !== req.auth.userId) {
			return res.status(401).json({
				error: new Error('Requête non autorisée !'),
			})
		}

		// On éxecute:
		Wishlist.deleteOne({ _id: req.params.id }).then(() =>
			res.status(200).json({ message: 'Liste de souhaits supprimée !' })
		)
	} catch (error) {
		res.status(400).json({ error })
	}
}

const getOne = async (req, res) => {
	try {
		let wishlist = await Wishlist.find()
		if (wishlist) {
			res.status(200).json(wishlist)
		} else {
			res.status(204).json({ message: 'Aucun liste de souhaits' })
		}
	} catch (error) {
		res.status(400).json(error)
	}
}

export { create, update, erase, getOne }
