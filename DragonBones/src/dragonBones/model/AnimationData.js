import { BaseObject } from '../core/BaseObject';
import { AnimationBlendType, TimelineType } from '../core/DragonBones';

/**
 * - The animation data.
 * @version DragonBones 3.0
 * @language en_US
 */
export class AnimationData extends BaseObject {
	static toString() {
		return '[class dragonBones.AnimationData]';
	}
	/**
	 * - FrameIntArray.
	 * @internal
	 */
	frameIntOffset;

	/**
	 * - FrameFloatArray.
	 * @internal
	 */
	frameFloatOffset;

	/**
	 * - FrameArray.
	 * @internal
	 */
	frameOffset;

	/**
	 * @private
	 */
	blendType;

	/**
	 * - The frame count of the animation.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	frameCount;

	/**
	 * - The play times of the animation. [0: Loop play, [1~N]: Play N times]
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	playTimes;

	/**
	 * - The duration of the animation. (In seconds)
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	duration;

	/**
	 * @private
	 */
	scale;

	/**
	 * - The fade in time of the animation. (In seconds)
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	fadeInTime;

	/**
	 * @private
	 */
	cacheFrameRate;

	/**
	 * - The animation name.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	name;

	/**
	 * @private
	 */
	cachedFrames = [];

	/**
	 * @private
	 */
	boneTimelines = {};

	/**
	 * @private
	 */
	slotTimelines = {};

	/**
	 * @private
	 */
	constraintTimelines = {};

	/**
	 * @private
	 */
	animationTimelines = {};

	/**
	 * @private
	 */
	boneCachedFrameIndices = {};

	/**
	 * @private
	 */
	slotCachedFrameIndices = {};

	/**
	 * @private
	 */
	actionTimeline = null; // Initial value.

	/**
	 * @private
	 */
	zOrderTimeline = null; // Initial value.

	/**
	 * @private
	 */
	parent;

	_onClear() {
		for (let k in this.boneTimelines) {
			for (const timeline of this.boneTimelines[k]) {
				timeline.returnToPool();
			}

			delete this.boneTimelines[k];
		}

		for (let k in this.slotTimelines) {
			for (const timeline of this.slotTimelines[k]) {
				timeline.returnToPool();
			}

			delete this.slotTimelines[k];
		}

		for (let k in this.constraintTimelines) {
			for (const timeline of this.constraintTimelines[k]) {
				timeline.returnToPool();
			}

			delete this.constraintTimelines[k];
		}

		for (let k in this.animationTimelines) {
			for (const timeline of this.animationTimelines[k]) {
				timeline.returnToPool();
			}

			delete this.animationTimelines[k];
		}

		for (let k in this.boneCachedFrameIndices) {
			delete this.boneCachedFrameIndices[k];
		}

		for (let k in this.slotCachedFrameIndices) {
			delete this.slotCachedFrameIndices[k];
		}

		if (this.actionTimeline !== null) {
			this.actionTimeline.returnToPool();
		}

		if (this.zOrderTimeline !== null) {
			this.zOrderTimeline.returnToPool();
		}

		this.frameIntOffset = 0;
		this.frameFloatOffset = 0;
		this.frameOffset = 0;
		this.blendType = AnimationBlendType.None;
		this.frameCount = 0;
		this.playTimes = 0;
		this.duration = 0.0;
		this.scale = 1.0;
		this.fadeInTime = 0.0;
		this.cacheFrameRate = 0.0;
		this.name = '';
		this.cachedFrames.length = 0;
		// this.boneTimelines.clear();
		// this.slotTimelines.clear();
		// this.constraintTimelines.clear();
		// this.animationTimelines.clear();
		// this.boneCachedFrameIndices.clear();
		// this.slotCachedFrameIndices.clear();
		this.actionTimeline = null;
		this.zOrderTimeline = null;
		this.parent = null; //
	}

	/**
	 * @internal
	 */
	cacheFrames(frameRate) {
		if (this.cacheFrameRate > 0.0) {
			// TODO clear cache.
			return;
		}

		this.cacheFrameRate = Math.max(Math.ceil(frameRate * this.scale), 1.0);
		const cacheFrameCount = Math.ceil(this.cacheFrameRate * this.duration) + 1; // Cache one more frame.

		this.cachedFrames.length = cacheFrameCount;
		for (let i = 0, l = this.cacheFrames.length; i < l; ++i) {
			this.cachedFrames[i] = false;
		}

		for (const bone of this.parent.sortedBones) {
			const indices = new Array(cacheFrameCount);
			for (let i = 0, l = indices.length; i < l; ++i) {
				indices[i] = -1;
			}

			this.boneCachedFrameIndices[bone.name] = indices;
		}

		for (const slot of this.parent.sortedSlots) {
			const indices = new Array(cacheFrameCount);
			for (let i = 0, l = indices.length; i < l; ++i) {
				indices[i] = -1;
			}

			this.slotCachedFrameIndices[slot.name] = indices;
		}
	}

	/**
	 * @private
	 */
	addBoneTimeline(timelineName, timeline) {
		const timelines =
			timelineName in this.boneTimelines
				? this.boneTimelines[timelineName]
				: (this.boneTimelines[timelineName] = []);
		if (timelines.indexOf(timeline) < 0) {
			timelines.push(timeline);
		}
	}

	/**
	 * @private
	 */
	addSlotTimeline(timelineName, timeline) {
		const timelines =
			timelineName in this.slotTimelines
				? this.slotTimelines[timelineName]
				: (this.slotTimelines[timelineName] = []);
		if (timelines.indexOf(timeline) < 0) {
			timelines.push(timeline);
		}
	}

	/**
	 * @private
	 */
	addConstraintTimeline(timelineName, timeline) {
		const timelines =
			timelineName in this.constraintTimelines
				? this.constraintTimelines[timelineName]
				: (this.constraintTimelines[timelineName] = []);
		if (timelines.indexOf(timeline) < 0) {
			timelines.push(timeline);
		}
	}

	/**
	 * @private
	 */
	addAnimationTimeline(timelineName, timeline) {
		const timelines =
			timelineName in this.animationTimelines
				? this.animationTimelines[timelineName]
				: (this.animationTimelines[timelineName] = []);
		if (timelines.indexOf(timeline) < 0) {
			timelines.push(timeline);
		}
	}

	/**
	 * @private
	 */
	getBoneTimelines(timelineName) {
		const timeline = timelineName in this.boneTimelines ? this.boneTimelines[timelineName] : null;

		return timeline;
	}

	/**
	 * @private
	 */
	getSlotTimelines(timelineName) {
		return timelineName in this.slotTimelines ? this.slotTimelines[timelineName] : null;
	}

	/**
	 * @private
	 */
	getConstraintTimelines(timelineName) {
		return timelineName in this.constraintTimelines ? this.constraintTimelines[timelineName] : null;
	}

	/**
	 * @private
	 */
	getAnimationTimelines(timelineName) {
		return timelineName in this.animationTimelines ? this.animationTimelines[timelineName] : null;
	}

	/**
	 * @private
	 */
	getBoneCachedFrameIndices(boneName) {
		return boneName in this.boneCachedFrameIndices ? this.boneCachedFrameIndices[boneName] : null;
	}

	/**
	 * @private
	 */
	getSlotCachedFrameIndices(slotName) {
		return slotName in this.slotCachedFrameIndices ? this.slotCachedFrameIndices[slotName] : null;
	}
}

/**
 * @private
 */
export class TimelineData extends BaseObject {
	static toString() {
		return '[class dragonBones.TimelineData]';
	}

	type;
	offset; // TimelineArray.
	frameIndicesOffset; // FrameIndices.

	_onClear() {
		this.type = TimelineType.BoneAll;
		this.offset = 0;
		this.frameIndicesOffset = -1;
	}
}

/**
 * @internal
 */
export class AnimationTimelineData extends TimelineData {
	static toString() {
		return '[class dragonBones.AnimationTimelineData]';
	}

	x;
	y;

	_onClear() {
		super._onClear();

		this.x = 0.0;
		this.y = 0.0;
	}
}
