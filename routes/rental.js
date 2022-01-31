import { Router } from 'express'
import {
	createOne,
	updateOne,
	deleteOne,
	getAll,
	getOne,
} from '../controllers/reportType.js'

const router = Router()

router.post('/createOne', createOne)
router.put('/updateOne/:id', updateOne)
router.delete('/deleteOne/:id', deleteOne)
router.get('/getAll', getAll)
router.get('/getOne/:id', getOne)

export default router
