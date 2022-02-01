import Buyer from '../models/Buyer.js'

//CREATE BUYER
const create = (req, res) => {
	const ag = new Buyer({
		...req.body,
	})

	ag.save()
		.then(() => {
			res.status(201).json({
				status_code: 201,
				message: 'Buyer enregistré !',
			})
		})
		.catch((error) => {
			res.status(400).json({
				status_code: 400,
				message: error,
			})
		})
}

const getAll = () => {
	Buyer.find()
		.then((buyers) => res.status(200).json(buyers))
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

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

export { getAll, getOne, create }
