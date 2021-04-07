import { BaseObject } from '../core/BaseObject';

/**
 * - The properties of the object carry basic information about an event,
 * which are passed as parameter or parameter's parameter to event listeners when an event occurs.
 * @version DragonBones 4.5
 * @language en_US
 */
export class EventObject extends BaseObject {
	/**
	 * - Animation start play.
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	static START = 'start';
	/**
	 * - Animation loop play complete once.
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	static LOOP_COMPLETE = 'loopComplete';
	/**
	 * - Animation play complete.
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	static COMPLETE = 'complete';
	/**
	 * - Animation fade in start.
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	static FADE_IN = 'fadeIn';
	/**
	 * - Animation fade in complete.
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	static FADE_IN_COMPLETE = 'fadeInComplete';
	/**
	 * - Animation fade out start.
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	static FADE_OUT = 'fadeOut';
	/**
	 * - Animation fade out complete.
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	static FADE_OUT_COMPLETE = 'fadeOutComplete';
	/**
	 * - Animation frame event.
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	static FRAME_EVENT = 'frameEvent';
	/**
	 * - Animation frame sound event.
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	static SOUND_EVENT = 'soundEvent';
	/**
	 * @internal
	 * @private
	 */
	static actionDataToInstance(data, instance, armature) {
		if (data.type === ActionType.Play) {
			instance.type = EventObject.FRAME_EVENT;
		} else {
			instance.type =
				data.type === ActionType.Frame ? EventObject.FRAME_EVENT : EventObject.SOUND_EVENT;
		}

		instance.name = data.name;
		instance.armature = armature;
		instance.actionData = data;
		instance.data = data.data;

		if (data.bone !== null) {
			instance.bone = armature.getBone(data.bone.name);
		}

		if (data.slot !== null) {
			instance.slot = armature.getSlot(data.slot.name);
		}
	}

	static toString() {
		return '[class dragonBones.EventObject]';
	}
	/**
	 * - If is a frame event, the value is used to describe the time that the event was in the animation timeline. (In seconds)
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	time;
	/**
	 * - The event type。
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	type;
	/**
	 * - The event name. (The frame event name or the frame sound name)
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	name;
	/**
	 * - The armature that dispatch the event.
	 * @see dragonBones.Armature
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	armature;
	/**
	 * - The bone that dispatch the event.
	 * @see dragonBones.Bone
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	bone;
	/**
	 * - The slot that dispatch the event.
	 * @see dragonBones.Slot
	 * @version DragonBones 4.5
	 * @language en_US
	 */
	slot;
	/**
	 * - The animation state that dispatch the event.
	 * @see dragonBones.AnimationState
	 * @version DragonBones 4.5
	 * @language en_US
	 */

	animationState;
	/**
	 * @private
	 */
	actionData;
	/**
	 * @private
	 */
	/**
	 * - The custom data.
	 * @see dragonBones.CustomData
	 * @version DragonBones 5.0
	 * @language en_US
	 */
	data;

	_onClear() {
		this.time = 0.0;
		this.type = '';
		this.name = '';
		this.armature = null;
		this.bone = null;
		this.slot = null;
		this.animationState = null;
		this.actionData = null;
		this.data = null;
	}
}
