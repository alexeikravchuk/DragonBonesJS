/**
 * - The Point object represents a location in a two-dimensional coordinate system.
 * @version DragonBones 3.0
 * @language en_US
 */
export class Point {
	/**
	 * - The horizontal coordinate.
	 * @default 0.0
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	x;

	/**
	 * - The vertical coordinate.
	 * @default 0.0
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	y;

	/**
	 * - Creates a new point. If you pass no parameters to this method, a point is created at (0,0).
	 * @param x - The horizontal coordinate.
	 * @param y - The vertical coordinate.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	constructor(x = 0.0, y = 0.0) {
		this.x = x;
		this.y = y;
	}

	/**
	 * @private
	 */
	copyFrom(value) {
		this.x = value.x;
		this.y = value.y;
	}

	/**
	 * @private
	 */
	clear() {
		this.x = this.y = 0.0;
	}
}
