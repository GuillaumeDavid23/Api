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

//Check AVAILABILITIES OF AGENT
const checkAvailabilities = async (req, res) => {
	try {
		let begin = new Date(req.body.date)
		let end = new Date(req.body.date)
		begin.setUTCHours(8)
		end.setUTCHours(19)

		let appointments = await Appointment.find({
			id_agent: req.body.id_agent,
		}).sort({ dateBegin: 'asc' })

		let availableArray = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
		appointments.forEach((appoint) => {
			if (appoint.dateBegin >= begin && appoint.dateEnd <= end) {
				let hourBegin = appoint.dateBegin.getUTCHours()
				let hourEnd = appoint.dateEnd.getUTCHours()
				while (hourBegin <= hourEnd) {
					let index = availableArray.indexOf(hourBegin)
					availableArray.splice(index, 1)
					hourBegin++
				}
			}
		})
		res.status(200).json({
			Availabilities: availableArray,
		})
	} catch (error) {
		console.log(error)
		res.status(400).json(error)
	}
}

export { create, getAllAgents, getAgent, checkAvailabilities }
