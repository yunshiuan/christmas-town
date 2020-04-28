/*jshint esversion: 6 */
// @ts-check
import * as T from "../../libs/CS559-THREE/build/three.module.js";
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";

let snowmanCtr = 0;

let snow_material;
let eye_stone_material;
let mouth_stone_material;
let nose_carrot_material;
let hand_stone_material;
/**
 * @typedef SnowmanProperties
 * @type {object}
 * @property {number} [x=0] - the position x
 * @property {number} [y=0] - the position y
 * @property {number} [z=0] - the position z
 * @property {boolean} [decorated=true] - whether to decorate the snowman
 * @property {number} [scale=1] - the scaling factor
 * @property {string} [hat_color="cyan"] - the color of the hat
 */
export class Snowman extends GrObject {
    /**
     * @param {SnowmanProperties} params
     */
    constructor(params = {}) {
        // collect the house with doors and windows
        let group = new T.Group();
        /**
         * Constants
         */
        const posX = params.x ? Number(params.x) : 0;
        const posY = params.y ? Number(params.y) : 0;
        // a global variable for plotting
        let currentPosY = posY;
        const posZ = params.z ? Number(params.z) : 0;
        const scale = params.scale ? Number(params.scale) : 1;
        const decorated = params.decorated ? params.decorated : true;
        const hat_color = params.hat_color ? params.hat_color : "cyan";

        // - snowman
        const NUM_BALLS = 3;
        const NUM_EYES = 2;
        const NUM_MOUTH_STONES = 5;
        const SIZE_GRADIENT = 0.8;
        const LIST_BALLS = [];
        const LIST_BALL_RADIUS = [];
        const OVERLAP_BALL = 0.3;
        const LIST_EYES = [];
        const LIST_MOUTH = [];
        // - snow
        const SNOW_COL = "white";
        const SNOW_ROUGHTNESS = 1;
        const SNOW_METALNESS = 0;
        // - eye stone
        const EYE_STONE_COL = "grey";
        const EYE_STONE_ROUGHTNESS = 0.5;
        const EYE_STONE_METALNESS = 0.8;
        // - mouth stone
        const MOUTH_STONE_COL = "red";
        const MOUTH_STONE_ROUGHTNESS = 0.5;
        const MOUTH_STONE_METALNESS = 0.8;
        // -nose cone
        const NOSE_COL = "orange";
        const NOSE_ROUGHTNESS = 0.8;
        const NOSE_METALNESS = 0;
        // - snowball
        const SNOW_BALL_SURFACES = 20;
        const SNOW_BALL_RADIUS = 1;
        // - eye
        const EYE_RADIUS = 0.1;
        const EYE_SURFACES = 20;
        const EYE_ARC_HEIGHT = 30 * (Math.PI / 180); // the degree which deviates from the middle horizontal line of the face
        const EYE_ARC_WIDTH = 20 * (Math.PI / 180); // the degree which deviates from the middle verticle line of the face
        // - mouth
        const MOUTH_STONE_RADIUS = 0.05;
        const MOUTH_STONE_SURFACES = 20;
        const MOUTH_ARC_INIT_HEIGHT = -15 * (Math.PI / 180);
        const MOUTH_ARC_DELTA_HEIGHT = 5 * (Math.PI / 180);
        const MOUTH_ARC_DELTA_WIDTH = 10 * (Math.PI / 180);
        // - nose
        const NOSE_RADIUS = 0.2;
        const NOSE_LENGTH = 0.5;
        const NOSE_SURFACES = 20;
        const NOSE_ARC_HEIGHT = 5 * (Math.PI / 180);
        // - hat
        const HAT_RADIUS = 0.35;
        const HAT_HEIGHT = 1;
        const HAT_SURFACES = 20;
        const HAT_COL = hat_color;
        const HAT_ROUGHTNESS = 0.8;
        const HAT_METALNESS = 0;
        // const HAT_BASE_RADIUS = 0.7;
        /**
         * Define material
         */
        // snow
        if (!snow_material) {
            snow_material = new T.MeshStandardMaterial({
                color: SNOW_COL,
                // emissive: "blue", 
                metalness: SNOW_METALNESS,
                roughness: SNOW_ROUGHTNESS
            });
        }
        // eye stone
        if (!eye_stone_material) {
            eye_stone_material = new T.MeshStandardMaterial({
                color: EYE_STONE_COL,
                metalness: EYE_STONE_METALNESS,
                roughness: EYE_STONE_ROUGHTNESS
            });
        }
        // mouth stone
        if (!mouth_stone_material) {
            mouth_stone_material = new T.MeshStandardMaterial({
                color: MOUTH_STONE_COL,
                metalness: MOUTH_STONE_METALNESS,
                roughness: MOUTH_STONE_ROUGHTNESS
            });
        }
        // nose cone
        if (!nose_carrot_material) {
            nose_carrot_material = new T.MeshStandardMaterial({
                color: NOSE_COL,
                metalness: NOSE_METALNESS,
                roughness: NOSE_ROUGHTNESS
            });
        }
        /**  
         * Draw the snowman
         */
        let radius; //for later usage when placing eyes
        for (let i = 0; i < NUM_BALLS; i++) {
            /**
             * Place the balls
             */

            // get the parameters for this ball
            radius = SNOW_BALL_RADIUS * Math.pow(SIZE_GRADIENT, i);
            LIST_BALL_RADIUS.push(radius);
            let snowball = new T.SphereBufferGeometry(radius, SNOW_BALL_SURFACES, SNOW_BALL_SURFACES);
            // update the parameters for the next ball
            if (i > 0) {
                currentPosY += (2 * radius * (1 - OVERLAP_BALL));
            }
            LIST_BALLS[i] = new T.Mesh(snowball, snow_material);
            LIST_BALLS[i].position.set(0, currentPosY, 0);
            group.add(LIST_BALLS[i]);
        }
        /**
        * Place the eyes
        */
        let eyeball = new T.SphereBufferGeometry(EYE_RADIUS, EYE_SURFACES, EYE_SURFACES);
        // let eye = new T.Mesh(eyeball, stone);
        let posEyeY = currentPosY + (Math.sin(EYE_ARC_HEIGHT) * radius);
        let radiusAtEye = radius * Math.cos(EYE_ARC_HEIGHT);
        let posEyeZ = radiusAtEye * Math.cos(EYE_ARC_WIDTH);
        for (let i = 0; i < NUM_EYES; i++) {
            let posEyeX;
            // left eye
            if (i == 0) {
                posEyeX = - radiusAtEye * Math.sin(EYE_ARC_WIDTH);
            }
            // right eye
            if (i == 1) {
                posEyeX = + radiusAtEye * Math.sin(EYE_ARC_WIDTH);
            }
            LIST_EYES[i] = new T.Mesh(eyeball, eye_stone_material);
            LIST_EYES[i].position.set(posEyeX, posEyeY, posEyeZ);
            group.add(LIST_EYES[i]);
        }

        /**
        * Place the mouth
        */
        let mouthball = new T.SphereBufferGeometry(MOUTH_STONE_RADIUS, MOUTH_STONE_SURFACES, MOUTH_STONE_SURFACES);
        let posStoneX;
        let posStoneY;
        let posStoneZ;
        let radiusAtStone; // the radius of the snowball at that slice
        for (let i = 0; i < NUM_MOUTH_STONES; i++) {
            // the lowest stone
            if (i == 0) {
                radiusAtStone = radius * Math.cos(MOUTH_ARC_INIT_HEIGHT);
                posStoneX = radiusAtStone * Math.sin(0);
                posStoneZ = radiusAtStone * Math.cos(0);
                posStoneY = currentPosY + Math.sin((MOUTH_ARC_INIT_HEIGHT) * radius);
            }
            // the medium two stones
            if (i == 1 || i == 2) {
                radiusAtStone = radius * Math.cos(MOUTH_ARC_INIT_HEIGHT + MOUTH_ARC_DELTA_HEIGHT);
                posStoneZ = radiusAtStone * Math.cos(MOUTH_ARC_DELTA_WIDTH);
                posStoneY = currentPosY + Math.sin((MOUTH_ARC_INIT_HEIGHT + MOUTH_ARC_DELTA_HEIGHT) * radius);
                if (i == 1) {
                    posStoneX = radiusAtStone * Math.sin(MOUTH_ARC_DELTA_WIDTH);
                } else {
                    posStoneX = - radiusAtStone * Math.sin(MOUTH_ARC_DELTA_WIDTH);
                }
            }
            // the upper two stones
            if (i == 3 || i == 4) {
                radiusAtStone = radius * Math.cos(MOUTH_ARC_INIT_HEIGHT + 2 * MOUTH_ARC_DELTA_HEIGHT);
                posStoneZ = radiusAtStone * Math.cos(MOUTH_ARC_DELTA_WIDTH);
                posStoneY = currentPosY + Math.sin((MOUTH_ARC_INIT_HEIGHT + 2 * MOUTH_ARC_DELTA_HEIGHT) * radius);
                if (i == 3) {
                    posStoneX = radiusAtStone * Math.sin(2 * MOUTH_ARC_DELTA_WIDTH);
                } else {
                    posStoneX = - radiusAtStone * Math.sin(2 * MOUTH_ARC_DELTA_WIDTH);
                }
            }
            LIST_MOUTH[i] = new T.Mesh(mouthball, mouth_stone_material);
            LIST_MOUTH[i].position.set(posStoneX, posStoneY, posStoneZ);
            group.add(LIST_MOUTH[i]);
        }

        /**
        * Place the nose
        */
        let noseShape = new T.ConeGeometry(NOSE_RADIUS, NOSE_LENGTH, NOSE_SURFACES);
        let nose = new T.Mesh(noseShape, nose_carrot_material);
        let radiusAtNose = radius * Math.cos(NOSE_ARC_HEIGHT);
        let posNoseX = 0;
        let posNoseY = currentPosY + Math.sin((NOSE_ARC_HEIGHT) * radiusAtNose);
        let posNoseZ = radiusAtStone;

        nose.position.set(posNoseX, posNoseY, posNoseZ);
        nose.rotateX(Math.PI / 2);
        group.add(nose);

        if (decorated) {
            // hat
            let hatCloth = new T.MeshStandardMaterial({
                color: HAT_COL,
                metalness: HAT_METALNESS,
                roughness: HAT_ROUGHTNESS,
                side: T.DoubleSide
            });
            // hand
            if (!hand_stone_material) {
                hand_stone_material = new T.MeshStandardMaterial({
                    color: "brown",
                    metalness: 0.5,
                    roughness: 1
                });
            }
            /**
             * Place the hat
             */
            let hat = new T.Group();
            let hatRodShape = new T.CylinderGeometry(HAT_RADIUS, HAT_RADIUS, HAT_HEIGHT, HAT_SURFACES);
            let hatRod = new T.Mesh(hatRodShape, hatCloth);
            let posHatX = 0;
            let posHatY = currentPosY + radius;
            let posHatZ = 0;
            hatRod.position.set(posHatX, posHatY, posHatZ);

            let hatBaseShape = new T.RingGeometry(HAT_RADIUS, 1, 20);
            let hatBase = new T.Mesh(hatBaseShape, hatCloth);
            hatBase.rotateX(Math.PI / 2);
            hatBase.position.set(posHatX, posHatY, posHatZ);
            hat.add(hatBase);
            hat.add(hatRod);

            group.add(hat);

            /**
             * Place the hand
             */
            let handShape = new T.CylinderGeometry(0.1, 0.1, 1.5, 4);
            let rigthHandRod = new T.Mesh(handShape, hand_stone_material);
            rigthHandRod.rotateZ(125 * (Math.PI / 180));
            rigthHandRod.position.set(radius, currentPosY - 1.3 * radius, 0);
            group.add(rigthHandRod);

            let leftHandRod = new T.Mesh(handShape, hand_stone_material);
            leftHandRod.rotateZ(45 * (Math.PI / 180));
            leftHandRod.position.set(-radius, currentPosY - 1.3 * radius, 0);
            group.add(leftHandRod);
        }
        /** 
         * Place the whole house.
         */
        // group.rotateY(degreesToRadians(45));
        group.position.set(posX, posY + (LIST_BALL_RADIUS[0] * scale * 0.9), posZ);
        group.scale.set(scale, scale, scale);
        super(`snowman-${snowmanCtr++}`, group);
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
    }
}