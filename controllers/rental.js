import Rental from '../models/Rental.js'

const create = (req, res, next) => {
	const rental = new Rental({
		...req.body,
	})
	rental
		.save()
		.then(() =>
			res.status(201).json({
				status_code: 201,
				message: 'Location enregistrée !',
			})
		)
		.catch((error) =>
			res.status(400).json({
				status_code: 400,
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
				status_code: 200,
				message: 'Location modifiée !',
			})
		)
		.catch((error) =>
			res.status(400).json({
				status_code: 400,
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
				status_code: 404,
				error: 'Location non trouvée !',
			})
		}
		if (rental.userId !== req.auth.userId) {
			return res.status(401).json({
				status_code: 401,
				error: 'Requête non autorisée !',
			})
		}
		Rental.deleteOne({
			_id: req.params.id,
		})
			.then(() =>
				res.status(200).json({
					status_code: 200,
					message: 'Location supprimée !',
				})
			)
			.catch((error) =>
				res.status(400).json({
					status_code: 400,
					error,
				})
			)
	})
}

const getAll = (req, res, next) => {
	Rental.find()
		.then((rentals) =>
			res.status(200).json({
				status_code: 200,
				datas: rentals,
			})
		)
		.catch((error) =>
			res.status(400).json({
				status_code: 400,
				error,
			})
		)
}

const getOne = async (req, res, next) => {
	try {
		let rental = await Rental.findById(req.params._id)
		if (rental) {
			res.status(200).json({
				status_code: 200,
				datas: rental,
			})
		} else {
			res.status(204).json({
				status_code: 204,
				message: 'Location inexistante',
			})
		}
	} catch (error) {
		res.status(400).json({
			status_code: 400,
			error,
		})
	}
}

export { create, update, erase, getAll, getOne }
