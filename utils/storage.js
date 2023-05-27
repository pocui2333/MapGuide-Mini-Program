//暂时没用到，先封装上
const clearStorage = () => {
	return uni.clearStorage()
}

const removeStorage = (key) => {
	return uni.removeStorage({
		key
	})
}

export const setStorage = (key, data, expiration = 1) => {
	const now = new Date().getTime()
	const cacheData = {
		data,
		expiration: now * 4 * 3600
	}
	const jsonData = JSON.stringify(cacheData)
	return uni.setStorage({
		key,
		data:jsonData
	})
}

export const getStorage = (key) => {
	const cache = uni.getStorageSync( key )
	if(!cache) return null
	const cacheData = JSON.parse(cache)
	if (cacheData.expiration && new Date().getTime() > cacheData.expiration) {
	    removeStorage(key)
	    return null
	}
	return cacheData.data
}