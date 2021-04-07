import { BaseObject } from '../core/BaseObject';
import { ConstraintType } from '../core/DragonBones';

/**
 * @private
 */
export class ConstraintData extends BaseObject {
	order;
	name;
	type;
	target;
	root;
	bone;

	_onClear() {
		this.order = 0;
		this.name = '';
		this.type = ConstraintType.IK;
		this.target = null; //
		this.root = null; //
		this.bone = null;
	}
}

/**
 * @internal
 */
export class IKConstraintData extends ConstraintData {
	static toString() {
		return '[class dragonBones.IKConstraintData]';
	}

	scaleEnabled;
	bendPositive;
	weight;

	_onClear() {
		super._onClear();

		this.scaleEnabled = false;
		this.bendPositive = false;
		this.weight = 1.0;
	}
}

/**
 * @internal
 */
export class PathConstraintData extends ConstraintData {
	static toString() {
		return '[class dragonBones.PathConstraintData]';
	}

	pathSlot;
	pathDisplayData;
	bones = [];
	positionMode;
	spacingMode;
	rotateMode;
	position;
	spacing;
	rotateOffset;
	rotateMix;
	translateMix;

	_onClear() {
		super._onClear();

		this.pathSlot = null;
		this.pathDisplayData = null;
		this.bones.length = 0;

		this.positionMode = PositionMode.Fixed;
		this.spacingMode = SpacingMode.Fixed;
		this.rotateMode = RotateMode.Chain;

		this.position = 0.0;
		this.spacing = 0.0;
		this.rotateOffset = 0.0;
		this.rotateMix = 0.0;
		this.translateMix = 0.0;
	}

	AddBone(value) {
		this.bones.push(value);
	}
}
