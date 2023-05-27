import { setStorage, getStorage } from '@/utils/storage.js'

const mapPoints = 'mapPoints'
const mapTypes = 'types'
const mapPosition = 'defaultPosition'

const getPoints = async () => {
	const loadMapPoints = uniCloud.importObject('loadMapPoints')
	return await loadMapPoints.getMapPoints()
}

const getConfigs = async () => {
	const normalConfig = uniCloud.importObject('normalConfig')
	return await normalConfig.getMapConfig()
}

export const getAllPoints = async () => {
	let allPoints = getStorage(mapPoints);
	if (allPoints) return allPoints;
	try {
	  allPoints = await getPoints();
	  if (allPoints) {
		setStorage(mapPoints, allPoints, 1);
	  }
	} catch (err) {
	  throw new Error('获取数据失败' + err);
	}
	return allPoints;
}

export const getAllConfigs = async () => {
	const types = getStorage(mapTypes);
	const defaultPosition = getStorage(mapPosition);

	if (types && defaultPosition) {
	  return { defaultPosition, types };
	}

	try {
	  const allConfigs = await getConfigs();
	  if (allConfigs) {
		setStorage(mapTypes, allConfigs.types, 24);
		setStorage(mapPosition, allConfigs.defaultPosition, 24);
		return allConfigs;
	  }
	} catch (err) {
	  throw new Error('获取数据失败' + err);
	}
}