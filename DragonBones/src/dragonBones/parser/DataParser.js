import {
	ActionType,
	AnimationBlendType,
	ArmatureType,
	BlendMode,
	BoneType,
	BoundingBoxType,
	DisplayType,
	RotateMode,
	SpacingMode,
} from '../core/DragonBones';

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

	parseDragonBonesData(rawData, scale) {}
	parseTextureAtlasData(rawData, textureAtlasData, scale) {}
}
