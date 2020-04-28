/*jshint esversion: 6 */
// @ts-check
import * as T from "../../libs/CS559-THREE/build/three.module.js";
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import { ObjGrObject } from "../../libs/CS559-Framework/loaders.js";

let carouselObCtr = 0;
let horse_geometry;
// A Carousel.
/**
 * @typedef CarouselProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [scale=1]
 */
export class Carousel extends GrObject {
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
        const scale = params.scale ? Number(params.scale) : 1;

        let width = 3;
        let carousel = new T.Group();
        let num_horse = 10;
        let base_geom = new T.CylinderGeometry(width, width, 1, 32);
        let base_mat = new T.MeshStandardMaterial({
            color: "lightblue",
            metalness: 0.3,
            roughness: 0.8
        });
        let base = new T.Mesh(base_geom, base_mat);
        base.translateY(0.5);
        carousel.add(base);

        let platform_group = new T.Group();
        base.add(platform_group);
        platform_group.translateY(0.5);

        let platform_geom = new T.CylinderGeometry(
            0.95 * width,
            0.95 * width,
            0.2,
            32
        );
        let platform_mat = new T.MeshStandardMaterial({
            color: "gold",
            metalness: 0.3,
            roughness: 0.8
        });
        let platform = new T.Mesh(platform_geom, platform_mat);
        platform_group.add(platform);
        /**
         * Add the central pole
         */
        let cpole_geom = new T.CylinderGeometry(0.3 * width, 0.3 * width, 3, 16);
        let cpole_mat = new T.MeshStandardMaterial({
            color: "gold",
            metalness: 0.8,
            roughness: 0.5
        });
        let cpole = new T.Mesh(cpole_geom, cpole_mat);
        platform_group.add(cpole);
        cpole.translateY(1.5);

        let top_trim = new T.Mesh(platform_geom, platform_mat);
        platform_group.add(top_trim);
        top_trim.translateY(3);

        /**
         * Add poles (for holding the horses)
         */
        let opole_geom = new T.CylinderGeometry(0.03 * width, 0.03 * width, 3, 16);
        let opole_mat = new T.MeshStandardMaterial({
            color: "#aaaaaa",
            metalness: 0.8,
            roughness: 0.5
        });
        let opole;
        let num_poles = 10;
        let poles = [];
        for (let i = 0; i < num_poles; i++) {
            opole = new T.Mesh(opole_geom, opole_mat);
            platform_group.add(opole);
            // 1.5 is the height of upper surface of the platform
            opole.translateY(1.5);
            opole.rotateY((2 * i * Math.PI) / num_poles);
            opole.translateX(0.8 * width);
            poles.push(opole);
        }
        /**
         * Add one horse for each pole
         */

        // let horse_geom = new T.BoxGeometry(0.3 * width, 0.05 * width, 0.1 * width);
        let horse_colors = ["red", "#ff6600", "#99ff66", "cyan", "#d24dff"];
        /**@type THREE.Object3D*/
        let horse;
        let horses = [];
        // load the horse object once for all
        let horseObj = new ObjGrObject(
            {
                obj: '/for_students/objects/standing-horse.obj',
                name: 'horse'
            }
        );
        for (let i = 0; i < num_horse; i++) {
            horse = horseObj.objects[0];
            let horse_material = new T.MeshStandardMaterial({
                color: horse_colors[i % (horse_colors.length)],
                metalness: 0.2,
                roughness: 1
            });
            horses.push({
                horse: horse,
                material: horse_material,
                // whether updated the material yet
                flagMaterial: false
            });
        }
        /**
         * Add the roof
         */
        // add 8 segments of the roof (each covers 45 degrees)
        // let roofSegment;
        let roof_mat;
        let num_segments = 8;
        // let segment = [];
        let roof = new T.Group();
        for (let i = 0; i < num_segments; i++) {
            // the color
            if ((i % 2) == 0) {
                roof_mat = new T.MeshStandardMaterial({
                    color: "red",
                    metalness: 0,
                    roughness: 1
                });
            } else {
                roof_mat = new T.MeshStandardMaterial({
                    color: "white",
                    metalness: 0,
                    roughness: 1
                });
            }
            // the shape
            let segment_geom = new T.ConeGeometry(width, 0.5 * width, 32,
                4, false,
                i * (Math.PI * 2 / num_segments), (Math.PI * 2 / num_segments));
            let segment = new T.Mesh(segment_geom, roof_mat);
            roof.add(segment);

        }
        carousel.add(roof);
        roof.translateY(4.8);

        // note that we have to make the Object3D before we can call
        // super and we have to call super before we can use this
        super(`Carousel-${carouselObCtr++}`, carousel);
        this.whole_ob = carousel;
        this.platform = platform;
        this.poles = poles;
        this.horses = horses;
        this.width = width;
        this.num_horse = num_horse;
        // put the object in its place
        this.whole_ob.position.x = posX;
        this.whole_ob.position.y = posY;
        this.whole_ob.position.z = posZ;
        this.scale = scale;
        carousel.scale.set(scale, scale, scale);

        // the keep track of the time
        this.time = 0;
    }
    /**
     * Define the movement of the carousel.
     *
     * @param {*} step
     * @param {*} timeOfDay
     * @memberof Carousel
     */
    tick(step, timeOfDay) {
        /**
         * change the material of the horse
         * - add and place the horse to the scene if not yet added
         * - for why this is necessary, see https://piazza.com/class/k58y3vw56z21il?cid=555
         */
        // check if all the material have been updated
        let updateAllMat = false;
        // only update the material if hasn't
        if (!updateAllMat) {
            // iterate through each horse
            for (let index = 0; index < this.num_horse; index++) {
                let horse_update = this.horses[index].flagMaterial;
                const horse_obj = this.horses[index].horse;
                const horse_material = this.horses[index].material;
                if (horse_obj.children[0] && (!horse_update)) {
                    if (horse_obj.children[0].children[0]) {
                        /**@type THREE.Mesh */
                        // @ts-ignore
                        let horseMesh = horse_obj.children[0].children[0];
                        horseMesh.material = horse_material;
                        horse_geometry = horseMesh.geometry;

                        // recreate the horse object with the material
                        let horse_object = new T.Mesh(horse_geometry, horse_material);
                        this.platform.add(horse_object);

                        horse_object.scale.set(0.6, 0.6, 0.6);
                        // 1.5 is the height of upper surface of the platform
                        horse_object.translateY(-1);
                        // place the horses evenly
                        horse_object.rotateY((2 * index * Math.PI) / this.num_horse);
                        // move away from the central pole
                        horse_object.translateX(0.8 * this.width);
                        horse_object.rotateY(225 * (Math.PI / 180));
                        this.horses[index].horse = horse_object;
                        // update the flag after updated the material
                        this.horses[index].flagMaterial = true;
                    }
                }
            }
            // finish updating all the materials
            updateAllMat = true;
        }

        // rotate the whole carousel
        this.whole_ob.rotateY(0.003 * step);

        // move the horses up and down

        this.time += step / 1000; // time in seconds (ms -> sec)

        for (let index = 0; index < this.horses.length; index++) {
            // set the y position based on the time (each horse a off a bit)
            let t = (this.time + index / this.horses.length) % 1;

            const horse = this.horses[index].horse;

            // sine movement
            horse.position.y = 0.5 * Math.sin(t * Math.PI * 2);

        }
    }
}