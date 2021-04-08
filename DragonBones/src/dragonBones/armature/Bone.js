import { BoneType, DragonBones, OffsetMode } from '../core/DragonBones';
import { Transform } from '../geom/Transform';
import { TransformObject } from './TransformObject';

/**
 * - Bone is one of the most important logical units in the armature animation system,
 * and is responsible for the realization of translate, rotation, scaling in the animations.
 * A armature can contain multiple bones.
 * @see dragonBones.BoneData
 * @see dragonBones.Armature
 * @see dragonBones.Slot
 * @version DragonBones 3.0
 * @language en_US
 */
export class Bone extends TransformObject {
	static toString() {
		return '[class dragonBones.Bone]';
	}
	/**
	 * - The offset mode.
	 * @see #offset
	 * @version DragonBones 5.5
	 * @language en_US
	 */
	offsetMode;

	/**
	 * @internal
	 */
	animationPose = new Transform();

	/**
	 * @internal
	 */
	_transformDirty;

	/**
	 * @internal
	 */
	_childrenTransformDirty;
	_localDirty;

	/**
	 * @internal
	 */
	_hasConstraint;
	_visible;
	_cachedFrameIndex;

	/**
	 * @internal
	 */
	_boneData;

	/**
	 * @private
	 */
	_parent;

	/**
	 * @internal
	 */
	_cachedFrameIndices;

	_onClear() {
		super._onClear();

		this.offsetMode = OffsetMode.Additive;
		this.animationPose.identity();

		this._transformDirty = false;
		this._childrenTransformDirty = false;
		this._localDirty = true;
		this._hasConstraint = false;
		this._visible = true;
		this._cachedFrameIndex = -1;
		this._boneData = null; //
		this._parent = null; //
		this._cachedFrameIndices = null;
	}

	_updateGlobalTransformMatrix(isCache) {
		// For typescript.
		const boneData = this._boneData;
		const global = this.global;
		const globalTransformMatrix = this.globalTransformMatrix;
		const origin = this.origin;
		const offset = this.offset;
		const animationPose = this.animationPose;
		const parent = this._parent; //

		const flipX = this._armature.flipX;
		const flipY = this._armature.flipY === DragonBones.yDown;
		let inherit = parent !== null;
		let rotation = 0.0;

		if (this.offsetMode === OffsetMode.Additive) {
			if (origin !== null) {
				// global.copyFrom(this.origin).add(this.offset).add(this.animationPose);
				global.x = origin.x + offset.x + animationPose.x;
				global.scaleX = origin.scaleX * offset.scaleX * animationPose.scaleX;
				global.scaleY = origin.scaleY * offset.scaleY * animationPose.scaleY;

				if (DragonBones.yDown) {
					global.y = origin.y + offset.y + animationPose.y;
					global.skew = origin.skew + offset.skew + animationPose.skew;
					global.rotation = origin.rotation + offset.rotation + animationPose.rotation;
				} else {
					global.y = origin.y - offset.y + animationPose.y;
					global.skew = origin.skew - offset.skew + animationPose.skew;
					global.rotation = origin.rotation - offset.rotation + animationPose.rotation;
				}
			} else {
				global.copyFrom(offset);

				if (!DragonBones.yDown) {
					global.y = -global.y;
					global.skew = -global.skew;
					global.rotation = -global.rotation;
				}

				global.add(animationPose);
			}
		} else if (this.offsetMode === OffsetMode.None) {
			if (origin !== null) {
				global.copyFrom(origin).add(animationPose);
			} else {
				global.copyFrom(animationPose);
			}
		} else {
			inherit = false;
			global.copyFrom(offset);

			if (!DragonBones.yDown) {
				global.y = -global.y;
				global.skew = -global.skew;
				global.rotation = -global.rotation;
			}
		}

		if (inherit) {
			const isSurface = parent._boneData.type === BoneType.Surface;
			const surfaceBone = isSurface ? parent._bone : null;
			const parentMatrix = isSurface
				? parent._getGlobalTransformMatrix(global.x, global.y)
				: parent.globalTransformMatrix;

			if (boneData.inheritScale && (!isSurface || surfaceBone !== null)) {
				if (isSurface) {
					if (boneData.inheritRotation) {
						global.rotation += parent.global.rotation;
					}

					surfaceBone.updateGlobalTransform();
					global.scaleX *= surfaceBone.global.scaleX;
					global.scaleY *= surfaceBone.global.scaleY;
					parentMatrix.transformPoint(global.x, global.y, global);
					global.toMatrix(globalTransformMatrix);

					if (boneData.inheritTranslation) {
						global.x = globalTransformMatrix.tx;
						global.y = globalTransformMatrix.ty;
					} else {
						globalTransformMatrix.tx = global.x;
						globalTransformMatrix.ty = global.y;
					}
				} else {
					if (!boneData.inheritRotation) {
						parent.updateGlobalTransform();

						if (flipX && flipY) {
							rotation = global.rotation - (parent.global.rotation + Math.PI);
						} else if (flipX) {
							rotation = global.rotation + parent.global.rotation + Math.PI;
						} else if (flipY) {
							rotation = global.rotation + parent.global.rotation;
						} else {
							rotation = global.rotation - parent.global.rotation;
						}

						global.rotation = rotation;
					}

					global.toMatrix(globalTransformMatrix);
					globalTransformMatrix.concat(parentMatrix);

					if (boneData.inheritTranslation) {
						global.x = globalTransformMatrix.tx;
						global.y = globalTransformMatrix.ty;
					} else {
						globalTransformMatrix.tx = global.x;
						globalTransformMatrix.ty = global.y;
					}

					if (isCache) {
						global.fromMatrix(globalTransformMatrix);
					} else {
						this._globalDirty = true;
					}
				}
			} else {
				if (boneData.inheritTranslation) {
					const x = global.x;
					const y = global.y;
					global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
					global.y = parentMatrix.b * x + parentMatrix.d * y + parentMatrix.ty;
				} else {
					if (flipX) {
						global.x = -global.x;
					}

					if (flipY) {
						global.y = -global.y;
					}
				}

				if (boneData.inheritRotation) {
					parent.updateGlobalTransform();

					if (parent.global.scaleX < 0.0) {
						rotation = global.rotation + parent.global.rotation + Math.PI;
					} else {
						rotation = global.rotation + parent.global.rotation;
					}

					if (parentMatrix.a * parentMatrix.d - parentMatrix.b * parentMatrix.c < 0.0) {
						rotation -= global.rotation * 2.0;

						if (flipX !== flipY || boneData.inheritReflection) {
							global.skew += Math.PI;
						}

						if (!dragonBones.DragonBones.yDown) {
							global.skew = -global.skew;
						}
					}

					global.rotation = rotation;
				} else if (flipX || flipY) {
					if (flipX && flipY) {
						rotation = global.rotation + Math.PI;
					} else {
						if (flipX) {
							rotation = Math.PI - global.rotation;
						} else {
							rotation = -global.rotation;
						}

						global.skew += Math.PI;
					}

					global.rotation = rotation;
				}

				global.toMatrix(globalTransformMatrix);
			}
		} else {
			if (flipX || flipY) {
				if (flipX) {
					global.x = -global.x;
				}

				if (flipY) {
					global.y = -global.y;
				}

				if (flipX && flipY) {
					rotation = global.rotation + Math.PI;
				} else {
					if (flipX) {
						rotation = Math.PI - global.rotation;
					} else {
						rotation = -global.rotation;
					}

					global.skew += Math.PI;
				}

				global.rotation = rotation;
			}

			global.toMatrix(globalTransformMatrix);
		}
	}
	/**
	 * @internal
	 */
	_updateAlpha() {
		if (this._parent !== null) {
			this._globalAlpha = this._alpha * this._parent._globalAlpha;
		} else {
			this._globalAlpha = this._alpha * this._armature._globalAlpha;
		}
	}
	/**
	 * @internal
	 */
	init(boneData, armatureValue) {
		if (this._boneData !== null) {
			return;
		}

		this._boneData = boneData;
		this._armature = armatureValue;
		this._alpha = this._boneData.alpha;

		if (this._boneData.parent !== null) {
			this._parent = this._armature.getBone(this._boneData.parent.name);
		}

		this._armature._addBone(this);
		//
		this.origin = this._boneData.transform;
	}
	/**
	 * @internal
	 */
	update(cacheFrameIndex) {
		if (cacheFrameIndex >= 0 && this._cachedFrameIndices !== null) {
			const cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex];
			if (cachedFrameIndex >= 0 && this._cachedFrameIndex === cachedFrameIndex) {
				// Same cache.
				this._transformDirty = false;
			} else if (cachedFrameIndex >= 0) {
				// Has been Cached.
				this._transformDirty = true;
				this._cachedFrameIndex = cachedFrameIndex;
			} else {
				if (this._hasConstraint) {
					// Update constraints.
					for (const constraint of this._armature._constraints) {
						if (constraint._root === this) {
							constraint.update();
						}
					}
				}

				if (this._transformDirty || (this._parent !== null && this._parent._childrenTransformDirty)) {
					// Dirty.
					this._transformDirty = true;
					this._cachedFrameIndex = -1;
				} else if (this._cachedFrameIndex >= 0) {
					// Same cache, but not set index yet.
					this._transformDirty = false;
					this._cachedFrameIndices[cacheFrameIndex] = this._cachedFrameIndex;
				} else {
					// Dirty.
					this._transformDirty = true;
					this._cachedFrameIndex = -1;
				}
			}
		} else {
			if (this._hasConstraint) {
				// Update constraints.
				for (const constraint of this._armature._constraints) {
					if (constraint._root === this) {
						constraint.update();
					}
				}
			}

			if (this._transformDirty || (this._parent !== null && this._parent._childrenTransformDirty)) {
				// Dirty.
				cacheFrameIndex = -1;
				this._transformDirty = true;
				this._cachedFrameIndex = -1;
			}
		}

		if (this._transformDirty) {
			this._transformDirty = false;
			this._childrenTransformDirty = true;
			//
			if (this._cachedFrameIndex < 0) {
				const isCache = cacheFrameIndex >= 0;
				if (this._localDirty) {
					this._updateGlobalTransformMatrix(isCache);
				}

				if (isCache && this._cachedFrameIndices !== null) {
					this._cachedFrameIndex = this._cachedFrameIndices[
						cacheFrameIndex
					] = this._armature._armatureData.setCacheFrame(this.globalTransformMatrix, this.global);
				}
			} else {
				this._armature._armatureData.getCacheFrame(
					this.globalTransformMatrix,
					this.global,
					this._cachedFrameIndex
				);
			}
			//
		} else if (this._childrenTransformDirty) {
			this._childrenTransformDirty = false;
		}

		this._localDirty = true;
	}
	/**
	 * @internal
	 */
	updateByConstraint() {
		if (this._localDirty) {
			this._localDirty = false;

			if (this._transformDirty || (this._parent !== null && this._parent._childrenTransformDirty)) {
				this._updateGlobalTransformMatrix(true);
			}

			this._transformDirty = true;
		}
	}

	/**
	 * - Forces the bone to update the transform in the next frame.
	 * When the bone is not animated or its animation state is finished, the bone will not continue to update,
	 * and when the skeleton must be updated for some reason, the method needs to be called explicitly.
	 * @example
	 * <pre>
	 *     let bone = armature.getBone("arm");
	 *     bone.offset.scaleX = 2.0;
	 *     bone.invalidUpdate();
	 * </pre>
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	invalidUpdate() {
		this._transformDirty = true;
	}

	/**
	 * - Check whether the bone contains a specific bone.
	 * @see dragonBones.Bone
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	contains(value) {
		if (value === this) {
			return false;
		}

		let ancestor = value;
		while (ancestor !== this && ancestor !== null) {
			ancestor = ancestor.parent;
		}

		return ancestor === this;
	}

	/**
	 * - The bone data.
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	get boneData() {
		return this._boneData;
	}

	/**
	 * - The visible of all slots in the bone.
	 * @default true
	 * @see dragonBones.Slot#visible
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	get visible() {
		return this._visible;
	}

	set visible(value) {
		if (this._visible === value) {
			return;
		}

		this._visible = value;

		for (const slot of this._armature.getSlots()) {
			if (slot.parent === this) {
				slot._updateVisible();
			}
		}
	}

	/**
	 * - The bone name.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	get name() {
		return this._boneData.name;
	}

	/**
	 * - The parent bone to which it belongs.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	get parent() {
		return this._parent;
	}
}
