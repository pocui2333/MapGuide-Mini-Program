const db = uniCloud.database()
module.exports = {
	getMapPoints: async () => {
		return await db.collection('mapPoints').field({
			_id:false
		}).get()
	}
}
