import Seller from '../models/Seller.js'

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

export { getOne, getAll }
