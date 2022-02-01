import Property from '../models/Property.js'

// CREATE
const createProperty = (req, res) => {
	const newProperty = new Property({
		...req.body,
	})
	newProperty
		.save()
		.then(() => {
			res.status(201).json({
				status_code: 201,
				message: 'Propriété enregistrée !',
			})
		})
		.catch((error) => {
			res.status(400).json({
				status_code: 400,
				message: error,
			})
		})
}

// READ
const getAllProperties = (req, res) => {
	Property.find()
		.then((properties) => {
			res.status(200).json({
				status_code: 200,
				message: 'Liste des propriétés récupérée !',
				data: properties,
			})
		})
		.catch((error) => {
			res.status(400).json({
				status_code: 400,
				message: error,
			})
		})
}

// READ ONE
const getPropertyById = async (req, res) => {
	try {
		let property = await Property.findById(req.body._id)
		if (property) {
			res.status(200).json({
				status_code: 200,
				message: 'Propriété récupérée !',
				data: property,
			})
		} else {
			res.status(204).json({
				status_code: 204,
				message: 'Aucune propriété !',
			})
		}
	} catch (error) {
		res.status(400).json({
			status_code: 400,
			message: error,
		})
	}
}

// UPDATE
const updateProperty = (req, res) => {
	Property.updateOne(
		{ _id: req.params.id },
		{
			...req.body,
			_id: req.body.id,
		}
	)
		.then(() => {
			res.status(200).json({
				status_code: 200,
				message: 'Proprité modifiée !',
			})
		})
		.catch((error) => {
			res.status(400).json({
				status_code: 400,
				message: error,
			})
		})
}

// DELETE
const deleteProperty = async (req, res) => {
	try {
		// On récupère la propriété avec son Id
		let property = await Property.findById({ _id: req.params.id })

		// Si pas de propriété trouvée
		if (!property) {
			return res.status(404).json({
				status_code: 404,
				message: 'Propriété non trouvée !',
			})
		}

		// Enfin, on supprime la propriété
		Property.deleteOne({ _id: req.params.id }).then(() => {
			return res.status(200).json({
				status_code: 200,
				message: 'Propriété supprimée !',
			})
		})
	} catch (error) {
		return res.status(400).json({
			status_code: 400,
			message: error,
		})
	}
}

export {
	createProperty,
	getAllProperties,
	getPropertyById,
	updateProperty,
	deleteProperty,
}
