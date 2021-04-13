import { BaseObject } from '../core/BaseObject';
import { BinaryOffset, TimelineType } from '../core/DragonBones';
import { Transform } from '../geom/Transform';
import { TextureData } from '../model/TextureAtlasData';
import { DataParser } from './DataParser';

/**
 * @private
 */
export class ObjectDataParser extends DataParser {
	_rawTextureAtlasIndex = 0;
	_bone = null;
	_geometry = null;
	_mesh = null;

	_parseAnimation(rawData) {
		const animation = BaseObject.borrowObject(AnimationData);
		animation.blendType = DataParser._getAnimationBlendType(
			DataParser._getString(rawData, DataParser.BLEND_TYPE, '')
		);
		animation.frameCount = DataParser._getNumber(rawData, DataParser.DURATION, 0);
		animation.playTimes = DataParser._getNumber(rawData, DataParser.PLAY_TIMES, 1);
		animation.duration = animation.frameCount / this._armature.frameRate; // float
		animation.fadeInTime = DataParser._getNumber(rawData, DataParser.FADE_IN_TIME, 0.0);
		animation.scale = DataParser._getNumber(rawData, DataParser.SCALE, 1.0);
		animation.name = DataParser._getString(rawData, DataParser.NAME, DataParser.DEFAULT_NAME);

		if (animation.name.length === 0) {
			animation.name = DataParser.DEFAULT_NAME;
		}

		animation.frameIntOffset = this._frameIntArray.length;
		animation.frameFloatOffset = this._frameFloatArray.length;
		animation.frameOffset = this._frameArray.length;
		this._animation = animation;

		if (DataParser.FRAME in rawData) {
			const rawFrames = rawData[DataParser.FRAME];
			const keyFrameCount = rawFrames.length;

			if (keyFrameCount > 0) {
				for (let i = 0, frameStart = 0; i < keyFrameCount; ++i) {
					const rawFrame = rawFrames[i];
					this._parseActionDataInFrame(rawFrame, frameStart, null, null);
					frameStart += DataParser._getNumber(rawFrame, DataParser.DURATION, 1);
				}
			}
		}

		if (DataParser.Z_ORDER in rawData) {
			this._animation.zOrderTimeline = this._parseTimeline(
				rawData[DataParser.Z_ORDER],
				null,
				DataParser.FRAME,
				TimelineType.ZOrder,
				FrameValueType.Step,
				0,
				this._parseZOrderFrame
			);
		}

		if (DataParser.BONE in rawData) {
			const rawTimelines = rawData[DataParser.BONE];
			for (const rawTimeline of rawTimelines) {
				this._parseBoneTimeline(rawTimeline);
			}
		}

		if (DataParser.SLOT in rawData) {
			const rawTimelines = rawData[DataParser.SLOT];
			for (const rawTimeline of rawTimelines) {
				this._parseSlotTimeline(rawTimeline);
			}
		}

		if (DataParser.FFD in rawData) {
			const rawTimelines = rawData[DataParser.FFD];
			for (const rawTimeline of rawTimelines) {
				let skinName = DataParser._getString(rawTimeline, DataParser.SKIN, DataParser.DEFAULT_NAME);
				const slotName = DataParser._getString(rawTimeline, DataParser.SLOT, '');
				const displayName = DataParser._getString(rawTimeline, DataParser.NAME, '');

				if (skinName.length === 0) {
					//
					skinName = DataParser.DEFAULT_NAME;
				}

				this._slot = this._armature.getSlot(slotName);
				this._mesh = this._armature.getMesh(skinName, slotName, displayName);
				if (this._slot === null || this._mesh === null) {
					continue;
				}

				const timeline = this._parseTimeline(
					rawTimeline,
					null,
					DataParser.FRAME,
					TimelineType.SlotDeform,
					FrameValueType.Float,
					0,
					this._parseSlotDeformFrame
				);

				if (timeline !== null) {
					this._animation.addSlotTimeline(slotName, timeline);
				}

				this._slot = null; //
				this._mesh = null; //
			}
		}

		if (DataParser.IK in rawData) {
			const rawTimelines = rawData[DataParser.IK];
			for (const rawTimeline of rawTimelines) {
				const constraintName = DataParser._getString(rawTimeline, DataParser.NAME, '');
				const constraint = this._armature.getConstraint(constraintName);
				if (constraint === null) {
					continue;
				}

				const timeline = this._parseTimeline(
					rawTimeline,
					null,
					DataParser.FRAME,
					TimelineType.IKConstraint,
					FrameValueType.Int,
					2,
					this._parseIKConstraintFrame
				);

				if (timeline !== null) {
					this._animation.addConstraintTimeline(constraintName, timeline);
				}
			}
		}

		if (this._actionFrames.length > 0) {
			this._animation.actionTimeline = this._parseTimeline(
				null,
				this._actionFrames,
				'',
				TimelineType.Action,
				FrameValueType.Step,
				0,
				this._parseActionFrame
			);
			this._actionFrames.length = 0;
		}

		if (DataParser.TIMELINE in rawData) {
			const rawTimelines = rawData[DataParser.TIMELINE];
			for (const rawTimeline of rawTimelines) {
				const timelineType = DataParser._getNumber(rawTimeline, DataParser.TYPE, TimelineType.Action);
				const timelineName = DataParser._getString(rawTimeline, DataParser.NAME, '');
				let timeline = null;

				switch (timelineType) {
					case TimelineType.Action:
						// TODO
						break;

					case TimelineType.SlotDisplay: // TODO
					case TimelineType.SlotZIndex:
					case TimelineType.BoneAlpha:
					case TimelineType.SlotAlpha:
					case TimelineType.AnimationProgress:
					case TimelineType.AnimationWeight:
						if (timelineType === TimelineType.SlotDisplay) {
							this._frameValueType = FrameValueType.Step;
							this._frameValueScale = 1.0;
						} else {
							this._frameValueType = FrameValueType.Int;

							if (timelineType === TimelineType.SlotZIndex) {
								this._frameValueScale = 1.0;
							} else if (
								timelineType === TimelineType.AnimationProgress ||
								timelineType === TimelineType.AnimationWeight
							) {
								this._frameValueScale = 10000.0;
							} else {
								this._frameValueScale = 100.0;
							}
						}

						if (
							timelineType === TimelineType.BoneAlpha ||
							timelineType === TimelineType.SlotAlpha ||
							timelineType === TimelineType.AnimationWeight
						) {
							this._frameDefaultValue = 1.0;
						} else {
							this._frameDefaultValue = 0.0;
						}

						if (
							timelineType === TimelineType.AnimationProgress &&
							animation.blendType !== AnimationBlendType.None
						) {
							timeline = BaseObject.borrowObject(AnimationTimelineData);
							const animaitonTimeline = timeline;
							animaitonTimeline.x = DataParser._getNumber(rawTimeline, DataParser.X, 0.0);
							animaitonTimeline.y = DataParser._getNumber(rawTimeline, DataParser.Y, 0.0);
						}

						timeline = this._parseTimeline(
							rawTimeline,
							null,
							DataParser.FRAME,
							timelineType,
							this._frameValueType,
							1,
							this._parseSingleValueFrame,
							timeline
						);
						break;

					case TimelineType.BoneTranslate:
					case TimelineType.BoneRotate:
					case TimelineType.BoneScale:
					case TimelineType.IKConstraint:
					case TimelineType.AnimationParameter:
						if (
							timelineType === TimelineType.IKConstraint ||
							timelineType === TimelineType.AnimationParameter
						) {
							this._frameValueType = FrameValueType.Int;

							if (timelineType === TimelineType.AnimationParameter) {
								this._frameValueScale = 10000.0;
							} else {
								this._frameValueScale = 100.0;
							}
						} else {
							if (timelineType === TimelineType.BoneRotate) {
								this._frameValueScale = Transform.DEG_RAD;
							} else {
								this._frameValueScale = 1.0;
							}

							this._frameValueType = FrameValueType.Float;
						}

						if (
							timelineType === TimelineType.BoneScale ||
							timelineType === TimelineType.IKConstraint
						) {
							this._frameDefaultValue = 1.0;
						} else {
							this._frameDefaultValue = 0.0;
						}

						timeline = this._parseTimeline(
							rawTimeline,
							null,
							DataParser.FRAME,
							timelineType,
							this._frameValueType,
							2,
							this._parseDoubleValueFrame
						);
						break;

					case TimelineType.ZOrder:
						// TODO
						break;

					case TimelineType.Surface: {
						const surface = this._armature.getBone(timelineName);
						if (surface === null) {
							continue;
						}

						this._geometry = surface.geometry;
						timeline = this._parseTimeline(
							rawTimeline,
							null,
							DataParser.FRAME,
							timelineType,
							FrameValueType.Float,
							0,
							this._parseDeformFrame
						);

						this._geometry = null; //
						break;
					}

					case TimelineType.SlotDeform: {
						this._geometry = null; //
						for (const skinName in this._armature.skins) {
							const skin = this._armature.skins[skinName];
							for (const slontName in skin.displays) {
								const displays = skin.displays[slontName];
								for (const display of displays) {
									if (display !== null && display.name === timelineName) {
										this._geometry = display.geometry;
										break;
									}
								}
							}
						}

						if (this._geometry === null) {
							continue;
						}

						timeline = this._parseTimeline(
							rawTimeline,
							null,
							DataParser.FRAME,
							timelineType,
							FrameValueType.Float,
							0,
							this._parseDeformFrame
						);

						this._geometry = null; //
						break;
					}

					case TimelineType.SlotColor:
						timeline = this._parseTimeline(
							rawTimeline,
							null,
							DataParser.FRAME,
							timelineType,
							FrameValueType.Int,
							1,
							this._parseSlotColorFrame
						);
						break;
				}

				if (timeline !== null) {
					switch (timelineType) {
						case TimelineType.Action:
							// TODO
							break;

						case TimelineType.ZOrder:
							// TODO
							break;

						case TimelineType.BoneTranslate:
						case TimelineType.BoneRotate:
						case TimelineType.BoneScale:
						case TimelineType.Surface:
						case TimelineType.BoneAlpha:
							this._animation.addBoneTimeline(timelineName, timeline);
							break;

						case TimelineType.SlotDisplay:
						case TimelineType.SlotColor:
						case TimelineType.SlotDeform:
						case TimelineType.SlotZIndex:
						case TimelineType.SlotAlpha:
							this._animation.addSlotTimeline(timelineName, timeline);
							break;

						case TimelineType.IKConstraint:
							this._animation.addConstraintTimeline(timelineName, timeline);
							break;

						case TimelineType.AnimationProgress:
						case TimelineType.AnimationWeight:
						case TimelineType.AnimationParameter:
							this._animation.addAnimationTimeline(timelineName, timeline);
							break;
					}
				}
			}
		}

		this._animation = null; //

		return animation;
	}

	_parseGeometry(rawData, geometry) {
		const rawVertices = rawData[DataParser.VERTICES];
		const vertexCount = Math.floor(rawVertices.length / 2); // uint
		let triangleCount = 0;
		const geometryOffset = this._intArray.length;
		const verticesOffset = this._floatArray.length;
		//
		geometry.offset = geometryOffset;
		geometry.data = this._data;
		//
		this._intArray.length += 1 + 1 + 1 + 1;
		this._intArray[geometryOffset + BinaryOffset.GeometryVertexCount] = vertexCount;
		this._intArray[geometryOffset + BinaryOffset.GeometryFloatOffset] = verticesOffset;
		this._intArray[geometryOffset + BinaryOffset.GeometryWeightOffset] = -1; //
		//
		this._floatArray.length += vertexCount * 2;
		for (let i = 0, l = vertexCount * 2; i < l; ++i) {
			this._floatArray[verticesOffset + i] = rawVertices[i];
		}

		if (DataParser.TRIANGLES in rawData) {
			const rawTriangles = rawData[DataParser.TRIANGLES];
			triangleCount = Math.floor(rawTriangles.length / 3); // uint
			//
			this._intArray.length += triangleCount * 3;
			for (let i = 0, l = triangleCount * 3; i < l; ++i) {
				this._intArray[geometryOffset + BinaryOffset.GeometryVertexIndices + i] = rawTriangles[i];
			}
		}
		// Fill triangle count.
		this._intArray[geometryOffset + BinaryOffset.GeometryTriangleCount] = triangleCount;

		if (DataParser.UVS in rawData) {
			const rawUVs = rawData[DataParser.UVS];
			const uvOffset = verticesOffset + vertexCount * 2;
			this._floatArray.length += vertexCount * 2;
			for (let i = 0, l = vertexCount * 2; i < l; ++i) {
				this._floatArray[uvOffset + i] = rawUVs[i];
			}
		}

		if (DataParser.WEIGHTS in rawData) {
			const rawWeights = rawData[DataParser.WEIGHTS];
			const weightCount = Math.floor(rawWeights.length - vertexCount) / 2; // uint
			const weightOffset = this._intArray.length;
			const floatOffset = this._floatArray.length;
			let weightBoneCount = 0;
			const sortedBones = this._armature.sortedBones;
			const weight = BaseObject.borrowObject(WeightData);
			weight.count = weightCount;
			weight.offset = weightOffset;

			this._intArray.length += 1 + 1 + weightBoneCount + vertexCount + weightCount;
			this._intArray[weightOffset + BinaryOffset.WeigthFloatOffset] = floatOffset;

			if (DataParser.BONE_POSE in rawData) {
				const rawSlotPose = rawData[DataParser.SLOT_POSE];
				const rawBonePoses = rawData[DataParser.BONE_POSE];
				const weightBoneIndices = new Array();

				weightBoneCount = Math.floor(rawBonePoses.length / 7); // uint
				weightBoneIndices.length = weightBoneCount;

				for (let i = 0; i < weightBoneCount; ++i) {
					const rawBoneIndex = rawBonePoses[i * 7]; // uint
					const bone = this._rawBones[rawBoneIndex];
					weight.addBone(bone);
					weightBoneIndices[i] = rawBoneIndex;
					this._intArray[weightOffset + BinaryOffset.WeigthBoneIndices + i] = sortedBones.indexOf(
						bone
					);
				}

				this._floatArray.length += weightCount * 3;
				this._helpMatrixA.copyFromArray(rawSlotPose, 0);

				for (
					let i = 0,
						iW = 0,
						iB = weightOffset + BinaryOffset.WeigthBoneIndices + weightBoneCount,
						iV = floatOffset;
					i < vertexCount;
					++i
				) {
					const iD = i * 2;
					const vertexBoneCount = (this._intArray[iB++] = rawWeights[iW++]); // uint

					let x = this._floatArray[verticesOffset + iD];
					let y = this._floatArray[verticesOffset + iD + 1];
					this._helpMatrixA.transformPoint(x, y, this._helpPoint);
					x = this._helpPoint.x;
					y = this._helpPoint.y;

					for (let j = 0; j < vertexBoneCount; ++j) {
						const rawBoneIndex = rawWeights[iW++]; // uint
						const boneIndex = weightBoneIndices.indexOf(rawBoneIndex);
						this._helpMatrixB.copyFromArray(rawBonePoses, boneIndex * 7 + 1);
						this._helpMatrixB.invert();
						this._helpMatrixB.transformPoint(x, y, this._helpPoint);
						this._intArray[iB++] = boneIndex;
						this._floatArray[iV++] = rawWeights[iW++];
						this._floatArray[iV++] = this._helpPoint.x;
						this._floatArray[iV++] = this._helpPoint.y;
					}
				}
			} else {
				const rawBones = rawData[DataParser.BONES];
				weightBoneCount = rawBones.length;

				for (let i = 0; i < weightBoneCount; i++) {
					const rawBoneIndex = rawBones[i];
					const bone = this._rawBones[rawBoneIndex];
					weight.addBone(bone);
					this._intArray[weightOffset + BinaryOffset.WeigthBoneIndices + i] = sortedBones.indexOf(
						bone
					);
				}

				this._floatArray.length += weightCount * 3;
				for (
					let i = 0,
						iW = 0,
						iV = 0,
						iB = weightOffset + BinaryOffset.WeigthBoneIndices + weightBoneCount,
						iF = floatOffset;
					i < weightCount;
					i++
				) {
					const vertexBoneCount = rawWeights[iW++];
					this._intArray[iB++] = vertexBoneCount;

					for (let j = 0; j < vertexBoneCount; j++) {
						const boneIndex = rawWeights[iW++];
						const boneWeight = rawWeights[iW++];
						const x = rawVertices[iV++];
						const y = rawVertices[iV++];

						this._intArray[iB++] = rawBones.indexOf(boneIndex);
						this._floatArray[iF++] = boneWeight;
						this._floatArray[iF++] = x;
						this._floatArray[iF++] = y;
					}
				}
			}

			geometry.weight = weight;
		}
	}

	_parseArray(rawData) {
		// rawData;
		this._intArray.length = 0;
		this._floatArray.length = 0;
		this._frameIntArray.length = 0;
		this._frameFloatArray.length = 0;
		this._frameArray.length = 0;
		this._timelineArray.length = 0;
		this._colorArray.length = 0;
	}

	parseTextureAtlasData(rawData, textureAtlasData, scale = 1.0) {
		console.assert(rawData !== undefined);

		if (rawData === null) {
			if (this._rawTextureAtlases === null || this._rawTextureAtlases.length === 0) {
				return false;
			}

			const rawTextureAtlas = this._rawTextureAtlases[this._rawTextureAtlasIndex++];
			this.parseTextureAtlasData(rawTextureAtlas, textureAtlasData, scale);

			if (this._rawTextureAtlasIndex >= this._rawTextureAtlases.length) {
				this._rawTextureAtlasIndex = 0;
				this._rawTextureAtlases = null;
			}

			return true;
		}

		// Texture format.
		textureAtlasData.width = DataParser._getNumber(rawData, DataParser.WIDTH, 0);
		textureAtlasData.height = DataParser._getNumber(rawData, DataParser.HEIGHT, 0);
		textureAtlasData.scale =
			scale === 1.0 ? 1.0 / DataParser._getNumber(rawData, DataParser.SCALE, 1.0) : scale;
		textureAtlasData.name = DataParser._getString(rawData, DataParser.NAME, '');
		textureAtlasData.imagePath = DataParser._getString(rawData, DataParser.IMAGE_PATH, '');

		if (DataParser.SUB_TEXTURE in rawData) {
			const rawTextures = rawData[DataParser.SUB_TEXTURE];
			for (let i = 0, l = rawTextures.length; i < l; ++i) {
				const rawTexture = rawTextures[i];
				const frameWidth = DataParser._getNumber(rawTexture, DataParser.FRAME_WIDTH, -1.0);
				const frameHeight = DataParser._getNumber(rawTexture, DataParser.FRAME_HEIGHT, -1.0);
				const textureData = textureAtlasData.createTexture();

				textureData.rotated = DataParser._getBoolean(rawTexture, DataParser.ROTATED, false);
				textureData.name = DataParser._getString(rawTexture, DataParser.NAME, '');
				textureData.region.x = DataParser._getNumber(rawTexture, DataParser.X, 0.0);
				textureData.region.y = DataParser._getNumber(rawTexture, DataParser.Y, 0.0);
				textureData.region.width = DataParser._getNumber(rawTexture, DataParser.WIDTH, 0.0);
				textureData.region.height = DataParser._getNumber(rawTexture, DataParser.HEIGHT, 0.0);

				if (frameWidth > 0.0 && frameHeight > 0.0) {
					textureData.frame = TextureData.createRectangle();
					textureData.frame.x = DataParser._getNumber(rawTexture, DataParser.FRAME_X, 0.0);
					textureData.frame.y = DataParser._getNumber(rawTexture, DataParser.FRAME_Y, 0.0);
					textureData.frame.width = frameWidth;
					textureData.frame.height = frameHeight;
				}

				textureAtlasData.addTexture(textureData);
			}
		}

		return true;
	}

	static _objectDataParserInstance = null;

	/**
	 * - Deprecated, please refer to {@link dragonBones.BaseFactory#parseDragonBonesData()}.
	 * @deprecated
	 * @language en_US
	 */
	static getInstance() {
		if (ObjectDataParser._objectDataParserInstance === null) {
			ObjectDataParser._objectDataParserInstance = new ObjectDataParser();
		}

		return ObjectDataParser._objectDataParserInstance;
	}
}

/**
 * @private
 */
export class ActionFrame {
	frameStart = 0;
	actions = [];
}
