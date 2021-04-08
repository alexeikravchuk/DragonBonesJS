/**
 * - The BaseObject is the base class for all objects in the DragonBones framework.
 * All BaseObject instances are cached to the object pool to reduce the performance consumption of frequent requests for memory or memory recovery.
 * @version DragonBones 4.5
 * @language en_US
 */
export class BaseObject {
	static _hashCode = 0;
	static _defaultMaxCount = 3000;
	static _maxCountMap = {};
	static _poolsMap = {};

	static _returnObject(object) {
		const classType = String(object.constructor);
		const maxCount =
			classType in BaseObject._maxCountMap
				? BaseObject._maxCountMap[classType]
				: BaseObject._defaultMaxCount;
		const pool = (BaseObject._poolsMap[classType] = BaseObject._poolsMap[classType] || []);
		if (pool.length < maxCount) {
			if (!object._isInPool) {
				object._isInPool = true;
				pool.push(object);
			} else {
				console.warn('The object is already in the pool.');
			}
		} else {
		}
	}

	/**
	 * - Set the maximum cache count of the specify object pool.
	 * @param objectConstructor - The specify class. (Set all object pools max cache count if not set)
	 * @param maxCount - Max count.
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	static setMaxCount(objectConstructor, maxCount) {
		if (maxCount < 0 || maxCount !== maxCount) {
			// isNaN
			maxCount = 0;
		}

		if (objectConstructor !== null) {
			const classType = String(objectConstructor);
			const pool = classType in BaseObject._poolsMap ? BaseObject._poolsMap[classType] : null;
			if (pool !== null && pool.length > maxCount) {
				pool.length = maxCount;
			}

			BaseObject._maxCountMap[classType] = maxCount;
		} else {
			BaseObject._defaultMaxCount = maxCount;

			for (let classType in BaseObject._poolsMap) {
				const pool = BaseObject._poolsMap[classType];
				if (pool.length > maxCount) {
					pool.length = maxCount;
				}

				if (classType in BaseObject._maxCountMap) {
					BaseObject._maxCountMap[classType] = maxCount;
				}
			}
		}
	}

	/**
	 * - Clear the cached instances of a specify object pool.
	 * @param objectConstructor - Specify class. (Clear all cached instances if not set)
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	static clearPool(objectConstructor = null) {
		if (objectConstructor !== null) {
			const classType = String(objectConstructor);
			const pool = classType in BaseObject._poolsMap ? BaseObject._poolsMap[classType] : null;
			if (pool !== null && pool.length > 0) {
				pool.length = 0;
			}
		} else {
			for (let k in BaseObject._poolsMap) {
				const pool = BaseObject._poolsMap[k];
				pool.length = 0;
			}
		}
	}

	/**
	 * - Get an instance of the specify class from object pool.
	 * @param objectConstructor - The specify class.
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	static borrowObject(objectConstructor) {
		const classType = String(objectConstructor);
		const pool = classType in BaseObject._poolsMap ? BaseObject._poolsMap[classType] : null;
		if (pool !== null && pool.length > 0) {
			const object = pool.pop();
			object._isInPool = false;
			return object;
		}

		const object = new objectConstructor();
		object._onClear();
		return object;
	}

	/**
	 * - A unique identification number assigned to the object.
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	hashCode = BaseObject._hashCode++;
	_isInPool = false;

	_onClear() {}

	/**
	 * - Clear the object and return it back to object pool。
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	returnToPool() {
		this._onClear();
		BaseObject._returnObject(this);
	}
}
