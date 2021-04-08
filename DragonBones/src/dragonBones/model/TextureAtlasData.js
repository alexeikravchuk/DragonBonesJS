import { BaseObject } from '../core/BaseObject';
import { Rectangle } from '../geom/Rectangle';

/**
 * - The texture atlas data.
 * @version DragonBones 3.0
 * @language en_US
 */
export class TextureAtlasData extends BaseObject {
	/**
	 * @private
	 */
	autoSearch;

	/**
	 * @private
	 */
	width;

	/**
	 * @private
	 */
	height;

	/**
	 * @private
	 */
	scale;

	/**
	 * - The texture atlas name.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	name;

	/**
	 * - The image path of the texture atlas.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	imagePath;

	/**
	 * @private
	 */
	textures = {};

	_onClear() {
		for (let k in this.textures) {
			this.textures[k].returnToPool();
			delete this.textures[k];
		}

		this.autoSearch = false;
		this.width = 0;
		this.height = 0;
		this.scale = 1.0;
		// this.textures.clear();
		this.name = '';
		this.imagePath = '';
	}

	/**
	 * @private
	 */
	copyFrom(value) {
		this.autoSearch = value.autoSearch;
		this.scale = value.scale;
		this.width = value.width;
		this.height = value.height;
		this.name = value.name;
		this.imagePath = value.imagePath;

		for (let k in this.textures) {
			this.textures[k].returnToPool();
			delete this.textures[k];
		}

		// this.textures.clear();

		for (let k in value.textures) {
			const texture = this.createTexture();
			texture.copyFrom(value.textures[k]);
			this.textures[k] = texture;
		}
	}

	/**
	 * @internal
	 */
	createTexture() {}

	/**
	 * @internal
	 */
	addTexture(value) {
		if (value.name in this.textures) {
			console.warn('Same texture: ' + value.name);
			return;
		}

		value.parent = this;
		this.textures[value.name] = value;
	}
	
	/**
	 * @private
	 */
	getTexture(textureName) {
		return textureName in this.textures ? this.textures[textureName] : null;
	}
}

/**
 * @private
 */
export class TextureData extends BaseObject {
	static createRectangle() {
		return new Rectangle();
	}

	rotated;
	name;
	region = new Rectangle();
	parent;
	frame = null; // Initial value.

	_onClear() {
		this.rotated = false;
		this.name = '';
		this.region.clear();
		this.parent = null; //
		this.frame = null;
	}

	copyFrom(value) {
		this.rotated = value.rotated;
		this.name = value.name;
		this.region.copyFrom(value.region);
		this.parent = value.parent;

		if (this.frame === null && value.frame !== null) {
			this.frame = TextureData.createRectangle();
		} else if (this.frame !== null && value.frame === null) {
			this.frame = null;
		}

		if (this.frame !== null && value.frame !== null) {
			this.frame.copyFrom(value.frame);
		}
	}
}
