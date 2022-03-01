import multer from 'multer'

const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
}

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'public/uploads')
	},
	filename: (req, file, callback) => {
		let datas = Object.keys(req.body).length === 0 ? req.query : req.body
		const name = datas.propertyRef + '-' + file.fieldname
		const extension = MIME_TYPES[file.mimetype]
		let fullFileName = name + '-' + Date.now() + '.' + extension
		callback(null, fullFileName)

		// Insertion des noms de fichiers dans la requête:
		if (req.filesName === undefined) req.filesName = {}
		req.filesName[file.fieldname] = fullFileName
	},
})

export default multer({ storage: storage }).fields([
	{ name: 'photo1' },
	{ name: 'photo2' },
	{ name: 'photo3' },
	{ name: 'photo4' },
	{ name: 'photo5' },
])
