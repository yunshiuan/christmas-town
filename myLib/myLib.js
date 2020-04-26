/*jshint esversion: 6 */
// @ts-check

//
// CS559 - Graphics Town - Workbook 12
// Example Code: 
// Example "Town"
//
// This sets up the town loading different objects. 
//
// It should be called from the onload function, after the world has been created

/** These imports are for the examples - feel free to remove them */
import { GrWorld } from "../../libs/CS559-Framework/GrWorld.js";
// import { SimpleHouse } from "../../examples/house.js";
import { CircularTrack, TrackCube, TrackCar } from "../../examples/track.js";
import { Helicopter, Helipad } from "../../examples/helicopter.js";
import { ShinySculpture } from "../../examples/shinySculpture.js";
import { MorphTest } from "../../examples/morph.js";
import { BuildingGable } from "./building.js";
import { cubeTextureHelp } from "./skybox.js";

import { SimpleHouse } from "../../examples/house.js"
/********************************************************************** */
/**
 * 
 * @param {GrWorld} world 
 */
export function main(world) {
  // make two rows of houses, mainly to give something to look at
  for (let i = 0; i < 20; i += 5) {
    world.add(new BuildingGable({ x: i, z: -12, scale: 2 }));
    world.add(new BuildingGable({ x: i, z: 12, scale: 2 }));
    //  world.add(new BuildingGable({ x: 0, y: 0, z: 0, scale: 2 }));
  }
  // world.add(new SimpleHouse({ x: 0, y: 0, z: 0 }));

  /** Race Track - with three things racing around */
  let track = new CircularTrack();
  let tc1 = new TrackCube(track);
  let tc2 = new TrackCube(track);
  let tc3 = new TrackCar(track);

  // place things are different points on the track
  tc2.u = 0.25;
  tc3.u = 0.125;
  // and make sure they are in the world
  world.add(track);
  world.add(tc1);
  world.add(tc2);
  world.add(tc3);

  /** Helicopter - first make places for it to land*/
  world.add(new Helipad(-15, 0, 0));
  world.add(new Helipad(15, 0, 0));
  world.add(new Helipad(0, 0, -17));
  world.add(new Helipad(0, 0, 17));
  let copter = new Helicopter();
  world.add(copter);
  copter.getPads(world.objects);

  // these are testing objects
  // world.add(new ShinySculpture(world));
  // world.add(new MorphTest({ x: 10, y: 3, r: 2 }));

  /** Add the skybox */
  world.scene.background = cubeTextureHelp("./images/");
}


