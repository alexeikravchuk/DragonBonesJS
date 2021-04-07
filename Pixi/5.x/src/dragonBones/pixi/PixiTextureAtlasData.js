import { Texture } from '../../../../../../pixi.js/packages/core/src/textures/Texture';
import { Rectangle } from '../../../../../../pixi.js/packages/math/src/shapes/Rectangle';
import { BaseObject } from '../../../../../DragonBones/src/dragonBones/core/BaseObject';
import { TextureAtlasData, TextureData } from '../../../../../DragonBones/src/dragonBones/model/TextureAtlasData';

/**
 * - The PixiJS texture atlas data.
 * @version DragonBones 3.0
 * @language en_US
 */

export class PixiTextureAtlasData extends TextureAtlasData {
	static toString() {
		return '[class dragonBones.PixiTextureAtlasData]';
	}

	_renderTexture = null; // Initial value.

	_onClear() {
		super._onClear();

		if (this._renderTexture !== null) {
			// this._renderTexture.dispose();
		}

		this._renderTexture = null;
	}
	/**
	 * @inheritDoc
	 */
	createTexture() {
		return BaseObject.borrowObject(PixiTextureData);
	}
	/**
	 * - The PixiJS texture.
	 * @version DragonBones 3.0
	 * @language en_US
	 */

	get renderTexture() {
		return this._renderTexture;
	}
	set renderTexture(value) {
		if (this._renderTexture === value) {
			return;
		}

		this._renderTexture = value;

		if (this._renderTexture !== null) {
			for (let k in this.textures) {
				const textureData = this.textures[k];

				textureData.renderTexture = new Texture(
					this._renderTexture,
					new Rectangle(
						textureData.region.x,
						textureData.region.y,
						textureData.region.width,
						textureData.region.height
					),
					new Rectangle(
						textureData.region.x,
						textureData.region.y,
						textureData.region.width,
						textureData.region.height
					),
					new Rectangle(0, 0, textureData.region.width, textureData.region.height),
					textureData.rotated // .d.ts bug
				);
			}
		} else {
			for (let k in this.textures) {
				const textureData = this.textures[k];
				textureData.renderTexture = null;
			}
		}
	}
}
/**
 * @internal
 */
export class PixiTextureData extends TextureData {
	static toString() {
		return '[class dragonBones.PixiTextureData]';
	}

	renderTexture = null; // Initial value.

	_onClear() {
		super._onClear();

		if (this.renderTexture !== null) {
			this.renderTexture.destroy(false);
		}

		this.renderTexture = null;
	}
}
