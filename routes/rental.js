import express from 'express'
import stuffCtrl from '../controllers/stuff'
import auth from '../middleware/auth'

const router = express.Router()

router.post('/', auth, stuffCtrl.createThing)
router.put('/:id', auth, stuffCtrl.modifyThing)
router.delete('/:id', auth, stuffCtrl.deleteThing)
router.get('/:id', auth, stuffCtrl.getOneThing)
router.get('/', auth, stuffCtrl.getAllThings)

module.exports = router