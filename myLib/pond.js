/*jshint esversion: 6 */
// @ts-check
import * as T from "../../libs/THREE/build/three.module.js";
import { GrObject } from "../../libs/Framework/GrObject.js";
import { Track } from "./track.js";
import { degreesToRadians } from "./helperFun.js";

let pondCtr = 0;
let pond_geometry;
let geometry_point;
// A Pond
/**
 * @typedef pondProperties
 * @type {object}
 * @property {GrWorld} [world=null] - necessary for reflection
 * @property {number} [y=0] - position y
 * @property {Array<Array<number>>} [arrayControlPoints] 
 * - the array of the controls point that will be interpolated by the cubic splines.
 * - [cardinal spline control point index -> [posX, posY]]
 * @property {boolean} [showControlPoints=false]
 * - whether to visualize the control points or not
 * @property {T.CubeTexture} [envMap=false] - the skybox to reflect by the pond
 */
export class Pond extends Track {
    /**
  * @param {pondProperties} params
  */
    constructor(params = {}) {
        let group = new T.Group();
        /** 
         * Constants
         */

        /** 
         * Get inputs
         */
        let arrayControlPoints;
        if (!params.arrayControlPoints) {
            const INIT_HEIGHT = 3;
            const INIT_UPPER_WIDTH = 3;
            const INIT_LOWER_WIDTH = 1;
            const INIT_P0 = { "x": 0, "y": 0 };
            const INIT_LOWER_SHIFT = 10;
            const default_points = [
                [INIT_P0.x, INIT_P0.y],
                [INIT_P0.x + INIT_LOWER_SHIFT, INIT_P0.y + INIT_HEIGHT],
                [INIT_P0.x + INIT_LOWER_SHIFT + INIT_LOWER_WIDTH, INIT_P0.y + INIT_HEIGHT],
                [INIT_P0.x + INIT_UPPER_WIDTH, INIT_P0.y]
            ];
            arrayControlPoints = default_points;
        } else {
            arrayControlPoints = params.arrayControlPoints;
        }
        const showControlPoints = params.showControlPoints ? params.showControlPoints : false;
        const posY = params.y ? params.y : 0;
        const envMap = params.envMap;
        super({
            name: 'pond',
            arrayControlPoints: arrayControlPoints,
            showControlPoints: showControlPoints,
            y: posY,
            envMap: envMap
        });
        this.group = group;
        this.envMap = params.envMap;
        this.world = params.world;

        // convert the cardinal control points to bezier control points
        let arrayBezierPoints = this.getArrayBezierControlPoints(arrayControlPoints);

        // build the distance table
        // - for arc-length parameterization for whatever is following the track
        this.distanceTable = this.buildDistanceTable(arrayBezierPoints);

        this.cubecamPosition = false;
        // this.buildTrack(arrayBezierPoints, this.group, MATERIAL_POND, MATERIAL_POINT);
        this.arrayControlPoints = arrayControlPoints;
        this.arrayBezierPoints = arrayBezierPoints;
        this.numSegments = arrayBezierPoints.length;
    }
    /**
     * Build all the bezier segments and put them in the T.group.
     *
     * @param {Array<Array<Array<number>>>} arrayBezierPoints - the array of the controls point of each cubic Bezier curve segment     
     * @param {T.Group} group - the group of the track
     * @param {T.Material} material_pond - the material of the pond surface
     * @param {T.Material} material_point - the material of the control points     
     * @returns {T.Group} - the group of the track
     */
    buildTrack(arrayBezierPoints, group, material_pond, material_point) {

        // make the pond reflective
        let cubecam = new T.CubeCamera(0.01, 1000, 128);
        this.cubecam = cubecam;
        const MATERIAL_POND = new T.MeshStandardMaterial(
            {
                color: "#e6ffff",
                metalness: 0.6,
                roughness: 0.5,
                side: T.DoubleSide,
                envMap: this.envMap
                // envMap: cubecam.renderTarget.texture
            }
        );
        const MATERIAL_POINT = new T.MeshStandardMaterial({
            color: "black"
            // side: T.DoubleSide
        });
        /** 
         * Draw the pond surface
         */
        let pondShape = new T.Shape();
        for (let segmentIndex = 0; segmentIndex < arrayBezierPoints.length; segmentIndex++) {
            let segmentControlPoints = arrayBezierPoints[segmentIndex];

            // draw the bezier curve of each segment
            pondShape.moveTo(segmentControlPoints[0][0], segmentControlPoints[0][1]);
            pondShape.bezierCurveTo(
                segmentControlPoints[1][0], segmentControlPoints[1][1],
                segmentControlPoints[2][0], segmentControlPoints[2][1],
                segmentControlPoints[3][0], segmentControlPoints[3][1]
            );

            /** 
             * Draw the control points 
             */
            // - only draw the control points that are interpolated
            // -- which is the first (and the last) control point of the bezier spline
            // -- no need to draw both the first and the last since it's a close track
            if (this.showControlPoints) {

                if (!geometry_point) {
                    geometry_point = new T.SphereBufferGeometry(0.3);
                    // geometry_point = new T.PlaneBufferGeometry(1.5, 0.5);
                }
                let controlPointObject = new T.Mesh(geometry_point, MATERIAL_POINT);
                controlPointObject.position.set(
                    segmentControlPoints[0][0],
                    0.1,
                    segmentControlPoints[0][1]
                );
                // let axesHelper = new T.AxesHelper(5);
                // controlPointObject.add(axesHelper);
                // controlPointObject.rotateX(degreesToRadians(90));
                // controlPointObject.rotateZ(
                //     Math.atan2(thisPoint.vY, thisPoint.vX)
                // );
                group.add(controlPointObject);
            }
        }
        if (!pond_geometry) {
            pond_geometry = new T.ShapeBufferGeometry(pondShape);
            // pond_geometry = new T.SphereBufferGeometry(3);
        }
        // make the pond object
        let pond_mesh = new T.Mesh(pond_geometry, MATERIAL_POND);
        pond_mesh.rotateX(degreesToRadians(90));
        group.add(pond_mesh);
        // let axesHelper = new T.AxesHelper(15);
        // group.add(axesHelper);
        // group.rotateX(degreesToRadians(90));
        return group;
    }
    tick(step, timeOfDay) {
        // if (!this.cubecamPosition) {
        //     this.cubecam.position.set(
        //         this.arrayControlPoints[0][0],
        //         this.posY-0.1,
        //         this.arrayControlPoints[0][1] + 7);
        //     this.cubecamPosition = true;
        // }

        // this.cubecam.update(this.world.renderer, this.world.scene);

    }
}
