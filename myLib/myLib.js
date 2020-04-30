/*jshint esversion: 6 */
// @ts-check

//
// CS559 - Graphics Town - Workbook 12
// This sets up the town loading different objects. 
// It should be called from the onload function, after the world has been created

import { GrWorld } from "../../libs/CS559-Framework/GrWorld.js";
// import { SimpleHouse } from "../../examples/house.js";
import { CircularTrack, TrackCube, TrackCar } from "../../examples/track.js";
// import { Helicopter, Helipad } from "../../examples/helicopter.js";
import { ShinySculpture } from "../../examples/shinySculpture.js";
import { MorphTest } from "../../examples/morph.js";
import { BuildingWood, BuildingBrick } from "./building.js";
import { Snowman } from "./snowman.js";
import { Carousel } from "./carousel.js";
import { Helicopter } from "./helicopter.js";
import { Bus } from "./bus.js";
import { Track } from "./track.js";

import { cubeTextureHelp } from "./skybox.js";
// import { SimpleHouse } from "../../examples/house.js"
/**
 * 
 * @param {GrWorld} world 
 */
export function main(world) {
  /** 
   * Constants
   */
  const NUM_COL_HOUSES = 4;
  const INTERVAL_HOUSE = 5;
  const INTERVAL_ROW = 8;
  /** 
   * Place wood houses
   */

  for (let i = 0; i < NUM_COL_HOUSES; i++) {
    // far row
    world.add(new BuildingWood({ x: INTERVAL_HOUSE * i, z: -10, scale: 2 }));

    // near row
    let buildingWood = new BuildingWood({ x: INTERVAL_HOUSE * i, z: 10, scale: 2 });
    buildingWood.objects[0].rotateY(Math.PI / 2 * 2);
    buildingWood.objects[0].translateX(-buildingWood.width * 2);
    world.add(buildingWood);
  }


  /** 
   * Place brick houses
   */
  for (let i = 0; i < NUM_COL_HOUSES; i++) {
    // far row
    world.add(new BuildingBrick({ x: INTERVAL_HOUSE * i, z: -10 - INTERVAL_ROW, scale: 2 }));

    // near row
    let buildingBrick = new BuildingBrick({ x: INTERVAL_HOUSE * i, z: 10 + INTERVAL_ROW, scale: 2 });
    buildingBrick.objects[0].rotateY(Math.PI / 2 * 2);
    buildingBrick.objects[0].translateX(-buildingBrick.width * 2);
    world.add(buildingBrick);
  }

  /** 
   * Place the snowmans
   */
  const hat_colors = ["red", "cyan", "green", "purple"];
  for (let i = 0; i < NUM_COL_HOUSES; i++) {
    // far row
    world.add(new Snowman({
      x: INTERVAL_HOUSE * i, z: -9, scale: 0.3, hat_color: hat_colors[i % hat_colors.length]
    }));
    world.add(new Snowman({
      x: INTERVAL_HOUSE * i + 3, z: -9, scale: 0.3, hat_color: hat_colors[i % hat_colors.length]
    }));

    // near row
    let snowman = new Snowman({
      x: INTERVAL_HOUSE * i, z: 9, scale: 0.3,
      hat_color: hat_colors[(NUM_COL_HOUSES - i - 1) % hat_colors.length]
    });
    snowman.objects[0].rotateY(Math.PI / 2 * 2);
    world.add(snowman);

    world.add(new Snowman({
      x: INTERVAL_HOUSE * i + 3, z: 9, scale: 0.3,
      hat_color: hat_colors[(NUM_COL_HOUSES - i - 1) % hat_colors.length]
    }));
  }

  /** 
   * Place the carousel
   */

  world.add(new Carousel({ x: -10, scale: 0.7 }));

  /** 
   * Place the helicopter
   */
  let helicopter = new Helicopter({ x: 10, y: 15, z: 0, scale: 0.3 });
  world.add(helicopter);

  /** 
   * Place the bus
   */
  let bus = new Bus({ x: 10, y: 0, z: 0, scale: 1 });
  world.add(bus);

  /** 
   * Place the track
   */
  let track = new Track();
  world.add(track);
  // /** Race Track - with three things racing around */
  // let track = new CircularTrack();
  // let tc1 = new TrackCube(track);
  // let tc2 = new TrackCube(track);
  // let tc3 = new TrackCar(track);

  // // place things are different points on the track
  // tc2.u = 0.25;
  // tc3.u = 0.125;
  // // and make sure they are in the world
  // world.add(track);
  // world.add(tc1);
  // world.add(tc2);
  // world.add(tc3);

  /** Helicopter - first make places for it to land*/
  // world.add(new Helipad(-15, 0, 0));
  // world.add(new Helipad(15, 0, 0));
  // world.add(new Helipad(0, 0, -17));
  // world.add(new Helipad(0, 0, 17));
  // let copter = new Helicopter();
  // world.add(copter);
  // copter.getPads(world.objects);

  // // these are testing objects
  // world.add(new ShinySculpture(world));
  // world.add(new MorphTest({ x: 10, y: 3, r: 2 }));

  /** Add the skybox */
  world.scene.background = cubeTextureHelp("./images/");
}


