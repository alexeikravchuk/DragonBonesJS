import { Animation } from '../animation/Animation';
import { BaseObject } from '../core/BaseObject';

/**
 * - Armature is the core of the skeleton animation system.
 * @see dragonBones.ArmatureData
 * @see dragonBones.Bone
 * @see dragonBones.Slot
 * @see dragonBones.Animation
 * @version DragonBones 3.0
 * @language en_US
 */
export class Armature extends BaseObject /* implements IAnimatable */ {
	static toString() {
		return '[class dragonBones.Armature]';
	}

	static _onSortSlots(a, b) {
		return a._zIndex * 1000 + a._zOrder > b._zIndex * 1000 + b._zOrder ? 1 : -1;
	}

	/**
	 * - Whether to inherit the animation control of the parent armature.
	 * True to try to have the child armature play an animation with the same name when the parent armature play the animation.
	 * @default true
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	inheritAnimation;

	/**
	 * @private
	 */
	userData;

	/**
	 * @internal
	 */
	_lockUpdate;
	_slotsDirty;
	_zOrderDirty;

	/**
	 * @internal
	 */
	_zIndexDirty;

	/**
	 * @internal
	 */
	_alphaDirty;
	_flipX;
	_flipY;

	/**
	 * @internal
	 */
	_cacheFrameIndex;
	_alpha;

	/**
	 * @internal
	 */
	_globalAlpha;
	_bones = [];
	_slots = [];

	/**
	 * @internal
	 */
	_constraints = [];
	_actions = [];

	/**
	 * @internal
	 */
	_armatureData;
	_animation = null; // Initial value.
	_proxy = null; // Initial value.
	_display;

	/**
	 * @internal
	 */
	_replaceTextureAtlasData = null; // Initial value.
	_replacedTexture;

	/**
	 * @internal
	 */
	_dragonBones;
	_clock = null; // Initial value.

	/**
	 * @internal
	 */
	_parent;

	_onClear() {
		if (this._clock !== null) {
			// Remove clock first.
			this._clock.remove(this);
		}

		for (const bone of this._bones) {
			bone.returnToPool();
		}

		for (const slot of this._slots) {
			slot.returnToPool();
		}

		for (const constraint of this._constraints) {
			constraint.returnToPool();
		}

		for (const action of this._actions) {
			action.returnToPool();
		}

		if (this._animation !== null) {
			this._animation.returnToPool();
		}

		if (this._proxy !== null) {
			this._proxy.dbClear();
		}

		if (this._replaceTextureAtlasData !== null) {
			this._replaceTextureAtlasData.returnToPool();
		}

		this.inheritAnimation = true;
		this.userData = null;

		this._lockUpdate = false;
		this._slotsDirty = true;
		this._zOrderDirty = false;
		this._zIndexDirty = false;
		this._alphaDirty = true;
		this._flipX = false;
		this._flipY = false;
		this._cacheFrameIndex = -1;
		this._alpha = 1.0;
		this._globalAlpha = 1.0;
		this._bones.length = 0;
		this._slots.length = 0;
		this._constraints.length = 0;
		this._actions.length = 0;
		this._armatureData = null; //
		this._animation = null; //
		this._proxy = null; //
		this._display = null;
		this._replaceTextureAtlasData = null;
		this._replacedTexture = null;
		this._dragonBones = null; //
		this._clock = null;
		this._parent = null;
	}

	/**
	 * @internal
	 */
	_sortZOrder(slotIndices, offset) {
		const slotDatas = this._armatureData.sortedSlots;
		const isOriginal = slotIndices === null;

		if (this._zOrderDirty || !isOriginal) {
			for (let i = 0, l = slotDatas.length; i < l; ++i) {
				const slotIndex = isOriginal ? i : slotIndices[offset + i];
				if (slotIndex < 0 || slotIndex >= l) {
					continue;
				}

				const slotData = slotDatas[slotIndex];
				const slot = this.getSlot(slotData.name);

				if (slot !== null) {
					slot._setZOrder(i);
				}
			}

			this._slotsDirty = true;
			this._zOrderDirty = !isOriginal;
		}
	}

	/**
	 * @internal
	 */
	_addBone(value) {
		if (this._bones.indexOf(value) < 0) {
			this._bones.push(value);
		}
	}

	/**
	 * @internal
	 */
	_addSlot(value) {
		if (this._slots.indexOf(value) < 0) {
			this._slots.push(value);
		}
	}

	/**
	 * @internal
	 */
	_addConstraint(value) {
		if (this._constraints.indexOf(value) < 0) {
			this._constraints.push(value);
		}
	}

	/**
	 * @internal
	 */
	_bufferAction(action, append) {
		if (this._actions.indexOf(action) < 0) {
			if (append) {
				this._actions.push(action);
			} else {
				this._actions.unshift(action);
			}
		}
	}

	/**
	 * - Dispose the armature. (Return to the object pool)
	 * @example
	 * <pre>
	 *     removeChild(armature.display);
	 *     armature.dispose();
	 * </pre>
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	dispose() {
		if (this._armatureData !== null) {
			this._lockUpdate = true;
			this._dragonBones.bufferObject(this);
		}
	}

	/**
	 * @internal
	 */
	init(armatureData, proxy, display, dragonBones) {
		if (this._armatureData !== null) {
			return;
		}

		this._armatureData = armatureData;
		this._animation = BaseObject.borrowObject(Animation);
		this._proxy = proxy;
		this._display = display;
		this._dragonBones = dragonBones;

		this._proxy.dbInit(this);
		this._animation.init(this);
		this._animation.animations = this._armatureData.animations;
	}

	/**
	 * @inheritDoc
	 */
	advanceTime(passedTime) {
		if (this._lockUpdate) {
			return;
		}

		this._lockUpdate = true;

		if (this._armatureData === null) {
			console.warn('The armature has been disposed.');
			return;
		} else if (this._armatureData.parent === null) {
			console.warn(
				'The armature data has been disposed.\nPlease make sure dispose armature before call factory.clear().'
			);
			return;
		}

		const prevCacheFrameIndex = this._cacheFrameIndex;
		// Update animation.
		this._animation.advanceTime(passedTime);
		// Sort slots.
		if (this._slotsDirty || this._zIndexDirty) {
			this._slots.sort(Armature._onSortSlots);

			if (this._zIndexDirty) {
				for (let i = 0, l = this._slots.length; i < l; ++i) {
					this._slots[i]._setZOrder(i); //
				}
			}

			this._slotsDirty = false;
			this._zIndexDirty = false;
		}
		// Update alpha.
		if (this._alphaDirty) {
			this._alphaDirty = false;
			this._globalAlpha = this._alpha * (this._parent !== null ? this._parent._globalAlpha : 1.0);

			for (const bone of this._bones) {
				bone._updateAlpha();
			}

			for (const slot of this._slots) {
				slot._updateAlpha();
			}
		}
		// Update bones and slots.
		if (this._cacheFrameIndex < 0 || this._cacheFrameIndex !== prevCacheFrameIndex) {
			let i = 0,
				l = 0;
			for (i = 0, l = this._bones.length; i < l; ++i) {
				this._bones[i].update(this._cacheFrameIndex);
			}

			for (i = 0, l = this._slots.length; i < l; ++i) {
				this._slots[i].update(this._cacheFrameIndex);
			}
		}
		// Do actions.
		if (this._actions.length > 0) {
			for (const action of this._actions) {
				const actionData = action.actionData;
				if (actionData !== null) {
					if (actionData.type === ActionType.Play) {
						if (action.slot !== null) {
							const childArmature = action.slot.childArmature;
							if (childArmature !== null) {
								childArmature.animation.fadeIn(actionData.name);
							}
						} else if (action.bone !== null) {
							for (const slot of this.getSlots()) {
								if (slot.parent === action.bone) {
									const childArmature = slot.childArmature;
									if (childArmature !== null) {
										childArmature.animation.fadeIn(actionData.name);
									}
								}
							}
						} else {
							this._animation.fadeIn(actionData.name);
						}
					}
				}

				action.returnToPool();
			}

			this._actions.length = 0;
		}

		this._lockUpdate = false;
		this._proxy.dbUpdate();
	}

	/**
	 * - Forces a specific bone or its owning slot to update the transform or display property in the next frame.
	 * @param boneName - The bone name. (If not set, all bones will be update)
	 * @param updateSlot - Whether to update the bone's slots. (Default: false)
	 * @see dragonBones.Bone#invalidUpdate()
	 * @see dragonBones.Slot#invalidUpdate()
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	invalidUpdate(boneName = null, updateSlot = false) {
		if (boneName !== null && boneName.length > 0) {
			const bone = this.getBone(boneName);
			if (bone !== null) {
				bone.invalidUpdate();

				if (updateSlot) {
					for (const slot of this._slots) {
						if (slot.parent === bone) {
							slot.invalidUpdate();
						}
					}
				}
			}
		} else {
			for (const bone of this._bones) {
				bone.invalidUpdate();
			}

			if (updateSlot) {
				for (const slot of this._slots) {
					slot.invalidUpdate();
				}
			}
		}
	}

	/**
	 * - Check whether a specific point is inside a custom bounding box in a slot.
	 * The coordinate system of the point is the inner coordinate system of the armature.
	 * Custom bounding boxes need to be customized in Dragonbones Pro.
	 * @param x - The horizontal coordinate of the point.
	 * @param y - The vertical coordinate of the point.
	 * @version DragonBones 5.0
	 * @language en_US
	 */
	containsPoint(x, y) {
		for (const slot of this._slots) {
			if (slot.containsPoint(x, y)) {
				return slot;
			}
		}

		return null;
	}

	/**
	 * - Check whether a specific segment intersects a custom bounding box for a slot in the armature.
	 * The coordinate system of the segment and intersection is the inner coordinate system of the armature.
	 * Custom bounding boxes need to be customized in Dragonbones Pro.
	 * @param xA - The horizontal coordinate of the beginning of the segment.
	 * @param yA - The vertical coordinate of the beginning of the segment.
	 * @param xB - The horizontal coordinate of the end point of the segment.
	 * @param yB - The vertical coordinate of the end point of the segment.
	 * @param intersectionPointA - The first intersection at which a line segment intersects the bounding box from the beginning to the end. (If not set, the intersection point will not calculated)
	 * @param intersectionPointB - The first intersection at which a line segment intersects the bounding box from the end to the beginning. (If not set, the intersection point will not calculated)
	 * @param normalRadians - The normal radians of the tangent of the intersection boundary box. [x: Normal radian of the first intersection tangent, y: Normal radian of the second intersection tangent] (If not set, the normal will not calculated)
	 * @returns The slot of the first custom bounding box where the segment intersects from the start point to the end point.
	 * @version DragonBones 5.0
	 * @language en_US
	 */
	intersectsSegment(
		xA,
		yA,
		xB,
		yB,
		intersectionPointA = null,
		intersectionPointB = null,
		normalRadians = null
	) {
		const isV = xA === xB;
		let dMin = 0.0;
		let dMax = 0.0;
		let intXA = 0.0;
		let intYA = 0.0;
		let intXB = 0.0;
		let intYB = 0.0;
		let intAN = 0.0;
		let intBN = 0.0;
		let intSlotA = null;
		let intSlotB = null;

		for (const slot of this._slots) {
			const intersectionCount = slot.intersectsSegment(
				xA,
				yA,
				xB,
				yB,
				intersectionPointA,
				intersectionPointB,
				normalRadians
			);
			if (intersectionCount > 0) {
				if (intersectionPointA !== null || intersectionPointB !== null) {
					if (intersectionPointA !== null) {
						let d = isV ? intersectionPointA.y - yA : intersectionPointA.x - xA;
						if (d < 0.0) {
							d = -d;
						}

						if (intSlotA === null || d < dMin) {
							dMin = d;
							intXA = intersectionPointA.x;
							intYA = intersectionPointA.y;
							intSlotA = slot;

							if (normalRadians) {
								intAN = normalRadians.x;
							}
						}
					}

					if (intersectionPointB !== null) {
						let d = intersectionPointB.x - xA;
						if (d < 0.0) {
							d = -d;
						}

						if (intSlotB === null || d > dMax) {
							dMax = d;
							intXB = intersectionPointB.x;
							intYB = intersectionPointB.y;
							intSlotB = slot;

							if (normalRadians !== null) {
								intBN = normalRadians.y;
							}
						}
					}
				} else {
					intSlotA = slot;
					break;
				}
			}
		}

		if (intSlotA !== null && intersectionPointA !== null) {
			intersectionPointA.x = intXA;
			intersectionPointA.y = intYA;

			if (normalRadians !== null) {
				normalRadians.x = intAN;
			}
		}

		if (intSlotB !== null && intersectionPointB !== null) {
			intersectionPointB.x = intXB;
			intersectionPointB.y = intYB;

			if (normalRadians !== null) {
				normalRadians.y = intBN;
			}
		}

		return intSlotA;
	}

	/**
	 * - Get a specific bone.
	 * @param name - The bone name.
	 * @see dragonBones.Bone
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	getBone(name) {
		for (const bone of this._bones) {
			if (bone.name === name) {
				return bone;
			}
		}

		return null;
	}

	/**
	 * - Get a specific bone by the display.
	 * @param display - The display object.
	 * @see dragonBones.Bone
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	getBoneByDisplay(display) {
		const slot = this.getSlotByDisplay(display);

		return slot !== null ? slot.parent : null;
	}

	/**
	 * - Get a specific slot.
	 * @param name - The slot name.
	 * @see dragonBones.Slot
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	getSlot(name) {
		for (const slot of this._slots) {
			if (slot.name === name) {
				return slot;
			}
		}

		return null;
	}

	/**
	 * - Get a specific slot by the display.
	 * @param display - The display object.
	 * @see dragonBones.Slot
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	getSlotByDisplay(display) {
		if (display !== null) {
			for (const slot of this._slots) {
				if (slot.display === display) {
					return slot;
				}
			}
		}

		return null;
	}

	/**
	 * - Get all bones.
	 * @see dragonBones.Bone
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	getBones() {
		return this._bones;
	}

	/**
	 * - Get all slots.
	 * @see dragonBones.Slot
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	getSlots() {
		return this._slots;
	}

	/**
	 * - Whether to flip the armature horizontally.
	 * @version DragonBones 5.5
	 * @language en_US
	 */
	get flipX() {
		return this._flipX;
	}

	set flipX(value) {
		if (this._flipX === value) {
			return;
		}

		this._flipX = value;
		this.invalidUpdate();
	}

	/**
	 * - Whether to flip the armature vertically.
	 * @version DragonBones 5.5
	 * @language en_US
	 */
	get flipY() {
		return this._flipY;
	}

	set flipY(value) {
		if (this._flipY === value) {
			return;
		}

		this._flipY = value;
		this.invalidUpdate();
	}

	/**
	 * - The animation cache frame rate, which turns on the animation cache when the set value is greater than 0.
	 * There is a certain amount of memory overhead to improve performance by caching animation data in memory.
	 * The frame rate should not be set too high, usually with the frame rate of the animation is similar and lower than the program running frame rate.
	 * When the animation cache is turned on, some features will fail, such as the offset property of bone.
	 * @example
	 * <pre>
	 *     armature.cacheFrameRate = 24;
	 * </pre>
	 * @see dragonBones.DragonBonesData#frameRate
	 * @see dragonBones.ArmatureData#frameRate
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	get cacheFrameRate() {
		return this._armatureData.cacheFrameRate;
	}

	set cacheFrameRate(value) {
		if (this._armatureData.cacheFrameRate !== value) {
			this._armatureData.cacheFrames(value);

			// Set child armature frameRate.
			for (const slot of this._slots) {
				const childArmature = slot.childArmature;
				if (childArmature !== null) {
					childArmature.cacheFrameRate = value;
				}
			}
		}
	}

	/**
	 * - The armature name.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	get name() {
		return this._armatureData.name;
	}

	/**
	 * - The armature data.
	 * @see dragonBones.ArmatureData
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	get armatureData() {
		return this._armatureData;
	}

	/**
	 * - The animation player.
	 * @see dragonBones.Animation
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	get animation() {
		return this._animation;
	}

	/**
	 * @pivate
	 */
	get proxy() {
		return this._proxy;
	}

	/**
	 * - The EventDispatcher instance of the armature.
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	get eventDispatcher() {
		return this._proxy;
	}

	/**
	 * - The display container.
	 * The display of the slot is displayed as the parent.
	 * Depending on the rendering engine, the type will be different, usually the DisplayObjectContainer type.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	get display() {
		return this._display;
	}

	/**
	 * @private
	 */
	get replacedTexture() {
		return this._replacedTexture;
	}

	set replacedTexture(value) {
		if (this._replacedTexture === value) {
			return;
		}

		if (this._replaceTextureAtlasData !== null) {
			this._replaceTextureAtlasData.returnToPool();
			this._replaceTextureAtlasData = null;
		}

		this._replacedTexture = value;

		for (const slot of this._slots) {
			slot.invalidUpdate();
			slot.update(-1);
		}
	}

	/**
	 * @inheritDoc
	 */
	get clock() {
		return this._clock;
	}

	set clock(value) {
		if (this._clock === value) {
			return;
		}

		if (this._clock !== null) {
			this._clock.remove(this);
		}

		this._clock = value;

		if (this._clock) {
			this._clock.add(this);
		}

		// Update childArmature clock.
		for (const slot of this._slots) {
			const childArmature = slot.childArmature;
			if (childArmature !== null) {
				childArmature.clock = this._clock;
			}
		}
	}

	/**
	 * - Get the parent slot which the armature belongs to.
	 * @see dragonBones.Slot
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	get parent() {
		return this._parent;
	}

	/**
	 * - Deprecated, please refer to {@link #display}.
	 * @deprecated
	 * @language en_US
	 */
	getDisplay() {
		return this._display;
	}
}
