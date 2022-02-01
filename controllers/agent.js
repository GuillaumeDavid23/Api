import Agent from '../models/Agent.js'

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

const getAll = (req, res) => {
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

export { create, getAll }
