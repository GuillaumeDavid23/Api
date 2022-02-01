import Buyer from './Buyer.js'

const getBuyer = async () => {
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

const getAllBuyers = () => {
	Buyer.find()
		.then((buyers) => res.status(200).json(buyers))
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

export { getAllBuyers, getBuyer }
