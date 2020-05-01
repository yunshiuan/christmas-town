/*jshint esversion: 6 */
// @ts-check
import * as T from "../../libs/CS559-THREE/build/three.module.js";
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import * as H from "./helperFun.js";

let MiniLoaderObCtr = 0;
// A fork-lift
/**
 * @typedef MiniLoaderProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [scale=1]
 */
export class MiniLoader extends GrObject {
    /**
     * @param {MiniLoaderProperties} params
     */
    constructor(params = {}) {
        let miniloader = new T.Group();
        /**
         * Constants
         */
        const truckWidth = 1;
        const wheelWidth = truckWidth / 4;
        const armWidth = truckWidth;
        let truckExSettings = {
            steps: 2,
            depth: truckWidth,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.1,
            bevelSegments: 2
        };
        let wheelExSettings = {
            steps: 2,
            depth: wheelWidth,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.1,
            bevelSegments: 2
        };
        let armExSettings = {
            steps: 2,
            depth: armWidth,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.1,
            bevelSegments: 2
        };
        let miniloader_mat = new T.MeshStandardMaterial({
            color: "cyan",
            metalness: 0.5,
            roughness: 0.7
        });
        let wheel_mat = new T.MeshStandardMaterial({
            color: "grey",
            metalness: 0,
            roughness: 0.7
        });
        let arm_mat = new T.MeshStandardMaterial({
            color: "#888888",
            metalness: 0.8,
            roughness: 0.3
        });

        /**
         * Add the truck
         */
        let base_curve = new T.Shape();
        base_curve.moveTo(0, 0);
        base_curve.lineTo(-0.3, 1.01);
        base_curve.lineTo(-0.3 + 0.97, 1.01 + 1.96);
        base_curve.lineTo(-0.3 + 0.97 + 1.26, 1.01 + 1.96);
        base_curve.lineTo(-0.3 + 0.97 + 1.26 + 0.32, 1.01 + 1.96 - 1.79);
        base_curve.lineTo(-0.3 + 0.97 + 1.26 + 0.32 + 1.26, 1.01 + 1.96 - 1.79 + 0.46);
        base_curve.lineTo(-0.3 + 0.97 + 1.26 + 0.32 + 1.26, 1.01 + 1.96 - 1.79 + 0.46 - 1.63);
        base_curve.lineTo(-0.3 + 0.97 + 1.26 + 0.32 + 1.26 - 3.5, 1.01 + 1.96 - 1.79 + 0.46 - 1.63);
        let base_geom = new T.ExtrudeGeometry(base_curve, truckExSettings);
        let base = new T.Mesh(base_geom, miniloader_mat);
        miniloader.add(base);

        /**
         * Add the wheels
         */
        const num_wheels = 4;
        const wheel_radius = truckWidth / 2;
        let wheel2D = new T.Shape();
        wheel2D.moveTo(0, 0);
        wheel2D.arc(0, 0, wheel_radius, 0, Math.PI * 2, true);
        let wheel3D = new T.ExtrudeGeometry(wheel2D, wheelExSettings);
        let wheels = [];
        // place the wheels
        for (let index = 0; index < num_wheels; index++) {
            let wheel = new T.Mesh(wheel3D, wheel_mat);
            // right and left
            if (index == 0 || index == 1) {
                wheel.translateZ(- (wheelWidth / 1));
            } else {
                wheel.translateZ(truckWidth / 1);
            }
            // front and rear
            if (index == 0 || index == 2) {
                wheel.translateX(3);
            } else {
                wheel.translateX(0);
            }
            wheels.push(wheel);
            miniloader.add(wheel);
        }

        /**
         * Add the front side
         */
        let front_group = new T.Group();
        miniloader.add(front_group);
        front_group.translateY(0.7);
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
        let front_geom = new T.ExtrudeGeometry(front_curve, truckExSettings);
        let front = new T.Mesh(front_geom, miniloader_mat);
        front_group.add(front);

        /**
         * Add the arm for the bucket
         */
        const lowest_pos = -2;
        const arm_height = 2.5;
        const arm_width = 0.20;
        const arm_origin_x = -0.8;
        const arm_origin_y = 0.8;
        let arm_group = new T.Group();
        front_group.add(arm_group);
        arm_group.position.set(arm_origin_x, arm_origin_y, 0);
        let arm_curve = new T.Shape();
        arm_curve.moveTo(0, 0);
        arm_curve.lineTo(arm_width, 0);
        arm_curve.lineTo(arm_width, lowest_pos);
        arm_curve.lineTo(0, lowest_pos);
        arm_curve.lineTo(0, 0);
        let arm_geom = new T.ExtrudeGeometry(arm_curve, truckExSettings);
        let arm = new T.Mesh(arm_geom, arm_mat);
        arm.translateX(-0.3);
        arm_group.rotation.z = H.degreesToRadians(-70);
        arm_group.add(arm);
        // let arm_axesHelper = new T.AxesHelper(3);
        // arm_group.add(arm_axesHelper);

        /**
         * Add the bucket
         */
        const bucket_upper_length = 1.5;
        const bucket_lower_length = 0.5;
        const bucket_upper_lower_diff = (bucket_upper_length - bucket_lower_length) / 2;
        const bucket_height = 0.9;
        let bucket_group = new T.Group();
        arm_group.add(bucket_group);
        bucket_group.position.set(0, -arm_height + 0.35, 0);
        let bucket_curve = new T.Shape();
        bucket_curve.moveTo(0, 0);
        bucket_curve.lineTo(0, 0);
        bucket_curve.lineTo(-bucket_upper_length, 0);
        bucket_curve.lineTo(-bucket_upper_length + (bucket_upper_lower_diff), -bucket_height);
        bucket_curve.lineTo(
            -bucket_upper_length + (bucket_upper_lower_diff) + bucket_lower_length,
            -bucket_height);
        bucket_curve.lineTo(0, 0);
        let bucket_geom = new T.ExtrudeGeometry(bucket_curve, armExSettings);
        let bucket = new T.Mesh(bucket_geom, arm_mat);
        // place the bucket
        bucket_group.add(bucket);
        bucket.translateX(-0.2);
        bucket.rotateZ(H.degreesToRadians(60));
        // bucket.scale.set(-1, 1, 1);

        // bucket.translateZ(-0.2);
        // let bucket_axesHelper = new T.AxesHelper(3);
        // bucket_group.add(bucket_axesHelper);

        super(`Mini-Loader-${MiniLoaderObCtr++}`, miniloader, [
            ["x", -6, 6, 5],
            ["z", -2, 0, 0],
            ["theta", 0, 360, 0],
            ["arm angle", 55, 90, 55],
            ["bucket angle", -40, 90, 20]
        ]);

        this.whole_ob = miniloader;
        this.front = front_group;
        this.arm = arm_group;
        this.bucket = bucket_group;
        // this.base_origin_y = base_origin_y;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        // lift the truck so that the wheels touch the ground
        this.whole_ob.position.y = params.y ? Number(params.y) : wheel_radius;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.scale ? Number(params.scale) : 1;
        miniloader.scale.set(scale, scale, scale);

        // parameters for tick()
        this.state = "moveForward";
        this.timer = 0;
        this.speed = 0.03;
        // for translation
        this.tranX = 0;
        this.tranY = 0;
        // record the original position to reset translation
        this.originalPosX = this.whole_ob.position.x;

        // let axesHelper = new T.AxesHelper(5);
        // this.whole_ob.add(axesHelper);

        /** 
         * Make the miniloader rideable
         */
        // let axesHelper = new T.AxesHelper(5);
        let ridePoint = new T.Object3D();
        ridePoint.rotateY(H.degreesToRadians(-90));
        ridePoint.translateX(4);
        ridePoint.translateZ(-6);
        this.whole_ob.add(ridePoint);
        // this.whole_ob.add(axesHelper);
        // ridePoint.add(axesHelper);
        this.rideable = ridePoint;


    }
    /**
     * Define the movement of the miniloader.
     *
     * @memberof MiniLoader
     */
    tick(step, timeOfDay) {
        this.timer += this.speed;
        switch (this.state) {
            // order: 
            // moveForward -> bucketUp -> armUp -> moveBackward-> rotateBodyClockwise ->
            // armDown -> bucketDown -> rotateBodyCounterClockwise -> ...
            // - body rotation: [-90,90]
            // - arm rotation: [-55, -90]            
            // - bucket rotation: [-30, 40]
            case "moveForward":
                if (this.tranX < 3) {
                    // reset the position before translation
                    // this.whole_ob.position.x = this.originalPosX;
                    // this.whole_ob.translateX(- this.tranX);
                    this.tranX += this.speed;
                    this.whole_ob.position.x = this.originalPosX - this.tranX;
                } else {
                    this.state = "bucketUp";
                }
                break;
            case "moveBackward":
                if (this.tranX > 0) {
                    // reset the position before translation
                    // this.whole_ob.position.x = this.originalPosX;
                    // this.whole_ob.translateX(- this.tranX);
                    this.tranX -= this.speed;
                    this.whole_ob.position.x = this.originalPosX - this.tranX;
                } else {
                    this.state = "rotateBodyClockwise";
                }
                break;
            case "armDown":
                if (this.arm.rotation.z < H.degreesToRadians(-55)) {
                    this.arm.rotation.z += this.speed;
                } else {
                    this.state = "bucketDown";
                }
                break;
            case "armUp":
                if (this.arm.rotation.z > H.degreesToRadians(-90)) {
                    this.arm.rotation.z -= this.speed;
                } else {
                    this.state = "moveBackward";
                }
                break;
            case "bucketDown":
                if (this.bucket.rotation.z < H.degreesToRadians(40)) {
                    this.bucket.rotation.z += this.speed;
                } else {
                    this.state = "rotateBodyCounterClockwise";
                }
                break;
            case "bucketUp":
                if (this.bucket.rotation.z > H.degreesToRadians(-30)) {
                    this.bucket.rotation.z -= this.speed;
                } else {
                    this.state = "armUp";
                }
                break;
            case "rotateBodyClockwise":
                if (this.whole_ob.rotation.y > H.degreesToRadians(-90)) {
                    this.whole_ob.rotation.y -= this.speed;
                } else {
                    this.state = "armDown";
                }
                break;
            case "rotateBodyCounterClockwise":
                if (this.whole_ob.rotation.y < H.degreesToRadians(0)) {
                    this.whole_ob.rotation.y += this.speed;
                } else {
                    this.state = "moveForward";
                }
                break;
            default:
        }
    }
}