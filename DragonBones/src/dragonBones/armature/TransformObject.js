
    /**
     * - The base class of the transform object.
     * @see dragonBones.Transform
     * @version DragonBones 4.5
     * @language en_US
     */

import { BaseObject } from '../core/BaseObject';
import { Matrix } from '../geom/Matrix';
import { Point } from '../geom/Point';
import { Transform } from '../geom/Transform';

    
    export class TransformObject extends BaseObject {
        static  _helpMatrix = new Matrix();
        static  _helpTransform = new Transform();
        static  _helpPoint = new Point();
        /**
         * - A matrix relative to the armature coordinate system.
         * @version DragonBones 3.0
         * @language en_US
         */
        
         globalTransformMatrix = new Matrix();
        /**
         * - A transform relative to the armature coordinate system.
         * @see #updateGlobalTransform()
         * @version DragonBones 3.0
         * @language en_US
         */
       
         global = new Transform();
        /**
         * - The offset transform relative to the armature or the parent bone coordinate system.
         * @see #dragonBones.Bone#invalidUpdate()
         * @version DragonBones 3.0
         * @language en_US
         */
       
         offset = new Transform();
        /**
         * @private
         */
        origin;
        /**
         * @private
         */
        userData;
        _globalDirty;
        /**
         * @internal
         */
        _alpha;
        /**
         * @internal
         */
        _globalAlpha;
        /**
         * @internal
         */
        _armature;
        /**
         */
        _onClear() {
            this.globalTransformMatrix.identity();
            this.global.identity();
            this.offset.identity();
            this.origin = null;
            this.userData = null;

            this._globalDirty = false;
            this._alpha = 1.0;
            this._globalAlpha = 1.0;
            this._armature = null; //
        }
        /**
         * - For performance considerations, rotation or scale in the {@link #global} attribute of the bone or slot is not always properly accessible,
         * some engines do not rely on these attributes to update rendering, such as Egret.
         * The use of this method ensures that the access to the {@link #global} property is correctly rotation or scale.
         * @example
         * <pre>
         *     bone.updateGlobalTransform();
         *     let rotation = bone.global.rotation;
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
       
        updateGlobalTransform() {
            if (this._globalDirty) {
                this._globalDirty = false;
                this.global.fromMatrix(this.globalTransformMatrix);
            }
        }
        /**
         * - The armature to which it belongs.
         * @version DragonBones 3.0
         * @language en_US
         */
        
        get armature() {
            return this._armature;
        }
    }
