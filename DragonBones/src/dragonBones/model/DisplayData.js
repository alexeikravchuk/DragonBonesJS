import { BaseObject } from '../core/BaseObject';
import { DisplayType } from '../core/DragonBones';
import { Point } from '../geom/Point';
import { Transform } from '../geom/Transform';

/**
 * @private
 */
export class GeometryData {
	isShared;
	inheritDeform;
	offset;
	data;
	weight = null; // Initial value.

	clear() {
		if (!this.isShared && this.weight !== null) {
			this.weight.returnToPool();
		}

		this.isShared = false;
		this.inheritDeform = false;
		this.offset = 0;
		this.data = null;
		this.weight = null;
	}

	shareFrom(value) {
		this.isShared = true;
		this.offset = value.offset;
		this.weight = value.weight;
	}

	get vertexCount() {
		const intArray = this.data.intArray;
		return intArray[this.offset + dragonBones.BinaryOffset.GeometryVertexCount];
	}

	get triangleCount() {
		const intArray = this.data.intArray;
		return intArray[this.offset + dragonBones.BinaryOffset.GeometryTriangleCount];
	}
}

/**
 * @private
 */
export class DisplayData extends BaseObject {
	type;
	name;
	path;
	transform = new Transform();
	parent;

	_onClear() {
		this.name = '';
		this.path = '';
		this.transform.identity();
		this.parent = null; //
	}
}

/**
 * @private
 */
export class ImageDisplayData extends DisplayData {

	pivot = new Point();
	texture;

	_onClear() {
		super._onClear();

		this.type = DisplayType.Image;
		this.pivot.clear();
		this.texture = null;
	}
}

/**
 * @private
 */
export class ArmatureDisplayData extends DisplayData {

	inheritAnimation;
	actions = [];
	armature;

	_onClear() {
		super._onClear();

		for (const action of this.actions) {
			action.returnToPool();
		}

		this.type = DisplayType.Armature;
		this.inheritAnimation = false;
		this.actions.length = 0;
		this.armature = null;
	}
	/**
	 * @private
	 */
	addAction(value) {
		this.actions.push(value);
	}
}

/**
 * @private
 */
export class MeshDisplayData extends DisplayData {

	geometry = new GeometryData();
	texture;

	_onClear() {
		super._onClear();

		this.type = DisplayType.Mesh;
		this.geometry.clear();
		this.texture = null;
	}
}

/**
 * @private
 */
export class BoundingBoxDisplayData extends DisplayData {


	boundingBox = null; // Initial value.

	_onClear() {
		super._onClear();

		if (this.boundingBox !== null) {
			this.boundingBox.returnToPool();
		}

		this.type = DisplayType.BoundingBox;
		this.boundingBox = null;
	}
}

/**
 * @private
 */
export class PathDisplayData extends DisplayData {

	closed;
	constantSpeed;
	geometry = new GeometryData();
	curveLengths = [];

	_onClear() {
		super._onClear();

		this.type = DisplayType.Path;
		this.closed = false;
		this.constantSpeed = false;
		this.geometry.clear();
		this.curveLengths.length = 0;
	}
}

/**
 * @private
 */
export class WeightData extends BaseObject {


	count;
	offset;
	bones = [];

	_onClear() {
		this.count = 0;
		this.offset = 0;
		this.bones.length = 0;
	}

	addBone(value) {
		this.bones.push(value);
	}
}
