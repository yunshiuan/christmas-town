/*jshint esversion: 6 */
// @ts-check
import * as T from "../../libs/CS559-THREE/build/three.module.js";
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import { ObjGrObject } from "../../libs/CS559-Framework/loaders.js";
import * as H from "./helperFun.js";

let busObCtr = 0;
// A bus
/**
 * @typedef busProperties
 * @type {object}
 * @property {number} [x=0] 
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [scale=1]
 */
export class Bus extends GrObject {
    /**
     * @param {busProperties} params
     */
    constructor(params = {}) {
        let busGroup = new T.Group();

        /**
         * Constants
         */
        let busScale = 0.8;
        const busHeight = 2 * busScale;
        const busWidth = 3 * busScale;
        const busLength = 6 * busScale;
        const busColor = "orange";
        let frontExSettings = {
            steps: 2,
            depth: busWidth,
            bevelEnabled: false
        };
        let wheelExSettings = {
            steps: 2,
            depth: 0.5,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.1,
            bevelSegments: 2
        };

        // materials
        let bus_cap_mat = new T.MeshStandardMaterial({
            color: busColor,
            metalness: 0.3,
            roughness: 0.7
        });
        let bus_container_mat = new T.MeshStandardMaterial({
            color: busColor,
            metalness: 0.3,
            roughness: 0.7
        });
        let wheel_mat = new T.MeshStandardMaterial({
            color: "#404040",
            metalness: 0,
            roughness: 0.7
        });
        let window_mat = new T.MeshStandardMaterial({
            color: "black",
            metalness: 0.7,
            // roughness: 1,
            side: T.DoubleSide
        });
        /**
         * Add the bus container
         */

        let busGeometry = new T.BoxGeometry(busLength, busHeight, busWidth);
        let bus = new T.Mesh(busGeometry, bus_container_mat);
        // place to the ground
        bus.translateY(busHeight / 2);
        busGroup.add(bus);
        /**
         * Add the cap
         */
        let front_group = new T.Group();
        busGroup.add(front_group);
        // front_group.translateY(0.7);
        let front_curve = new T.Shape();
        front_curve.moveTo(-1, 0);
        front_curve.lineTo(1.2, 0);
        front_curve.lineTo(1.2, busHeight * 0.3);
        front_curve.lineTo(1, busHeight);
        front_curve.lineTo(-1, busHeight);
        let front_geom = new T.ExtrudeGeometry(front_curve, frontExSettings);
        let front = new T.Mesh(front_geom, bus_cap_mat);
        front_group.scale.set(-1, 1, 1);
        front.translateX(busWidth / 2 + 2.2);
        front.translateZ(-busWidth / 2);
        front_group.add(front);
        /**
         * Add the wheels
         */
        const num_wheels = 6;
        const wheel_radius = busWidth / 5;
        let wheel2D = new T.Shape();
        wheel2D.moveTo(0, 0);
        wheel2D.arc(0, 0, wheel_radius, 0, Math.PI * 2, true);
        let wheel3D = new T.ExtrudeGeometry(wheel2D, wheelExSettings);
        let wheels = [];
        // place the wheels
        for (let index = 0; index < num_wheels; index++) {
            let wheel = new T.Mesh(wheel3D, wheel_mat);
            // right and left
            if (index % 2 == 0) {
                wheel.translateZ((busWidth / 2) - (busWidth / 10));
            } else {
                wheel.translateZ(-1 * (busWidth / 2) - (busWidth / 10));
            }
            // front, middle, rear
            if (index == 0 || index == 1) {
                wheel.translateX(busLength / 4);
            } else if (index == 2 || index == 3) {
                wheel.translateX(- busLength / 4);
            } else {
                wheel.translateX(- busLength + 1);
            }
            wheels.push(wheel);
            busGroup.add(wheel);
        }
        /**
         * Add side windows
         */
        const num_side_windows = 12;
        const window_width = busWidth * 0.3;
        const window_height = busHeight * 0.5;
        let window2D = new T.Shape();
        window2D.moveTo(0, 0);
        window2D.lineTo(window_width, 0);
        window2D.lineTo(window_width, window_height);
        window2D.lineTo(0, window_height);
        window2D.lineTo(0, 0);

        let windowGeo = new T.ShapeGeometry(window2D);
        let windows = [];
        // place the side windows
        for (let index = 0; index < num_side_windows; index++) {
            let window = new T.Mesh(windowGeo, window_mat);
            let row_index = Math.floor(index / 2);
            // left
            if ((index % 2) == 0) {
                window.translateZ((busWidth / 2) + 0.01);
                window.translateY((busHeight / 2) * 0.9);
                // right
            } else if ((index % 2) == 1) {
                window.translateZ(-1 * ((busWidth / 2) + 0.01));
                window.translateY((busHeight / 2) * 0.9);
            }
            // start from the head of the bus
            window.translateX(-(busLength / 2) - ((2.2) * 0.9));
            // place windows on the x axis
            window.translateX(window_width * 1.5 * row_index);

            windows.push(window);
            busGroup.add(window);
        }
        /**
         * Add the front window
         */
        const front_window_width = busWidth * 0.95;
        const front_window_height = busHeight * 0.7;
        let front_window2D = new T.Shape();
        front_window2D.moveTo(0, 0);
        front_window2D.lineTo(front_window_width, 0);
        front_window2D.lineTo(front_window_width, front_window_height);
        front_window2D.lineTo(0, front_window_height);
        front_window2D.lineTo(0, 0);

        let frontWindowGeo = new T.ShapeGeometry(front_window2D);
        // place the front window
        let frontWindow = new T.Mesh(frontWindowGeo, window_mat);
        frontWindow.rotateY(H.degreesToRadians(90));
        frontWindow.rotateX(H.degreesToRadians(10));

        frontWindow.position.x = (-(busLength / 2) - (2.2 * 1.01));
        frontWindow.position.y = (busHeight * 0.3);
        frontWindow.position.z = 0 + front_window_width / 2;
        busGroup.add(frontWindow);

        super(`Truck-${busObCtr++}`, busGroup);
        /**
         * Scale the bus
         */
        let scale = params.scale ? Number(params.scale) : 1;
        busGroup.scale.set(scale, scale, scale);
        /**
         * Store each part in a field.
         */
        this.whole_ob = busGroup;
        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        // lift the bus so that the wheels touch the ground
        this.whole_ob.position.y = params.y ? Number(params.y) + wheel_radius * scale : wheel_radius * scale;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;

    }
}