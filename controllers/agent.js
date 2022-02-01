import Agent from '../models/Agent.js'
import Appointment from '../models/Appointment.js'

//CREATE AGENT
const create = (req, res) => {
	const ag = new Agent({
		...req.body,
	})

	ag.save()
		.then(() => {
			res.status(201).json({
				status_code: 201,
				message: 'Agent enregistré !',
			})
		})
		.catch((error) => {
			res.status(400).json({
				status_code: 400,
				message: error,
			})
		})
}

//GET ALL AGENT
const getAllAgents = (req, res) => {
	Agent.find()
		.then((ags) => {
			res.status(200).json({
				status_code: 200,
				message: 'Tous les agents : récupérés !',
				data: ags,
			})
		})
		.catch((err) => {
			res.status_code(400)
		})
}

//GET ONE AGENT
const getAgent = async (req, res) => {
	try {
		const user = await User.findById(req.params._id)
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

//GET AVAILABILITIES OF AGENT
const getAvailabilities = async (req, res) => {
	try {
		let begin = req.body.dateBegin
		let end = req.body.dateEnd

		let appointments = await Appointment.find({
			id_agent: req.body._id,
			slot: {
				$gte: new Date(new Date(begin)),
				$lt: new Date(new Date(end)),
			},
		}).sort({ slot: 'asc' })
		res.status(200).json({
			appointments: appointments,
		})
	} catch (error) {
		res.status(400).json(error)
	}
}

export { create, getAllAgents, getAgent, getAvailabilities }
