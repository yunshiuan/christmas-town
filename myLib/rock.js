/*jshint esversion: 6 */
// @ts-check
import * as T from "../../libs/THREE/build/three.module.js";
// import { GrObject } from "../../libs/Framework/GrObject.js";

let rock_material;
let rock_geom;
// A rock
/**
 * @typedef rockProperties
 * @type {object}
 * @property {number} [x=0] 
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [scale=1]
 */
export class Rock {
    /**
     * @param {rockProperties} params
     */
    constructor(params = {}) {
        /**
         * Constants
         */
        const posX = params.x ? Number(params.x) : 0;
        const posY = params.y ? Number(params.y) : 0;
        const posZ = params.z ? Number(params.z) : 0;
        const scale = params.scale ? Number(params.scale) : 1;

        // rock 
        const ROCK_RADIUS = 12;
        const ROCK_COLOR = "grey";

        if (!rock_geom) {
            rock_geom = new T.SphereBufferGeometry(ROCK_RADIUS, 6, 5);
        }
        if (!rock_material) {
            rock_material = new T.MeshStandardMaterial({
                color: ROCK_COLOR,
                roughness: 0.9,
                metalness: 0
            });
        }
        let rock = new T.Mesh(rock_geom, rock_material);
        rock.position.set(posX, posY, posZ);
        rock.scale.set(scale, scale, scale);
        // save the rock as a field
        this.rock = rock;

        this.radius = ROCK_RADIUS * scale;
    }
}