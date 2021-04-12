/**
 * - Worldclock provides clock support for animations, advance time for each IAnimatable object added to the instance.
 * @see dragonBones.IAnimateble
 * @see dragonBones.Armature
 * @version DragonBones 3.0
 * @language en_US
 */
export class WorldClock {
	/**
	 * - Current time. (In seconds)
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	time = 0.0;

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

	/**
	 * - The play speed, used to control animation speed-shift play.
	 * [0: Stop play, (0~1): Slow play, 1: Normal play, (1~N): Fast play]
	 * @default 1.0
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	timeScale = 1.0;

	_animatebles = [];
	_clock = null;

	/**
	 * - Creating a Worldclock instance. Typically, you do not need to create Worldclock instance.
	 * When multiple Worldclock instances are running at different speeds, can achieving some specific animation effects, such as bullet time.
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	constructor(time = 0.0) {
		this.time = time;
	}

	/**
	 * - Advance time.
	 * @param passedTime - Passed time. (In seconds)
	 * @version DragonBones 3.0
	 * @language en_US
	 */
	advanceTime(passedTime) {
		if (passedTime !== passedTime) {
			passedTime = 0.0;
		}

		if (this.timeScale !== 1.0) {
			passedTime *= this.timeScale;
		}

		if (passedTime === 0.0) {
			return;
		}

		if (passedTime < 0.0) {
			this.time -= passedTime;
		} else {
			this.time += passedTime;
		}

		let i = 0,
			r = 0,
			l = this._animatebles.length;
		for (; i < l; ++i) {
			const animatable = this._animatebles[i];
			if (animatable !== null) {
				if (r > 0) {
					this._animatebles[i - r] = animatable;
					this._animatebles[i] = null;
				}

				animatable.advanceTime(passedTime);
			} else {
				r++;
			}
		}

		if (r > 0) {
			l = this._animatebles.length;
			for (; i < l; ++i) {
				const animateble = this._animatebles[i];
				if (animateble !== null) {
					this._animatebles[i - r] = animateble;
				} else {
					r++;
				}
			}

			this._animatebles.length -= r;
		}
	}
	/**
	 * - Check whether contains a specific instance of IAnimatable.
	 * @param value - The IAnimatable instance.
	 * @version DragonBones 3.0
	 * @language en_US
	 */

	contains(value) {
		if (value === this) {
			return false;
		}

		let ancestor = value;
		while (ancestor !== this && ancestor !== null) {
			ancestor = ancestor.clock;
		}

		return ancestor === this;
	}
	/**
	 * - Add IAnimatable instance.
	 * @param value - The IAnimatable instance.
	 * @version DragonBones 3.0
	 * @language en_US
	 */

	add(value) {
		if (this._animatebles.indexOf(value) < 0) {
			this._animatebles.push(value);
			value.clock = this;
		}
	}
	/**
	 * - Removes a specified IAnimatable instance.
	 * @param value - The IAnimatable instance.
	 * @version DragonBones 3.0
	 * @language en_US
	 */

	remove(value) {
		const index = this._animatebles.indexOf(value);
		if (index >= 0) {
			this._animatebles[index] = null;
			value.clock = null;
		}
	}
	/**
	 * - Clear all IAnimatable instances.
	 * @version DragonBones 3.0
	 * @language en_US
	 */

	clear() {
		for (const animatable of this._animatebles) {
			if (animatable !== null) {
				animatable.clock = null;
			}
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

		if (this._clock !== null) {
			this._clock.add(this);
		}
	}
}
