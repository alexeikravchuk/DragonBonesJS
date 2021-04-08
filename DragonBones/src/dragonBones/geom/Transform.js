/**
 * - 2D Transform.
 * @version DragonBones 3.0
 * @language en_US
 */
export class Transform {
	/**
	 * @private
	 */
	static PI = Math.PI;

	/**
	 * @private
	 */
	static PI_D = Math.PI * 2.0;

	/**
	 * @private
	 */
	static PI_H = Math.PI / 2.0;

	/**
	 * @private
	 */
	static PI_Q = Math.PI / 4.0;

	/**
	 * @private
	 */
	static RAD_DEG = 180.0 / Math.PI;

	/**
	 * @private
	 */
	static DEG_RAD = Math.PI / 180.0;

	/**
	 * @private
	 */
	static normalizeRadian(value) {
		value = (value + Math.PI) % (Math.PI * 2.0);
		value += value > 0.0 ? -Math.PI : Math.PI;

		return value;
	}

	/**
	 * - Horizontal translate.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	x;

	/**
	 * - Vertical translate.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	_y;
	

	get y() {
		return this._y;
	}

	set y(value) {
		this._y = value;
		// if(isNaN(value)) {
		// 	debugger;
		// }
	}

	/**
	 * - Skew. (In radians)
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	skew;

	/**
	 * - rotation. (In radians)
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	rotation;

	/**
	 * - Horizontal Scaling.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	scaleX;

	/**
	 * - Vertical scaling.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	scaleY;

	/**
	 * @private
	 */
	constructor(x = 0.0, y = 0.0, skew = 0.0, rotation = 0.0, scaleX = 1.0, scaleY = 1.0) {
		this.x = x;
		this.y = y;
		this.skew = skew;
		this.rotation = rotation;
		this.scaleX = scaleX;
		this.scaleY = scaleY;
	}

	/**
	 * @private
	 */
	copyFrom(value) {
		this.x = value.x;
		this.y = value.y;
		this.skew = value.skew;
		this.rotation = value.rotation;
		this.scaleX = value.scaleX;
		this.scaleY = value.scaleY;

		return this;
	}

	/**
	 * @private
	 */
	identity() {
		this.x = this.y = 0.0;
		this.skew = this.rotation = 0.0;
		this.scaleX = this.scaleY = 1.0;

		return this;
	}

	/**
	 * @private
	 */
	add(value) {
		this.x += value.x;
		this.y += value.y;
		this.skew += value.skew;
		this.rotation += value.rotation;
		this.scaleX *= value.scaleX;
		this.scaleY *= value.scaleY;

		return this;
	}

	/**
	 * @private
	 */
	minus(value) {
		this.x -= value.x;
		this.y -= value.y;
		this.skew -= value.skew;
		this.rotation -= value.rotation;
		this.scaleX /= value.scaleX;
		this.scaleY /= value.scaleY;

		return this;
	}

	/**
	 * @private
	 */
	fromMatrix(matrix) {
		const backupScaleX = this.scaleX,
			backupScaleY = this.scaleY;
		const PI_Q = Transform.PI_Q;

		this.x = matrix.tx;
		this.y = matrix.ty;
		this.rotation = Math.atan(matrix.b / matrix.a);
		let skewX = Math.atan(-matrix.c / matrix.d);

		this.scaleX =
			this.rotation > -PI_Q && this.rotation < PI_Q
				? matrix.a / Math.cos(this.rotation)
				: matrix.b / Math.sin(this.rotation);
		this.scaleY =
			skewX > -PI_Q && skewX < PI_Q ? matrix.d / Math.cos(skewX) : -matrix.c / Math.sin(skewX);

		if (backupScaleX >= 0.0 && this.scaleX < 0.0) {
			this.scaleX = -this.scaleX;
			this.rotation = this.rotation - Math.PI;
		}

		if (backupScaleY >= 0.0 && this.scaleY < 0.0) {
			this.scaleY = -this.scaleY;
			skewX = skewX - Math.PI;
		}

		this.skew = skewX - this.rotation;

		return this;
	}
	
	/**
	 * @private
	 */
	toMatrix(matrix) {
		if (this.rotation === 0.0) {
			matrix.a = 1.0;
			matrix.b = 0.0;
		} else {
			matrix.a = Math.cos(this.rotation);
			matrix.b = Math.sin(this.rotation);
		}

		if (this.skew === 0.0) {
			matrix.c = -matrix.b;
			matrix.d = matrix.a;
		} else {
			matrix.c = -Math.sin(this.skew + this.rotation);
			matrix.d = Math.cos(this.skew + this.rotation);
		}

		if (this.scaleX !== 1.0) {
			matrix.a *= this.scaleX;
			matrix.b *= this.scaleX;
		}

		if (this.scaleY !== 1.0) {
			matrix.c *= this.scaleY;
			matrix.d *= this.scaleY;
		}

		matrix.tx = this.x;
		matrix.ty = this.y;

		return this;
	}
}
