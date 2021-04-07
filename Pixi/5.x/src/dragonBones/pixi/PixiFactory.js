import { Texture } from '../../../../../../pixi.js/packages/core/src/textures/Texture';
import { SimpleMesh } from '../../../../../../pixi.js/packages/mesh-extras/src/SimpleMesh';
import { settings } from '../../../../../../pixi.js/packages/settings/src/settings';
import { Sprite } from '../../../../../../pixi.js/packages/sprite/src/Sprite';
import { Ticker } from '../../../../../../pixi.js/packages/ticker/src/Ticker';
import { Armature } from '../../../../../DragonBones/src/dragonBones/armature/Armature';
import { BaseObject } from '../../../../../DragonBones/src/dragonBones/core/BaseObject';
import { DragonBones } from '../../../../../DragonBones/src/dragonBones/core/DragonBones';
import { BaseFactory } from '../../../../../DragonBones/src/dragonBones/factory/BaseFactory';
import { PixiArmatureDisplay } from './PixiArmatureDisplay';
import { PixiSlot } from './PixiSlot';
import { PixiTextureAtlasData } from './PixiTextureAtlasData';

/**
 * - The PixiJS factory.
 * @version DragonBones 3.0
 * @language en_US
 */

export class PixiFactory extends BaseFactory {
	static _dragonBonesInstance = null;
	static _factory = null;
	static _clockHandler(passedTime) {
		this._dragonBonesInstance.advanceTime((passedTime / settings.TARGET_FPMS) * 0.001);
	}

	/*
	 * `passedTime` is elapsed time, specified in seconds.
	 */

	static advanceTime(passedTime) {
		this._dragonBonesInstance.advanceTime(passedTime);
	}

	/*
	 * whether use `PIXI.Ticker.shared`
	 */
	static useSharedTicker = true;

	/**
	 * - A global factory instance that can be used directly.
	 * @version DragonBones 4.7
	 * @language en_US
	 */

	static get factory() {
		if (PixiFactory._factory === null) {
			PixiFactory._factory = new PixiFactory(null, PixiFactory.useSharedTicker);
		}

		return PixiFactory._factory;
	}

	static newInstance(useSharedTicker = true) {
		if (PixiFactory._factory === null) {
			PixiFactory._factory = new PixiFactory(null, useSharedTicker);
		}

		return PixiFactory._factory;
	}

	/**
	 * @inheritDoc
	 */

	constructor(dataParser, useSharedTicker = true) {
		super(dataParser);

		if (PixiFactory._dragonBonesInstance === null) {
			const eventManager = new PixiArmatureDisplay(Texture.EMPTY);
			PixiFactory._dragonBonesInstance = new DragonBones(eventManager);
			if (useSharedTicker) {
				Ticker.shared.add(PixiFactory._clockHandler, PixiFactory);
			}
		}

		this._dragonBones = PixiFactory._dragonBonesInstance;
	}

	_buildTextureAtlasData(textureAtlasData, textureAtlas) {
		if (textureAtlasData) {
			textureAtlasData.renderTexture = textureAtlas;
		} else {
			textureAtlasData = BaseObject.borrowObject(PixiTextureAtlasData);
		}

		return textureAtlasData;
	}

	_buildArmature(dataPackage) {
		const armature = BaseObject.borrowObject(Armature);
		const armatureDisplay = new PixiArmatureDisplay(Texture.EMPTY);

		armature.init(dataPackage.armature, armatureDisplay, armatureDisplay, this._dragonBones);

		return armature;
	}

	_buildSlot(_dataPackage, slotData, armature) {
		const slot = BaseObject.borrowObject(PixiSlot);
		slot.init(
			slotData, 
			armature, 
			new Sprite(Texture.EMPTY), 
			new SimpleMesh()
			);

		return slot;
	}

	/**
	 * - Create a armature from cached DragonBonesData instances and TextureAtlasData instances, then use the {@link #clock} to update it.
	 * The difference is that the armature created by {@link #buildArmature} is not WorldClock instance update.
	 * @param armatureName - The armature data name.
	 * @param dragonBonesName - The cached name of the DragonBonesData instance. (If not set, all DragonBonesData instances are retrieved, and when multiple DragonBonesData instances contain a the same name armature data, it may not be possible to accurately create a specific armature)
	 * @param skinName - The skin name, you can set a different ArmatureData name to share it's skin data. (If not set, use the default skin data)
	 * @returns The armature display container.
	 * @see dragonBones.IArmatureProxy
	 * @see dragonBones.BaseFactory#buildArmature
	 * @version DragonBones 4.5
	 * @example
	 * <pre>
	 *     let armatureDisplay = factory.buildArmatureDisplay("armatureName", "dragonBonesName");
	 * </pre>
	 * @language en_US
	 */

	buildArmatureDisplay(armatureName, dragonBonesName = '', skinName = '', textureAtlasName = '') {
		const armature = this.buildArmature(
			armatureName,
			dragonBonesName || '',
			skinName || '',
			textureAtlasName || ''
		);
		if (armature !== null) {
			this._dragonBones.clock.add(armature);

			return armature.display;
		}

		return null;
	}

	/**
	 * - Create the display object with the specified texture.
	 * @param textureName - The texture data name.
	 * @param textureAtlasName - The texture atlas data name (Of not set, all texture atlas data will be searched)
	 * @version DragonBones 3.0
	 * @language en_US
	 */

	getTextureDisplay(textureName, textureAtlasName = null) {
		const textureData = this._getTextureData(
			textureAtlasName !== null ? textureAtlasName : '',
			textureName
		);
		if (textureData !== null && textureData.renderTexture !== null) {
			return new Sprite(textureData.renderTexture);
		}

		return null;
	}

	/**
	 * - A global sound event manager.
	 * Sound events can be listened to uniformly from the manager.
	 * @version DragonBones 4.5
	 * @language en_US
	 */

	get soundEventManager() {
		return this._dragonBones.eventManager;
	}
}
