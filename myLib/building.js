/*jshint esversion: 6 */
// @ts-check
import * as T from "../libs/THREE/build/three.module.js";
import { GrObject } from "../libs/Framework/GrObject.js";
import * as H from "./helperFun.js";
import { GrCube } from "../libs/Framework/SimpleObjects.js";

let woodBuildingCtr = 0;
let t_wood;
let t_door_wood;
let t_window_wood;
let building_wood_geometry;
let building_wood_material;
/**
 * @typedef BuildingWoodProperties
 * @type {object}
 * @property {number} [x=0] - the position x
 * @property {number} [y=0] - the position y
 * @property {number} [z=0] - the position z
 * @property {number} [h=1] - the size h
 * @property {number} [w=1.5] - the size w
 * @property {number} [d=1.5] - the size d
 * @property {number} [scale=1] - the scaling factor
 */
export class BuildingWood extends GrObject {
    /**
     * @param {BuildingWoodProperties} params
     */
    constructor(params = {}) {
        // collect the house with doors and windows
        let group = new T.Group();
        /**
         * Constants
         */
        const height = params.h ? Number(params.h) : 1;
        const width = params.w ? Number(params.w) : 1.5;
        const depth = params.d ? Number(params.d) : 1.5;
        const x = params.x ? Number(params.x) : 0;
        const y = params.y ? Number(params.y) : 0;
        const z = params.z ? Number(params.z) : 0;
        const scale = params.scale ? Number(params.scale) : 1;

        const wall_color = "#ffa64d";
        const front_color1 = wall_color;
        const front_color2 = wall_color;
        const front_color3 = wall_color;
        const side_color1 = wall_color;
        const side_color2 = wall_color;
        const side_color3 = wall_color;

        const roof_height = 0.5;
        const roof_side_color = "brown";
        const roof_mountain_color = "#cc3300";

        /**
         * Create the house body
         */
        if (!building_wood_geometry) {
            building_wood_geometry = new T.Geometry();
            /**
             * Define the vertices
             */

            // the front 4 vertices
            building_wood_geometry.vertices.push(new T.Vector3(0, 0, 0));
            building_wood_geometry.vertices.push(new T.Vector3(width, 0, 0));
            building_wood_geometry.vertices.push(new T.Vector3(width, height, 0));
            building_wood_geometry.vertices.push(new T.Vector3(0, height, 0));

            // the back 4 vertices
            building_wood_geometry.vertices.push(new T.Vector3(0, 0, -depth));
            building_wood_geometry.vertices.push(new T.Vector3(width, 0, -depth));
            building_wood_geometry.vertices.push(new T.Vector3(width, height, -depth));
            building_wood_geometry.vertices.push(new T.Vector3(0, height, -depth));

            // the roof vertices
            building_wood_geometry.vertices.push(new T.Vector3(width / 2, height + roof_height, 0));
            building_wood_geometry.vertices.push(new T.Vector3(width / 2, height + roof_height, -depth));

            /**
             * Define the faces
             */

            // the front side
            let f1 = new T.Face3(0, 1, 2);
            building_wood_geometry.faces.push(f1);
            f1.vertexColors[0] = new T.Color(front_color1);
            f1.vertexColors[1] = new T.Color(front_color2);
            f1.vertexColors[2] = new T.Color(front_color3);

            let f2 = new T.Face3(2, 3, 0);
            building_wood_geometry.faces.push(f2);
            f2.vertexColors[0] = new T.Color(front_color3);//2
            f2.vertexColors[1] = new T.Color(front_color2);//3
            f2.vertexColors[2] = new T.Color(front_color1);//0

            // the left side
            let f3 = new T.Face3(4, 0, 3);
            building_wood_geometry.faces.push(f3);
            f3.vertexColors[0] = new T.Color(side_color1);//0
            f3.vertexColors[1] = new T.Color(side_color2);//3
            f3.vertexColors[2] = new T.Color(side_color3);//4

            let f4 = new T.Face3(3, 7, 4);
            building_wood_geometry.faces.push(f4);
            f4.vertexColors[0] = new T.Color(side_color2);//3
            f4.vertexColors[1] = new T.Color(side_color1);//7
            f4.vertexColors[2] = new T.Color(side_color3);//4

            // the back side
            let f5 = new T.Face3(5, 4, 7);
            building_wood_geometry.faces.push(f5);
            f5.vertexColors[0] = new T.Color(front_color3);
            f5.vertexColors[1] = new T.Color(front_color1);
            f5.vertexColors[2] = new T.Color(front_color2);

            let f6 = new T.Face3(7, 6, 5);
            building_wood_geometry.faces.push(f6);
            f6.vertexColors[0] = new T.Color(front_color2);
            f6.vertexColors[1] = new T.Color(front_color1);
            f6.vertexColors[2] = new T.Color(front_color3);

            // the right side
            let f7 = new T.Face3(1, 5, 6);
            building_wood_geometry.faces.push(f7);
            f7.vertexColors[0] = new T.Color(side_color2);//6
            f7.vertexColors[1] = new T.Color(side_color3);//2
            f7.vertexColors[2] = new T.Color(side_color1);//5

            let f8 = new T.Face3(6, 2, 1);
            building_wood_geometry.faces.push(f8);
            f8.vertexColors[0] = new T.Color(side_color1);//5
            f8.vertexColors[1] = new T.Color(side_color3);//2
            f8.vertexColors[2] = new T.Color(side_color2);//1

            // the roof (rectangle part)
            let f9 = new T.Face3(2, 6, 9);
            f9.color.setStyle(roof_side_color);
            building_wood_geometry.faces.push(f9);
            let f10 = new T.Face3(9, 8, 2);
            f10.color.setStyle(roof_side_color);
            building_wood_geometry.faces.push(f10);
            let f11 = new T.Face3(7, 3, 8);
            f11.color.setStyle(roof_side_color);
            building_wood_geometry.faces.push(f11);
            let f12 = new T.Face3(8, 9, 7);
            f12.color.setStyle(roof_side_color);
            building_wood_geometry.faces.push(f12);

            // the roof (triangle part)
            let f13 = new T.Face3(6, 7, 9);
            f13.color.setStyle(roof_mountain_color);
            building_wood_geometry.faces.push(f13);
            let f14 = new T.Face3(3, 2, 8);
            f14.color.setStyle(roof_mountain_color);
            building_wood_geometry.faces.push(f14);
            f13.color.setStyle(roof_mountain_color);
            f14.color.setStyle(roof_mountain_color);

            building_wood_geometry.computeFaceNormals();
        }
        /**
         * Add wood textures to the walls
         */
        const num_face_side = 4;
        const num_face_roof_rect = 2;
        const num_face_roof_tri = 2;
        if (!t_wood) {
            t_wood = new T.TextureLoader().load("Images/wood_texture.jpg");
            t_wood.repeat.set(2, 2);
            t_wood.wrapS = T.MirroredRepeatWrapping;
            t_wood.wrapT = T.MirroredRepeatWrapping;
        }

        const max_length = Math.max(height, width, depth);
        // define the UV values for the side faces
        for (let index = 0; index < num_face_side; index++) {

            building_wood_geometry.faceVertexUvs[0].push([
                new T.Vector2(0, 0),
                new T.Vector2(1 * (width / max_length), 0),
                new T.Vector2(1 * (width / max_length), 1 * (height / max_length))
            ]);
            building_wood_geometry.faceVertexUvs[0].push([
                new T.Vector2(1 * (width / max_length), 1 * (height / max_length)),
                new T.Vector2(0, 1 * (height / max_length)),
                new T.Vector2(0, 0)
            ]);
        }
        // define the UV values for the side faces
        for (let index = 0; index < num_face_roof_rect; index++) {
            building_wood_geometry.faceVertexUvs[0].push([
                new T.Vector2(0, 0),
                new T.Vector2(1 * (width / max_length), 0),
                new T.Vector2(1 * (width / max_length), 1 * (height / max_length))
            ]);
            building_wood_geometry.faceVertexUvs[0].push([
                new T.Vector2(1 * (width / max_length), 1 * (height / max_length)),
                new T.Vector2(0, 1 * (height / max_length)),
                new T.Vector2(0, 0)
            ]);
        }

        // define the UV values for the triangle roof faces
        for (let index = 0; index < num_face_roof_tri; index++) {
            building_wood_geometry.faceVertexUvs[0].push([
                new T.Vector2(0, 0),
                new T.Vector2(1 * (width / max_length), 0),
                new T.Vector2((1 / 2) * (width / max_length), 1 * (roof_height / max_length))
            ]);
        }

        /**
         * Add the main house.
         */
        if (!building_wood_material) {
            building_wood_material = new T.MeshStandardMaterial({
                map: t_wood,
                roughness: 0.75,
                vertexColors: T.VertexColors
            });
        }
        let mesh = new T.Mesh(building_wood_geometry, building_wood_material);
        group.add(mesh);

        /**
         * Add the door.
         */
        const door_height = 0.4;
        const door_width = 0.25;
        let door = new woodDoor(door_height, door_width);
        door = H.shift(door, (width / 2), 0, 0.01);
        group.add(door.objects[0]);

        /**
         * Add the windows.
         */

        const window_height = 0.2;
        const window_width = 0.4;
        for (let index = 0; index < num_face_side; index++) {
            // front
            if (index == 0) {
                let windowLeft = new woodWindow(window_height, window_width);
                windowLeft = H.shift(windowLeft, (width / 4), height / 2, 0.01);
                group.add(windowLeft.objects[0]);

                let windowRight = new woodWindow(window_height, window_width);
                windowRight = H.shift(windowRight, (width * 3 / 4), height / 2, 0.01);
                group.add(windowRight.objects[0]);
                // back
            } else if (index == 2) {
                let windowLeft = new woodWindow(window_height, window_width);
                windowLeft = H.shift(windowLeft, (width / 4), height / 2, -depth - 0.01);
                windowLeft = H.rotate(windowLeft, 0, 180, 0);
                group.add(windowLeft.objects[0]);

                let windowRight = new woodWindow(window_height, window_width);
                windowRight = H.shift(windowRight, (width * 3 / 4), height / 2, -depth - 0.01);
                windowRight = H.rotate(windowRight, 0, 180, 0);
                group.add(windowRight.objects[0]);
                // left
            } else if (index == 1) {
                let windowMiddle = new woodWindow(window_height, window_width);
                windowMiddle = H.shift(windowMiddle, - 0.01, height / 2, -(depth / 2));
                windowMiddle = H.rotate(windowMiddle, 0, -90, 0);
                group.add(windowMiddle.objects[0]);
                // right
            } else if (index == 3) {
                let windowMiddle = new woodWindow(window_height, window_width);
                windowMiddle = H.shift(windowMiddle, width + 0.01, height / 2, -(depth / 2));
                windowMiddle = H.rotate(windowMiddle, 0, 90, 0);
                group.add(windowMiddle.objects[0]);
            }
        }
        /** 
         * Place the whole house.
         */
        // group.rotateY(degreesToRadians(45));
        group.position.set(x, y, z);
        group.scale.set(scale, scale, scale);
        super(`woodBuilding-${woodBuildingCtr++}`, group);
        this.posX = x;
        this.posY = y;
        this.posZ = z;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.scale = scale;
    }
}
/**
 * The class for the wood window.
 */
class woodWindow extends GrObject {
    constructor(h, w) {
        let geometry = new doorGeometry(h, w, "white").geometry;
        if (!t_window_wood) {
            t_window_wood = new T.TextureLoader().load("Images/window_wood_texture.jpg");
            t_window_wood.repeat.set(2, 2);
            t_window_wood.wrapS = T.MirroredRepeatWrapping;
            t_window_wood.wrapT = T.MirroredRepeatWrapping;
            // t_window_wood.needsUpdate = true;
        }
        let material = new T.MeshStandardMaterial({
            map: t_window_wood,
            roughness: 0.9,
            vertexColors: T.VertexColors
        });
        let mesh = new T.Mesh(geometry, material);
        super("window", mesh);
    }
}

/**
 * The class for the geometry of the door.
 */
class doorGeometry {
    constructor(h, w, color) {
        let geometry = new T.Geometry();
        /**
         * Constants
         */
        const height = h ? h : 0.3;
        const width = w ? w : 0.15;
        // const depth = d ? d : 0.1;
        const door_color = color;

        /**
         * Define the vertices
         */

        // the front 4 vertices
        geometry.vertices.push(new T.Vector3(-width / 2, 0, 0));
        geometry.vertices.push(new T.Vector3(width / 2, 0, 0));
        geometry.vertices.push(new T.Vector3(width / 2, height, 0));
        geometry.vertices.push(new T.Vector3(-width / 2, height, 0));

        /**
         * Define the faces
         */

        // the front side
        let f1 = new T.Face3(0, 1, 2);
        geometry.faces.push(f1);
        let f2 = new T.Face3(2, 3, 0);
        geometry.faces.push(f2);
        f1.color.setStyle(door_color);
        f2.color.setStyle(door_color);

        geometry.computeFaceNormals();

        // add texture
        geometry.faceVertexUvs[0].push([
            new T.Vector2(0, 0),
            new T.Vector2(1, 0),
            new T.Vector2(1, 1)
        ]);
        geometry.faceVertexUvs[0].push([
            new T.Vector2(1, 1),
            new T.Vector2(0, 1),
            new T.Vector2(0, 0)
        ]);
        this.geometry = geometry;
    }
}
/**
 * The class for the wood door.
 */
class woodDoor extends GrObject {
    constructor(h, w) {
        let geometry = new doorGeometry(h, w, "brown").geometry;
        if (!t_door_wood) {
            t_door_wood = new T.TextureLoader().load("Images/door_wood_texture.jpg");
            t_door_wood.repeat.set(2, 2);
            t_door_wood.wrapS = T.MirroredRepeatWrapping;
            t_door_wood.wrapT = T.MirroredRepeatWrapping;
            // t_door_wood.needsUpdate = true;
        }
        let material = new T.MeshStandardMaterial({
            map: t_door_wood,
            roughness: 0.9,
            vertexColors: T.VertexColors
        });
        let mesh = new T.Mesh(geometry, material);
        super("door", mesh);
    }
}


let brickBuildingCtr = 0;
let t_brick;
let t_door_brick;
let t_window_brick;
let building_brick_geometry;
let building_brick_material;

/**
 * @typedef BuildingBrickProperties
 * @type {object}
 * @property {number} [x=0] - the position x
 * @property {number} [y=0] - the position y
 * @property {number} [z=0] - the position z
 * @property {number} [h=2] - the size h
 * @property {number} [w=2] - the size w
 * @property {number} [d=1.5] - the size d
 * @property {number} [scale=1] - the scaling factor
 */
export class BuildingBrick extends GrObject {
    /**
     * @param {BuildingBrickProperties} params
     */
    constructor(params = {}) {
        // collect the house with doors and windows
        let group = new T.Group();

        /**
         * Constants
         */
        const height = params.h ? Number(params.h) : 2;
        const width = params.w ? Number(params.w) : 2;
        const depth = params.d ? Number(params.d) : 1.5;
        const x = params.x ? Number(params.x) : 0;
        const y = params.y ? Number(params.y) : 0;
        const z = params.z ? Number(params.z) : 0;
        const scale = params.scale ? Number(params.scale) : 1;

        const wall_color = "white";
        const front_color1 = wall_color;
        const front_color2 = wall_color;
        const front_color3 = wall_color;
        const side_color1 = wall_color;
        const side_color2 = wall_color;
        const side_color3 = wall_color;

        const roof_height = 0.5;
        const roof_color = "brown";

        /**
         * Create the house body
         */
        if (!building_brick_geometry) {


            building_brick_geometry = new T.Geometry();

            /**
             * Define the vertices
             */

            // the front 4 vertices
            building_brick_geometry.vertices.push(new T.Vector3(0, 0, 0));
            building_brick_geometry.vertices.push(new T.Vector3(width, 0, 0));
            building_brick_geometry.vertices.push(new T.Vector3(width, height, 0));
            building_brick_geometry.vertices.push(new T.Vector3(0, height, 0));

            // the back 4 vertices
            building_brick_geometry.vertices.push(new T.Vector3(0, 0, -depth));
            building_brick_geometry.vertices.push(new T.Vector3(width, 0, -depth));
            building_brick_geometry.vertices.push(new T.Vector3(width, height, -depth));
            building_brick_geometry.vertices.push(new T.Vector3(0, height, -depth));

            // the roof vertex
            building_brick_geometry.vertices.push(new T.Vector3(width / 2, height + roof_height, -depth / 2));

            /**
             * Define the faces
             */

            // the front side
            let f1 = new T.Face3(0, 1, 2);
            building_brick_geometry.faces.push(f1);
            f1.vertexColors[0] = new T.Color(front_color1);
            f1.vertexColors[1] = new T.Color(front_color2);
            f1.vertexColors[2] = new T.Color(front_color3);

            let f2 = new T.Face3(2, 3, 0);
            building_brick_geometry.faces.push(f2);
            f2.vertexColors[0] = new T.Color(front_color3);//2
            f2.vertexColors[1] = new T.Color(front_color2);//3
            f2.vertexColors[2] = new T.Color(front_color1);//0

            // the left side
            let f3 = new T.Face3(4, 0, 3);
            building_brick_geometry.faces.push(f3);
            f3.vertexColors[0] = new T.Color(side_color1);//0
            f3.vertexColors[1] = new T.Color(side_color2);//3
            f3.vertexColors[2] = new T.Color(side_color3);//4

            let f4 = new T.Face3(3, 7, 4);
            building_brick_geometry.faces.push(f4);
            f4.vertexColors[0] = new T.Color(side_color2);//3
            f4.vertexColors[1] = new T.Color(side_color1);//7
            f4.vertexColors[2] = new T.Color(side_color3);//4

            // the back side
            let f5 = new T.Face3(5, 4, 7);
            building_brick_geometry.faces.push(f5);
            f5.vertexColors[0] = new T.Color(front_color3);
            f5.vertexColors[1] = new T.Color(front_color1);
            f5.vertexColors[2] = new T.Color(front_color2);

            let f6 = new T.Face3(7, 6, 5);
            building_brick_geometry.faces.push(f6);
            f6.vertexColors[0] = new T.Color(front_color2);
            f6.vertexColors[1] = new T.Color(front_color1);
            f6.vertexColors[2] = new T.Color(front_color3);

            // the right side
            let f7 = new T.Face3(1, 5, 6);
            building_brick_geometry.faces.push(f7);
            f7.vertexColors[0] = new T.Color(side_color2);//6
            f7.vertexColors[1] = new T.Color(side_color3);//2
            f7.vertexColors[2] = new T.Color(side_color1);//5

            let f8 = new T.Face3(6, 2, 1);
            building_brick_geometry.faces.push(f8);
            f8.vertexColors[0] = new T.Color(side_color1);//5
            f8.vertexColors[1] = new T.Color(side_color3);//2
            f8.vertexColors[2] = new T.Color(side_color2);//1

            // the roof
            let f9 = new T.Face3(3, 2, 8);
            f9.color.setStyle(roof_color);
            building_brick_geometry.faces.push(f9);
            let f10 = new T.Face3(2, 6, 8);
            f10.color.setStyle(roof_color);
            building_brick_geometry.faces.push(f10);
            let f11 = new T.Face3(6, 7, 8);
            f11.color.setStyle(roof_color);
            building_brick_geometry.faces.push(f11);
            let f12 = new T.Face3(7, 3, 8);
            f12.color.setStyle(roof_color);
            building_brick_geometry.faces.push(f12);

            building_brick_geometry.computeFaceNormals();
        }
        /**
         * Add textures
         */
        const num_face_side = 4;
        const num_face_roof = 4;
        if (!t_brick) {
            t_brick = new T.TextureLoader().load("Images/brick_texture2.jpg");
            t_brick.repeat.set(1, 2);
            t_brick.wrapS = T.MirroredRepeatWrapping;
            t_brick.wrapT = T.MirroredRepeatWrapping;
        }

        const max_length = Math.max(height, width, depth);
        // define the UV values for the side faces
        for (let index = 0; index < num_face_side; index++) {

            building_brick_geometry.faceVertexUvs[0].push([
                new T.Vector2(0, 0),
                new T.Vector2(1 * (width / max_length), 0),
                new T.Vector2(1 * (width / max_length), 1 * (height / max_length))
            ]);
            building_brick_geometry.faceVertexUvs[0].push([
                new T.Vector2(1 * (width / max_length), 1 * (height / max_length)),
                new T.Vector2(0, 1 * (height / max_length)),
                new T.Vector2(0, 0)
            ]);
        }
        // define the UV values for the roof faces
        for (let index = 0; index < num_face_roof; index++) {
            building_brick_geometry.faceVertexUvs[0].push([
                new T.Vector2(0, 0),
                new T.Vector2(1 * (width / max_length), 0),
                new T.Vector2((1 / 2) * (width / max_length), 1 * (height / max_length))
            ]);
        }

        /**
         * Add the house body
         */
        if (!building_brick_material) {
            building_brick_material = new T.MeshStandardMaterial({
                map: t_brick,
                roughness: 0.75,
                vertexColors: T.VertexColors
            });
        }
        let mesh = new T.Mesh(building_brick_geometry, building_brick_material);

        group.add(mesh);

        /**
         * Add the door
         */
        const door_height = 0.5;
        const door_width = 0.3;
        let door = new metalDoor(door_height, door_width);
        door = H.shift(door, (width / 2), 0, 0.01);
        group.add(door.objects[0]);

        /**
        * Add the window
        */

        const window_height = 0.5;
        const window_width = 0.3;
        for (let index = 0; index < num_face_side; index++) {
            // front
            if (index == 0) {
                let windowLeft = new stoneWindow(window_height, window_width);
                windowLeft = H.shift(windowLeft, (width / 4), height * (3 / 5), 0.01);
                group.add(windowLeft.objects[0]);

                let windowRight = new stoneWindow(window_height, window_width);
                windowRight = H.shift(windowRight, (width * 3 / 4), height * (3 / 5), 0.01);
                group.add(windowRight.objects[0]);

                let windowLowerLeft = new stoneWindow(window_height, window_width);
                windowLowerLeft = H.shift(windowLowerLeft, (width / 4), height * (1 / 5), 0.01);
                group.add(windowLowerLeft.objects[0]);

                let windowLowerRight = new stoneWindow(window_height, window_width);
                windowLowerRight = H.shift(windowLowerRight, (width * 3 / 4), height * (1 / 5), 0.01);
                group.add(windowLowerRight.objects[0]);
                // back
            } else if (index == 2) {
                let windowLeft = new stoneWindow(window_height, window_width);
                windowLeft = H.shift(windowLeft, (width / 4), height * (3 / 5), -depth - 0.01);
                windowLeft = H.rotate(windowLeft, 0, 180, 0);
                group.add(windowLeft.objects[0]);

                let windowRight = new stoneWindow(window_height, window_width);
                windowRight = H.shift(windowRight, (width * 3 / 4), height * (3 / 5), -depth - 0.01);
                windowRight = H.rotate(windowRight, 0, 180, 0);
                group.add(windowRight.objects[0]);

                let windowLowerLeft = new stoneWindow(window_height, window_width);
                windowLowerLeft = H.shift(windowLowerLeft, (width / 4), height * (1 / 5), -depth - 0.01);
                windowLowerLeft = H.rotate(windowLowerLeft, 0, 180, 0);
                group.add(windowLowerLeft.objects[0]);

                let windowLowerRight = new stoneWindow(window_height, window_width);
                windowLowerRight = H.shift(windowLowerRight, (width * 3 / 4), height * (1 / 5), -depth - 0.01);
                windowLowerRight = H.rotate(windowLowerRight, 0, 180, 0);
                group.add(windowLowerRight.objects[0]);
                // left
            } else if (index == 1) {
                let windowMiddle = new stoneWindow(window_height, window_width);
                windowMiddle = H.shift(windowMiddle, - 0.01, height / 2, -(depth / 2));
                windowMiddle = H.rotate(windowMiddle, 0, -90, 0);
                group.add(windowMiddle.objects[0]);
                // right
            } else if (index == 3) {
                let windowMiddle = new stoneWindow(window_height, window_width);
                windowMiddle = H.shift(windowMiddle, width + 0.01, height / 2, -(depth / 2));
                windowMiddle = H.rotate(windowMiddle, 0, 90, 0);
                group.add(windowMiddle.objects[0]);
            }
        }

        /** 
         * Place the whole house.
         */
        // group.rotateY(degreesToRadians(45));
        group.position.set(x, y, z);
        group.scale.set(scale, scale, scale);
        super(`brickBuilding-${brickBuildingCtr++}`, group);
        this.posX = x;
        this.posY = y;
        this.posZ = z;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.scale = scale;
    }
}

/**
 * The class for the stone window.
 */
class stoneWindow extends GrObject {
    constructor(h, w) {
        let geometry = new doorGeometry(h, w, "white").geometry;
        if (!t_window_brick) {
            t_window_brick = new T.TextureLoader().load("Images/window_stone_texture.png");
        }

        let material = new T.MeshStandardMaterial({
            map: t_window_brick,
            roughness: 0.9,
            vertexColors: T.VertexColors
        });
        let mesh = new T.Mesh(geometry, material);
        super("window", mesh);
    }
}

/**
 * The class for the metal door.
 */
class metalDoor extends GrObject {
    constructor(h, w) {
        let geometry = new doorGeometry(h, w, "white").geometry;
        if (!t_door_brick) {
            t_door_brick = new T.TextureLoader().load("Images/door_metal_texture.jpg");
        }

        let material = new T.MeshStandardMaterial({
            map: t_door_brick,
            roughness: 0.9,
            vertexColors: T.VertexColors
        });
        let mesh = new T.Mesh(geometry, material);
        super("door", mesh);
    }
}