import express from 'express'
import {
	create,
	update,
	erase,
	getAll,
	getOne,
	addBuyer,
	removeBuyer,
	addSeller,
	removeSeller,
} from '../controllers/transaction.js'
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
router.put('/buyer/:_id', auth, checkAccess(['seller', 'agent']), addBuyer)

//(Delete) Suppression d'un vendeur dans lst_buyer
router.delete(
	'/buyer/:_id',
	auth,
	checkAccess(['seller', 'agent']),
	removeBuyer
)

//(Update) Ajout d'un vendeur dans lst_seller
router.put('/seller/:_id', auth, checkAccess(['seller', 'agent']), addSeller)

//(Delete) Suppression d'un vendeur dans lst_seller
router.delete(
	'/seller/:_id',
	auth,
	checkAccess(['seller', 'agent']),
	removeSeller
)

//(Create) Création d'une transaction
router.post('/', checkTransactionBody(), validation, create)

//(Update) Mise à jour d'une transaction
router.put(
	'/:_id',
	auth,
	checkTransactionExistence(),
	checkTransactionBody(),
	validation,
	update
)

//(Delete) Suppression d'une transaction
router.delete('/:_id', auth, checkTransactionExistence(), validation, erase)

//(Get) Récuperer toutes les transactions
router.get('/', auth, getAll)

//(Get) Récuperer une transaction
router.get('/:_id', auth, validateParamId(), validation, getOne)

export default router
