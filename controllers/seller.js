import Seller from '../models/Seller.js'

// CREATE
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

const getOne = async (req, res) => {
	try {
		const seller = await Seller.findById(req.params._id)
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
