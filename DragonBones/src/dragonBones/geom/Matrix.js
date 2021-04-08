/**
 * - 2D Transform matrix.
 * @version DragonBones 3.0
 * @language en_US
 */
export class Matrix {
	/**
	 * - The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
	 * @default 1.0
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	a;

	/**
	 * - The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
	 * @default 0.0
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	b;

	/**
	 * - The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
	 * @default 0.0
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	c;

	/**
	 * - The value that affects the positioning of pixels along the y axis when scaling or rotating an image.
	 * @default 1.0
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	d;

	/**
	 * - The distance by which to translate each point along the x axis.
	 * @default 0.0
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	tx;

	/**
	 * - The distance by which to translate each point along the y axis.
	 * @default 0.0
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	_ty;

	/**
	 * @private
	 */
	constructor(a = 1.0, b = 0.0, c = 0.0, d = 1.0, tx = 0.0, ty = 0.0) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
		this.tx = tx;
		this.ty = ty;
	}

	get ty() {
		return this._ty;
	}

	set ty(value) {
		
		if(isNaN(value)) {
			debugger;
		}
		this._ty = value;
	}

	/**
	 * @private
	 */
	copyFrom(value) {
		this.a = value.a;
		this.b = value.b;
		this.c = value.c;
		this.d = value.d;
		this.tx = value.tx;
		this.ty = value.ty;

		return this;
	}

	/**
	 * @private
	 */
	copyFromArray(value, offset = 0) {
		this.a = value[offset];
		this.b = value[offset + 1];
		this.c = value[offset + 2];
		this.d = value[offset + 3];
		this.tx = value[offset + 4];
		this.ty = value[offset + 5];

		return this;
	}

	/**
	 * - Convert to unit matrix.
	 * The resulting matrix has the following properties: a=1, b=0, c=0, d=1, tx=0, ty=0.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	identity() {
		this.a = this.d = 1.0;
		this.b = this.c = 0.0;
		this.tx = this.ty = 0.0;

		return this;
	}

	/**
	 * - Multiplies the current matrix with another matrix.
	 * @param value - The matrix that needs to be multiplied.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	concat(value) {
		let aA = this.a * value.a;
		let bA = 0.0;
		let cA = 0.0;
		let dA = this.d * value.d;
		let txA = this.tx * value.a + value.tx;
		let tyA = this.ty * value.d + value.ty;

		if (this.b !== 0.0 || this.c !== 0.0) {
			aA += this.b * value.c;
			bA += this.b * value.d;
			cA += this.c * value.a;
			dA += this.c * value.b;
		}

		if (value.b !== 0.0 || value.c !== 0.0) {
			bA += this.a * value.b;
			cA += this.d * value.c;
			txA += this.ty * value.c;
			tyA += this.tx * value.b;
		}

		this.a = aA;
		this.b = bA;
		this.c = cA;
		this.d = dA;
		this.tx = txA;
		this.ty = tyA;

		return this;
	}

	/**
	 * - Convert to inverse matrix.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	invert() {
		let aA = this.a;
		let bA = this.b;
		let cA = this.c;
		let dA = this.d;
		const txA = this.tx;
		const tyA = this.ty;

		if (bA === 0.0 && cA === 0.0) {
			this.b = this.c = 0.0;
			if (aA === 0.0 || dA === 0.0) {
				this.a = this.b = this.tx = this.ty = 0.0;
			} else {
				aA = this.a = 1.0 / aA;
				dA = this.d = 1.0 / dA;
				this.tx = -aA * txA;
				this.ty = -dA * tyA;
			}

			return this;
		}

		let determinant = aA * dA - bA * cA;
		if (determinant === 0.0) {
			this.a = this.d = 1.0;
			this.b = this.c = 0.0;
			this.tx = this.ty = 0.0;

			return this;
		}

		determinant = 1.0 / determinant;
		let k = (this.a = dA * determinant);
		bA = this.b = -bA * determinant;
		cA = this.c = -cA * determinant;
		dA = this.d = aA * determinant;
		this.tx = -(k * txA + cA * tyA);
		this.ty = -(bA * txA + dA * tyA);

		return this;
	}
	
	/**
	 * - Apply a matrix transformation to a specific point.
	 * @param x - X coordinate.
	 * @param y - Y coordinate.
	 * @param result - The point after the transformation is applied.
	 * @param delta - Whether to ignore tx, ty's conversion to point.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	transformPoint(x, y, result, delta = false) {
		result.x = this.a * x + this.c * y;
		result.y = this.b * x + this.d * y;

		if (!delta) {
			result.x += this.tx;
			result.y += this.ty;
		}
	}
	
	/**
	 * @private
	 */
	transformRectangle(rectangle, delta = false) {
		const a = this.a;
		const b = this.b;
		const c = this.c;
		const d = this.d;
		const tx = delta ? 0.0 : this.tx;
		const ty = delta ? 0.0 : this.ty;

		const x = rectangle.x;
		const y = rectangle.y;
		const xMax = x + rectangle.width;
		const yMax = y + rectangle.height;

		let x0 = a * x + c * y + tx;
		let y0 = b * x + d * y + ty;
		let x1 = a * xMax + c * y + tx;
		let y1 = b * xMax + d * y + ty;
		let x2 = a * xMax + c * yMax + tx;
		let y2 = b * xMax + d * yMax + ty;
		let x3 = a * x + c * yMax + tx;
		let y3 = b * x + d * yMax + ty;

		let tmp = 0.0;

		if (x0 > x1) {
			tmp = x0;
			x0 = x1;
			x1 = tmp;
		}
		if (x2 > x3) {
			tmp = x2;
			x2 = x3;
			x3 = tmp;
		}

		rectangle.x = Math.floor(x0 < x2 ? x0 : x2);
		rectangle.width = Math.ceil((x1 > x3 ? x1 : x3) - rectangle.x);

		if (y0 > y1) {
			tmp = y0;
			y0 = y1;
			y1 = tmp;
		}
		if (y2 > y3) {
			tmp = y2;
			y2 = y3;
			y3 = tmp;
		}

		rectangle.y = Math.floor(y0 < y2 ? y0 : y2);
		rectangle.height = Math.ceil((y1 > y3 ? y1 : y3) - rectangle.y);
	}
}
