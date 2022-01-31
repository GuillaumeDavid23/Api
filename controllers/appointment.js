import Appointment from '../models/Appointment.js'
import Buyer from '../models/Buyer.js'
import Agent from '../models/Agent.js'

const create = (req, res) => {
	const appointment = new Appointment({
		...req.body,
	})
	appointment
		.save()
		.then(() =>
			res.status(201).json({
				message: 'Rendez-vous enregistré !',
			})
		)
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

const update = (req, res) => {
	Appointment.updateOne(
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
				message: 'Rendez-vous modifié !',
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
		let appointment = await Appointment.findOne({ _id: req.params.id })
		if (!appointment) {
			return res.status(404).json({
				error: new Error('Rendez-vous non trouvé !'),
			})
		}
		if (appointment.userId !== req.auth.userId) {
			return res.status(401).json({
				error: new Error('Requête non autorisée !'),
			})
		}

		// On éxecute:
		Appointment.deleteOne({ _id: req.params.id }).then(() =>
			res.status(200).json({ message: 'Rendez-vous supprimé !' })
		)
	} catch (error) {
		res.status(400).json({ error })
	}
}

const getAll = (req, res) => {
	Appointment.find()
		.then((appointments) => res.status(200).json(appointments))
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

const getOne = async (req, res) => {
	try {
		let appointment = await Appointment.find()
		if (appointment) {
			res.status(200).json(appointment)
		} else {
			res.status(204).json({ message: 'Aucun rendez-vous' })
		}
	} catch (error) {
		res.status(400).json(error)
	}
}

const getParticipants = async (req, res) => {
	try {
		let appointment = await Appointment.findOne({ _id: req.params._id })
		let buyer = await Buyer.findOne({ _id: appointment.id_buyer })
		let agent = await Agent.findOne({ _id: appointment.id_agent })
		res.status(200).json({
			buyer: buyer,
			agent: agent,
		})
	} catch (error) {
		res.status(400).json(error)
	}
}

export { create, update, erase, getAll, getOne, getParticipants }
