import Rental from '../models/Rental.js'

const create = async (req, res) => {
	try {
		const rental = new Rental({
			...req.body,
		})
		await rental.save()
		res.status(201).json({
			status_code: 201,
			message: 'Location enregistrée !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

const update = async (req, res) => {
	try {
		await Rental.updateOne(
			{
				_id: req.params.id,
			},
			{
				...req.body,
				_id: req.params.id,
			}
		)
		res.status(200).json({
			status_code: 200,
			message: 'Location modifiée !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

const erase = async (req, res) => {
	try {
		let rental = await Rental.findOne({
			_id: req.params.id,
		})
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
		await Rental.deleteOne({
			_id: req.params.id,
		})
		res.status(200).json({
			status_code: 200,
			message: 'Location supprimée !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

const getAll = async (req, res) => {
	try {
		let rentals = await Rental.find()
		res.status(200).json({
			status_code: 200,
			datas: rentals,
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

const getOne = async (req, res) => {
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
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

export { create, update, erase, getAll, getOne }
