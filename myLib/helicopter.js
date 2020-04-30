/*jshint esversion: 6 */
// @ts-check
import * as T from "../../libs/CS559-THREE/build/three.module.js";
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import { ObjGrObject } from "../../libs/CS559-Framework/loaders.js";
import * as H from "./helperFun.js";

let helicopterCtr = 0;
/**
 * @class Helicopter
 * @typedef CarouselProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [scale=0.15]
 * @extends {GrObject} 
 */
export class Helicopter extends GrObject {
    /**
     * @param {CarouselProperties} params
     */
    constructor(params = {}) {
        /**
         * Constants
         */
        const posX = params.x ? Number(params.x) : 0;
        const posY = params.y ? Number(params.y) : 0;
        const posZ = params.z ? Number(params.z) : 0;
        const scale = params.scale ? Number(params.scale) : 0.15;
        const SPEED = 0.01;
        // const altitude = 5;

        // collect the body and the propeller
        let group = new T.Group();
        super(`helicopter-${helicopterCtr++}`, group);
        this.group = group;
        // the body
        this.addBody();

        // the propellers
        this.propellers = [];
        const propellerColor = "#997300";
        this.addPropeller(0, 2, -3, 0.3, propellerColor);
        this.addPropeller(0, 2, 3, 0.3, propellerColor);
        this.speed = SPEED;
        // this.altitude = altitude;
        // put the object in its place
        this.group.position.x = posX;
        this.group.position.y = posY;
        this.group.position.z = posZ;
        this.scale = scale;
        this.setScale(scale);

        // parameters for tick()
        this.originX = posX;
        this.originY = posY;
        this.originZ = posZ;
        this.timer = 0;

        // let axesHelper = new T.AxesHelper(5);
        let ridePoint = new T.Object3D();
        // ridePoint.add(axesHelper);

        ridePoint.rotateX(H.degreesToRadians(280));
        ridePoint.position.set(0, -190, -20);

        this.head.add(ridePoint);
        this.rideable = ridePoint;
    }
    /**
     * Add the body,
     *
     * @memberof Helicopter
     */
    addBody() {
        // the body
        let bodyGeometry = new T.SphereGeometry(5, 32, 3);
        let bodyMaterial = new T.MeshStandardMaterial({
            color: "#0000cc",
            metalness: 0.5,
            roughness: 0.7
        });
        this.body = new T.Mesh(bodyGeometry, bodyMaterial);
        this.body.rotateX(Math.PI / 2);
        this.body.scale.set(0.5, 1, 0.5);

        // the head
        let headGeometry = new T.ConeGeometry(5, 20, 32);
        let headMaterial = new T.MeshStandardMaterial({
            color: "#00ffff",
            metalness: 0.2,
            roughness: 0.7
            // side: DoubleSide
        });
        this.head = new T.Mesh(headGeometry, headMaterial);
        this.head.rotateX(Math.PI / 2);
        this.head.position.set(0, 0, 4.5);
        this.head.scale.set(0.3, 0.1, 0.3);

        // the windows
        this.windows = [];
        let windowGeometry = new T.SphereGeometry(5, 32, 32, 1, 0.6, 0.8, 0.7);
        let windowMaterial = new T.MeshStandardMaterial({
            color: "grey",
            metalness: 0.2,
            roughness: 0.7
            // side: DoubleSide
        });
        // windows
        for (let index = 0; index < 6; index++) {
            this.windows.push(new T.Mesh(windowGeometry, windowMaterial));
            this.windows[index].scale.set(0.2, 0.5, 0.5);

            // - left windows
            if (index < 3) {
                this.windows[index].rotateY(Math.PI / 2);
                this.windows[index].position.set(0, 0, 0.6 + -1.2 * (index));
            } else {
                // - right windows
                this.windows[index].rotateY(-Math.PI / 2);
                this.windows[index].position.set(0, 0, 0.6 + -1.2 * (index - 3));

            }
        }

        // add to the group
        this.group.add(this.body);
        this.group.add(this.head);
        for (let index = 0; index < this.windows.length; index++) {
            const window = this.windows[index];
            this.group.add(window);
        }
    }
    /**
     * Set scale.
     * 
     * @param {number} s 
     * @memberof Quadcopter
     */
    setScale(s) {
        this.group.scale.set(s, s, s);
    }
    /**
     * Set position.
     * 
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @memberof Quadcopter
     */
    setPosition(x, y, z) {
        this.group.position.x = x;
        this.group.position.y = y;
        this.group.position.z = z;
    }
    /**
     * Get the current position.
     *
     * @memberof Quadcopter
     */
    getPosition() {
        return {
            x: this.group.position.x,
            y: this.group.position.y,
            z: this.group.position.z
        };
    }
    /**
     * Add a propeller. Called by the constructor.
     * @param {number} pX - relative to the origin of the body (the upper-left corner)
     * @param {number} pY - relative to the origin of the body (the upper-left corner)
     * @param {number} pZ - relative to the origin of the body (the upper-left corner)
     * @param {number} s - the scaling factor
     * @param {string} color - the color of the propellers
     * @memberof GrObject
     */
    addPropeller(pX, pY, pZ, s, color) {
        let geometry = new T.BoxGeometry(20, 0.5, 1);
        let material = new T.MeshStandardMaterial({
            color: color,
            roughness: 0.8
        });
        let thisPropeller = new T.Mesh(geometry, material);
        // place the propeller
        let currentPos = this.getPosition();
        thisPropeller.position.x = currentPos.x + pX;
        thisPropeller.position.y = currentPos.y + pY;
        thisPropeller.position.z = currentPos.z + pZ;
        thisPropeller.scale.set(s, s, s);

        // save the propeller to the container
        this.propellers.push(thisPropeller);
        // add to the group
        this.group.add(thisPropeller);
    }
    /**
     * Define the movement of the helicopter.
     *
     * @memberof Helicopter
     */
    tick(step, timeOfDay) {

        // // all the speeds are arbitrary, so we tune things here
        // let deltaSlowed = step / 200;

        // // spin the propellers
        // for (let index = 0; index < this.propellers.length; index++) {
        //     const propeller = this.propellers[index];
        //     propeller.rotateY(deltaSlowed * 4);
        //     // propeller.rotateOnWorldAxis(new T.Vector3(0, 1, 0), 0.3);
        // }
        // // // spin the rotor around - even when the helicopter is landed
        // // this.rotor.rotateY(deltaSlowed * 4);

        // // state machine - depending on state, do the right thing
        // switch (this.state) {
        //     case 0: // initialization
        //         this.state = 1;
        //         this.delay = 0;
        //         break;
        //     case 1: // ascend to altitude
        //         this.group.position.y += deltaSlowed;
        //         if (this.group.position.y >= this.altitude) {
        //             this.group.position.y = this.altitude;
        //             this.state = 4;
        //             // pick a random helipad - must be different than where we are
        //             let targets = this.pads.filter((obj) => obj != this.current);
        //             let pick = Math.floor(Math.random() * targets.length);
        //             this.current = targets[pick];
        //             // compute the spin, before we start
        //             let dx = this.current.mesh.position.x - this.group.position.x;
        //             let dz = this.current.mesh.position.z - this.group.position.z;
        //             let ds = Math.sqrt(dx * dx + dz * dz);
        //             if (ds > 0) {
        //                 // compute the goal angle
        //                 this.goalangle = Math.atan2(dx, dz);
        //                 // get the current angle
        //                 let quat = new T.Quaternion();
        //                 this.group.getWorldQuaternion(quat);
        //                 let eu = new T.Euler();
        //                 eu.setFromQuaternion(quat);
        //                 this.currentangle = eu.y;
        //                 this.state = 4;
        //             } else {
        //                 this.state = 5; // don't bother spinning
        //             }
        //         }
        //         break;
        //     case 2: // descend
        //         this.group.position.y -= deltaSlowed;
        //         if (this.group.position.y <= 0) {
        //             this.group.position.y = 0;
        //             this.state = 3;
        //             this.delay = 1 + Math.random();
        //         }
        //         break;
        //     case 3: // wait before takeoff
        //         this.delay -= deltaSlowed;
        //         if (this.delay < 0) {
        //             this.state = 1; // take off again
        //         }
        //         break;
        //     case 4: // rotate to point towards destination
        //         let ad = this.goalangle - this.currentangle;
        //         if (ad > 0.1) {
        //             this.currentangle += 0.05;
        //         } else if (ad < -0.1) {
        //             this.currentangle -= 0.05;
        //         } else {
        //             this.state = 5;
        //             this.currentangle = this.goalangle;
        //         }
        //         this.group.setRotationFromEuler(
        //             new T.Euler(0, this.currentangle, 0)
        //         );
        //         break;
        //     case 5: // fly to destination
        //         let dx = this.current.mesh.position.x - this.group.position.x;
        //         let dz = this.current.mesh.position.z - this.group.position.z;
        //         let dst = Math.sqrt(dx * dx + dz * dz);
        //         let ds = deltaSlowed * 1.5;
        //         if (dst > ds) {
        //             this.group.position.x += (dx * ds) / dst;
        //             this.group.position.z += (dz * ds) / dst;
        //         } else {
        //             this.group.position.x = this.current.mesh.position.x;
        //             this.group.position.z = this.current.mesh.position.z;
        //             this.state = 2;
        //         }
        //         break;
        // }

        /**
         * move in a circle
         */
        this.timer += this.speed;
        let nexPos =
        {
            x: this.originX + (5) * (Math.sin(2 * this.timer)),
            y: this.originY + (0) * (Math.sin(2 * this.timer)),
            z: this.originZ + (15) * (Math.sin(this.timer))
        };
        // head toward the flying direction
        this.group.lookAt(nexPos.x, nexPos.y, nexPos.z);
        // update the body mass position
        this.setPosition(nexPos.x, nexPos.y, nexPos.z);

        // spin the propellers
        for (let index = 0; index < this.propellers.length; index++) {
            const propeller = this.propellers[index];
            propeller.rotateY(0.3);
            // propeller.rotateOnWorldAxis(new T.Vector3(0, 1, 0), 0.3);
        }
    }
}

/**
  * The class of the radar.
  *
  * @class Radar
  */
class Radar {
    /**
     *Creates an instance of Radar.
     * @param {string} diskColor
     * @memberof Radar
     */
    constructor(diskColor) {
        this.group = new T.Group();
        //  add the disk
        this.addDisk(diskColor);
        this.disk.rotateX(Math.PI / 2);
        this.lasar.rotateX(Math.PI / 2);

        // define the up vector
        this.disk.up.set(0, 0, 1);

    }
    /**
   * Set scale.
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @memberof Radar
   */
    setScale(x, y, z) {
        this.group.scale.set(x, y, z);
    }
    /**
     * Set position.
     * 
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @memberof Radar
     */
    setPosition(x, y, z) {
        this.group.position.x = x;
        this.group.position.y = y;
        this.group.position.z = z;
    }
    /**
     * Get the current position.
     *
     * @memberof Radar
     */
    getPosition() {
        return {
            x: this.group.position.x,
            y: this.group.position.y,
            z: this.group.position.z
        };
    }
    /**
     * Add the disk.
     * @param {string} diskColor
     * @memberof Radar
     */
    addDisk(diskColor) {
        // the disk
        let points = [];
        for (let i = 0; i < 10; i++) {
            points.push(new T.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
        }
        let diskGeometry = new T.LatheGeometry(points);
        let diskMaterial = new T.MeshStandardMaterial({
            color: diskColor,
            metalness: 0.2,
            roughness: 0.7,
            side: T.DoubleSide
        });
        let disk = new T.Mesh(diskGeometry, diskMaterial);
        this.disk = disk;
        this.group.add(disk);

        // the lasar
        let laser = new T.Shape();
        let x = 0, y = 0;
        laser.moveTo(x - 0.2, y);
        laser.lineTo(x - 0.2, y + 30);
        laser.lineTo(x + 0.2, y + 30);
        laser.lineTo(x + 0.2, y);
        let laserGeometry = new T.ShapeGeometry(laser);
        let laserMaterial = new T.MeshStandardMaterial(
            {
                color: "red",
                side: T.DoubleSide
            });
        let lasar = new T.Mesh(laserGeometry, laserMaterial);
        this.lasar = lasar;
        this.group.add(lasar);
    }
    /**
     * Follow a quadcopter.
     *
     * @param {Helicopter} quadcopter - the quadcopter to follow
     * @memberof Radar
     */
    follow(quadcopter) {
        let pos = quadcopter.getPosition();
        this.group.lookAt(pos.x, pos.y, pos.z);
    }
}
