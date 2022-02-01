import Rental from '../models/Rental.js'

const create = (req, res, next) => {
	delete req.body._id
	const thing = new Thing({
		...req.body,
	})
	thing
		.save()
		.then(() =>
			res.status(201).json({
				message: 'Objet enregistré !',
			})
		)
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

const update = (req, res, next) => {
	Thing.updateOne(
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

const erase = (req, res, next) => {
	Thing.findOne({
		_id: req.params.id,
	}).then((thing) => {
		if (!thing) {
			return res.status(404).json({
				error: new Error('Objet non trouvé !'),
			})
		}
		if (thing.userId !== req.auth.userId) {
			return res.status(401).json({
				error: new Error('Requête non autorisée !'),
			})
		}
		Thing.deleteOne({
			_id: req.params.id,
		})
			.then(() =>
				res.status(200).json({
					message: 'Objet supprimé !',
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
	Thing.find()
		.then((things) => res.status(200).json(things))
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

const getOne = (req, res, next) => {
	Thing.findOne({
		_id: req.params.id,
	})
		.then((thing) => res.status(200).json(thing))
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

export { create, update, erase, getAll, getOne }
