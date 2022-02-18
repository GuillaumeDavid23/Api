import express from 'express'
import * as TC from '../controllers/transaction.js'
import auth from '../middleware/auth.js'
import checkAccess from '../middleware/checkAccess.js'
import {
	checkTransactionBody,
	checkTransactionExistence,
} from '../middleware/validation/transaction.js'
import {
	validateParamId,
	validation,
} from '../middleware/validation/validation.js'

const router = express.Router()

//(Update) Ajout d'un vendeur dans lst_buyer
router.put('/buyer/:_id', auth, checkAccess(['agent']), TC.addBuyer)

//(Delete) Suppression d'un vendeur dans lst_buyer
router.delete('/buyer/:_id', auth, checkAccess(['agent']), TC.removeBuyer)

//(Update) Ajout d'un vendeur dans lst_seller
router.put('/seller/:_id', auth, checkAccess(['agent']), TC.addSeller)

//(Delete) Suppression d'un vendeur dans lst_seller
router.delete('/seller/:_id', auth, checkAccess(['agent']), TC.removeSeller)

//(Create) Création d'une transaction
router.post(
	'/',
	auth,
	checkAccess(['agent']),
	checkTransactionBody(),
	validation,
	TC.create
)

//(Update) Mise à jour d'une transaction
router.put(
	'/:_id',
	auth,
	checkAccess(['agent']),
	checkTransactionExistence(),
	checkTransactionBody(),
	validation,
	TC.update
)

//(Delete) Suppression d'une transaction
router.delete(
	'/:_id',
	auth,
	checkAccess(['agent']),
	checkTransactionExistence(),
	validation,
	TC.erase
)

//(Get) Récuperation de toutes les transactions
router.get('/', auth, checkAccess(['agent']), TC.getAll)

//(Get) Récuperation d'une transaction
router.get(
	'/:_id',
	auth,
	checkAccess(['agent']),
	validateParamId(),
	validation,
	TC.getOne
)

export default router
