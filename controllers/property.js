import Property from '../models/Property.js'
import fs from 'fs'

// CREATE
/**
 * @api {post} /api/property Créer une propriété
 * @apiName createProperty
 * @apiGroup Property
 *
 * @apiHeader {String} Authorization
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
 * @apiParam {Array} lst_equipments={murs:4},{toit:1}
 * @apiParam {Array} lst_heater={hp:30},{hc:50}
 * @apiParam {Array} lst_water={hot:40},{cold:10}
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
 *       "message": "Propriété enregistrée !"",
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
// Version avec fichiers:
const createProperty = (req, res) => {
	let datas = Object.keys(req.body).length === 0 ? req.query : req.body
	console.log(datas)
	const newProperty = new Property({
		...datas,
		isToSell: datas.isToSell == 'on' ? true : false,
		imageUrl: `${req.protocol}://${req.get('host')}/uploads/${
			datas.propertyRef
		}`,
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
 * @api {get} /api/property Récupérer toutes les propriétés
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
 * @api {get} /api/property/:id Récupérer une propriété
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
/**
 * @api {put} /api/property/:_id Mettre à jour une propriété
 * @apiName updateProperty
 * @apiGroup Property
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id
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
 * @apiParam {Array} lst_equipments={murs:4},{toit:1}
 * @apiParam {Array} lst_heater={hp:30},{hc:50}
 * @apiParam {Array} lst_water={hot:40},{cold:10}
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
const updateProperty = (req, res) => {
	let datas = Object.keys(req.body).length === 0 ? req.query : req.body
	const property = req.file
		? {
				...JSON.parse(req.body),
				imageUrl: `${req.protocol}://${req.get('host')}/uploads/${
					req.file.filename
				}`,
		  }
		: { ...req.body }

	Property.updateOne(
		{ _id: datas.id },
		{
			...datas,
			_id: datas.id,
		}
	)
		.then(() => {
			res.status(200).json({
				status_code: 200,
				message: 'Propriété modifiée !',
			})
		})
		.catch((error) => {
			console.log(error)
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
		let property = await Property.findById({ _id: req.params._id })

		// Si pas de propriété trouvée
		if (!property) {
			return res.status(404).json({
				status_code: 404,
				message: 'Propriété non trouvée !',
			})
		}

		// Si image existante, on supprime tout: (unlink need callback)
		if (property.imageUrl) {
			fs.unlink(
				'uploads/' + property.imageUrl.split('/uploads/')[1],
				() => {
					Property.deleteOne({ _id: req.params._id }).then(() => {
						return res.status(200).json({
							status_code: 200,
							message: 'Propriété et ses images supprimées !',
						})
					})
				}
			)
		} else {
			Property.deleteOne({ _id: req.params._id }).then(() => {
				return res.status(200).json({
					status_code: 200,
					message: 'Propriété supprimée !',
				})
			})
		}
	} catch (error) {
		console.log(error)
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
