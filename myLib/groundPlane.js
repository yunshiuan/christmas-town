/*jshint esversion: 6 */
// @ts-check
import * as T from "../../libs/CS559-THREE/build/three.module.js";
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import * as H from "./helperFun.js";

let GroundPlaneObCtr = 0;
// A fork-lift
/**
 * @typedef GroundPlaneProperties
 * @type {object}
 * @property {Number} [x=0]
 * @property {Number} [y=0]
 * @property {Number} [z=0]
 * @property {Number} [width=25]
 * @property {Number} [height=25]
 * @property {Number} [thickness=0.1]  
 * @property {Number} [size=5]
 * @property {string|Number} [color="white"]   
 */
export class GroundPlane extends GrObject {
    /**
     * @param {GroundPlaneProperties} params
     */
    constructor(params = {}) {
        // let planeGroup = new T.Group();
        /**
         * Get inputs
         */
        const width = params.width ? Number(params.width) : 25;
        const height = params.height ? Number(params.height) : 25;
        const thickness = params.thickness ? Number(params.thickness) : 0.1;
        const color = params.color ? String(params.color) : "white";
        let geom = new T.BoxGeometry(width, thickness, height);
        let material = new T.MeshStandardMaterial({ color: color, roughness: 0.9 });
        let mesh = new T.Mesh(geom, material);
        super(`groundPlane-${GroundPlaneObCtr++}`, mesh);
        /**
         * Sabe fields
         */
        this.posX = params.x ? Number(params.x) : 0;
        this.posY = params.y ? Number(params.y) : 0;
        this.posZ = params.z ? Number(params.z) : 0;
        this.size = params.size ? Number(params.size) : 1;
        this.width = width;
        this.height = height;
        this.thickness = thickness;
        this.color = color;


        // planeGroup.add(mesh);
        // this.planeGroup = planeGroup;
        this.mesh = mesh;
        /** 
         * Place the ground plane
        */
        // put the box into the right place
        this.mesh.position.set(this.posX, this.posY - this.thickness / 2, this.posY);
    }
}