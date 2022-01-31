import Transaction from '../models/Transaction.js'

const create = (req, res) => {
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
				message: 'Transaction modifiée !',
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
		let transaction = await Transaction.findOne({ _id: req.params.id })
		if (!transaction) {
			return res.status(404).json({
				error: new Error('Transaction non trouvée !'),
			})
		}
		if (transaction.userId !== req.auth.userId) {
			return res.status(401).json({
				error: new Error('Requête non autorisée !'),
			})
		}

		// On éxecute:
		Transaction.deleteOne({ _id: req.params.id }).then(() =>
			res.status(200).json({ message: 'Transaction supprimée !' })
		)
	} catch (error) {
		res.status(400).json({ error })
	}
}

const getAll = (req, res) => {
	Transaction.find()
		.then((transactions) => res.status(200).json(transactions))
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

const getOne = async (req, res) => {
	try {
		let transaction = await Transaction.find()
		if (transaction) {
			res.status(200).json(transaction)
		} else {
			res.status(204).json({ message: 'Aucune transaction' })
		}
	} catch (error) {
		res.status(400).json(error)
	}
}

export { create, update, erase, getAll, getOne }
