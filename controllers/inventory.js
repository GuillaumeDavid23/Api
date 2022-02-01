import Inventory from '../models/inventory.js'

const create = (req, res) => {
	const inventory = new Inventory({
		...req.body,
	})
	inventory
		.save()
		.then(() =>
			res.status(201).json({
				message: 'Inventaire enregistrée !',
			})
		)
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

const update = (req, res) => {
	Inventory.updateOne(
		{
			_id: req.params.id,
		},
		{
			...req.body,
			_id: req.params.id,
		}
	)
		.then(() =>
			res.status(200).json({
				message: 'Inventaire modifiée !',
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
		let inventory = await Inventory.findOne({ _id: req.params.id })
		if (!inventory) {
			return res.status(404).json({
				error: new Error('Inventaire non trouvé !'),
			})
		}
		if (inventory.userId !== req.auth.userId) {
			return res.status(401).json({
				error: new Error('Requête non autorisée !'),
			})
		}

		// On éxecute:
		inventory
			.deleteOne({ _id: req.params.id })
			.then(() =>
				res.status(200).json({ message: 'Inventaire supprimée !' })
			)
	} catch (error) {
		res.status(400).json({ error })
	}
}

const getAll = () => {
	Inventory.find()
		.then((inventories) => res.status(200).json(inventories))
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

const getOne = async (req, res) => {
	try {
		let inventory = await Inventory.find()
		if (inventory) {
			res.status(200).json(inventory)
		} else {
			res.status(204).json({ message: 'Aucun inventaire' })
		}
	} catch (error) {
		res.status(400).json(error)
	}
}

// /!\ Réussir à recupérer la condition:
const getAllForOneUser = () => {
	Inventory.find({})
		.then((inventories) => res.status(200).json(inventories))
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

export { create, update, erase, getAll, getOne, getAllForOneUser }
