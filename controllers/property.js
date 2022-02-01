import Property from '../models/Property.js'

// CREATE
/**
 * @api {post} /property Créer une propriété
 * @apiName createProperty
 * @apiGroup Property
 *
 * @apiParam {String} title="Super Maison"
 * @apiParam {String} description="Vraiment super !"
 * @apiParam {Number} amount="300000"
 * @apiParam {String} location="Amiens"
 * @apiParam {String} propertyType="Maison"
 * @apiParam {Number} surface="100"
 * @apiParam {Number} roomNumber="5"
 * @apiParam {String} transactionType="Achat"
 *
 * @apiParam {Array} list_equipments={murs:4},{toit:1}
 * @apiParam {Array} list_heater={hp:30},{hc:50}
 * @apiParam {Array} list_water={hot:40},{cold:10}
 * @apiParam {String} electricMeterRef="azertyuiop"
 * @apiParam {String} gasMeterRef="azertyuiop2"
 *
 * @apiParam {Boolean} isToSell="true"
 * @apiParam {String} propertyRef="azertyuiop0"
 *
 * @apiSuccess {String} message Message de completion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": 'Propriété enregistrée !',
 *     }
 *
 * @apiError ServerError Propriété non crée.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Propriété non crée !"
 *     }
 */
const createProperty = (req, res) => {
	const newProperty = new Property({
		...req.query,
		isToSell: req.query.isToSell == 'on' ? true : false,
		// ...req.body,
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
/**
 * @api {get} /property Récupérer toutes les propriétés
 * @apiName getAllProperties
 * @apiGroup Property
 *
 * @apiSuccess {Array} properties Liste de Propriétés
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Liste de Propriétés récupérée !",
 *       "data": properties,
 *     }
 *
 * @apiError ServerError Erreur Serveur
 *
 */
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
			res.status(500).json({
				status_code: 500,
				message: error,
			})
		})
}

// READ ONE
/**
 * @api {get} /property/:id Récupérer une propriété
 * @apiName getPropertyById
 * @apiGroup Property
 *
 * @apiParam {Number} _id ID de la propriété.
 *
 * @apiSuccess {Property} property Objet Propriété.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Propriété récupérée !",
 *       "data": property,
 *     }
 *
 * @apiError PropertyNotFound Propriété non trouvée.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Propriété non trouvée !"
 *     }
 */
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
