import { BaseObject } from '../core/BaseObject';

/**
 * - The skin data, typically a armature data instance contains at least one skinData.
 * @version DragonBones 3.0
 * @language en_US
 */
export class SkinData extends BaseObject {

	/**
	 * - The skin name.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	name;

	/**
	 * @private
	 */
	displays = {};

	/**
	 * @private
	 */
	parent;

	_onClear() {
		for (let k in this.displays) {
			const slotDisplays = this.displays[k];
			for (const display of slotDisplays) {
				if (display !== null) {
					display.returnToPool();
				}
			}

			delete this.displays[k];
		}

		this.name = '';
		// this.displays.clear();
		this.parent = null; //
	}

	/**
	 * @internal
	 */
	addDisplay(slotName, value) {
		if (!(slotName in this.displays)) {
			this.displays[slotName] = [];
		}

		if (value !== null) {
			value.parent = this;
		}

		const slotDisplays = this.displays[slotName]; // TODO clear prev
		slotDisplays.push(value);
	}

	/**
	 * @private
	 */
	getDisplay(slotName, displayName) {
		const slotDisplays = this.getDisplays(slotName);
		if (slotDisplays !== null) {
			for (const display of slotDisplays) {
				if (display !== null && display.name === displayName) {
					return display;
				}
			}
		}

		return null;
	}

	/**
	 * @private
	 */
	getDisplays(slotName) {
		if (!(slotName in this.displays)) {
			return null;
		}

		return this.displays[slotName];
	}
}
