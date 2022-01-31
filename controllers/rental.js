import ReportType from '../models/ReportType.js'
// import locationValidation from "../validation/locationValidation.js"

const createOne = (req, res) => {
	const { body } = req
	// // Validation:
	// const { error } = locationValidation(body)
	// if (error) return res.status(401).json(error.details[0].message)

	ReportType.create(body)
		.then(() =>
			res.status(201).json({
				message: 'Type de signalement enregistré',
			})
		)
		.catch((error) => res.status(500).json({ error }))
}

const updateOne = (req, res) => {
	const { body } = req
	Collect.update(body, { where: { id: body.id } })
		.then(() =>
			res.status(200).json({ message: 'Type de signalement modifié' })
		)
		.catch((error) => res.status(500).json({ error }))
}

const deleteOne = (req, res) => {
	// On check l'existence du type de signalement:
	ReportType.findOne({ where: { id: req.params.id } })
		.then((reportType) => {
			if (!reportType)
				return res
					.status(404)
					.json({ message: 'Type de signalement inexistante' })
		})
		.catch((error) => res.status(500).json({ error }))

	// Exécution:
	ReportType.destroy({ where: { id: req.params.id } })
		.then(res.status(200).json({ message: 'Type de signalement supprimé' }))
		.catch((error) => res.status(500).json({ error }))
}

const getAll = (req, res) => {
	ReportType.findAll({
		attributes: ['id', 'type'],
		where: { portail: 1 },
	})
		.then((reportTypes) => {
			res.status(200).json(reportTypes)
		})
		.catch((error) => res.status(500).json(error))
}

const getOne = (req, res) => {
	ReportType.findOne({ where: { id: req.params.id } })
		.then((reportType) => res.status(200).json(reportType))
		.catch((error) => res.status(500).json(error))
}

export { createOne, updateOne, deleteOne, getAll, getOne }
