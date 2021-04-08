import { BaseObject } from '../core/BaseObject';

/**
 * @private
 */
export class CanvasData extends BaseObject {

	hasBackground;
	color;
	x;
	y;
	width;
	height;

	_onClear() {
		this.hasBackground = false;
		this.color = 0x000000;
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
	}
}
