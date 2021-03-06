const jwt = require('jsonwebtoken');

const userModel = require('../model/userModel');
const userAccountModel = require('../model/userAccountModel');
const userClubMapModel = require('../model/userClubMapModel');
const userDetailModel = require('../model/userDetailModel');

const tokenValues = require('../config/token');


const userService = {
	/* params = {username, password} */
	/* results = {userId} */
	createUser: (params) => {
		/*
		 a) create a new 'user'
		 b) create a new 'user_detail' with the same [id] as 'user'
		 &  create a new 'user_balance' with the same [id] as 'user'
		 */
		let userId = null;
		return userModel.create(params)
			.then((result) => {
				userId = result.insertId;

				return Promise.all([
					userDetailModel.create({id: userId}),
					userAccountModel.create({id: userId, balance: 0})
				]);
			})
			.then(() => {
				return {userId: userId};
			});
	},

	/* params = {username, password} */
	/* results = {id, username, token} */
	logIn: (params) => {
		/*
		 a) get 'user' with [username]
		 b) verify the [password]
		 c) update the [last_login]
		 d) generate token
		 */
		let userId = null;
		return userModel.findOneByUsername(params)
			.then((results) => {
				if (results.length == 0) {
					return Promise.reject(new Error('no such user'));
				}

				const user = results[0];
				if (user.password != params.password) {
					return Promise.reject(new Error('wrong password.'));
				}

				userId = results[0].id;

				return userModel.updateLastLoginTimeById({id: userId});
			})
			.then(() => {
				const token = jwt.sign({
					id: userId,
					username: params.username
				}, tokenValues.TOKEN_SECRET, {expiresIn: tokenValues.TOKEN_EXPIRATION});

				return {id: userId, username: params.username, token: token};
			})
	},

	/* params = {activity_id} */
	/* results = {participants} */
	getAllParticipantsByActivityId: (params) => {
		/*
		 a) get all 'user' by [activity_id], using 'user_activity_map'
		 */
		return userModel.findAllByActivityId(params)
			.then((results) => {
				return {participants: results};
			});
	},

	/* params = {club_id} */
	/* results = {members} */
	getAllMembersByClubId: (params) => {
		/*
		 a) get all 'user' by [club_id]
		 */
		return userModel.findAllByClubId(params)
			.then((results) => {
				return {members: results};
			});
	},

	/* params = {club_id} */
	/* results = {admins} */
	getAllAdminsByClubId: (params) => {
		/*
		 a) get all admin 'user' by [club_id]
		 */
		return userClubMapModel.findAllAdminsByClubId(params)
			.then((results) => {
				return {admins: results};
			});
	},

};

module.exports = userService;
