import { BaseObject } from '../core/BaseObject';

/**
 * - The DragonBones data.
 * A DragonBones data contains multiple armature data.
 * @see dragonBones.ArmatureData
 * @version DragonBones 3.0
 * @language en_US
 */

export class DragonBonesData extends BaseObject {
	static toString() {
		return '[class dragonBones.DragonBonesData]';
	}

	/**
	 * @private
	 */
	autoSearch;

	/**
	 * - The animation frame rate.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	frameRate;

	/**
	 * - The data version.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	version;

	/**
	 * - The DragonBones data name.
	 * The name is consistent with the DragonBones project name.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	name;

	/**
	 * @private
	 */
	stage;

	/**
	 * @internal
	 */
	frameIndices = [];

	/**
	 * @internal
	 */
	cachedFrames = [];

	/**
	 * - All armature data names.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	armatureNames = [];

	/**
	 * @private
	 */
	armatures = {};

	/**
	 * @internal
	 */
	binary;

	/**
	 * @internal
	 */
	intArray;

	/**
	 * @internal
	 */
	floatArray;

	/**
	 * @internal
	 */
	frameIntArray;

	/**
	 * @internal
	 */
	frameFloatArray;

	/**
	 * @internal
	 */
	frameArray;

	/**
	 * @internal
	 */
	timelineArray;

	/**
	 * @internal
	 */
	colorArray;

	/**
	 * @private
	 */
	userData = null; // Initial value.

	_onClear() {
		for (let k in this.armatures) {
			this.armatures[k].returnToPool();
			delete this.armatures[k];
		}

		if (this.userData !== null) {
			this.userData.returnToPool();
		}

		this.autoSearch = false;
		this.frameRate = 0;
		this.version = '';
		this.name = '';
		this.stage = null;
		this.frameIndices.length = 0;
		this.cachedFrames.length = 0;
		this.armatureNames.length = 0;
		//this.armatures.clear();
		this.binary = null; //
		this.intArray = null; //
		this.floatArray = null; //
		this.frameIntArray = null; //
		this.frameFloatArray = null; //
		this.frameArray = null; //
		this.timelineArray = null; //
		this.colorArray = null; //
		this.userData = null;
	}

	/**
	 * @internal
	 */
	addArmature(value) {
		if (value.name in this.armatures) {
			console.warn('Same armature: ' + value.name);
			return;
		}

		value.parent = this;
		this.armatures[value.name] = value;
		this.armatureNames.push(value.name);
	}

	/**
	 * - Get a specific armature data.
	 * @param armatureName - The armature data name.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	getArmature(armatureName) {
		return armatureName in this.armatures ? this.armatures[armatureName] : null;
	}
}
