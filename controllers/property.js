import Property from '../models/Property.js'
import User from '../models/User.js'
import sendMail from '../util/mail.js'
import fs from 'fs'
import { asyncForEach } from '../util/functions.js'

/**
 * @api {post} /api/property 1 - Créer une propriété
 * @apiName createProperty
 * @apiGroup Propriété
 *
 * @apiHeader {String} Authorization
 *
 * @apiBody {String} title="Super Maison" Titre du bien
 * @apiBody {String} description="Vraiment super !" Description du bien
 * @apiBody {Number} amount="300000" Montant du bien
 * @apiBody {String} location="Amiens" Localisation du bien
 * @apiBody {String} propertyType="Maison" Type de bien
 * @apiBody {Number} surface="100" Surface du bien
 * @apiBody {Number} roomNumber="5" Nombre de pièce du bien
 * @apiBody {String} transactionType="Achat" Type de transaction du bien
 *
 * @apiBody {Array} lst_equipments={murs:4},{toit:1} Liste des équipements du bien
 * @apiBody {Array} lst_heater={hp:30},{hc:50} Liste des mesures de chauffage du bien
 * @apiBody {Array} lst_water={hot:40},{cold:10} Liste des mesures d'eau du bien
 * @apiBody {String} electricMeterRef="azertyuiop" Référence du compteur électrique du bien
 * @apiBody {String} gasMeterRef="azertyuiop2" Référence du compteur de gaz du bien
 *
 * @apiBody {Boolean} isToSell="true" Le bien est-il en vente ?
 * @apiBody {String} propertyRef="azertyuiop0" Référence du bien
 *
 * @apiSuccess {String} message Message de completion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 * 		"status_code": 201,
 *       	"message": "Propriété enregistrée.",
 *     }
 *
 * @apiError BodyValidationError Erreurs générales sur les formats de données.
 * @apiError ServerError Erreur serveur.
 */
const createProperty = async (req, res) => {
	try {
		// Gestion préalable des images:
		let imageUrl = {}
		if (req.filesName !== undefined) {
			Object.keys(req.filesName).forEach((imgKey) => {
				imageUrl[imgKey] = 'property/' + req.filesName[imgKey]
			})
		}

		// Création et enregistrement de la propriété:
		var newProperty = new Property({
			...req.body,
			isToSell: req.body.isToSell == 'on' ? true : false,
			imageUrl,
		})
		newProperty = await newProperty.save()
		// await sendAlert(req.body, newProperty._id.valueOf())
		res.status(201).json({
			status_code: 201,
			message: 'Propriété enregistrée.',
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {get} /api/property 3 - Récupérer toutes les propriétés
 * @apiName getAllProperties
 * @apiGroup Propriété
 *
 * @apiSuccess {Array} properties Liste de Propriétés
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *  		"status_code": 200,
 *       	"message": "Liste de Propriétés récupérée.",
 *       	"properties": {properties},
 *     }
 *
 * @apiError ServerError Erreur Serveur
 */
const getAllProperties = async (req, res) => {
	try {
		let properties = await Property.find()
		res.status(200).json({
			status_code: 200,
			message: 'Liste des propriétés récupérée.',
			properties,
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {get} /api/property/:id 3.1 - Récupérer une propriété
 * @apiName getPropertyById
 * @apiGroup Propriété
 *
 * @apiParam {ObjectId} _id ID de la propriété.
 *
 * @apiSuccess {Property} property Objet Propriété.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		"status_code": 200,
 *       	"message": "Propriété récupérée.",
 *       	"property": {property},
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 204 OK
 *
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 */
const getPropertyById = async (req, res) => {
	let data = Object.keys(req.params).length === 0 ? req.query : req.params

	try {
		let property = await Property.findById(data._id)
		if (property) {
			res.status(200).json({
				status_code: 200,
				message: 'Propriété récupérée.',
				property,
			})
		} else {
			res.status(204)
		}
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {put} /api/property/:_id 2 - Mettre à jour une propriété
 * @apiName updateProperty
 * @apiGroup Propriété
 *
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiParam {ObjectId} _id
 *
 * @apiBody {String} title="Super Maison"
 * @apiBody {String} description="Vraiment super !"
 * @apiBody {Number} amount="300000"
 * @apiBody {String} location="Amiens"
 * @apiBody {String} propertyType="Maison"
 * @apiBody {Number} surface="100"
 * @apiBody {Number} roomNumber="5"
 * @apiBody {String} transactionType="Achat"
 *
 * @apiBody {Array} lst_equipments={murs:4},{toit:1}
 * @apiBody {Array} lst_heater={hp:30},{hc:50}
 * @apiBody {Array} lst_water={hot:40},{cold:10}
 * @apiBody {String} electricMeterRef="azertyuiop"
 * @apiBody {String} gasMeterRef="azertyuiop2"
 *
 * @apiBody {Boolean} isToSell="true"
 * @apiBody {String} propertyRef="azertyuiop0"
 *
 * @apiSuccess {String} message Message de completion.
 * @apiSuccess {UserModel} data azertyuiop
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		"status_code": 200,
 *       	"message": "Propriété actualisée.",
 *     }
 *
 * @apiError PropertyValidationError Propriété non trouvée.
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError BodyValidationError Erreurs générales sur les formats de données.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample _idError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 * 		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"_id": "Propriété non trouvé."
 * 				}
 * 			]
 *     }
 */
const updateProperty = async (req, res) => {
	let datas = Object.keys(req.params).length === 0 ? req.query : req.params

	try {
		req.file
			? {
					...JSON.parse(req.body),
					imageUrl: `${req.protocol}://${req.get('host')}/uploads/${
						req.file.filename
					}`,
			  }
			: { ...req.body }

		await Property.updateOne(
			{ _id: datas._id },
			{
				...req.body,
			}
		)
		res.status(200).json({
			status_code: 200,
			message: 'Propriété modifiée !',
		})
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {delete} /api/property/:_id 4 - Supprimer une propriété
 * @apiName deleteProperty
 * @apiGroup Propriété
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id
 *
 * @apiSuccess {String} message Message de completion.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 * 		"status_code": 200,
 *       	"message": "Propriété supprimée !",
 *     }
 *
 * @apiError PropertyValidationError Propriété non trouvé.
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample _idError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 * 		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"_id": "Propriété non trouvé."
 * 				}
 * 			]
 *     }
 */
const deleteProperty = async (req, res) => {
	let data = Object.keys(req.params).length === 0 ? req.query : req.params

	try {
		// On récupère la propriété avec son Id
		let property = await Property.findById({ _id: data._id })

		// Si image existante, on supprime tout: (unlink need callback)
		if (property.imageUrl) {
			fs.unlink(
				'uploads/' + property.imageUrl.split('/uploads/')[1],
				async () => {
					await Property.deleteOne({ _id: req.params._id })
					return res.status(200).json({
						status_code: 200,
						message: 'Propriété et ses images supprimées !',
					})
				}
			)
		} else {
			await Property.deleteOne({ _id: req.params._id })
			return res.status(200).json({
				status_code: 200,
				message: 'Propriété supprimée.',
			})
		}
	} catch (error) {
		res.status(500).json({ status_code: 500, error: error.message })
	}
}

/**
 * @api {post} /api/property/searchProperties 3 - Rechercher des propriétés
 * @apiName searchProperties
 * @apiGroup Propriété
 *
 * @apiBody {String} search="Super Maison"
 * @apiBody {Number} minPrice="200000"
 * @apiBody {Number} maxPrice="300000"
 * @apiBody {String} propertyType="Maison"
 * @apiBody {Number} surfaceMin="80"
 * @apiBody {Number} surfaceMax="100"
 * @apiBody {Number} roomNumberMin="3"
 * @apiBody {Number} roomNumberMax="5"
 * @apiBody {String} transactionType="Achat"
 *
 * @apiSuccess {Array} properties Liste de Propriétés
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *  		"status_code": 200,
 *       	"message": "Propriétés filtrées.",
 *       	"data": {properties},
 *     }
 *
 * @apiError BodyValidationError Erreurs générales sur les formats de données.
 * @apiError ServerError Erreur Serveur
 */
const searchProperties = async (req, res) => {
	try {
		// Destructuration du body:
		const {
			transactionType,
			propertyType,
			location,
			minPrice,
			maxPrice,
			roomNumberMin,
			roomNumberMax,
			surfaceMin,
			surfaceMax,
			search,
		} = req.body

		// // Filtrage sur la localisation:
		// if (location !== '') {
		// 	where['transactionType'] = transactionType
		// }

		var queryCond = {}
		if (search) {
			queryCond.$or = [
				{
					title: {
						$regex: search,
						$options: 'i',
					},
				},
				{
					description: {
						$regex: search,
						$options: 'i',
					},
				},
			]
		}

		// Filtrage sur la surface:
		if (surfaceMin && surfaceMax) {
			// Filtrage sur le nombre de pièces max et nombre de pièces min:
			queryCond.surface = {
				$gte: parseInt(surfaceMin),
				$lte: parseInt(surfaceMax),
			}
		} else if (surfaceMin) {
			// Filtrage sur le nombre de pièces min:
			queryCond.surface = { $gte: parseInt(surfaceMin) }
		} else if (surfaceMax) {
			// Filtrage sur le nombre de pièces max:
			queryCond.surface = { $lte: parseInt(surfaceMax) }
		}

		// Filtrage sur le type de transaction:
		if (transactionType) {
			queryCond.transactionType = transactionType
		}

		// Filtrage sur le type de bien:
		if (propertyType) {
			queryCond.propertyType = propertyType
		}

		if (minPrice && maxPrice) {
			// Filtrage sur le prix max et prix min:
			queryCond.amount = {
				$gte: parseInt(minPrice),
				$lte: parseInt(maxPrice),
			}
		} else if (minPrice) {
			// Filtrage sur le prix min:
			queryCond.amount = { $gte: parseInt(minPrice) }
		} else if (maxPrice) {
			// Filtrage sur le prix max:
			queryCond.amount = { $lte: parseInt(maxPrice) }
		}

		// Filtrage sur le nombre de pièces:
		if (roomNumberMin && roomNumberMax) {
			// Filtrage sur le nombre de pièces max et nombre de pièces min:
			queryCond.roomNumber = {
				$gte: parseInt(roomNumberMin),
				$lte: parseInt(roomNumberMax),
			}
		} else if (roomNumberMin) {
			// Filtrage sur le nombre de pièces min:
			queryCond.roomNumber = { $gte: parseInt(roomNumberMin) }
		} else if (roomNumberMax) {
			// Filtrage sur le nombre de pièces max:
			queryCond.roomNumber = { $lte: parseInt(roomNumberMax) }
		}

		// Appel de la méthode avec la moitié des filtres:
		let properties = await Property.find(queryCond)

		// Filtrage sur la localisation:
		if (location !== '') {
			properties = properties.filter(
				(property) => property.location == location
			)
		}

		res.status(200).json({
			status_code: 200,
			message: 'Propriétés filtrées.',
			data: properties,
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

// SENDALERT (Intervient dans create)
const sendAlert = async (datas, newId) => {
	try {
		const buyers = await User.find({ buyer: { $exists: true } })

		await asyncForEach(buyers, async (buyer) => {
			let preferences = buyer.buyer
			if (
				(preferences.budgetMin &&
					preferences.budgetMin <= datas.amount) ||
				(preferences.budgetMax &&
					preferences.budgetMax >= datas.amount) ||
				(preferences.city && preferences.city === datas.location) ||
				(preferences.surfaceMin &&
					preferences.surfaceMin <= datas.surface) ||
				(preferences.surfaceMax &&
					preferences.surfaceMax >= datas.surface) ||
				(preferences.type && preferences.type === datas.propertyType)
			) {
				sendMail('sendAlert', {
					to: buyer.email,
					amount: datas.amount,
					city: datas.location,
					surface: datas.surface,
					type: datas.propertyType,
					idProperty: newId,
				})
			}
		})
	} catch (error) {
		console.log("Echec lors de l'envoi du mail:", error.message)
	}
}

/**
 * @api {put} /api/property/equipment/:_id 7 - Ajouter un équipement
 * @apiName addEquipment
 * @apiGroup Propriété
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id id de la propriété
 *
 * @apiBody {String} name nom de l'équipement
 *
 * @apiSuccess {String} message équipement ajouté !
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Equipement ajouté !',
 *     }
 *
 * @apiError PropertyValidationError Propriété non trouvé.
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample _idError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 * 		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"_id": "Propriété non trouvé."
 * 				}
 * 			]
 *     }
 */
const addEquipment = async (req, res) => {
	try {
		await Property.updateOne(
			{ _id: req.params._id },
			{
				$push: {
					list_equipments: [req.body.name],
				},
			}
		)
		res.status(200).json({
			status_code: 200,
			message: 'Equipement ajouté à la liste !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {delete} /api/property/equipment/:_id 8 - Supprimer un équipement
 * @apiName removeEquipment
 * @apiGroup Propriété
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id id de la propriété
 *
 * @apiBody {String} name nom de l'équipement à supprimer
 *
 * @apiSuccess {String} message equipement supprimé de la liste
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Equipement supprimé de la liste',
 *     }
 *
 * @apiError PropertyValidationError Propriété non trouvé.
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample _idError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 * 		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"_id": "Propriété non trouvé."
 * 				}
 * 			]
 *     }
 */
const removeEquipment = async (req, res) => {
	try {
		await Property.updateOne(
			{ _id: req.params._id },
			{
				$pull: {
					list_equipments: req.body.name,
				},
			}
		)
		res.status(200).json({
			status_code: 200,
			message: 'Equipement supprimé de la liste !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {put} /api/property/heater/:_id 5 - Ajouter un chauffage
 * @apiName addHeater
 * @apiGroup Propriété
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id id de la propriété
 *
 * @apiBody {String} name nom du chauffage
 * @apiBody {Number} quantity nombre de chauffage
 *
 * @apiSuccess {String} message chauffage ajouté !
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Chauffage ajouté !',
 *     }
 *
 * @apiError PropertyValidationError Propriété non trouvé.
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample _idError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 * 		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"_id": "Propriété non trouvé."
 * 				}
 * 			]
 *     }
 */
const addHeater = async (req, res) => {
	try {
		await Property.updateOne(
			{ _id: req.params._id },
			{
				$push: {
					list_heater: [
						{ name: req.body.name, quantity: req.body.quantity },
					],
				},
			}
		)
		res.status(200).json({
			status_code: 200,
			message: 'Chauffage ajouté à la liste !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

/**
 * @api {delete} /api/property/heater/:_id 6 - Supprimer un chauffage
 * @apiName removeHeater
 * @apiGroup Propriété
 *
 * @apiHeader {String} Authorization
 *
 * @apiParam {ObjectId} _id id de la propriété
 *
 * @apiBody {String} name nom de l'chauffage à supprimer
 *
 * @apiSuccess {String} message equipement supprimé de la liste
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "message": 'Chauffage supprimé de la liste',
 *     }
 *
 * @apiError PropertyValidationError Propriété non trouvé.
 * @apiError ParamValidationError Erreur sur le format de l'identiant en paramêtre.
 * @apiError ServerError Erreur serveur.
 *
 * @apiErrorExample _idError:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 * 		"status_code": 422,
 * 		"message": "La validation à échouée.",
 *       	"errors": [
 * 				{
 * 					"_id": "Propriété non trouvé."
 * 				}
 * 			]
 *     }
 */
const removeHeater = async (req, res) => {
	try {
		await Property.updateOne(
			{ _id: req.params._id },
			{
				$pull: {
					list_heater: { name: { $eq: req.body.name } },
				},
			}
		)
		res.status(200).json({
			status_code: 200,
			message: 'Chauffage supprimé de la liste !',
		})
	} catch (error) {
		res.status(500).json({
			status_code: 500,
			error: error.message,
		})
	}
}

export {
	createProperty,
	getAllProperties,
	getPropertyById,
	updateProperty,
	deleteProperty,
	searchProperties,
	addEquipment,
	removeEquipment,
	addHeater,
	removeHeater,
}
