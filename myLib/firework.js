/*jshint esversion: 6 */
// @ts-check
import * as T from "../../libs/CS559-THREE/build/three.module.js";
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import * as H from "./helperFun.js";
// import { Rock } from "./rock.js";

let fireworkCtr = 0;
// A firework balls shooter. It will shoot many firework balls, which will explode into a bunch of particles.
/**
 * @typedef fireworkShooterProperties
 * @type {object}
 * @property {number} [x=0] 
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [scale=1]
 * @property {T.Scene} [scene] 
 * - this is where the balls and particles will be added to because they should live in 
 * the world coordinate rather than the shooter's coordinate (which could be moving).
 */
export class FireWorkShooter extends GrObject {
    /**
     * @param {fireworkShooterProperties} params
     */
    constructor(params = {}) {
        let shooterGroup = new T.Group();
        /**
         * Inputs
         */
        const posX = params.x ? Number(params.x) : 0;
        const posY = params.y ? Number(params.y) : 0;
        const posZ = params.z ? Number(params.z) : 0;
        const scale = params.scale ? Number(params.scale) : 1;
        /** 
        * Constants
        */
        // Global
        // Gravitational acceleration
        // const GRAVITY_ACC = 0;
        const GRAVITY_ACC = 0.0015;

        // Balls
        const BALL_RADIUS = 4;
        // // the color of the stroke of the balls
        // const STROKE_COL = "#FFFFFF";
        // color list for ball before explosion
        const LIST_COL_CIRCLE = ["#00FF00", "#0000FF", "#FF0000"];
        // color list for exploded particles
        const LIST_COL_PARTICLE = ["#99FF99", "#9999FF", "#FF9999"];
        // which color to start with
        // const INIT_COLOR_INDEX = 0;
        const INIT_V = 10; // initial shooting speed
        // probability of shooting a random ball
        const PROP_RANDOM_SHOOT = 0.03;

        // Particles
        // const SIZE_PARTICLE = 2;
        // //  fading rate (alpha value)
        const FADING_RATE = 0.03;
        // const EXPLOSION_SPEED = 10;

        // list of the balls
        /**@type {Array<FireworkBall>} */
        let listBalls = [];
        // the particles that are still on the screen
        /**@type {Array<Array<FireworkParticle>>} */
        let listActiveParticles = [];
        super(`firework-${fireworkCtr++}`, shooterGroup);

        // save the fields
        this.scene = params.scene;
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
        this.shooterGroup = shooterGroup;
        this.scale = scale;

        this.listBalls = listBalls;
        this.listActiveParticles = listActiveParticles;
        this.prop_random_shoot = PROP_RANDOM_SHOOT;
        this.init_v = INIT_V;
        this.ball_radius = BALL_RADIUS;
        this.gravity_acc = GRAVITY_ACC;
        this.fading_rate = FADING_RATE;
        this.list_col_ball = LIST_COL_CIRCLE;
        this.list_col_particle = LIST_COL_PARTICLE;
        // this.size_particle = SIZE_PARTICLE;
        // this.explosion_speed = EXPLOSION_SPEED;
        // put the object in its place
        this.shooterGroup.position.x = posX;
        this.shooterGroup.position.y = posY;
        this.shooterGroup.position.z = posZ;
        this.shooterGroup.scale.set(scale, scale, scale);
        /** 
         * Shoot one ball
         */
        this.shootBall({
            posX: 0,
            posY: 0,
            posZ: 0,
            expX: 0,
            expY: 5,
            expZ: 0,
            vX: 0,
            vY: 0.1,
            vZ: 0,
            radius: 0.1
        });
    }
    /**
     * Create a ball
     * @param {fireworkBallProperties} params
     */
    shootBall(params = {}) {
        let newBall = new FireworkBall({
            posX: params.posX,
            posY: params.posY,
            posZ: params.posZ,
            expX: params.expX,
            expY: params.expY,
            expZ: params.expZ,
            vX: params.vX,
            vY: params.vY,
            vZ: params.vZ,
            radius: params.radius,
            ballColor: this.list_col_ball[this.listBalls.length % this.list_col_ball.length],
            particleColor: this.list_col_particle[this.listBalls.length % this.list_col_particle.length],
            scene: this.scene
        });
        this.listBalls.push(newBall);
        // add the ball to the world coordinate
        this.scene.add(newBall.ball_obj);
    }
    /**
     * Define the animation of the firework created by the shooter.
     *
     * @memberof FireWorkShooter
     */
    tick(step, timeOfDay) {
        /**  
         * Update the position of all firework balls (that haven't yet exploded)
         */
        for (let ballIndex = 0; ballIndex < this.listBalls.length; ballIndex++) {
            const ball = this.listBalls[ballIndex];
            /** 
             * Before the ball reaches the explosion height
             */
            if (ball.posY < ball.expY) {
                // Update the position of the ball
                // include the effect of gravity
                let grativityMove = this.gravity_acc * ball.timer;
                // increase the travel duration
                ball.timer += 1;
                ball.posX += (ball.vX);
                ball.posY += (ball.vY);
                ball.posZ += (ball.vZ);
                ball.ball_obj.position.set(ball.posX, ball.posY, ball.posZ);
            } else {
                /**
                 * When the ball reaches the explosion height
                 */
                // extract the particles that the ball stores
                this.listActiveParticles.push(ball.explode());
                // remove the ball
                ball.ball_obj.visible = false;
                this.listBalls.splice(ballIndex, 1);
            }
        }
        /**  
         * Update the position of all the active particles (that haven't yet faded away)
         */
        // interate through the particles from different exploded balls
        for (let explodedBallIndex = 0; explodedBallIndex < this.listActiveParticles.length; explodedBallIndex++) {
            const eplodedBallParticles = this.listActiveParticles[explodedBallIndex];
            // update the particle position
            for (let particleIndex = 0; particleIndex < eplodedBallParticles.length; particleIndex++) {
                const particle = eplodedBallParticles[particleIndex];
                // include the effect of gravity
                let grativityMove = this.gravity_acc * particle.timer;
                // increase the travel duration
                particle.timer += 1;
                particle.particle_obj.position.x += particle.vX;
                particle.particle_obj.position.y += (particle.vY - grativityMove);
                particle.particle_obj.position.z += particle.vZ;
                if (particle.alpha >= 0) {
                    particle.alpha -= this.fading_rate;
                    // @ts-ignore
                    particle.particle_obj.material.opacity = particle.alpha;
                }
            }
            // remove the particles of this exploded ball from the list if already faded away
            if (eplodedBallParticles[0].alpha <= 0) {
                // make the T objects of the particles disapper
                eplodedBallParticles.forEach(particle => {
                    particle.particle_obj.visible = false;
                });
                // remove the particles
                this.listActiveParticles.splice(explodedBallIndex, 1);
            }

        }
    }


}

// A firework ball
let ball_material;
let ball_geom;
/**
 * @typedef fireworkBallProperties
 * @type {object}
 * @property {number} [posX=0] - the shooting position
 * @property {number} [posY=0]
 * @property {number} [posZ=0] 
 * @property {number} [expX=0] - the explosion position
 * @property {number} [expY=5]
 * @property {number} [expZ=0] 
 * @property {number} [vX=0] - the initial velocity
 * @property {number} [vY=0]
 * @property {number} [vZ=0] 
 * @property {number} [radius=1] - the radius of the ball
 * @property {number} [scale=1]
 * @property {string} [ballColor="red"] - the color of the firework ball
 * @property {string} [particleColor="orange"] - the color of the firework particles
 * @property {T.Scene} [scene] 
 * - this is where the balls and particles will be added to because they should live in 
 * the world coordinate rather than the shooter's coordinate (which could be moving).
 */
class FireworkBall {
    /**
     * @param {fireworkBallProperties} params
     */
    constructor(params = {}) {
        /**
         * Constants
         */
        // inputs
        this.posX = params.posX ? Number(params.posX) : 0;
        this.posY = params.posY ? Number(params.posY) : 0;
        this.posZ = params.posZ ? Number(params.posZ) : 0;
        this.expX = params.expX ? Number(params.expX) : 0;
        this.expY = params.expY ? Number(params.expY) : 5;
        this.expZ = params.expZ ? Number(params.expZ) : 0;
        this.vX = params.vX ? Number(params.vX) : 0;
        this.vY = params.vY ? Number(params.vY) : 0;
        this.vZ = params.vZ ? Number(params.vZ) : 0;
        this.radius = params.radius ? Number(params.radius) : 1;
        this.scale = params.scale ? Number(params.scale) : 1;
        this.ballColor = params.ballColor ? String(params.ballColor) : "red";
        this.particleColor = params.particleColor ? String(params.particleColor) : "orange";
        this.scene = params.scene;
        // other constants
        // the number of explosion particles
        const NUM_PARTICLES = 20;
        this.num_particles = NUM_PARTICLES;
        // the flying duration after shooting
        this.timer = 0;
        // to store the particles that this ball will become after explosion
        /**@type {Array<FireworkParticle>} */
        this.listParticles = [];

        /** 
         * Create the visible ball object
         */
        if (!ball_geom) {
            ball_geom = new T.SphereBufferGeometry(this.radius, 6, 5);
        }
        if (!ball_material) {
            ball_material = new T.MeshStandardMaterial({
                color: this.ballColor,
                roughness: 0.9,
                metalness: 0.3
            });
        }
        let ball_mesh = new T.Mesh(ball_geom, ball_material);
        this.ball_obj = ball_mesh;
        /** 
         * Add the particles
         */
        for (let index = 0; index < this.num_particles; index++) {
            let newParticle = new FireworkParticle({
                // start at where the ball explodes
                posX: this.expX, posY: this.expY, posZ: this.expZ,
                // vX: Math.random() * 3, vY: Math.random() * 3, vZ: Math.random() * 3,
                color: this.particleColor,
                radius: this.radius * 0.5,
                alpha: 1,
                scene: this.scene
            });
            this.listParticles.push(newParticle);
        }
    }
    /**
     * Explode the ball and launch particles.
     * @returns {Array<FireworkParticle>} - the particles the ball exploded into
     * @memberof FireworkBall
     */
    explode() {
        /**  
         * Add the T objects of particles to the scene.
         */
        for (let particleIndex = 0; particleIndex < this.listParticles.length; particleIndex++) {
            const particle = this.listParticles[particleIndex];
            this.scene.add(particle.particle_obj);
        }
        return this.listParticles;
    }
}

// A particle in a firework ball
let particle_material;
let particle_geom;
/**
 * @typedef fireworkParticleProperties
 * @type {object}
 * @property {number} [posX=0] - the shooting position
 * @property {number} [posY=0]
 * @property {number} [posZ=0] 
 * @property {number} [vX=0] - the initial velocity
 * @property {number} [vY=0]
 * @property {number} [vZ=0] 
 * @property {number} [radius=0.5] - the radius of the particle
 * @property {number} [scale=1]
 * @property {string} [color="orange"] - the color of the firework particle
 * @property {number} [alpha=1] - the alpha value of the particle
 * @property {T.Scene} [scene] 
 * - this is where the balls and particles will be added to because they should live in 
 * the world coordinate rather than the shooter's coordinate (which could be moving). 
 */
class FireworkParticle {
    /**
     * @param {fireworkParticleProperties} params
     */
    constructor(params = {}) {
        /**
         * Constants
         */
        //  fading rate (alpha value)
        // const FADING_RATE = 0.03;
        // the initial speed at explosion
        const EXPLOSION_SPEED = 0.1;
        // inputs
        this.posX = params.posX ? Number(params.posX) : 0;
        this.posY = params.posY ? Number(params.posY) : 0;
        this.posZ = params.posZ ? Number(params.posZ) : 0;
        this.vX = params.vX ? Number(params.vX) : EXPLOSION_SPEED * Math.random();
        this.vY = params.vY ? Number(params.vY) : EXPLOSION_SPEED * Math.random();
        this.vZ = params.vZ ? Number(params.vZ) : EXPLOSION_SPEED * Math.random();
        this.radius = params.radius ? Number(params.radius) : 1;
        this.scale = params.scale ? Number(params.scale) : 1;
        this.color = params.color ? String(params.color) : "orange";
        this.alpha = params.alpha ? Number(params.alpha) : 1;
        this.scene = this.scene;

        // the flying duration after explosion
        this.timer = 0;

        /** 
         * Create the visible particle
         */

        if (!particle_geom) {
            particle_geom = new T.SphereBufferGeometry(this.radius, 6, 5);
        }
        if (!particle_material) {
            particle_material = new T.MeshStandardMaterial({
                color: this.color,
                transparent: true,
                opacity: this.alpha,
                roughness: 0.9,
                metalness: 0.3
            });
        }
        let particle_mesh = new T.Mesh(particle_geom, particle_material);
        /** 
         * Place the particles
         */
        particle_mesh.position.set(this.posX, this.posY, this.posZ);

        /** 
         * Save the mesh as a field
         */
        this.particle_obj = particle_mesh;

    }
}