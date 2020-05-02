/*jshint esversion: 6 */
// @ts-check
import * as T from "../../libs/CS559-THREE/build/three.module.js";
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import { ObjGrObject } from "../../libs/CS559-Framework/loaders.js";
import * as H from "./helperFun.js";
import { Track } from "./track.js";

// define your vehicles here - remember, they need to be imported
// into the "main" program
let truckObCtr = 0;

// A truck
/**
 * @typedef truckProperties
 * @type {object}
 * @property {number} [x=0] 
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [scale=1]
 * @property {number} [speed=1]
 * @property {Track} [track=null] 
 */
export class Truck extends GrObject {
    /**
     * @param {truckProperties} params
     */
    constructor(params = {}) {
        let truckGroup = new T.Group();

        /**
         * Constants
         */
        let frontExSettings = {
            steps: 2,
            depth: 2,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.1,
            bevelSegments: 2
        };
        let wheelExSettings = {
            steps: 2,
            depth: 0.5,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.1,
            bevelSegments: 2
        };
        // textures
        // let t_window = new T.TextureLoader().load("../images/car_window_texture.jpg");
        // t_window.repeat.set(2, 2);
        // t_window.wrapS = T.MirroredRepeatWrapping;
        // t_window.wrapT = T.MirroredRepeatWrapping;

        let t_container = new T.TextureLoader().load("./images/truck_container_texture.png");
        t_container.repeat.set(1, 1);
        t_container.wrapS = T.MirroredRepeatWrapping;
        t_container.wrapT = T.MirroredRepeatWrapping;
        // materials
        let truck_cap_mat = new T.MeshStandardMaterial({
            color: "#0033cc",
            metalness: 0.1,
            roughness: 0.7
        });
        let truck_container_mat = new T.MeshStandardMaterial({
            map: t_container,
            metalness: 0.1,
            roughness: 0.7
        });
        let wheel_mat = new T.MeshStandardMaterial({
            color: "#404040",
            metalness: 0,
            roughness: 0.7
        });
        let window_mat = new T.MeshStandardMaterial({
            // map: t_window,
            color: "black",
            // metalness: 0.7,
            // roughness: 1,
            side: T.DoubleSide
        });
        /**
         * Add the truck container
         */
        let truckScale = 0.8;
        const truckHeight = 2 * truckScale;
        const truckWidth = 3 * truckScale;
        const truckLength = 6 * truckScale;
        let truckGeometry = new T.BoxGeometry(truckLength, truckHeight, truckWidth);
        let truck = new T.Mesh(truckGeometry, truck_container_mat);
        // place to the ground
        truck.translateY(truckHeight / 2);
        truckGroup.add(truck);
        /**
         * Add the cap
         */
        let front_group = new T.Group();
        truckGroup.add(front_group);
        // front_group.translateY(0.7);
        let front_curve = new T.Shape();
        front_curve.moveTo(-1, 0);
        front_curve.lineTo(1, 0);
        front_curve.lineTo(1.2, 0.35);
        front_curve.lineTo(1, 0.75);
        front_curve.lineTo(0.25, 0.75);
        front_curve.lineTo(0, 1.5);
        front_curve.lineTo(-0.8, 1.5);
        front_curve.lineTo(-1, 1.2);
        front_curve.lineTo(-1, 0);
        let front_geom = new T.ExtrudeGeometry(front_curve, frontExSettings);
        let front = new T.Mesh(front_geom, truck_cap_mat);
        front_group.scale.set(-1, 1, 1);
        front.translateX(truckWidth / 2 + 2.5);
        front.translateZ(-1);
        front_group.add(front);
        /**
         * Add the wheels
         */
        const num_wheels = 6;
        const wheel_radius = truckWidth / 5;
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
                wheel.translateZ((truckWidth / 2) - (truckWidth / 10));
            } else {
                wheel.translateZ(-1 * (truckWidth / 2) - (truckWidth / 10));
            }
            // front, middle, rear
            if (index == 0 || index == 1) {
                wheel.translateX(truckLength / 4);
            } else if (index == 2 || index == 3) {
                wheel.translateX(- truckLength / 4);
            } else {
                wheel.translateX(- truckLength + 1);
            }
            wheels.push(wheel);
            truckGroup.add(wheel);
        }
        /**
         * Add side windows
         */
        const num_side_windows = 2;
        const window_width = truckWidth / 4;
        const window_height = truckHeight / 3;
        let window2D = new T.Shape();
        window2D.moveTo(0, 0);
        window2D.lineTo(window_width, 0);
        window2D.lineTo(window_width, window_height);
        window2D.lineTo(window_width * 0.4, window_height);
        window2D.lineTo(0, window_height * 0.4);
        window2D.lineTo(0, 0);

        let windowGeo = new T.ShapeGeometry(window2D);
        let windows = [];
        // place the side windows
        for (let index = 0; index < num_side_windows; index++) {
            let window = new T.Mesh(windowGeo, window_mat);
            // left
            if (index == 0) {
                window.translateZ((truckWidth / 2) + 0.01);
                window.translateX(-(truckLength / 2) - ((2.5) * 0.5));
                window.translateY((truckHeight / 2) * 1.1);
            } else if (index == 1) {
                window.translateZ(-1 * ((truckWidth / 2) + 0.01));
                window.translateX(-(truckLength / 2) - ((2.5) * 0.5));
                window.translateY((truckHeight / 2) * 1.1);
            }
            windows.push(window);
            truckGroup.add(window);
        }
        /**
         * Add the front window
         */
        const front_window_width = truckWidth * 0.7;
        const front_window_height = truckHeight * 0.45;
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
        frontWindow.rotateX(H.degreesToRadians(17));

        frontWindow.position.x = (-(truckLength / 2) - (2.5 * 0.65));
        frontWindow.position.y = ((truckHeight / 2) * 1.1);
        frontWindow.position.z = 0 + front_window_width / 2;
        truckGroup.add(frontWindow);

        super(`Truck-${truckObCtr++}`, truckGroup);
        /**
         * Scale the truck
         */
        let scale = params.scale ? Number(params.scale) : 1;
        truckGroup.scale.set(scale, scale, scale);
        /**
         * Store each part in a field.
         */
        this.whole_ob = truckGroup;
        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        // lift the truck so that the wheels touch the ground
        this.whole_ob.position.y = params.y ? Number(params.y) + wheel_radius * scale : wheel_radius * scale;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        /**
         * Handle the track
         */
        this.track = params.track;
        // the starting position on the track
        this.u = 18;
        this.speed = params.speed ? Number(params.speed) : 1;
        /** 
         * Make the truck rideable
         */
        // let axesHelper = new T.AxesHelper(5);
        let ridePoint = new T.Object3D();
        // ridePoint.add(axesHelper);

        ridePoint.rotateX(H.degreesToRadians(90));
        ridePoint.rotateY(H.degreesToRadians(270));
        ridePoint.rotateZ(H.degreesToRadians(90));

        ridePoint.position.set(5, 3, 0);

        this.whole_ob.add(ridePoint);
        this.rideable = ridePoint;
    }
    /**
     * The movement of the bus
     * @param {*} step 
     * @param {*} timeOfDay 
     */
    tick(step, timeOfDay) {
        this.u += step / 2000 * (this.speed);
        let pos = this.track.getPosOnTrack(this.u, true);
        this.whole_ob.position.set(pos.posX, this.whole_ob.position.y, pos.posY);
        let zAngle = Math.atan2(pos.vY, pos.vX);
        // turn the object so the Z axis is facing in that direction
        this.whole_ob.rotation.y = -zAngle - Math.PI;
    }
}
