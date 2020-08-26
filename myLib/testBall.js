/*jshint esversion: 6 */
// @ts-check
import * as T from "../../libs/THREE/build/three.module.js";
import { GrObject } from "../../libs/Framework/GrObject.js";
let ballObCtr = 0;
// A ball.
/**
 * @typedef BallProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 * @property {boolean} [bumpMap=false]
 * @property {boolean} [normalMap=false]
 * @property {boolean} [envMap=false]
 * @property {T.Texture} [envMapTexture=null]
 */
export class GrBall extends GrObject {
    /**
     * @param {BallProperties} params
     */
    constructor(params = {}) {
        let width = 3;
        let ball = new T.Group();

        /** 
         * Define the material
         */
        let ball_mat = new T.MeshStandardMaterial({
            color: "silver",
            metalness: 0.9,
            roughness: 0.1
        });

        /**
         * Add maps
         */
        // the bump map
        if (params.bumpMap) {
            let t_bump = new T.TextureLoader().load("./images/ballBumpMap.png");
            t_bump.repeat.set(2, 1);
            t_bump.wrapS = T.RepeatWrapping;
            t_bump.needsUpdate = true;
            ball_mat.bumpMap = t_bump;
            ball_mat.metalnessMap = t_bump;
        }
        // the normal map
        if (params.normalMap) {
            let t_normal = new T.TextureLoader().load("./images/ballNormalMap.png");
            t_normal.repeat.set(2, 1);
            t_normal.wrapS = T.RepeatWrapping;
            t_normal.needsUpdate = true;
            ball_mat.normalMap = t_normal;
            ball_mat.metalnessMap = t_normal;
        }
        // the environment map
        if (params.envMap) {
            ball_mat.envMap = params.envMapTexture;
        }
        /**
         * Add ball 
         */
        let ball_group = new T.Group();
        ball.add(ball_group);
        let top_geom = new T.SphereGeometry(0.2 * width, 32, 32);

        let top = new T.Mesh(top_geom, ball_mat);
        top.translateY(2);
        ball_group.add(top);


        // note that we have to make the Object3D before we can call
        // super and we have to call super before we can use this
        super(`Ball-${ballObCtr++}`, ball);
        this.whole_ob = ball;

        this.width = width;
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        ball.scale.set(scale, scale, scale);

        // the keep track of the time
        this.time = 0;
    }
    /**
     * Define the movement of the ball.
     *
     * @param {*} step
     * @param {*} timeOfDay
     * @memberof GrBall
     */
    tick(step, timeOfDay) {
        // rotate the whole ball
        // this.whole_ob.rotateOnWorldAxis(new T.Vector3(0, 0, 1), 0.0003);
        // this.whole_ob.rotateY(0.003 * step);
    }
}
