import { BaseObject } from '../core/BaseObject';
import { ActionType } from '../core/DragonBones';

/**
 * - The user custom data.
 * @version DragonBones 5.0
 * @language en_US
 */

export class UserData extends BaseObject {
	static toString() {
		return '[class dragonBones.UserData]';
	}

	/**
	 * - The custom int numbers.
	 * @version DragonBones 5.0
	 * @language en_US
	 */
	ints = [];

	/**
	 * - The custom float numbers.
	 * @version DragonBones 5.0
	 * @language en_US
	 */
	floats = [];

	/**
	 * - The custom strings.
	 * @version DragonBones 5.0
	 * @language en_US
	 */
	strings = [];

	_onClear() {
		this.ints.length = 0;
		this.floats.length = 0;
		this.strings.length = 0;
	}

	/**
	 * @internal
	 */
	addInt(value) {
		this.ints.push(value);
	}

	/**
	 * @internal
	 */
	addFloat(value) {
		this.floats.push(value);
	}

	/**
	 * @internal
	 */
	addString(value) {
		this.strings.push(value);
	}

	/**
	 * - Get the custom int number.
	 * @version DragonBones 5.0
	 * @language en_US
	 */
	getInt(index = 0) {
		return index >= 0 && index < this.ints.length ? this.ints[index] : 0;
	}

	/**
	 * - Get the custom float number.
	 * @version DragonBones 5.0
	 * @language en_US
	 */
	getFloat(index = 0) {
		return index >= 0 && index < this.floats.length ? this.floats[index] : 0.0;
	}

	/**
	 * - Get the custom string.
	 * @version DragonBones 5.0
	 * @language en_US
	 */
	getString(index = 0) {
		return index >= 0 && index < this.strings.length ? this.strings[index] : '';
	}
}

/**
 * @private
 */
export class ActionData extends BaseObject {
	static toString() {
		return '[class dragonBones.ActionData]';
	}

	type;
	name; // Frame event name | Sound event name | Animation name
	bone;
	slot;
	data = null; //

	_onClear() {
		if (this.data !== null) {
			this.data.returnToPool();
		}

		this.type = ActionType.Play;
		this.name = '';
		this.bone = null;
		this.slot = null;
		this.data = null;
	}
}
