/**
 * - Play animation interface. (Both Armature and Wordclock implement the interface)
 * Any instance that implements the interface can be added to the Worldclock instance and advance time by Worldclock instance uniformly.
 * @see dragonBones.WorldClock
 * @see dragonBones.Armature
 * @version DragonBones 3.0
 * @language en_US
 */
export class IAnimatable {
	/**
	 * - Advance time.
	 * @param passedTime - Passed time. (In seconds)
	 * @version DragonBones 3.0
	 * @language en_US
	 */

	advanceTime(passedTime) {}
	/**
	 * - The Wordclock instance to which the current belongs.
	 * @example
	 * <pre>
	 *     armature.clock = factory.clock; // Add armature to clock.
	 *     armature.clock = null; // Remove armature from clock.
	 * </pre>
	 * @version DragonBones 5.0
	 * @language en_US
	 */

	clock;
}
