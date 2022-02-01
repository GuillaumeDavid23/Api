import Rental from '../models/Rental.js'

const create = (req, res, next) => {
	const rental = new Rental({
		...req.body,
	})
	rental
		.save()
		.then(() =>
			res.status(201).json({
				message: 'Location enregistrée !',
			})
		)
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

const update = (req, res, next) => {
	Rental.updateOne(
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
				message: 'Location modifiée !',
			})
		)
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

const erase = (req, res, next) => {
	Rental.findOne({
		_id: req.params.id,
	}).then((rental) => {
		if (!rental) {
			return res.status(404).json({
				error: new Error('Location non trouvée !'),
			})
		}
		if (rental.userId !== req.auth.userId) {
			return res.status(401).json({
				error: new Error('Requête non autorisée !'),
			})
		}
		Rental.deleteOne({
			_id: req.params.id,
		})
			.then(() =>
				res.status(200).json({
					message: 'Location supprimée !',
				})
			)
			.catch((error) =>
				res.status(400).json({
					error,
				})
			)
	})
}

const getAll = (req, res, next) => {
	Rental.find()
		.then((rentals) => res.status(200).json(rentals))
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

const getOne = (req, res, next) => {
	Rental.findOne({
		_id: req.params.id,
	})
		.then((rental) => res.status(200).json(rental))
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

export { create, update, erase, getAll, getOne }
