    /**
     * - A Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its
     * width and its height.<br/>
     * The x, y, width, and height properties of the Rectangle class are independent of each other; changing the value of
     * one property has no effect on the others. However, the right and bottom properties are integrally related to those
     * four properties. For example, if you change the value of the right property, the value of the width property changes;
     * if you change the bottom property, the value of the height property changes.
     * @version DragonBones 3.0
     * @language en_US
     */
export class Rectangle {
	/**
	 * - The x coordinate of the top-left corner of the rectangle.
	 * @default 0.0
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	x;

	/**
	 * - The y coordinate of the top-left corner of the rectangle.
	 * @default 0.0
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	y;

	/**
	 * - The width of the rectangle, in pixels.
	 * @default 0.0
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	width;

	/**
	 * - The height of the rectangle, in pixels.
	 * @default 0.0
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	height;

	/**
	 * @private
	 */
	constructor(x = 0.0, y = 0.0, width = 0.0, height = 0.0) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	/**
	 * @private
	 */
	copyFrom(value) {
		this.x = value.x;
		this.y = value.y;
		this.width = value.width;
		this.height = value.height;
	}

	/**
	 * @private
	 */
	clear() {
		this.x = this.y = 0.0;
		this.width = this.height = 0.0;
	}
}
