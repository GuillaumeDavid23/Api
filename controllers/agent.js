import Agent from '../models/Agent.js'
import Appointment from '../models/Appointment.js'
import Transaction from '../models/Transaction.js'

//CREATE AGENT
const create = (req, res) => {
	let datas = Object.keys(req.body).length === 0 ? req.query : req.body
	const ag = new Agent({
		...datas,
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
		const agent = await Agent.findById(req.params._id)
		if (agent) {
			res.status(200).json(agent)
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
	let datas = Object.keys(req.body).length === 0 ? req.query : req.body

	try {
		let begin = new Date(datas.date)
		let end = new Date(datas.date)
		begin.setUTCHours(8)
		end.setUTCHours(19)

		let appointments = await Appointment.find({
			id_agent: datas.id_agent,
		}).sort({ dateBegin: 'asc' })

		let availableArray = [
			'9h-9h30',
			'9h30-10h',
			'10h-10h30',
			'10h30-11h',
			'11h-11h30',
			'11h30-12h',
			'12h-12h30',
			'12h30-13h',
			'13h-13h30',
			'13h30-14h',
			'14h-14h30',
			'14h30-15h',
			'15h-15h30',
			'15h30-16h',
			'16h-16h30',
			'16h30-17h',
			'17h-17h30',
			'17h30-18h',
			'18h-18h30',
			'18h30-19h',
		]
		let index = 0
		appointments.forEach((appoint) => {
			if (appoint.dateBegin >= begin && appoint.dateEnd <= end) {
				let hourBegin = appoint.dateBegin.getUTCHours()
				let hourEnd = appoint.dateEnd.getUTCHours()
				while (hourBegin < hourEnd) {
					let slot = hourBegin + 0.5
					if (hourBegin % 1 === 0) {
						slot -= 0.5
						let result = hourBegin + 'h-' + slot + 'h30'
						index = availableArray.indexOf(result)
					} else {
						index = availableArray.indexOf(
							hourBegin - 0.5 + 'h30-' + slot + 'h'
						)
					}
					availableArray.splice(index, 1)
					hourBegin += 0.5
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

//MAKE ONE TRANSACTION
const makeTransaction = (req, res) => {
	let datas = Object.keys(req.body).length === 0 ? req.query : req.body

	const transaction = new Transaction({
		...datas,
	})

	transaction
		.save()
		.then(() => {
			res.status(201).json({
				status_code: 201,
				message: 'Transaction enregistré !',
			})
		})
		.catch((error) => {
			res.status(400).json({
				status_code: 400,
				message: error,
			})
		})
}

export { create, getAllAgents, getAgent, checkAvailabilities, makeTransaction }
