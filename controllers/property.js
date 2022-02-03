import Property from '../models/Property.js'
import Buyer from '../models/Buyer.js'
import nodemailer from 'nodemailer'
import fs from 'fs'
import { asyncForEach } from '../util/functions.js'

// CREATE
/**
 * @api {post} /api/property Créer une propriété
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
 *       "message": "Propriété enregistrée !"",
 *     }
 *
 * @apiError 400 Propriété non crée.
 * @apiError (Erreur 500) ServerError Erreur sur le Serveur.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *       "error": "Propriété non crée !"
 *     }
 */
const createProperty = (req, res) => {
	const newProperty = new Property({
		...req.body,
		isToSell: req.body.isToSell == 'on' ? true : false,
		imageUrl: `${req.protocol}://${req.get('host')}/uploads/${
			req.body.propertyRef
		}`,
	})

	newProperty
		.save()
		.then(() => {
			sendAlert(datas)
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
 * @apiGroup Propriété
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
 * @apiGroup Propriété
 *
 * @apiParam {ObjectId} _id ID de la propriété.
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
	let data = Object.keys(req.params).length === 0 ? req.query : req.params

	try {
		let property = await Property.findById(data._id)
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
 *       "message": "Propriété actualisée !",
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
	let datas = Object.keys(req.params).length === 0 ? req.query : req.params
	console.log(datas)
	const property = req.file
		? {
				...JSON.parse(req.body),
				imageUrl: `${req.protocol}://${req.get('host')}/uploads/${
					req.file.filename
				}`,
		  }
		: { ...req.body }

	Property.updateOne(
		{ _id: datas._id },
		{
			...req.body,
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
/**
 * @api {delete} /api/property/:_id Supprimer une propriété
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
 *       "message": "Propriété supprimée !",
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
const deleteProperty = async (req, res) => {
	let data = Object.keys(req.params).length === 0 ? req.query : req.params

	try {
		// On récupère la propriété avec son Id
		let property = await Property.findById({ _id: data._id })

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

// SENDALERT (Intervient dans create)
const sendAlert = async (datas) => {
	try {
		const buyers = await Buyer.find()

		await asyncForEach(buyers, async (buyer) => {
			if (
				(buyer.budgetMin ||
					buyer.budgetMax ||
					buyer.city ||
					buyer.surfaceMin ||
					buyer.surfaceMax ||
					buyer.type) &&
				(!buyer.budgetMin || buyer.budgetMin <= datas.amount) &&
				(!buyer.budgetMax || buyer.budgetMax >= datas.amount) &&
				(!buyer.city || buyer.city === datas.localisation) &&
				(!buyer.surfaceMin || buyer.surfaceMin <= datas.surface) &&
				(!buyer.surfaceMax || buyer.surfaceMax >= datas.surface) &&
				(!buyer.type || buyer.type === datas.propertyType)
			) {
				// create reusable transporter object using the default SMTP transport
				let transporter = nodemailer.createTransport({
					host: 'smtp.gmail.com',
					port: 465,
					secure: true, // true for 465, false for other ports
					auth: {
						user: 'mancheronv@gmail.com', // generated ethereal user
						pass: '#fg3rTxFninqL!TnrBdPjXoC$Poi38K5habrtq8G', // generated ethereal password
					},
				})

				// send mail with defined transport object
				let info = await transporter.sendMail({
					from: '"Fred Foo 👻" <mancheronv@gmail.com>', // sender address
					to: 'vmancheron@yahoo.fr', // list of receivers
					subject: 'Hello ✔', // Subject line
					text: 'Hello world?', // plain text body
					html: '<b>Hello world?</b>', // html body
				})

				console.log('Message sent: %s', info.messageId)
				// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
			}
		})
	} catch (error) {
		console.log(error)
	}
}

export {
	createProperty,
	getAllProperties,
	getPropertyById,
	updateProperty,
	deleteProperty,
}
