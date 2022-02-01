import Property from '../models/Property'

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
			res.json({
				status_code: 200,
				message: 'Liste des propriétés récupérée !',
				data: properties,
			})
		})
		.catch((error) => {
			res.json({
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
			res.json({
				status_code: 200,
				message: 'Propriété récupérée !',
				data: property,
			})
		} else {
			res.json({
				status_code: 204,
				message: 'Aucune propriété !',
			})
		}
	} catch (error) {
		res.json({
			status_code: 400,
			message: error,
		})
	}
}

export { createProperty, getAllProperties, getPropertyById }
