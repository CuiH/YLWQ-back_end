const query = require('../util/mysqlPool');

const userActivityMapSql = require('../sql/userActivityMapSql');


const userActivityMapModel = {
	/* params = {activity_id, user_id} */
	create: (params, callback) => {
		const now = new Date();
		query(userActivityMapSql.insert, [params.user_id, params.activity_id, now],
			(err, results, fields) => {
				if (err) {
					return callback(err, null);
				}

				callback(null, results);
			}
		);
	},

	/* params = {activity_id} */
	findAllByActivityId: (params, callback) => {
		query(userActivityMapSql.selectAllByActivityId, [params.activity_id],
			(err, results, fields) => {
				if (err) {
					return callback(err, null);
				}

				callback(null, results);
			}
		);
	},

	/* params = {user_id} */
	findAllByUserId: (params, callback) => {
		query(userActivityMapSql.selectAllByUserId, [params.user_id],
			(err, results, fields) => {
				if (err) {
					return callback(err, null);
				}

				callback(null, results);
			}
		);
	},

	/* params = {user_id, activity_id} */
	findOneByUserIdAndActivityId: (params, callback) => {
		query(userActivityMapSql.selectOneByUserIdAndActivityId, [params.user_id, params.activity_id],
			(err, results, fields) => {
				if (err) {
					return callback(err, null);
				}

				callback(null, results);
			}
		);
	}
};

module.exports = userActivityMapModel;
