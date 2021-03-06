/*jshint esversion: 6 */
// @ts-check
import * as T from "../libs/THREE/build/three.module.js";
import { GrObject } from "../libs/Framework/GrObject.js";
import { degreesToRadians } from "./helperFun.js";
// import { ObjGrObject } from "../libs/Framework/loaders.js";

let trackCtr = 0;
let geometry_point;

// A track built with cubic cardinal spline (drawn with Bezier curves).
/**
 * @typedef trackProperties
 * @type {object}
 * @property {string} [name = "track"]
 * @property {number} [y=0] 
 * @property {Array<Array<number>>} [arrayControlPoints] 
 * - the array of the controls point that will be interpolated by the cubic splines.
 * - [cardinal spline control point index -> [posX, posY]]
 * @property {boolean} [showControlPoints=false]
 * - whether to visualize the control points or not
 * @property {T.CubeTexture} [envMap=false] - the skybox to reflect by the pond 
 */

export class Track extends GrObject {
    /**
     * @param {trackProperties} params
     */
    constructor(params = {}) {
        let group = new T.Group();
        const name = params.name ? String(params.name) : 'track';
        super(`${name}-${trackCtr++}`, group);

        /** 
         * Constants
         */

        const MATERIAL_CURVE = new T.LineBasicMaterial(
            {
                color: "orange",
                side: T.DoubleSide
                // linewidth: 100
            }
        );
        const MATERIAL_POINT = new T.MeshStandardMaterial({
            color: "black"
            // side: T.DoubleSide
        });
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
        this.showControlPoints = params.showControlPoints ? params.showControlPoints : false;
        this.posY = params.y ? params.y : 0;

        // convert the cardinal control points to bezier control points
        let arrayBezierPoints = this.getArrayBezierControlPoints(arrayControlPoints);

        // build the distance table
        // - for arc-length parameterization for whatever is following the track
        this.distanceTable = this.buildDistanceTable(arrayBezierPoints);

        this.envMap = params.envMap;
        // build the track
        this.buildTrack(arrayBezierPoints, group, MATERIAL_CURVE, MATERIAL_POINT);

        this.arrayControlPoints = arrayControlPoints;
        this.arrayBezierPoints = arrayBezierPoints;
        this.numSegments = arrayBezierPoints.length;
        group.position.y = this.posY;
    }
    /**
     * Get the position and velocity of a given parameter value.
     * @param {number} t - the parameter for this entire track [0, num_segments]
     * @param {boolean} arc_length - convert the t to arc-length t
     * @returns {*} the coordinate and velocity (posX, posy, vX, vY)
     */
    getPosOnTrack(t, arc_length) {
        // make sure t is witin [0, num_segments]
        t = t % this.numSegments;
        // constant speed (arc-length) or not 
        if (arc_length) {
            t = this.reparamToArclength(t, this.numSegments, this.distanceTable);
        }
        // decide which part of segment is the train on right now
        // - and also get the control points for that segment
        let segmentIndex = Math.floor(t);
        let b1 = this.arrayBezierPoints[segmentIndex][0];
        let b2 = this.arrayBezierPoints[segmentIndex][1];
        let b3 = this.arrayBezierPoints[segmentIndex][2];
        let b4 = this.arrayBezierPoints[segmentIndex][3];
        // - the free parameter of that segment
        let u = t - segmentIndex;
        // - derive the train position and velocity
        let pointPar = this.getBezierPos(b1, b2, b3, b4, u);
        return pointPar;
    }
    /**
     * Build all the bezier segments and put them in the T.group.
     *
     * @param {Array<Array<Array<number>>>} arrayBezierPoints - the array of the controls point of each cubic Bezier curve segment     
     * @param {T.Group} group - the group of the track
     * @param {T.Material} material_curve - the material of the track
     * @param {T.Material} material_point - the material of the control points     
     * @returns {T.Group} - the group of the track
     */
    buildTrack(arrayBezierPoints, group, material_curve, material_point) {
        /** Constants */
        const RAIL_TIES_INTERVAL = 4;
        // const OFFSET_OUTER_TRACK = 1;
        const RAIL_TIES_WIDTH = 0.5;
        const RAIL_TIES_HEIGHT = 2;
        let geometry_line;
        /** 
         * Draw the track
         */
        // iterate through the distance table
        let numTies = 0;
        for (let rowIndex = 0; rowIndex < this.distanceTable[0].length; rowIndex++) {
            const traveledDistance = this.distanceTable[1][rowIndex];
            const posX = this.distanceTable[2][rowIndex];
            const posY = this.distanceTable[3][rowIndex];
            const vX = this.distanceTable[4][rowIndex];
            const vY = this.distanceTable[5][rowIndex];

            if (traveledDistance >= numTies * RAIL_TIES_INTERVAL) {
                let angle = Math.atan2(-vY, vX);

                if (!geometry_line) {
                    geometry_line = new T.PlaneBufferGeometry(RAIL_TIES_HEIGHT, RAIL_TIES_WIDTH);

                }
                let mesh_line = new T.Mesh(geometry_line, material_curve);
                mesh_line.position.set(
                    posX,
                    0.1,
                    posY);
                mesh_line.rotateY(angle);
                mesh_line.rotateX(degreesToRadians(90));

                group.add(mesh_line);
                // let axesHelper = new T.AxesHelper(5);
                // mesh_line.add(axesHelper);
                numTies++;
            }
        }
        /** 
         * Draw the control points 
         */
        if (this.showControlPoints) {
            for (let segmentIndex = 0; segmentIndex < arrayBezierPoints.length; segmentIndex++) {
                let segmentControlPoints = arrayBezierPoints[segmentIndex];
                let thisPoint = this.getBezierPos(
                    segmentControlPoints[0],
                    segmentControlPoints[1],
                    segmentControlPoints[2],
                    segmentControlPoints[3],
                    0);

                // - only draw the control points that are interpolated
                // -- which is the first (and the last) control point of the bezier spline
                // -- no need to draw both the first and the last since it's a close track
                if (!geometry_point) {
                    geometry_point = new T.SphereBufferGeometry(0.3);
                    // geometry_point = new T.PlaneBufferGeometry(1.5, 0.5);
                }
                let controlPointObject = new T.Mesh(geometry_point, material_point);
                controlPointObject.position.set(
                    thisPoint.posX,
                    0.1,
                    thisPoint.posY
                );
                // let axesHelper = new T.AxesHelper(5);
                // controlPointObject.add(axesHelper);
                controlPointObject.rotateX(degreesToRadians(90));
                controlPointObject.rotateZ(
                    Math.atan2(thisPoint.vY, thisPoint.vX)
                );
                group.add(controlPointObject);
            }
        }
        return group;
    }
    /**
     * 
     * @param {Array<Array<number>>} arrayControlPoints - an array of control points for cardinal splines
     * @returns {Array<Array<Array<number>>>} arrayBezierPoints - the array of the controls point of each cubic Bezier curve segment     
     * -  [segment index -> control point index -> [posX, posY]]
     */
    getArrayBezierControlPoints(arrayControlPoints) {
        // - collect the control points for the bezier curve segments at the same time
        let arrayBezierPoints = [];
        for (let startIndex = 0; startIndex < arrayControlPoints.length; startIndex++) {
            const c1 = arrayControlPoints[startIndex];
            const c2 = arrayControlPoints[(startIndex + 1) % arrayControlPoints.length];
            const c3 = arrayControlPoints[(startIndex + 2) % arrayControlPoints.length];
            const c4 = arrayControlPoints[(startIndex + 3) % arrayControlPoints.length];
            let bezierPoints = this.getSplineBezierControlPoints(c1, c2, c3, c4);
            arrayBezierPoints.push(bezierPoints);
        }
        return arrayBezierPoints;
    }
    /**
     * Get the corresponding Bezier control points of a cardinal cubic spline such that 
     * the c2 and c3 in cardinal curve could be connected by a cubic bezier curve.
     *
     * @param {Array<number>} c1 - 1st control point [x,y] of the cardinal spline
     * @param {Array<number>} c2 - 2nd control point [x,y] of the cardinal spline
     * @param {Array<number>} c3 - 3rd control point [x,y] of the cardinal spline
     * @param {Array<number>} c4 - 4th control point [x,y] of the cardinal spline
     * @returns {Array<Array<number>>} - the control points of the bezier curve
     */
    getSplineBezierControlPoints(c1, c2, c3, c4) {
        //  Derive the 4 control points for the bezier curve
        let b1 = c2;
        let b4 = c3;
        let b2 = [
            c2[0] + ((c3[0] - c1[0]) * (1 / 6)),
            c2[1] + ((c3[1] - c1[1]) * (1 / 6))
        ];
        let b3 = [
            c3[0] - ((c4[0] - c2[0]) * (1 / 6)),
            c3[1] - ((c4[1] - c2[1]) * (1 / 6))
        ];
        return [b1, b2, b3, b4];
    }
    /**
    * Build the distance table for interpolation (used by reparamToArclength()).
    *
    * @param {Array<Array<Array<number>>>} arrayBezierPoints - the array of the controls point of each cubic Bezier curve segment
    * @returns {Array<Array<number>>} - distance table 
    * - columns: [listT, listTravledDistance, posX, posY, vX, vY]
    */
    buildDistanceTable(arrayBezierPoints) {
        /**
         * Local variables
         */
        // the interval of t
        const stepSize = 0.01;
        let numSegments = arrayBezierPoints.length;

        /**
         * Create the distance table for interpolation
         */
        let listTravledDistance = [];
        let listT = [];
        let listPosX = [];
        let listPosY = [];
        let listvX = [];
        let listvY = [];
        let previousPointPar = {};
        let travledDistance = 0;
        // go through the track from start to the end
        // - get the position and derive the accumulated distance  
        let t = 0;
        while (t <= numSegments) {
            let segmentIndex = Math.floor(t);
            // - the free parameter of that segment
            let u = t - segmentIndex;
            // derive the train position
            let b1 = arrayBezierPoints[segmentIndex][0];
            let b2 = arrayBezierPoints[segmentIndex][1];
            let b3 = arrayBezierPoints[segmentIndex][2];
            let b4 = arrayBezierPoints[segmentIndex][3];
            let pointPar = this.getBezierPos(b1, b2, b3, b4, u);
            // compute the distance if t > 0
            if (t != 0) {
                travledDistance +=
                    Math.sqrt(
                        Math.pow((pointPar.posX - previousPointPar.posX), 2) +
                        Math.pow((pointPar.posY - previousPointPar.posY), 2));
                listTravledDistance.push(travledDistance);
                listT.push(t);
                listPosX.push(pointPar.posX);
                listPosY.push(pointPar.posY);
                listvX.push(pointPar.vX);
                listvY.push(pointPar.vY);
            }
            // save for the next iteration
            previousPointPar = pointPar;
            t += stepSize;
        }
        let distanceTable = [listT, listTravledDistance, listPosX, listPosY, listvX, listvY];
        return distanceTable;
    }
    /**Helper function */
    /**
     * Get the coodordinate and velocity of a point of a cubic bezier curve by Bernstein polynomials.
     *
     * @param {Array<number>} b1 - 1st control point [x,y]
     * @param {Array<number>} b2 - 2nd control point [x,y]
     * @param {Array<number>} b3 - 3rd control point [x,y]
     * @param {Array<number>} b4 - 4th control point [x,y]
     * @param {number} u - the free parameter of this curve [0,1]
     * @returns {*} the coordinate and velocity (posX, posy, vX, vY)
     */
    getBezierPos(b1, b2, b3, b4, u) {
        // the point of interest
        // - position
        let pt = [
            (Math.pow((1 - u), 3) * b1[0] + 3 * u * Math.pow((1 - u), 2) * b2[0] + 3 * Math.pow(u, 2) * (1 - u) * b3[0] + Math.pow(u, 3) * b4[0]),
            (Math.pow((1 - u), 3) * b1[1] + 3 * u * Math.pow((1 - u), 2) * b2[1] + 3 * Math.pow(u, 2) * (1 - u) * b3[1] + Math.pow(u, 3) * b4[1])
        ];
        // - derivitive
        let vt = [
            (-3 * Math.pow((1 - u), 2) * b1[0] +
                3 * Math.pow((1 - u), 2) * b2[0] - 6 * u * (1 - u) * b2[0] -
                3 * Math.pow(u, 2) * b3[0] +
                6 * u * (1 - u) * b3[0] + 3 * Math.pow(u, 2) * b4[0]),
            (-3 * Math.pow((1 - u), 2) * b1[1] +
                3 * Math.pow((1 - u), 2) * b2[1] - 6 * u * (1 - u) * b2[1] -
                3 * Math.pow(u, 2) * b3[1] +
                6 * u * (1 - u) * b3[1] + 3 * Math.pow(u, 2) * b4[1])
        ];
        // the point parameters to return
        let pointPar = {
            "posX": pt[0],
            "posY": pt[1],
            "vX": vt[0],
            "vY": vt[1]
        };
        return pointPar;
    }

    /**
     * Reparameterize the free parameter t to t* (arc-length) given the whole track.
     *
     * @param {number} nonArcT - the non-arc-length free parameter
     * @param {number} maxT - the maximun of the free parameter
     * @param {Array<Array<number>>} distanceTable - distance table (columns: [listT, listTravledDistance, posX, posY, vX, vY])
     * @returns {number} - the arc-length free parameter
     */
    reparamToArclength(nonArcT, maxT, distanceTable) {
        /** 
         * Interpolate the t* based on the distance table
         */
        // get the total distance
        let totalDistance = distanceTable[1][distanceTable[1].length - 1];
        // let totalDistance = listTravledDistance[listTravledDistance.length - 1];
        // the traveled distance at t
        let tTraveledDistance = (nonArcT / maxT) * totalDistance;

        // find the closest two rows that enclose the 'tTraveledDistance'
        // - the upper boundary and the lower boundary of t*
        for (let rowIndex = 0; rowIndex < distanceTable[0].length; rowIndex++) {
            const thisRow = {
                "t": distanceTable[0][rowIndex],
                "traveledDistance": distanceTable[1][rowIndex]
            };

            // break if found the upper bound of t*
            if (thisRow.traveledDistance > tTraveledDistance) {
                let arcTUpperBound = thisRow.t;
                // special case for the first row
                if (rowIndex == 0) {
                    let arcT = 0;
                    return arcT;
                } else {
                    let arcTLowerBound = distanceTable[0][rowIndex - 1];
                    let disFromLower = tTraveledDistance - distanceTable[1][rowIndex - 1];
                    let disFromLowerToUpper = distanceTable[1][rowIndex] - distanceTable[1][rowIndex - 1];
                    let propFromLower = disFromLower / disFromLowerToUpper;
                    // interpolate
                    let arcT = ((1 - propFromLower) * arcTLowerBound) + (propFromLower * arcTUpperBound);
                    return arcT;
                }
            }
        }
    }
}