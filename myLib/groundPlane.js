/*jshint esversion: 6 */
// @ts-check
import * as T from "../libs/THREE/build/three.module.js";
import { GrObject } from "../libs/Framework/GrObject.js";
import { shaderMaterial } from "../libs/Framework/shaderHelper.js";

import * as H from "./helperFun.js";
import { Material } from "../libs/THREE/build/three.module.js";

let GroundPlaneObCtr = 0;
let material;
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
        /**
         * Get inputs
         */
        const width = params.width ? Number(params.width) : 25;
        const height = params.height ? Number(params.height) : 25;
        const thickness = params.thickness ? Number(params.thickness) : 0.1;
        const color = params.color ? String(params.color) : "white";
        let geom = new T.BoxBufferGeometry(width, thickness, height, 10, 1, 10);
        // let material = new T.MeshStandardMaterial({ color: color, roughness: 0.9 });
        // Use displacement map
        if (!material) {
            let color_map = new T.TextureLoader().load("Images/ground_color_map.png");
            let height_map = new T.TextureLoader().load("Images/ground_height_map.png");
            let unis = T.UniformsLib.lights;
            material = shaderMaterial("./shaders/groundPlane.vs", "./shaders/groundPlane.fs",
                {
                    side: T.DoubleSide,
                    lights: true,
                    uniforms: unis
                });
            material.uniforms.heightmap = { value: height_map };
            material.uniforms.colormap = { value: color_map };
            // material = shaderMaterial(
            //     "./shaders/groundPlane.vs", "./shaders/groundPlane.fs", {
            //     side: T.DoubleSide,
            //     uniforms: {
            //         heightmap: { value: image },
            //         colormap: { value: image },
            //     },
            // });
        }

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