import Transaction from '../models/Transaction.js'

const create = (req, res) => {
	delete req.body._id
	const transaction = new Transaction({
		...req.body,
	})
	transaction
		.save()
		.then(() =>
			res.status(201).json({
				message: 'Transaction enregistrée !',
			})
		)
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

const update = (req, res) => {
	Transaction.updateOne(
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
				message: 'Objet modifié !',
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
		const transaction = await Transaction.findOne({ _id: req.params.id })
		if (!transaction) {
			return res.status(404).json({
				error: new Error('Objet non trouvé !'),
			})
		}
		if (transaction.userId !== req.auth.userId) {
			return res.status(401).json({
				error: new Error('Requête non autorisée !'),
			})
		}

		// On éxecute:
		Transaction.deleteOne({ _id: req.params.id }).then(() =>
			res.status(200).json({ message: 'Objet supprimé !' })
		)
	} catch (error) {
		res.status(400).json({ error })
	}
}

const getAll = (req, res) => {
	Thing.find()
		.then((things) => res.status(200).json(things))
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

const getOne = async (req, res) => {
	try {
		const user = await User.find()
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

export { create, update, erase, getAll, getOne }
