import { WorldClock } from '../animation/WorldClock';
import { EventObject } from '../event/EventObject';

/**
 * @private
 */
export const BinaryOffset = {
	WeigthBoneCount: 0,
	WeigthFloatOffset: 1,
	WeigthBoneIndices: 2,

	GeometryVertexCount: 0,
	GeometryTriangleCount: 1,
	GeometryFloatOffset: 2,
	GeometryWeightOffset: 3,
	GeometryVertexIndices: 4,

	TimelineScale: 0,
	TimelineOffset: 1,
	TimelineKeyFrameCount: 2,
	TimelineFrameValueCount: 3,
	TimelineFrameValueOffset: 4,
	TimelineFrameOffset: 5,

	FramePosition: 0,
	FrameTweenType: 1,
	FrameTweenEasingOrCurveSampleCount: 2,
	FrameCurveSamples: 3,

	DeformVertexOffset: 0,
	DeformCount: 1,
	DeformValueCount: 2,
	DeformValueOffset: 3,
	DeformFloatOffset: 4,
};

/**
 * @private
 */
export const ArmatureType = {
	Armature: 0,
	MovieClip: 1,
	Stage: 2,
};
/**
 * @private
 */
export const BoneType = {
	Bone: 0,
	Surface: 1,
};
/**
 * @private
 */
export const DisplayType = {
	Image: 0,
	Armature: 1,
	Mesh: 2,
	BoundingBox: 3,
	Path: 4,
};
/**
 * - Bounding box type.
 * @version DragonBones 5.0
 * @language en_US
 */

export const BoundingBoxType = {
	Rectangle: 0,
	Ellipse: 1,
	Polygon: 2,
};
/**
 * @private
 */
export const ActionType = {
	Play: 0,
	Frame: 10,
	Sound: 11,
};
/**
 * @private
 */
export const BlendMode = {
	Normal: 0,
	Add: 1,
	Alpha: 2,
	Darken: 3,
	Difference: 4,
	Erase: 5,
	HardLight: 6,
	Invert: 7,
	Layer: 8,
	Lighten: 9,
	Multiply: 10,
	Overlay: 11,
	Screen: 12,
	Subtract: 13,
};
/**
 * @private
 */
export const TweenType = {
	None: 0,
	Line: 1,
	Curve: 2,
	QuadIn: 3,
	QuadOut: 4,
	QuadInOut: 5,
};
/**
 * @private
 */
export const TimelineType = {
	Action: 0,
	ZOrder: 1,

	BoneAll: 10,
	BoneTranslate: 11,
	BoneRotate: 12,
	BoneScale: 13,

	Surface: 50,
	BoneAlpha: 60,

	SlotDisplay: 20,
	SlotColor: 21,
	SlotDeform: 22,
	SlotZIndex: 23,
	SlotAlpha: 24,

	IKConstraint: 30,

	AnimationProgress: 40,
	AnimationWeight: 41,
	AnimationParameter: 42,
};

/**
 * - Offset mode.
 * @version DragonBones 5.5
 * @language en_US
 */
export const OffsetMode = {
	None: 1,
	Additive: 2,
	Override: 3,
};

/**
 * - Animation fade out mode.
 * @version DragonBones 4.5
 * @language en_US
 */
export const AnimationFadeOutMode = {
	/**
	 * - Fade out the animation states of the same layer.
	 * @language en_US
	 */

	SameLayer: 1,
	/**
	 * - Fade out the animation states of the same group.
	 * @language en_US
	 */

	SameGroup: 2,
	/**
	 * - Fade out the animation states of the same layer and group.
	 * @language en_US
	 */

	SameLayerAndGroup: 3,
	/**
	 * - Fade out of all animation states.
	 * @language en_US
	 */

	All: 4,
	/**
	 * - Does not replace the animation state with the same name.
	 * @language en_US
	 */

	Single: 5,
};
/**
 * @private
 */
export const AnimationBlendType = {
	None: 1,
	E1D: 2,
};
/**
 * @private
 */
export const AnimationBlendMode = {
	Additive: 1,
	Override: 2,
};
/**
 * @private
 */
export const ConstraintType = {
	IK: 1,
	Path: 2,
};
/**
 * @private
 */
export const PositionMode = {
	Fixed: 1,
	Percent: 2,
};
/**
 * @private
 */
export const SpacingMode = {
	Length: 1,
	Fixed: 2,
	Percent: 3,
};
/**
 * @private
 */
export const RotateMode = {
	Tangent: 1,
	Chain: 2,
	ChainScale: 3,
};

/**
 * @private
 */
export class DragonBones {
	VERSION = '5.7.000';

	yDown = true;
	debug = false;
	debugDraw = false;

	_clock = new WorldClock();
	_events = [];
	_objects = [];
	_eventManager = null;

	constructor(eventManager) {
		this._eventManager = eventManager;
	}

	advanceTime(passedTime) {
		if (this._objects.length > 0) {
			for (const object of this._objects) {
				object.returnToPool();
			}

			this._objects.length = 0;
		}

		this._clock.advanceTime(passedTime);

		if (this._events.length > 0) {
			for (let i = 0; i < this._events.length; ++i) {
				const eventObject = this._events[i];
				const armature = eventObject.armature;

				if (armature._armatureData !== null) {
					// May be armature disposed before advanceTime.
					armature.eventDispatcher.dispatchDBEvent(eventObject.type, eventObject);
					if (eventObject.type === EventObject.SOUND_EVENT) {
						this._eventManager.dispatchDBEvent(eventObject.type, eventObject);
					}
				}

				this.bufferObject(eventObject);
			}

			this._events.length = 0;
		}
	}

	bufferEvent(value) {
		if (this._events.indexOf(value) < 0) {
			this._events.push(value);
		}
	}

	bufferObject(object) {
		if (this._objects.indexOf(object) < 0) {
			this._objects.push(object);
		}
	}

	get clock() {
		return this._clock;
	}

	get eventManager() {
		return this._eventManager;
	}
}
