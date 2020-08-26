/*jshint esversion: 6 */
// @ts-check
import * as T from "../../libs/THREE/build/three.module.js";
import { GrObject } from "../../libs/Framework/GrObject.js";
import { Rock } from "./rock.js";
import * as H from "./helperFun.js";

let moundCtr = 0;
// A mound. It is composed of a bunch of rocks.
/**
 * @typedef moundProperties
 * @type {object}
 * @property {number} [x=0] 
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [scale=1]
 */
export class Mound extends GrObject {
    /**
     * @param {moundProperties} params
     */
    constructor(params = {}) {
        let moundGroup = new T.Group();
        /**
         * Constants
         */
        const posX = params.x ? Number(params.x) : 0;
        const posY = params.y ? Number(params.y) : 0;
        const posZ = params.z ? Number(params.z) : 0;
        const scale = params.scale ? Number(params.scale) : 1;
        const radius_bottom = 3;
        const num_layers = 2;
        const num_rocks = [8, 3];
        super(`mound-${moundCtr++}`, moundGroup);
        // save the fields
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
        this.moundGroup = moundGroup;
        this.scale = scale;
        // put the object in its place
        this.moundGroup.position.x = posX;
        this.moundGroup.position.y = posY;
        this.moundGroup.position.z = posZ;
        this.moundGroup.scale.set(scale, scale, scale);

        /** 
         * Place the rocks to form a mound
         */
        for (let layerIndex = 0; layerIndex < num_layers; layerIndex++) {
            for (let rockIndex = 0; rockIndex < num_rocks[layerIndex]; rockIndex++) {
                const rockDegree = (360 / num_rocks[layerIndex]) * rockIndex;
                const rockPosX = radius_bottom * Math.cos(H.degreesToRadians(rockDegree));
                const rockPosZ = radius_bottom * Math.sin(H.degreesToRadians(rockDegree));
                let rock = new Rock({
                    x: rockPosX,
                    z: rockPosZ,
                    scale: 0.1
                });
                rock.rock.position.y = rock.radius * (layerIndex + 0.8);
                moundGroup.add(rock.rock);
            }
        }
        this.addRock(-0.2, 0, 0, 0.1);
    }

    /**
     * Add a rock to the mound.
     * @param {number} posX 
     * @param {number} posY 
     * @param {number} posZ 
     */
    addRock(posX, posY, posZ, scale) {
        let rock = new Rock({
            x: posX,
            z: posZ,
            scale: scale
        });
        // place the rock above the ground
        rock.rock.position.y = posY + (rock.radius * 0.8);
        this.moundGroup.add(rock.rock);
    }
}