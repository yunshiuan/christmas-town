/*jshint esversion: 6 */
// @ts-check
import * as T from "../../libs/THREE/build/three.module.js";
import { GrObject } from "../../libs/Framework/GrObject.js";

let treeCtr = 0;
let stem_material;
let crown_material;
let stem_geom;
// A tree
/**
 * @typedef treeProperties
 * @type {object}
 * @property {number} [x=0] 
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [scale=1]
 * @property {number} [speed=1]
 * @property {Track} [track=null]
 */
export class Tree extends GrObject {
    /**
     * @param {treeProperties} params
     */
    constructor(params = {}) {
        let treeGroup = new T.Group();
        /**
         * Constants
         */
        const posX = params.x ? Number(params.x) : 0;
        const posY = params.y ? Number(params.y) : 0;
        const posZ = params.z ? Number(params.z) : 0;
        const scale = params.scale ? Number(params.scale) : 1;
        // stem
        const STEM_RADIUS = 0.3;
        const STEM_HEIGHT = 5;
        const STEM_COLOR = "brown";
        // tree crowns
        const NUM_CROWNS = 4;
        const CROWN_SIZE_GRADIENT = 0.7;
        const CROWN_HEIGHT = 1;
        const CROWN_RADIUS_TOP = 0.2;
        const CROWN_RADIUS_BOTTOM = 2;
        const CROWN_COLOR = "#004d00";

        /** 
         * Make the stem
         */
        if (!stem_material) {
            stem_material = new T.MeshStandardMaterial({
                color: STEM_COLOR,
                roughness: 0.9,
                metalness: 0
            });
        }
        if (!stem_geom) {
            stem_geom = new T.CylinderBufferGeometry(
                STEM_RADIUS,
                STEM_RADIUS,
                STEM_HEIGHT,
                20);
        }
        let stem_mesh = new T.Mesh(stem_geom, stem_material);
        stem_mesh.translateY(STEM_HEIGHT / 2);
        treeGroup.add(stem_mesh);

        /** 
         * Make the tree crowns
         */
        if (!crown_material) {
            crown_material = new T.MeshStandardMaterial({
                color: CROWN_COLOR,
                roughness: 0.9,
                metalness: 0
            });
        }
        let crownHeight = STEM_HEIGHT * 0.4;
        for (let crownIndex = 0; crownIndex < NUM_CROWNS; crownIndex++) {
            let crown_geom = new T.CylinderBufferGeometry(
                CROWN_RADIUS_TOP * Math.pow(CROWN_SIZE_GRADIENT, crownIndex),
                CROWN_RADIUS_BOTTOM * Math.pow(CROWN_SIZE_GRADIENT, crownIndex),
                CROWN_HEIGHT * Math.pow(1.1, crownIndex),
                10);
            let crown_mesh = new T.Mesh(crown_geom, crown_material);
            crown_mesh.translateY(crownHeight);
            treeGroup.add(crown_mesh);
            crownHeight += STEM_HEIGHT * 0.2;
        }

        super(`tree-${treeCtr++}`, treeGroup);
        // save the fields
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
        this.treeGroup = treeGroup;
        this.scale = scale;
        // put the object in its place
        this.treeGroup.position.x = posX;
        this.treeGroup.position.y = posY;
        this.treeGroup.position.z = posZ;
        this.treeGroup.scale.set(scale, scale, scale);
    }
}
