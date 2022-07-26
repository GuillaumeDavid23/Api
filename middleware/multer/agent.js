import multer from 'multer'

const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
}

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'public/avatar')
	},
	filename: (req, file, callback) => {
		let _id =
			Object.keys(req.body).length === 0 ? req.query._id : req.body._id
		const extension = MIME_TYPES[file.mimetype]
		let fullFileName = _id + '.png'
		callback(null, fullFileName)
	},
})

export default multer({ storage: storage }).fields([{ name: 'photo' }])
