/**
 * @private
 */
export class ColorTransform {
	alphaMultiplier;
	redMultiplier;
	greenMultiplier;
	blueMultiplier;
	alphaOffset;
	redOffset;
	greenOffset;
	blueOffset;

	constructor(
		alphaMultiplier = 1.0,
		redMultiplier = 1.0,
		greenMultiplier = 1.0,
		blueMultiplier = 1.0,
		alphaOffset = 0,
		redOffset = 0,
		greenOffset = 0,
		blueOffset = 0
	) {
		this.alphaMultiplier = alphaMultiplier;
		this.redMultiplier = redMultiplier;
		this.greenMultiplier = greenMultiplier;
		this.blueMultiplier = blueMultiplier;
		this.alphaOffset = alphaOffset;
		this.redOffset = redOffset;
		this.greenOffset = greenOffset;
		this.blueOffset = blueOffset;
	}

	copyFrom(value) {
		this.alphaMultiplier = value.alphaMultiplier;
		this.redMultiplier = value.redMultiplier;
		this.greenMultiplier = value.greenMultiplier;
		this.blueMultiplier = value.blueMultiplier;
		this.alphaOffset = value.alphaOffset;
		this.redOffset = value.redOffset;
		this.greenOffset = value.greenOffset;
		this.blueOffset = value.blueOffset;
	}

	identity() {
		this.alphaMultiplier = this.redMultiplier = this.greenMultiplier = this.blueMultiplier = 1.0;
		this.alphaOffset = this.redOffset = this.greenOffset = this.blueOffset = 0;
	}
}
