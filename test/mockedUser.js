import mongoose from 'mongoose'
const global_id = new mongoose.Types.ObjectId()

const tmp_user_ok = {
	firstname: 'dummy',
	lastname: 'dummy',
	email: 'ok@dummy.com',
	password: 'Dummydummy69',
	newsletter: true,
	status: true,
}

const tmp_user_pasconfirme = {
	firstname: 'dummy',
	lastname: 'dummy',
	email: 'pasconfirme@dummy.com',
	password: 'Dummydummy69',
	newsletter: true,
}

const tmp_user_desac = {
	firstname: 'dummy',
	lastname: 'dummy',
	email: 'desac@dummy.com',
	password: 'Dummydummy69',
	newsletter: true,
	deletedAt: '2022-01-01T10:00:00',
}

const tmp_seller_acreer = {
	firstname: 'dummy',
	lastname: 'dummy',
	email: 'seller_acreer@dummy.com',
	password: 'Dummydummy69',
	newsletter: true,
	seller: {
		propertiesList: [],
	},
}
const tmp_buyer_acreer = {
	firstname: 'dummy',
	lastname: 'dummy',
	email: 'buyer_acreer@dummy.com',
	password: 'Dummydummy69',
	newsletter: true,
	buyer: {
		wishlist: [],
	},
}

export {
	tmp_user_ok,
	tmp_user_pasconfirme,
	tmp_user_desac,
	tmp_seller_acreer,
	tmp_buyer_acreer,
}
