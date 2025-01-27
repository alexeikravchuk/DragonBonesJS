import { BaseObject } from '../core/BaseObject';
import {
	ActionType,
	AnimationBlendType,
	ArmatureType,
	BlendMode,
	BoneType,
	BoundingBoxType,
	ConstraintType,
	DisplayType,
	PositionMode,
	RotateMode,
	SpacingMode,
} from '../core/DragonBones';
import { ColorTransform } from '../geom/ColorTransform';
import { Matrix } from '../geom/Matrix';
import { Point } from '../geom/Point';
import { Transform } from '../geom/Transform';
import { ArmatureData, BoneData, SlotData } from '../model/ArmatureData';
import { IKConstraintData } from '../model/ConstraintData';
import {
	ArmatureDisplayData,
	BoundingBoxDisplayData,
	ImageDisplayData,
	MeshDisplayData,
	PathDisplayData,
} from '../model/DisplayData';
import { DragonBonesData } from '../model/DragonBonesData';
import { SkinData } from '../model/SkinData';
import { ActionData, UserData } from '../model/UserData';

/**
 * @private
 */
export const FrameValueType = {
	Step: 0,
	Int: 1,
	Float: 2,
};

/**
 * @private
 */
export class DataParser {
	static DATA_VERSION_2_3 = '2.3';
	static DATA_VERSION_3_0 = '3.0';
	static DATA_VERSION_4_0 = '4.0';
	static DATA_VERSION_4_5 = '4.5';
	static DATA_VERSION_5_0 = '5.0';
	static DATA_VERSION_5_5 = '5.5';
	static DATA_VERSION_5_6 = '5.6';
	static DATA_VERSION = DataParser.DATA_VERSION_5_6;

	static DATA_VERSIONS = [
		DataParser.DATA_VERSION_4_0,
		DataParser.DATA_VERSION_4_5,
		DataParser.DATA_VERSION_5_0,
		DataParser.DATA_VERSION_5_5,
		DataParser.DATA_VERSION_5_6,
	];

	static TEXTURE_ATLAS = 'textureAtlas';
	static SUB_TEXTURE = 'SubTexture';
	static FORMAT = 'format';
	static IMAGE_PATH = 'imagePath';
	static WIDTH = 'width';
	static HEIGHT = 'height';
	static ROTATED = 'rotated';
	static FRAME_X = 'frameX';
	static FRAME_Y = 'frameY';
	static FRAME_WIDTH = 'frameWidth';
	static FRAME_HEIGHT = 'frameHeight';

	static DRADON_BONES = 'dragonBones';
	static USER_DATA = 'userData';
	static ARMATURE = 'armature';
	static CANVAS = 'canvas';
	static BONE = 'bone';
	static SURFACE = 'surface';
	static SLOT = 'slot';
	static CONSTRAINT = 'constraint';
	static SKIN = 'skin';
	static DISPLAY = 'display';
	static FRAME = 'frame';
	static IK = 'ik';
	static PATH_CONSTRAINT = 'path';

	static ANIMATION = 'animation';
	static TIMELINE = 'timeline';
	static FFD = 'ffd';
	static TRANSLATE_FRAME = 'translateFrame';
	static ROTATE_FRAME = 'rotateFrame';
	static SCALE_FRAME = 'scaleFrame';
	static DISPLAY_FRAME = 'displayFrame';
	static COLOR_FRAME = 'colorFrame';
	static DEFAULT_ACTIONS = 'defaultActions';
	static ACTIONS = 'actions';
	static EVENTS = 'events';

	static INTS = 'ints';
	static FLOATS = 'floats';
	static STRINGS = 'strings';

	static TRANSFORM = 'transform';
	static PIVOT = 'pivot';
	static AABB = 'aabb';
	static COLOR = 'color';

	static VERSION = 'version';
	static COMPATIBLE_VERSION = 'compatibleVersion';
	static FRAME_RATE = 'frameRate';
	static TYPE = 'type';
	static SUB_TYPE = 'subType';
	static NAME = 'name';
	static PARENT = 'parent';
	static TARGET = 'target';
	static STAGE = 'stage';
	static SHARE = 'share';
	static PATH = 'path';
	static LENGTH = 'length';
	static DISPLAY_INDEX = 'displayIndex';
	static Z_ORDER = 'zOrder';
	static Z_INDEX = 'zIndex';
	static BLEND_MODE = 'blendMode';
	static INHERIT_TRANSLATION = 'inheritTranslation';
	static INHERIT_ROTATION = 'inheritRotation';
	static INHERIT_SCALE = 'inheritScale';
	static INHERIT_REFLECTION = 'inheritReflection';
	static INHERIT_ANIMATION = 'inheritAnimation';
	static INHERIT_DEFORM = 'inheritDeform';
	static SEGMENT_X = 'segmentX';
	static SEGMENT_Y = 'segmentY';
	static BEND_POSITIVE = 'bendPositive';
	static CHAIN = 'chain';
	static WEIGHT = 'weight';

	static BLEND_TYPE = 'blendType';
	static FADE_IN_TIME = 'fadeInTime';
	static PLAY_TIMES = 'playTimes';
	static SCALE = 'scale';
	static OFFSET = 'offset';
	static POSITION = 'position';
	static DURATION = 'duration';
	static TWEEN_EASING = 'tweenEasing';
	static TWEEN_ROTATE = 'tweenRotate';
	static TWEEN_SCALE = 'tweenScale';
	static CLOCK_WISE = 'clockwise';
	static CURVE = 'curve';
	static SOUND = 'sound';
	static EVENT = 'event';
	static ACTION = 'action';

	static X = 'x';
	static Y = 'y';
	static SKEW_X = 'skX';
	static SKEW_Y = 'skY';
	static SCALE_X = 'scX';
	static SCALE_Y = 'scY';
	static VALUE = 'value';
	static ROTATE = 'rotate';
	static SKEW = 'skew';
	static ALPHA = 'alpha';

	static ALPHA_OFFSET = 'aO';
	static RED_OFFSET = 'rO';
	static GREEN_OFFSET = 'gO';
	static BLUE_OFFSET = 'bO';
	static ALPHA_MULTIPLIER = 'aM';
	static RED_MULTIPLIER = 'rM';
	static GREEN_MULTIPLIER = 'gM';
	static BLUE_MULTIPLIER = 'bM';

	static UVS = 'uvs';
	static VERTICES = 'vertices';
	static TRIANGLES = 'triangles';
	static WEIGHTS = 'weights';
	static SLOT_POSE = 'slotPose';
	static BONE_POSE = 'bonePose';

	static BONES = 'bones';
	static POSITION_MODE = 'positionMode';
	static SPACING_MODE = 'spacingMode';
	static ROTATE_MODE = 'rotateMode';
	static SPACING = 'spacing';
	static ROTATE_OFFSET = 'rotateOffset';
	static ROTATE_MIX = 'rotateMix';
	static TRANSLATE_MIX = 'translateMix';

	static TARGET_DISPLAY = 'targetDisplay';
	static CLOSED = 'closed';
	static CONSTANT_SPEED = 'constantSpeed';
	static VERTEX_COUNT = 'vertexCount';
	static LENGTHS = 'lengths';

	static GOTO_AND_PLAY = 'gotoAndPlay';

	static DEFAULT_NAME = 'default';

	static _getArmatureType(value) {
		switch (value.toLowerCase()) {
			case 'stage':
				return ArmatureType.Stage;

			case 'armature':
				return ArmatureType.Armature;

			case 'movieclip':
				return ArmatureType.MovieClip;

			default:
				return ArmatureType.Armature;
		}
	}

	static _getBoneType(value) {
		switch (value.toLowerCase()) {
			case 'bone':
				return BoneType.Bone;

			case 'surface':
				return BoneType.Surface;

			default:
				return BoneType.Bone;
		}
	}

	static _getPositionMode(value) {
		switch (value.toLocaleLowerCase()) {
			case 'percent':
				return PositionMode.Percent;

			case 'fixed':
				return PositionMode.Fixed;

			default:
				return PositionMode.Percent;
		}
	}

	static _getSpacingMode(value) {
		switch (value.toLocaleLowerCase()) {
			case 'length':
				return SpacingMode.Length;

			case 'percent':
				return SpacingMode.Percent;

			case 'fixed':
				return SpacingMode.Fixed;

			default:
				return SpacingMode.Length;
		}
	}

	static _getRotateMode(value) {
		switch (value.toLocaleLowerCase()) {
			case 'tangent':
				return RotateMode.Tangent;

			case 'chain':
				return RotateMode.Chain;

			case 'chainscale':
				return RotateMode.ChainScale;

			default:
				return RotateMode.Tangent;
		}
	}

	static _getDisplayType(value) {
		switch (value.toLowerCase()) {
			case 'image':
				return DisplayType.Image;

			case 'mesh':
				return DisplayType.Mesh;

			case 'armature':
				return DisplayType.Armature;

			case 'boundingbox':
				return DisplayType.BoundingBox;

			case 'path':
				return DisplayType.Path;

			default:
				return DisplayType.Image;
		}
	}

	static _getBoundingBoxType(value) {
		switch (value.toLowerCase()) {
			case 'rectangle':
				return BoundingBoxType.Rectangle;

			case 'ellipse':
				return BoundingBoxType.Ellipse;

			case 'polygon':
				return BoundingBoxType.Polygon;

			default:
				return BoundingBoxType.Rectangle;
		}
	}

	static _getBlendMode(value) {
		switch (value.toLowerCase()) {
			case 'normal':
				return BlendMode.Normal;

			case 'add':
				return BlendMode.Add;

			case 'alpha':
				return BlendMode.Alpha;

			case 'darken':
				return BlendMode.Darken;

			case 'difference':
				return BlendMode.Difference;

			case 'erase':
				return BlendMode.Erase;

			case 'hardlight':
				return BlendMode.HardLight;

			case 'invert':
				return BlendMode.Invert;

			case 'layer':
				return BlendMode.Layer;

			case 'lighten':
				return BlendMode.Lighten;

			case 'multiply':
				return BlendMode.Multiply;

			case 'overlay':
				return BlendMode.Overlay;

			case 'screen':
				return BlendMode.Screen;

			case 'subtract':
				return BlendMode.Subtract;

			default:
				return BlendMode.Normal;
		}
	}

	static _getAnimationBlendType(value) {
		switch (value.toLowerCase()) {
			case 'none':
				return AnimationBlendType.None;

			case '1d':
				return AnimationBlendType.E1D;

			default:
				return AnimationBlendType.None;
		}
	}

	static _getActionType(value) {
		switch (value.toLowerCase()) {
			case 'play':
				return ActionType.Play;

			case 'frame':
				return ActionType.Frame;

			case 'sound':
				return ActionType.Sound;

			default:
				return ActionType.Play;
		}
	}

	static _getBoolean(rawData, key, defaultValue) {
		if (key in rawData) {
			const value = rawData[key];
			const type = typeof value;

			if (type === 'boolean') {
				return value;
			} else if (type === 'string') {
				switch (value) {
					case '0':
					case 'NaN':
					case '':
					case 'false':
					case 'null':
					case 'undefined':
						return false;

					default:
						return true;
				}
			} else {
				return !!value;
			}
		}

		return defaultValue;
	}

	static _getNumber(rawData, key, defaultValue) {
		if (key in rawData) {
			const value = rawData[key];
			if (value === null || value === 'NaN') {
				return defaultValue;
			}

			return +value || 0;
		}

		return defaultValue;
	}

	static _getString(rawData, key, defaultValue) {
		if (key in rawData) {
			const value = rawData[key];
			const type = typeof value;

			if (type === 'string') {
				return value;
			}

			return String(value);
		}

		return defaultValue;
	}

	_actionFrames = [];
	_animation = null;
	_armature = null;
	_cacheBones = {};
	_cacheRawMeshes = [];
	_cacheMeshes = [];
	_colorArray = [];
	_data = null;
	_defaultColorOffset = -1;
	_floatArray = [];
	_frameArray = [];
	_frameDefaultValue = 0.0;
	_frameFloatArray = [];
	_frameIntArray = [];
	_frameValueScale = 1.0;
	_frameValueType = FrameValueType.Step;
	_helpArray = [];
	_helpColorTransform = new ColorTransform();
	_helpMatrixA = new Matrix();
	_helpMatrixB = new Matrix();
	_helpPoint = new Point();
	_helpTransform = new Transform();
	_intArray = [];
	_prevClockwise = 0;
	_prevRotation = 0.0;
	_rawBones = [];
	_rawTextureAtlases = null;
	_skin = null;
	_slot = null;
	_slotChildActions = {};
	_timeline = null;
	_timelineArray = [];
	_weightSlotPose = {};
	_weightBonePoses = {};

	_getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, t, result) {
		const l_t = 1.0 - t;
		const powA = l_t * l_t;
		const powB = t * t;
		const kA = l_t * powA;
		const kB = 3.0 * t * powA;
		const kC = 3.0 * l_t * powB;
		const kD = t * powB;

		result.x = kA * x1 + kB * x2 + kC * x3 + kD * x4;
		result.y = kA * y1 + kB * y2 + kC * y3 + kD * y4;
	}

	_mergeActionFrame(rawData, frameStart, type, bone, slot) {
		const actionOffset = this._armature.actions.length;
		const actions = this._parseActionData(rawData, type, bone, slot);
		let frameIndex = 0;
		let frame = null;

		for (const action of actions) {
			this._armature.addAction(action, false);
		}

		if (this._actionFrames.length === 0) {
			// First frame.
			frame = new ActionFrame();
			frame.frameStart = 0;
			this._actionFrames.push(frame);
			frame = null;
		}

		for (const eachFrame of this._actionFrames) {
			// Get same frame.
			if (eachFrame.frameStart === frameStart) {
				frame = eachFrame;
				break;
			} else if (eachFrame.frameStart > frameStart) {
				break;
			}

			frameIndex++;
		}

		if (frame === null) {
			// Create and cache frame.
			frame = new ActionFrame();
			frame.frameStart = frameStart;
			this._actionFrames.splice(frameIndex, 0, frame);
		}

		for (let i = 0; i < actions.length; ++i) {
			// Cache action offsets.
			frame.actions.push(actionOffset + i);
		}
	}

	_modifyArray() {
		// Align.
		if (this._intArray.length % Int16Array.BYTES_PER_ELEMENT !== 0) {
			this._intArray.push(0);
		}

		if (this._frameIntArray.length % Int16Array.BYTES_PER_ELEMENT !== 0) {
			this._frameIntArray.push(0);
		}

		if (this._frameArray.length % Int16Array.BYTES_PER_ELEMENT !== 0) {
			this._frameArray.push(0);
		}

		if (this._timelineArray.length % Uint16Array.BYTES_PER_ELEMENT !== 0) {
			this._timelineArray.push(0);
		}

		if (this._timelineArray.length % Int16Array.BYTES_PER_ELEMENT !== 0) {
			this._colorArray.push(0);
		}

		const l1 = this._intArray.length * Int16Array.BYTES_PER_ELEMENT;
		const l2 = this._floatArray.length * Float32Array.BYTES_PER_ELEMENT;
		const l3 = this._frameIntArray.length * Int16Array.BYTES_PER_ELEMENT;
		const l4 = this._frameFloatArray.length * Float32Array.BYTES_PER_ELEMENT;
		const l5 = this._frameArray.length * Int16Array.BYTES_PER_ELEMENT;
		const l6 = this._timelineArray.length * Uint16Array.BYTES_PER_ELEMENT;
		const l7 = this._colorArray.length * Int16Array.BYTES_PER_ELEMENT;
		const lTotal = l1 + l2 + l3 + l4 + l5 + l6 + l7;
		//
		const binary = new ArrayBuffer(lTotal);
		const intArray = new Int16Array(binary, 0, this._intArray.length);
		const floatArray = new Float32Array(binary, l1, this._floatArray.length);
		const frameIntArray = new Int16Array(binary, l1 + l2, this._frameIntArray.length);
		const frameFloatArray = new Float32Array(binary, l1 + l2 + l3, this._frameFloatArray.length);
		const frameArray = new Int16Array(binary, l1 + l2 + l3 + l4, this._frameArray.length);
		const timelineArray = new Uint16Array(binary, l1 + l2 + l3 + l4 + l5, this._timelineArray.length);
		const colorArray = new Int16Array(binary, l1 + l2 + l3 + l4 + l5 + l6, this._colorArray.length);

		for (let i = 0, l = this._intArray.length; i < l; ++i) {
			intArray[i] = this._intArray[i];
		}

		for (let i = 0, l = this._floatArray.length; i < l; ++i) {
			floatArray[i] = this._floatArray[i];
		}

		for (let i = 0, l = this._frameIntArray.length; i < l; ++i) {
			frameIntArray[i] = this._frameIntArray[i];
		}

		for (let i = 0, l = this._frameFloatArray.length; i < l; ++i) {
			frameFloatArray[i] = this._frameFloatArray[i];
		}

		for (let i = 0, l = this._frameArray.length; i < l; ++i) {
			frameArray[i] = this._frameArray[i];
		}

		for (let i = 0, l = this._timelineArray.length; i < l; ++i) {
			timelineArray[i] = this._timelineArray[i];
		}

		for (let i = 0, l = this._colorArray.length; i < l; ++i) {
			colorArray[i] = this._colorArray[i];
		}

		this._data.binary = binary;
		this._data.intArray = intArray;
		this._data.floatArray = floatArray;
		this._data.frameIntArray = frameIntArray;
		this._data.frameFloatArray = frameFloatArray;
		this._data.frameArray = frameArray;
		this._data.timelineArray = timelineArray;
		this._data.colorArray = colorArray;
		this._defaultColorOffset = -1;
	}

	_parseArmature(rawData, scale) {
		const armature = BaseObject.borrowObject(ArmatureData);
		armature.name = DataParser._getString(rawData, DataParser.NAME, '');
		armature.frameRate = DataParser._getNumber(rawData, DataParser.FRAME_RATE, this._data.frameRate);
		armature.scale = scale;

		if (DataParser.TYPE in rawData && typeof rawData[DataParser.TYPE] === 'string') {
			armature.type = DataParser._getArmatureType(rawData[DataParser.TYPE]);
		} else {
			armature.type = DataParser._getNumber(rawData, DataParser.TYPE, ArmatureType.Armature);
		}

		if (armature.frameRate === 0) {
			// Data error.
			armature.frameRate = 24;
		}

		this._armature = armature;

		if (DataParser.CANVAS in rawData) {
			const rawCanvas = rawData[DataParser.CANVAS];
			const canvas = BaseObject.borrowObject(CanvasData);

			if (DataParser.COLOR in rawCanvas) {
				canvas.hasBackground = true;
			} else {
				canvas.hasBackground = false;
			}

			canvas.color = DataParser._getNumber(rawCanvas, DataParser.COLOR, 0);
			canvas.x = DataParser._getNumber(rawCanvas, DataParser.X, 0) * armature.scale;
			canvas.y = DataParser._getNumber(rawCanvas, DataParser.Y, 0) * armature.scale;
			canvas.width = DataParser._getNumber(rawCanvas, DataParser.WIDTH, 0) * armature.scale;
			canvas.height = DataParser._getNumber(rawCanvas, DataParser.HEIGHT, 0) * armature.scale;
			armature.canvas = canvas;
		}

		if (DataParser.AABB in rawData) {
			const rawAABB = rawData[DataParser.AABB];
			armature.aabb.x = DataParser._getNumber(rawAABB, DataParser.X, 0.0) * armature.scale;
			armature.aabb.y = DataParser._getNumber(rawAABB, DataParser.Y, 0.0) * armature.scale;
			armature.aabb.width = DataParser._getNumber(rawAABB, DataParser.WIDTH, 0.0) * armature.scale;
			armature.aabb.height = DataParser._getNumber(rawAABB, DataParser.HEIGHT, 0.0) * armature.scale;
		}

		if (DataParser.BONE in rawData) {
			const rawBones = rawData[DataParser.BONE];
			for (const rawBone of rawBones) {
				const parentName = DataParser._getString(rawBone, DataParser.PARENT, '');
				const bone = this._parseBone(rawBone);

				if (parentName.length > 0) {
					// Get bone parent.
					const parent = armature.getBone(parentName);
					if (parent !== null) {
						bone.parent = parent;
					} else {
						// Cache.
						if (!(parentName in this._cacheBones)) {
							this._cacheBones[parentName] = [];
						}

						this._cacheBones[parentName].push(bone);
					}
				}

				if (bone.name in this._cacheBones) {
					for (const child of this._cacheBones[bone.name]) {
						child.parent = bone;
					}

					delete this._cacheBones[bone.name];
				}

				armature.addBone(bone);
				this._rawBones.push(bone); // Cache raw bones sort.
			}
		}

		if (DataParser.IK in rawData) {
			const rawIKS = rawData[DataParser.IK];
			for (const rawIK of rawIKS) {
				const constraint = this._parseIKConstraint(rawIK);
				if (constraint) {
					armature.addConstraint(constraint);
				}
			}
		}

		armature.sortBones();

		if (DataParser.SLOT in rawData) {
			let zOrder = 0;
			const rawSlots = rawData[DataParser.SLOT];
			for (const rawSlot of rawSlots) {
				armature.addSlot(this._parseSlot(rawSlot, zOrder++));
			}
		}

		if (DataParser.SKIN in rawData) {
			const rawSkins = rawData[DataParser.SKIN];
			for (const rawSkin of rawSkins) {
				armature.addSkin(this._parseSkin(rawSkin));
			}
		}

		if (DataParser.PATH_CONSTRAINT in rawData) {
			const rawPaths = rawData[DataParser.PATH_CONSTRAINT];
			for (const rawPath of rawPaths) {
				const constraint = this._parsePathConstraint(rawPath);
				if (constraint) {
					armature.addConstraint(constraint);
				}
			}
		}

		for (let i = 0, l = this._cacheRawMeshes.length; i < l; ++i) {
			// Link mesh.
			const rawData = this._cacheRawMeshes[i];
			const shareName = DataParser._getString(rawData, DataParser.SHARE, '');
			if (shareName.length === 0) {
				continue;
			}

			let skinName = DataParser._getString(rawData, DataParser.SKIN, DataParser.DEFAULT_NAME);
			if (skinName.length === 0) {
				//
				skinName = DataParser.DEFAULT_NAME;
			}

			const shareMesh = armature.getMesh(skinName, '', shareName); // TODO slot;
			if (shareMesh === null) {
				continue; // Error.
			}

			const mesh = this._cacheMeshes[i];
			mesh.geometry.shareFrom(shareMesh.geometry);
		}

		if (DataParser.ANIMATION in rawData) {
			const rawAnimations = rawData[DataParser.ANIMATION];
			for (const rawAnimation of rawAnimations) {
				const animation = this._parseAnimation(rawAnimation);
				armature.addAnimation(animation);
			}
		}

		if (DataParser.DEFAULT_ACTIONS in rawData) {
			const actions = this._parseActionData(
				rawData[DataParser.DEFAULT_ACTIONS],
				ActionType.Play,
				null,
				null
			);
			for (const action of actions) {
				armature.addAction(action, true);

				if (action.type === ActionType.Play) {
					// Set default animation from default action.
					const animation = armature.getAnimation(action.name);
					if (animation !== null) {
						armature.defaultAnimation = animation;
					}
				}
			}
		}

		if (DataParser.ACTIONS in rawData) {
			const actions = this._parseActionData(rawData[DataParser.ACTIONS], ActionType.Play, null, null);
			for (const action of actions) {
				armature.addAction(action, false);
			}
		}

		// Clear helper.
		this._rawBones.length = 0;
		this._cacheRawMeshes.length = 0;
		this._cacheMeshes.length = 0;
		this._armature = null;

		for (let k in this._weightSlotPose) {
			delete this._weightSlotPose[k];
		}
		for (let k in this._weightBonePoses) {
			delete this._weightBonePoses[k];
		}
		for (let k in this._cacheBones) {
			delete this._cacheBones[k];
		}
		for (let k in this._slotChildActions) {
			delete this._slotChildActions[k];
		}

		return armature;
	}

	_parseBone(rawData) {
		let type = BoneType.Bone;

		if (DataParser.TYPE in rawData && typeof rawData[DataParser.TYPE] === 'string') {
			type = DataParser._getBoneType(rawData[DataParser.TYPE]);
		} else {
			type = DataParser._getNumber(rawData, DataParser.TYPE, BoneType.Bone);
		}

		if (type === BoneType.Bone) {
			const scale = this._armature.scale;
			const bone = BaseObject.borrowObject(BoneData);
			bone.inheritTranslation = DataParser._getBoolean(rawData, DataParser.INHERIT_TRANSLATION, true);
			bone.inheritRotation = DataParser._getBoolean(rawData, DataParser.INHERIT_ROTATION, true);
			bone.inheritScale = DataParser._getBoolean(rawData, DataParser.INHERIT_SCALE, true);
			bone.inheritReflection = DataParser._getBoolean(rawData, DataParser.INHERIT_REFLECTION, true);
			bone.length = DataParser._getNumber(rawData, DataParser.LENGTH, 0) * scale;
			bone.alpha = DataParser._getNumber(rawData, DataParser.ALPHA, 1.0);
			bone.name = DataParser._getString(rawData, DataParser.NAME, '');

			if (DataParser.TRANSFORM in rawData) {
				this._parseTransform(rawData[DataParser.TRANSFORM], bone.transform, scale);
			}

			return bone;
		}

		const surface = BaseObject.borrowObject(SurfaceData);
		surface.alpha = DataParser._getNumber(rawData, DataParser.ALPHA, 1.0);
		surface.name = DataParser._getString(rawData, DataParser.NAME, '');
		surface.segmentX = DataParser._getNumber(rawData, DataParser.SEGMENT_X, 0);
		surface.segmentY = DataParser._getNumber(rawData, DataParser.SEGMENT_Y, 0);
		this._parseGeometry(rawData, surface.geometry);

		return surface;
	}

	_parseTransform(rawData, transform, scale) {
		transform.x = DataParser._getNumber(rawData, DataParser.X, 0.0) * scale;
		transform.y = DataParser._getNumber(rawData, DataParser.Y, 0.0) * scale;

		if (DataParser.ROTATE in rawData || DataParser.SKEW in rawData) {
			transform.rotation = Transform.normalizeRadian(
				DataParser._getNumber(rawData, DataParser.ROTATE, 0.0) * Transform.DEG_RAD
			);
			transform.skew = Transform.normalizeRadian(
				DataParser._getNumber(rawData, DataParser.SKEW, 0.0) * Transform.DEG_RAD
			);
		} else if (DataParser.SKEW_X in rawData || DataParser.SKEW_Y in rawData) {
			transform.rotation = Transform.normalizeRadian(
				DataParser._getNumber(rawData, DataParser.SKEW_Y, 0.0) * Transform.DEG_RAD
			);
			transform.skew =
				Transform.normalizeRadian(
					DataParser._getNumber(rawData, DataParser.SKEW_X, 0.0) * Transform.DEG_RAD
				) - transform.rotation;
		}

		transform.scaleX = DataParser._getNumber(rawData, DataParser.SCALE_X, 1.0);
		transform.scaleY = DataParser._getNumber(rawData, DataParser.SCALE_Y, 1.0);
	}

	_parseIKConstraint(rawData) {
		const bone = this._armature.getBone(DataParser._getString(rawData, DataParser.BONE, ''));
		if (bone === null) {
			return null;
		}

		const target = this._armature.getBone(DataParser._getString(rawData, DataParser.TARGET, ''));
		if (target === null) {
			return null;
		}

		const chain = DataParser._getNumber(rawData, DataParser.CHAIN, 0);
		const constraint = BaseObject.borrowObject(IKConstraintData);
		constraint.scaleEnabled = DataParser._getBoolean(rawData, DataParser.SCALE, false);
		constraint.bendPositive = DataParser._getBoolean(rawData, DataParser.BEND_POSITIVE, true);
		constraint.weight = DataParser._getNumber(rawData, DataParser.WEIGHT, 1.0);
		constraint.name = DataParser._getString(rawData, DataParser.NAME, '');
		constraint.type = ConstraintType.IK;
		constraint.target = target;

		if (chain > 0 && bone.parent !== null) {
			constraint.root = bone.parent;
			constraint.bone = bone;
		} else {
			constraint.root = bone;
			constraint.bone = null;
		}

		return constraint;
	}

	_parseSlot(rawData, zOrder) {
		const slot = BaseObject.borrowObject(SlotData);
		slot.displayIndex = DataParser._getNumber(rawData, DataParser.DISPLAY_INDEX, 0);
		slot.zOrder = zOrder;
		slot.zIndex = DataParser._getNumber(rawData, DataParser.Z_INDEX, 0);
		slot.alpha = DataParser._getNumber(rawData, DataParser.ALPHA, 1.0);
		slot.name = DataParser._getString(rawData, DataParser.NAME, '');
		slot.parent = this._armature.getBone(DataParser._getString(rawData, DataParser.PARENT, '')); //

		if (DataParser.BLEND_MODE in rawData && typeof rawData[DataParser.BLEND_MODE] === 'string') {
			slot.blendMode = DataParser._getBlendMode(rawData[DataParser.BLEND_MODE]);
		} else {
			slot.blendMode = DataParser._getNumber(rawData, DataParser.BLEND_MODE, BlendMode.Normal);
		}

		if (DataParser.COLOR in rawData) {
			slot.color = SlotData.createColor();
			this._parseColorTransform(rawData[DataParser.COLOR], slot.color);
		} else {
			slot.color = SlotData.DEFAULT_COLOR;
		}

		if (DataParser.ACTIONS in rawData) {
			this._slotChildActions[slot.name] = this._parseActionData(
				rawData[DataParser.ACTIONS],
				ActionType.Play,
				null,
				null
			);
		}

		return slot;
	}

	_parseSkin(rawData) {
		const skin = BaseObject.borrowObject(SkinData);
		skin.name = DataParser._getString(rawData, DataParser.NAME, DataParser.DEFAULT_NAME);

		if (skin.name.length === 0) {
			skin.name = DataParser.DEFAULT_NAME;
		}

		if (DataParser.SLOT in rawData) {
			const rawSlots = rawData[DataParser.SLOT];
			this._skin = skin;

			for (const rawSlot of rawSlots) {
				const slotName = DataParser._getString(rawSlot, DataParser.NAME, '');
				const slot = this._armature.getSlot(slotName);

				if (slot !== null) {
					this._slot = slot;

					if (DataParser.DISPLAY in rawSlot) {
						const rawDisplays = rawSlot[DataParser.DISPLAY];
						for (const rawDisplay of rawDisplays) {
							if (rawDisplay) {
								skin.addDisplay(slotName, this._parseDisplay(rawDisplay));
							} else {
								skin.addDisplay(slotName, null);
							}
						}
					}

					this._slot = null; //
				}
			}

			this._skin = null; //
		}

		return skin;
	}

	_parseDisplay(rawData) {
		const name = DataParser._getString(rawData, DataParser.NAME, '');
		const path = DataParser._getString(rawData, DataParser.PATH, '');
		let type = DisplayType.Image;
		let display = null;

		if (DataParser.TYPE in rawData && typeof rawData[DataParser.TYPE] === 'string') {
			type = DataParser._getDisplayType(rawData[DataParser.TYPE]);
		} else {
			type = DataParser._getNumber(rawData, DataParser.TYPE, type);
		}

		switch (type) {
			case DisplayType.Image: {
				const imageDisplay = (display = BaseObject.borrowObject(ImageDisplayData));
				imageDisplay.name = name;
				imageDisplay.path = path.length > 0 ? path : name;
				this._parsePivot(rawData, imageDisplay);
				break;
			}

			case DisplayType.Armature: {
				const armatureDisplay = (display = BaseObject.borrowObject(ArmatureDisplayData));
				armatureDisplay.name = name;
				armatureDisplay.path = path.length > 0 ? path : name;
				armatureDisplay.inheritAnimation = true;

				if (DataParser.ACTIONS in rawData) {
					const actions = this._parseActionData(
						rawData[DataParser.ACTIONS],
						ActionType.Play,
						null,
						null
					);
					for (const action of actions) {
						armatureDisplay.addAction(action);
					}
				} else if (this._slot.name in this._slotChildActions) {
					const displays = this._skin.getDisplays(this._slot.name);
					if (
						displays === null
							? this._slot.displayIndex === 0
							: this._slot.displayIndex === displays.length
					) {
						for (const action of this._slotChildActions[this._slot.name]) {
							armatureDisplay.addAction(action);
						}

						delete this._slotChildActions[this._slot.name];
					}
				}
				break;
			}

			case DisplayType.Mesh: {
				const meshDisplay = (display = BaseObject.borrowObject(MeshDisplayData));
				meshDisplay.geometry.inheritDeform = DataParser._getBoolean(
					rawData,
					DataParser.INHERIT_DEFORM,
					true
				);
				meshDisplay.name = name;
				meshDisplay.path = path.length > 0 ? path : name;

				if (DataParser.SHARE in rawData) {
					meshDisplay.geometry.data = this._data;
					this._cacheRawMeshes.push(rawData);
					this._cacheMeshes.push(meshDisplay);
				} else {
					this._parseMesh(rawData, meshDisplay);
				}
				break;
			}

			case DisplayType.BoundingBox: {
				const boundingBox = this._parseBoundingBox(rawData);
				if (boundingBox !== null) {
					const boundingBoxDisplay = (display = BaseObject.borrowObject(BoundingBoxDisplayData));
					boundingBoxDisplay.name = name;
					boundingBoxDisplay.path = path.length > 0 ? path : name;
					boundingBoxDisplay.boundingBox = boundingBox;
				}
				break;
			}

			case DisplayType.Path: {
				const rawCurveLengths = rawData[DataParser.LENGTHS];
				const pathDisplay = (display = BaseObject.borrowObject(PathDisplayData));
				pathDisplay.closed = DataParser._getBoolean(rawData, DataParser.CLOSED, false);
				pathDisplay.constantSpeed = DataParser._getBoolean(rawData, DataParser.CONSTANT_SPEED, false);
				pathDisplay.name = name;
				pathDisplay.path = path.length > 0 ? path : name;
				pathDisplay.curveLengths.length = rawCurveLengths.length;

				for (let i = 0, l = rawCurveLengths.length; i < l; ++i) {
					pathDisplay.curveLengths[i] = rawCurveLengths[i];
				}

				this._parsePath(rawData, pathDisplay);
				break;
			}
		}

		if (display !== null && DataParser.TRANSFORM in rawData) {
			this._parseTransform(rawData[DataParser.TRANSFORM], display.transform, this._armature.scale);
		}

		return display;
	}

	_parseMesh(rawData, mesh) {
		this._parseGeometry(rawData, mesh.geometry);

		if (DataParser.WEIGHTS in rawData) {
			// Cache pose data.
			const rawSlotPose = rawData[DataParser.SLOT_POSE];
			const rawBonePoses = rawData[DataParser.BONE_POSE];
			const meshName = this._skin.name + '_' + this._slot.name + '_' + mesh.name;
			this._weightSlotPose[meshName] = rawSlotPose;
			this._weightBonePoses[meshName] = rawBonePoses;
		}
	}

	_parseActionData(rawData, type, bone, slot) {
		const actions = new Array();

		if (typeof rawData === 'string') {
			const action = BaseObject.borrowObject(ActionData);
			action.type = type;
			action.name = rawData;
			action.bone = bone;
			action.slot = slot;
			actions.push(action);
		} else if (rawData instanceof Array) {
			for (const rawAction of rawData) {
				const action = BaseObject.borrowObject(ActionData);

				if (DataParser.GOTO_AND_PLAY in rawAction) {
					action.type = ActionType.Play;
					action.name = DataParser._getString(rawAction, DataParser.GOTO_AND_PLAY, '');
				} else {
					if (DataParser.TYPE in rawAction && typeof rawAction[DataParser.TYPE] === 'string') {
						action.type = DataParser._getActionType(rawAction[DataParser.TYPE]);
					} else {
						action.type = DataParser._getNumber(rawAction, DataParser.TYPE, type);
					}

					action.name = DataParser._getString(rawAction, DataParser.NAME, '');
				}

				if (DataParser.BONE in rawAction) {
					const boneName = DataParser._getString(rawAction, DataParser.BONE, '');
					action.bone = this._armature.getBone(boneName);
				} else {
					action.bone = bone;
				}

				if (DataParser.SLOT in rawAction) {
					const slotName = DataParser._getString(rawAction, DataParser.SLOT, '');
					action.slot = this._armature.getSlot(slotName);
				} else {
					action.slot = slot;
				}

				let userData = null;

				if (DataParser.INTS in rawAction) {
					if (userData === null) {
						userData = BaseObject.borrowObject(UserData);
					}

					const rawInts = rawAction[DataParser.INTS];
					for (const rawValue of rawInts) {
						userData.addInt(rawValue);
					}
				}

				if (DataParser.FLOATS in rawAction) {
					if (userData === null) {
						userData = BaseObject.borrowObject(UserData);
					}

					const rawFloats = rawAction[DataParser.FLOATS];
					for (const rawValue of rawFloats) {
						userData.addFloat(rawValue);
					}
				}

				if (DataParser.STRINGS in rawAction) {
					if (userData === null) {
						userData = BaseObject.borrowObject(UserData);
					}

					const rawStrings = rawAction[DataParser.STRINGS];
					for (const rawValue of rawStrings) {
						userData.addString(rawValue);
					}
				}

				action.data = userData;
				actions.push(action);
			}
		}

		return actions;
	}

	_parseActionDataInFrame(rawData, frameStart, bone, slot) {
		if (DataParser.EVENT in rawData) {
			this._mergeActionFrame(rawData[DataParser.EVENT], frameStart, ActionType.Frame, bone, slot);
		}

		if (DataParser.SOUND in rawData) {
			this._mergeActionFrame(rawData[DataParser.SOUND], frameStart, ActionType.Sound, bone, slot);
		}

		if (DataParser.ACTION in rawData) {
			this._mergeActionFrame(rawData[DataParser.ACTION], frameStart, ActionType.Play, bone, slot);
		}

		if (DataParser.EVENTS in rawData) {
			this._mergeActionFrame(rawData[DataParser.EVENTS], frameStart, ActionType.Frame, bone, slot);
		}

		if (DataParser.ACTIONS in rawData) {
			this._mergeActionFrame(rawData[DataParser.ACTIONS], frameStart, ActionType.Play, bone, slot);
		}
	}

	_parsePathConstraint(rawData) {
		const target = this._armature.getSlot(DataParser._getString(rawData, DataParser.TARGET, ''));
		if (target === null) {
			return null;
		}

		const defaultSkin = this._armature.defaultSkin;
		if (defaultSkin === null) {
			return null;
		}
		//TODO
		const targetDisplay = defaultSkin.getDisplay(
			target.name,
			DataParser._getString(rawData, DataParser.TARGET_DISPLAY, target.name)
		);
		if (targetDisplay === null || !(targetDisplay instanceof PathDisplayData)) {
			return null;
		}

		const bones = rawData[DataParser.BONES];
		if (bones === null || bones.length === 0) {
			return null;
		}

		const constraint = BaseObject.borrowObject(PathConstraintData);
		constraint.name = DataParser._getString(rawData, DataParser.NAME, '');
		constraint.type = ConstraintType.Path;
		constraint.pathSlot = target;
		constraint.pathDisplayData = targetDisplay;
		constraint.target = target.parent;
		constraint.positionMode = DataParser._getPositionMode(
			DataParser._getString(rawData, DataParser.POSITION_MODE, '')
		);
		constraint.spacingMode = DataParser._getSpacingMode(
			DataParser._getString(rawData, DataParser.SPACING_MODE, '')
		);
		constraint.rotateMode = DataParser._getRotateMode(
			DataParser._getString(rawData, DataParser.ROTATE_MODE, '')
		);
		constraint.position = DataParser._getNumber(rawData, DataParser.POSITION, 0);
		constraint.spacing = DataParser._getNumber(rawData, DataParser.SPACING, 0);
		constraint.rotateOffset = DataParser._getNumber(rawData, DataParser.ROTATE_OFFSET, 0);
		constraint.rotateMix = DataParser._getNumber(rawData, DataParser.ROTATE_MIX, 1);
		constraint.translateMix = DataParser._getNumber(rawData, DataParser.TRANSLATE_MIX, 1);
		//
		for (var boneName of bones) {
			const bone = this._armature.getBone(boneName);
			if (bone !== null) {
				constraint.AddBone(bone);

				if (constraint.root === null) {
					constraint.root = bone;
				}
			}
		}

		return constraint;
	}

	_parsePath(rawData, display) {
		this._parseGeometry(rawData, display.geometry);
	}

	_parsePivot(rawData, display) {
		if (DataParser.PIVOT in rawData) {
			const rawPivot = rawData[DataParser.PIVOT];
			display.pivot.x = DataParser._getNumber(rawPivot, DataParser.X, 0.0);
			display.pivot.y = DataParser._getNumber(rawPivot, DataParser.Y, 0.0);
		} else {
			display.pivot.x = 0.5;
			display.pivot.y = 0.5;
		}
	}

	_parseBoundingBox(rawData) {
		let boundingBox = null;
		let type = BoundingBoxType.Rectangle;

		if (DataParser.SUB_TYPE in rawData && typeof rawData[DataParser.SUB_TYPE] === 'string') {
			type = DataParser._getBoundingBoxType(rawData[DataParser.SUB_TYPE]);
		} else {
			type = DataParser._getNumber(rawData, DataParser.SUB_TYPE, type);
		}

		switch (type) {
			case BoundingBoxType.Rectangle:
				boundingBox = BaseObject.borrowObject(RectangleBoundingBoxData);
				break;

			case BoundingBoxType.Ellipse:
				boundingBox = BaseObject.borrowObject(EllipseBoundingBoxData);
				break;

			case BoundingBoxType.Polygon:
				boundingBox = this._parsePolygonBoundingBox(rawData);
				break;
		}

		if (boundingBox !== null) {
			boundingBox.color = DataParser._getNumber(rawData, DataParser.COLOR, 0x000000);
			if (
				boundingBox.type === BoundingBoxType.Rectangle ||
				boundingBox.type === BoundingBoxType.Ellipse
			) {
				boundingBox.width = DataParser._getNumber(rawData, DataParser.WIDTH, 0.0);
				boundingBox.height = DataParser._getNumber(rawData, DataParser.HEIGHT, 0.0);
			}
		}

		return boundingBox;
	}

	_parsePolygonBoundingBox(rawData) {
		const polygonBoundingBox = BaseObject.borrowObject(PolygonBoundingBoxData);

		if (DataParser.VERTICES in rawData) {
			const scale = this._armature.scale;
			const rawVertices = rawData[DataParser.VERTICES];
			const vertices = polygonBoundingBox.vertices;
			vertices.length = rawVertices.length;

			for (let i = 0, l = rawVertices.length; i < l; i += 2) {
				const x = rawVertices[i] * scale;
				const y = rawVertices[i + 1] * scale;
				vertices[i] = x;
				vertices[i + 1] = y;

				// AABB.
				if (i === 0) {
					polygonBoundingBox.x = x;
					polygonBoundingBox.y = y;
					polygonBoundingBox.width = x;
					polygonBoundingBox.height = y;
				} else {
					if (x < polygonBoundingBox.x) {
						polygonBoundingBox.x = x;
					} else if (x > polygonBoundingBox.width) {
						polygonBoundingBox.width = x;
					}

					if (y < polygonBoundingBox.y) {
						polygonBoundingBox.y = y;
					} else if (y > polygonBoundingBox.height) {
						polygonBoundingBox.height = y;
					}
				}
			}

			polygonBoundingBox.width -= polygonBoundingBox.x;
			polygonBoundingBox.height -= polygonBoundingBox.y;
		} else {
			console.warn('Data error.\n Please reexport DragonBones Data to fixed the bug.');
		}

		return polygonBoundingBox;
	}

	_parseBoneTimeline(rawData) {
		const bone = this._armature.getBone(DataParser._getString(rawData, DataParser.NAME, ''));
		if (bone === null) {
			return;
		}

		this._bone = bone;
		this._slot = this._armature.getSlot(this._bone.name);

		if (DataParser.TRANSLATE_FRAME in rawData) {
			this._frameDefaultValue = 0.0;
			this._frameValueScale = 1.0;
			const timeline = this._parseTimeline(
				rawData,
				null,
				DataParser.TRANSLATE_FRAME,
				TimelineType.BoneTranslate,
				FrameValueType.Float,
				2,
				this._parseDoubleValueFrame
			);

			if (timeline !== null) {
				this._animation.addBoneTimeline(bone.name, timeline);
			}
		}

		if (DataParser.ROTATE_FRAME in rawData) {
			this._frameDefaultValue = 0.0;
			this._frameValueScale = 1.0;
			const timeline = this._parseTimeline(
				rawData,
				null,
				DataParser.ROTATE_FRAME,
				TimelineType.BoneRotate,
				FrameValueType.Float,
				2,
				this._parseBoneRotateFrame
			);

			if (timeline !== null) {
				this._animation.addBoneTimeline(bone.name, timeline);
			}
		}

		if (DataParser.SCALE_FRAME in rawData) {
			this._frameDefaultValue = 1.0;
			this._frameValueScale = 1.0;
			const timeline = this._parseTimeline(
				rawData,
				null,
				DataParser.SCALE_FRAME,
				TimelineType.BoneScale,
				FrameValueType.Float,
				2,
				this._parseBoneScaleFrame
			);

			if (timeline !== null) {
				this._animation.addBoneTimeline(bone.name, timeline);
			}
		}

		if (DataParser.FRAME in rawData) {
			const timeline = this._parseTimeline(
				rawData,
				null,
				DataParser.FRAME,
				TimelineType.BoneAll,
				FrameValueType.Float,
				6,
				this._parseBoneAllFrame
			);

			if (timeline !== null) {
				this._animation.addBoneTimeline(bone.name, timeline);
			}
		}

		this._bone = null; //
		this._slot = null; //
	}

	_parseSlotTimeline(rawData) {
		const slot = this._armature.getSlot(DataParser._getString(rawData, DataParser.NAME, ''));
		if (slot === null) {
			return;
		}

		let displayTimeline = null;
		let colorTimeline = null;
		this._slot = slot;

		if (DataParser.DISPLAY_FRAME in rawData) {
			displayTimeline = this._parseTimeline(
				rawData,
				null,
				DataParser.DISPLAY_FRAME,
				TimelineType.SlotDisplay,
				FrameValueType.Step,
				0,
				this._parseSlotDisplayFrame
			);
		} else {
			displayTimeline = this._parseTimeline(
				rawData,
				null,
				DataParser.FRAME,
				TimelineType.SlotDisplay,
				FrameValueType.Step,
				0,
				this._parseSlotDisplayFrame
			);
		}

		if (DataParser.COLOR_FRAME in rawData) {
			colorTimeline = this._parseTimeline(
				rawData,
				null,
				DataParser.COLOR_FRAME,
				TimelineType.SlotColor,
				FrameValueType.Int,
				1,
				this._parseSlotColorFrame
			);
		} else {
			colorTimeline = this._parseTimeline(
				rawData,
				null,
				DataParser.FRAME,
				TimelineType.SlotColor,
				FrameValueType.Int,
				1,
				this._parseSlotColorFrame
			);
		}

		if (displayTimeline !== null) {
			this._animation.addSlotTimeline(slot.name, displayTimeline);
		}

		if (colorTimeline !== null) {
			this._animation.addSlotTimeline(slot.name, colorTimeline);
		}

		this._slot = null; //
	}

	_parseFrame(rawData, frameStart, frameCount) {
		rawData;

		frameCount;

		const frameOffset = this._frameArray.length;
		this._frameArray.length += 1;
		this._frameArray[frameOffset + BinaryOffset.FramePosition] = frameStart;

		return frameOffset;
	}

	_parseTweenFrame(rawData, frameStart, frameCount) {
		const frameOffset = this._parseFrame(rawData, frameStart, frameCount);

		if (frameCount > 0) {
			if (DataParser.CURVE in rawData) {
				const sampleCount = frameCount + 1;
				this._helpArray.length = sampleCount;
				const isOmited = this._samplingEasingCurve(rawData[DataParser.CURVE], this._helpArray);

				this._frameArray.length += 1 + 1 + this._helpArray.length;
				this._frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.Curve;
				this._frameArray[frameOffset + BinaryOffset.FrameTweenEasingOrCurveSampleCount] = isOmited
					? sampleCount
					: -sampleCount;
				for (let i = 0; i < sampleCount; ++i) {
					this._frameArray[frameOffset + BinaryOffset.FrameCurveSamples + i] = Math.round(
						this._helpArray[i] * 10000.0
					);
				}
			} else {
				const noTween = -2.0;
				let tweenEasing = noTween;
				if (DataParser.TWEEN_EASING in rawData) {
					tweenEasing = DataParser._getNumber(rawData, DataParser.TWEEN_EASING, noTween);
				}

				if (tweenEasing === noTween) {
					this._frameArray.length += 1;
					this._frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.None;
				} else if (tweenEasing === 0.0) {
					this._frameArray.length += 1;
					this._frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.Line;
				} else if (tweenEasing < 0.0) {
					this._frameArray.length += 1 + 1;
					this._frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.QuadIn;
					this._frameArray[
						frameOffset + BinaryOffset.FrameTweenEasingOrCurveSampleCount
					] = Math.round(-tweenEasing * 100.0);
				} else if (tweenEasing <= 1.0) {
					this._frameArray.length += 1 + 1;
					this._frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.QuadOut;
					this._frameArray[
						frameOffset + BinaryOffset.FrameTweenEasingOrCurveSampleCount
					] = Math.round(tweenEasing * 100.0);
				} else {
					this._frameArray.length += 1 + 1;
					this._frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.QuadInOut;
					this._frameArray[
						frameOffset + BinaryOffset.FrameTweenEasingOrCurveSampleCount
					] = Math.round(tweenEasing * 100.0 - 100.0);
				}
			}
		} else {
			this._frameArray.length += 1;
			this._frameArray[frameOffset + BinaryOffset.FrameTweenType] = TweenType.None;
		}

		return frameOffset;
	}

	_parseSingleValueFrame(rawData, frameStart, frameCount) {
		let frameOffset = 0;
		switch (this._frameValueType) {
			case FrameValueType.Step: {
				frameOffset = this._parseFrame(rawData, frameStart, frameCount);
				this._frameArray.length += 1;
				this._frameArray[frameOffset + 1] = DataParser._getNumber(
					rawData,
					DataParser.VALUE,
					this._frameDefaultValue
				);
				break;
			}

			case FrameValueType.Int: {
				frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
				const frameValueOffset = this._frameIntArray.length;
				this._frameIntArray.length += 1;
				this._frameIntArray[frameValueOffset] = Math.round(
					DataParser._getNumber(rawData, DataParser.VALUE, this._frameDefaultValue) *
						this._frameValueScale
				);
				break;
			}

			case FrameValueType.Float: {
				frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
				const frameValueOffset = this._frameFloatArray.length;
				this._frameFloatArray.length += 1;
				this._frameFloatArray[frameValueOffset] =
					DataParser._getNumber(rawData, DataParser.VALUE, this._frameDefaultValue) *
					this._frameValueScale;
				break;
			}
		}

		return frameOffset;
	}

	_parseDoubleValueFrame(rawData, frameStart, frameCount) {
		let frameOffset = 0;
		switch (this._frameValueType) {
			case FrameValueType.Step: {
				frameOffset = this._parseFrame(rawData, frameStart, frameCount);
				this._frameArray.length += 2;
				this._frameArray[frameOffset + 1] = DataParser._getNumber(
					rawData,
					DataParser.X,
					this._frameDefaultValue
				);
				this._frameArray[frameOffset + 2] = DataParser._getNumber(
					rawData,
					DataParser.Y,
					this._frameDefaultValue
				);
				break;
			}

			case FrameValueType.Int: {
				frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
				const frameValueOffset = this._frameIntArray.length;
				this._frameIntArray.length += 2;
				this._frameIntArray[frameValueOffset] = Math.round(
					DataParser._getNumber(rawData, DataParser.X, this._frameDefaultValue) *
						this._frameValueScale
				);
				this._frameIntArray[frameValueOffset + 1] = Math.round(
					DataParser._getNumber(rawData, DataParser.Y, this._frameDefaultValue) *
						this._frameValueScale
				);
				break;
			}

			case FrameValueType.Float: {
				frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
				const frameValueOffset = this._frameFloatArray.length;
				this._frameFloatArray.length += 2;
				this._frameFloatArray[frameValueOffset] =
					DataParser._getNumber(rawData, DataParser.X, this._frameDefaultValue) *
					this._frameValueScale;
				this._frameFloatArray[frameValueOffset + 1] =
					DataParser._getNumber(rawData, DataParser.Y, this._frameDefaultValue) *
					this._frameValueScale;
				break;
			}
		}

		return frameOffset;
	}

	_parseActionFrame(frame, frameStart, frameCount) {
		frameCount;

		const frameOffset = this._frameArray.length;
		const actionCount = frame.actions.length;
		this._frameArray.length += 1 + 1 + actionCount;
		this._frameArray[frameOffset + BinaryOffset.FramePosition] = frameStart;
		this._frameArray[frameOffset + BinaryOffset.FramePosition + 1] = actionCount; // Action count.

		for (let i = 0; i < actionCount; ++i) {
			// Action offsets.
			this._frameArray[frameOffset + BinaryOffset.FramePosition + 2 + i] = frame.actions[i];
		}

		return frameOffset;
	}

	_parseZOrderFrame(rawData, frameStart, frameCount) {
		const frameOffset = this._parseFrame(rawData, frameStart, frameCount);

		if (DataParser.Z_ORDER in rawData) {
			const rawZOrder = rawData[DataParser.Z_ORDER];
			if (rawZOrder.length > 0) {
				const slotCount = this._armature.sortedSlots.length;
				const unchanged = new Array(slotCount - rawZOrder.length / 2);
				const zOrders = new Array(slotCount);

				for (let i = 0; i < unchanged.length; ++i) {
					unchanged[i] = 0;
				}

				for (let i = 0; i < slotCount; ++i) {
					zOrders[i] = -1;
				}

				let originalIndex = 0;
				let unchangedIndex = 0;
				for (let i = 0, l = rawZOrder.length; i < l; i += 2) {
					const slotIndex = rawZOrder[i];
					const zOrderOffset = rawZOrder[i + 1];

					while (originalIndex !== slotIndex) {
						unchanged[unchangedIndex++] = originalIndex++;
					}

					const index = originalIndex + zOrderOffset;
					zOrders[index] = originalIndex++;
				}

				while (originalIndex < slotCount) {
					unchanged[unchangedIndex++] = originalIndex++;
				}

				this._frameArray.length += 1 + slotCount;
				this._frameArray[frameOffset + 1] = slotCount;

				let i = slotCount;
				while (i--) {
					if (zOrders[i] === -1) {
						this._frameArray[frameOffset + 2 + i] = unchanged[--unchangedIndex] || 0;
					} else {
						this._frameArray[frameOffset + 2 + i] = zOrders[i] || 0;
					}
				}

				return frameOffset;
			}
		}

		this._frameArray.length += 1;
		this._frameArray[frameOffset + 1] = 0;

		return frameOffset;
	}

	_parseBoneAllFrame(rawData, frameStart, frameCount) {
		this._helpTransform.identity();
		if (DataParser.TRANSFORM in rawData) {
			this._parseTransform(rawData[DataParser.TRANSFORM], this._helpTransform, 1.0);
		}

		// Modify rotation.
		let rotation = this._helpTransform.rotation;
		if (frameStart !== 0) {
			if (this._prevClockwise === 0) {
				rotation = this._prevRotation + Transform.normalizeRadian(rotation - this._prevRotation);
			} else {
				if (
					this._prevClockwise > 0 ? rotation >= this._prevRotation : rotation <= this._prevRotation
				) {
					this._prevClockwise =
						this._prevClockwise > 0 ? this._prevClockwise - 1 : this._prevClockwise + 1;
				}

				rotation =
					this._prevRotation + rotation - this._prevRotation + Transform.PI_D * this._prevClockwise;
			}
		}

		this._prevClockwise = DataParser._getNumber(rawData, DataParser.TWEEN_ROTATE, 0.0);
		this._prevRotation = rotation;
		//
		const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
		let frameFloatOffset = this._frameFloatArray.length;
		this._frameFloatArray.length += 6;
		this._frameFloatArray[frameFloatOffset++] = this._helpTransform.x;
		this._frameFloatArray[frameFloatOffset++] = this._helpTransform.y;
		this._frameFloatArray[frameFloatOffset++] = rotation;
		this._frameFloatArray[frameFloatOffset++] = this._helpTransform.skew;
		this._frameFloatArray[frameFloatOffset++] = this._helpTransform.scaleX;
		this._frameFloatArray[frameFloatOffset++] = this._helpTransform.scaleY;
		this._parseActionDataInFrame(rawData, frameStart, this._bone, this._slot);

		return frameOffset;
	}

	_parseBoneTranslateFrame(rawData, frameStart, frameCount) {
		const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
		let frameFloatOffset = this._frameFloatArray.length;
		this._frameFloatArray.length += 2;
		this._frameFloatArray[frameFloatOffset++] = DataParser._getNumber(rawData, DataParser.X, 0.0);
		this._frameFloatArray[frameFloatOffset++] = DataParser._getNumber(rawData, DataParser.Y, 0.0);

		return frameOffset;
	}

	_parseBoneRotateFrame(rawData, frameStart, frameCount) {
		// Modify rotation.
		let rotation = DataParser._getNumber(rawData, DataParser.ROTATE, 0.0) * Transform.DEG_RAD;

		if (frameStart !== 0) {
			if (this._prevClockwise === 0) {
				rotation = this._prevRotation + Transform.normalizeRadian(rotation - this._prevRotation);
			} else {
				if (
					this._prevClockwise > 0 ? rotation >= this._prevRotation : rotation <= this._prevRotation
				) {
					this._prevClockwise =
						this._prevClockwise > 0 ? this._prevClockwise - 1 : this._prevClockwise + 1;
				}

				rotation =
					this._prevRotation + rotation - this._prevRotation + Transform.PI_D * this._prevClockwise;
			}
		}

		this._prevClockwise = DataParser._getNumber(rawData, DataParser.CLOCK_WISE, 0);
		this._prevRotation = rotation;
		//
		const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
		let frameFloatOffset = this._frameFloatArray.length;
		this._frameFloatArray.length += 2;
		this._frameFloatArray[frameFloatOffset++] = rotation;
		this._frameFloatArray[frameFloatOffset++] =
			DataParser._getNumber(rawData, DataParser.SKEW, 0.0) * Transform.DEG_RAD;

		return frameOffset;
	}

	_parseBoneScaleFrame(rawData, frameStart, frameCount) {
		const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
		let frameFloatOffset = this._frameFloatArray.length;
		this._frameFloatArray.length += 2;
		this._frameFloatArray[frameFloatOffset++] = DataParser._getNumber(rawData, DataParser.X, 1.0);
		this._frameFloatArray[frameFloatOffset++] = DataParser._getNumber(rawData, DataParser.Y, 1.0);

		return frameOffset;
	}

	_parseSlotDisplayFrame(rawData, frameStart, frameCount) {
		const frameOffset = this._parseFrame(rawData, frameStart, frameCount);
		this._frameArray.length += 1;

		if (DataParser.VALUE in rawData) {
			this._frameArray[frameOffset + 1] = DataParser._getNumber(rawData, DataParser.VALUE, 0);
		} else {
			this._frameArray[frameOffset + 1] = DataParser._getNumber(rawData, DataParser.DISPLAY_INDEX, 0);
		}

		this._parseActionDataInFrame(rawData, frameStart, this._slot.parent, this._slot);

		return frameOffset;
	}

	_parseSlotColorFrame(rawData, frameStart, frameCount) {
		const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
		let colorOffset = -1;

		if (DataParser.VALUE in rawData || DataParser.COLOR in rawData) {
			const rawColor =
				DataParser.VALUE in rawData ? rawData[DataParser.VALUE] : rawData[DataParser.COLOR];
			for (let k in rawColor) {
				// Detects the presence of color.

				k;
				this._parseColorTransform(rawColor, this._helpColorTransform);
				colorOffset = this._colorArray.length;
				this._colorArray.length += 8;
				this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.alphaMultiplier * 100);
				this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.redMultiplier * 100);
				this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.greenMultiplier * 100);
				this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.blueMultiplier * 100);
				this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.alphaOffset);
				this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.redOffset);
				this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.greenOffset);
				this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.blueOffset);
				colorOffset -= 8;
				break;
			}
		}

		if (colorOffset < 0) {
			if (this._defaultColorOffset < 0) {
				this._defaultColorOffset = colorOffset = this._colorArray.length;
				this._colorArray.length += 8;
				this._colorArray[colorOffset++] = 100;
				this._colorArray[colorOffset++] = 100;
				this._colorArray[colorOffset++] = 100;
				this._colorArray[colorOffset++] = 100;
				this._colorArray[colorOffset++] = 0;
				this._colorArray[colorOffset++] = 0;
				this._colorArray[colorOffset++] = 0;
				this._colorArray[colorOffset++] = 0;
			}

			colorOffset = this._defaultColorOffset;
		}

		const frameIntOffset = this._frameIntArray.length;
		this._frameIntArray.length += 1;
		this._frameIntArray[frameIntOffset] = colorOffset;

		return frameOffset;
	}

	_parseSlotDeformFrame(rawData, frameStart, frameCount) {
		const frameFloatOffset = this._frameFloatArray.length;
		const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
		const rawVertices = DataParser.VERTICES in rawData ? rawData[DataParser.VERTICES] : null;
		const offset = DataParser._getNumber(rawData, DataParser.OFFSET, 0); // uint
		const vertexCount = this._intArray[this._mesh.geometry.offset + BinaryOffset.GeometryVertexCount];
		const meshName = this._mesh.parent.name + '_' + this._slot.name + '_' + this._mesh.name;
		const weight = this._mesh.geometry.weight;

		let x = 0.0;
		let y = 0.0;
		let iB = 0;
		let iV = 0;
		if (weight !== null) {
			const rawSlotPose = this._weightSlotPose[meshName];
			this._helpMatrixA.copyFromArray(rawSlotPose, 0);
			this._frameFloatArray.length += weight.count * 2;
			iB = weight.offset + BinaryOffset.WeigthBoneIndices + weight.bones.length;
		} else {
			this._frameFloatArray.length += vertexCount * 2;
		}

		for (let i = 0; i < vertexCount * 2; i += 2) {
			if (rawVertices === null) {
				// Fill 0.
				x = 0.0;
				y = 0.0;
			} else {
				if (i < offset || i - offset >= rawVertices.length) {
					x = 0.0;
				} else {
					x = rawVertices[i - offset];
				}

				if (i + 1 < offset || i + 1 - offset >= rawVertices.length) {
					y = 0.0;
				} else {
					y = rawVertices[i + 1 - offset];
				}
			}

			if (weight !== null) {
				// If mesh is skinned, transform point by bone bind pose.
				const rawBonePoses = this._weightBonePoses[meshName];
				const vertexBoneCount = this._intArray[iB++];

				this._helpMatrixA.transformPoint(x, y, this._helpPoint, true);
				x = this._helpPoint.x;
				y = this._helpPoint.y;

				for (let j = 0; j < vertexBoneCount; ++j) {
					const boneIndex = this._intArray[iB++];
					this._helpMatrixB.copyFromArray(rawBonePoses, boneIndex * 7 + 1);
					this._helpMatrixB.invert();
					this._helpMatrixB.transformPoint(x, y, this._helpPoint, true);

					this._frameFloatArray[frameFloatOffset + iV++] = this._helpPoint.x;
					this._frameFloatArray[frameFloatOffset + iV++] = this._helpPoint.y;
				}
			} else {
				this._frameFloatArray[frameFloatOffset + i] = x;
				this._frameFloatArray[frameFloatOffset + i + 1] = y;
			}
		}

		if (frameStart === 0) {
			const frameIntOffset = this._frameIntArray.length;
			this._frameIntArray.length += 1 + 1 + 1 + 1 + 1;
			this._frameIntArray[
				frameIntOffset + BinaryOffset.DeformVertexOffset
			] = this._mesh.geometry.offset;
			this._frameIntArray[frameIntOffset + BinaryOffset.DeformCount] =
				this._frameFloatArray.length - frameFloatOffset;
			this._frameIntArray[frameIntOffset + BinaryOffset.DeformValueCount] =
				this._frameFloatArray.length - frameFloatOffset;
			this._frameIntArray[frameIntOffset + BinaryOffset.DeformValueOffset] = 0;
			this._frameIntArray[frameIntOffset + BinaryOffset.DeformFloatOffset] =
				frameFloatOffset - this._animation.frameFloatOffset;
			this._timelineArray[this._timeline.offset + BinaryOffset.TimelineFrameValueCount] =
				frameIntOffset - this._animation.frameIntOffset;
		}

		return frameOffset;
	}

	_parseIKConstraintFrame(rawData, frameStart, frameCount) {
		const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
		let frameIntOffset = this._frameIntArray.length;
		this._frameIntArray.length += 2;
		this._frameIntArray[frameIntOffset++] = DataParser._getBoolean(
			rawData,
			DataParser.BEND_POSITIVE,
			true
		)
			? 1
			: 0;
		this._frameIntArray[frameIntOffset++] = Math.round(
			DataParser._getNumber(rawData, DataParser.WEIGHT, 1.0) * 100.0
		);

		return frameOffset;
	}

	_parseDeformFrame(rawData, frameStart, frameCount) {
		const frameFloatOffset = this._frameFloatArray.length;
		const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
		const rawVertices =
			DataParser.VERTICES in rawData
				? rawData[DataParser.VERTICES]
				: DataParser.VALUE in rawData
				? rawData[DataParser.VALUE]
				: null;
		const offset = DataParser._getNumber(rawData, DataParser.OFFSET, 0); // uint
		const vertexCount = this._intArray[this._geometry.offset + BinaryOffset.GeometryVertexCount];
		const weight = this._geometry.weight;
		let x = 0.0;
		let y = 0.0;

		if (weight !== null) {
			// TODO
		} else {
			this._frameFloatArray.length += vertexCount * 2;

			for (let i = 0; i < vertexCount * 2; i += 2) {
				if (rawVertices !== null) {
					if (i < offset || i - offset >= rawVertices.length) {
						x = 0.0;
					} else {
						x = rawVertices[i - offset];
					}

					if (i + 1 < offset || i + 1 - offset >= rawVertices.length) {
						y = 0.0;
					} else {
						y = rawVertices[i + 1 - offset];
					}
				} else {
					x = 0.0;
					y = 0.0;
				}

				this._frameFloatArray[frameFloatOffset + i] = x;
				this._frameFloatArray[frameFloatOffset + i + 1] = y;
			}
		}

		if (frameStart === 0) {
			const frameIntOffset = this._frameIntArray.length;
			this._frameIntArray.length += 1 + 1 + 1 + 1 + 1;
			this._frameIntArray[frameIntOffset + BinaryOffset.DeformVertexOffset] = this._geometry.offset;
			this._frameIntArray[frameIntOffset + BinaryOffset.DeformCount] =
				this._frameFloatArray.length - frameFloatOffset;
			this._frameIntArray[frameIntOffset + BinaryOffset.DeformValueCount] =
				this._frameFloatArray.length - frameFloatOffset;
			this._frameIntArray[frameIntOffset + BinaryOffset.DeformValueOffset] = 0;
			this._frameIntArray[frameIntOffset + BinaryOffset.DeformFloatOffset] =
				frameFloatOffset - this._animation.frameFloatOffset;
			this._timelineArray[this._timeline.offset + BinaryOffset.TimelineFrameValueCount] =
				frameIntOffset - this._animation.frameIntOffset;
		}

		return frameOffset;
	}

	_parseColorTransform(rawData, color) {
		color.alphaMultiplier = DataParser._getNumber(rawData, DataParser.ALPHA_MULTIPLIER, 100) * 0.01;
		color.redMultiplier = DataParser._getNumber(rawData, DataParser.RED_MULTIPLIER, 100) * 0.01;
		color.greenMultiplier = DataParser._getNumber(rawData, DataParser.GREEN_MULTIPLIER, 100) * 0.01;
		color.blueMultiplier = DataParser._getNumber(rawData, DataParser.BLUE_MULTIPLIER, 100) * 0.01;
		color.alphaOffset = DataParser._getNumber(rawData, DataParser.ALPHA_OFFSET, 0);
		color.redOffset = DataParser._getNumber(rawData, DataParser.RED_OFFSET, 0);
		color.greenOffset = DataParser._getNumber(rawData, DataParser.GREEN_OFFSET, 0);
		color.blueOffset = DataParser._getNumber(rawData, DataParser.BLUE_OFFSET, 0);
	}

	_samplingEasingCurve(curve, samples) {
		const curveCount = curve.length;

		if (curveCount % 3 === 1) {
			let stepIndex = -2;
			for (let i = 0, l = samples.length; i < l; ++i) {
				let t = (i + 1) / (l + 1); // float
				while ((stepIndex + 6 < curveCount ? curve[stepIndex + 6] : 1) < t) {
					// stepIndex + 3 * 2
					stepIndex += 6;
				}

				const isInCurve = stepIndex >= 0 && stepIndex + 6 < curveCount;
				const x1 = isInCurve ? curve[stepIndex] : 0.0;
				const y1 = isInCurve ? curve[stepIndex + 1] : 0.0;
				const x2 = curve[stepIndex + 2];
				const y2 = curve[stepIndex + 3];
				const x3 = curve[stepIndex + 4];
				const y3 = curve[stepIndex + 5];
				const x4 = isInCurve ? curve[stepIndex + 6] : 1.0;
				const y4 = isInCurve ? curve[stepIndex + 7] : 1.0;

				let lower = 0.0;
				let higher = 1.0;
				while (higher - lower > 0.0001) {
					const percentage = (higher + lower) * 0.5;
					this._getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, percentage, this._helpPoint);
					if (t - this._helpPoint.x > 0.0) {
						lower = percentage;
					} else {
						higher = percentage;
					}
				}

				samples[i] = this._helpPoint.y;
			}

			return true;
		} else {
			let stepIndex = 0;
			for (let i = 0, l = samples.length; i < l; ++i) {
				let t = (i + 1) / (l + 1); // float
				while (curve[stepIndex + 6] < t) {
					// stepIndex + 3 * 2
					stepIndex += 6;
				}

				const x1 = curve[stepIndex];
				const y1 = curve[stepIndex + 1];
				const x2 = curve[stepIndex + 2];
				const y2 = curve[stepIndex + 3];
				const x3 = curve[stepIndex + 4];
				const y3 = curve[stepIndex + 5];
				const x4 = curve[stepIndex + 6];
				const y4 = curve[stepIndex + 7];

				let lower = 0.0;
				let higher = 1.0;
				while (higher - lower > 0.0001) {
					const percentage = (higher + lower) * 0.5;
					this._getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, percentage, this._helpPoint);
					if (t - this._helpPoint.x > 0.0) {
						lower = percentage;
					} else {
						higher = percentage;
					}
				}

				samples[i] = this._helpPoint.y;
			}

			return false;
		}
	}

	parseDragonBonesData(rawData, scale = 1) {
		console.assert(rawData !== null && rawData !== undefined, 'Data error.');

		const version = DataParser._getString(rawData, DataParser.VERSION, '');
		const compatibleVersion = DataParser._getString(rawData, DataParser.COMPATIBLE_VERSION, '');

		if (
			DataParser.DATA_VERSIONS.indexOf(version) >= 0 ||
			DataParser.DATA_VERSIONS.indexOf(compatibleVersion) >= 0
		) {
			const data = BaseObject.borrowObject(DragonBonesData);
			data.version = version;
			data.name = DataParser._getString(rawData, DataParser.NAME, '');
			data.frameRate = DataParser._getNumber(rawData, DataParser.FRAME_RATE, 24);

			if (data.frameRate === 0) {
				// Data error.
				data.frameRate = 24;
			}

			if (DataParser.ARMATURE in rawData) {
				this._data = data;
				this._parseArray(rawData);

				const rawArmatures = rawData[DataParser.ARMATURE];
				for (const rawArmature of rawArmatures) {
					data.addArmature(this._parseArmature(rawArmature, scale));
				}

				if (!this._data.binary) {
					// DragonBones.webAssembly ? 0 : null;
					this._modifyArray();
				}

				if (DataParser.STAGE in rawData) {
					data.stage = data.getArmature(DataParser._getString(rawData, DataParser.STAGE, ''));
				} else if (data.armatureNames.length > 0) {
					data.stage = data.getArmature(data.armatureNames[0]);
				}

				this._data = null;
			}

			if (DataParser.TEXTURE_ATLAS in rawData) {
				this._rawTextureAtlases = rawData[DataParser.TEXTURE_ATLAS];
			}

			return data;
		} else {
			console.assert(false, 'Nonsupport data version');
		}

		return null;
	}

	parseTextureAtlasData(rawData, textureAtlasData, scale) {}
}
