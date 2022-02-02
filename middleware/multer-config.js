import multer from 'multer'

const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
}

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'uploads')
	},
	filename: (req, file, callback) => {
		let datas = Object.keys(req.body).length === 0 ? req.query : req.body
		const name = datas.propertyRef + '-' + file.fieldname
		const extension = MIME_TYPES[file.mimetype]
		callback(null, name + '-' + Date.now() + '.' + extension)
	},
})

export default multer({ storage: storage }).fields([
	{ name: 'photo1' },
	{ name: 'photo2' },
	{ name: 'photo3' },
	{ name: 'photo4' },
	{ name: 'photo5' },
])
