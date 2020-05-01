/*jshint esversion: 6 */
// @ts-check

//
// CS559 - Graphics Town - Workbook 12
// This sets up the town loading different objects. 
// It should be called from the onload function, after the world has been created

import { GrWorld } from "../../libs/CS559-Framework/GrWorld.js";
// import { SimpleHouse } from "../../examples/house.js";
// import { CircularTrack, TrackCube, TrackCar } from "../../examples/track.js";
// import { Helicopter, Helipad } from "../../examples/helicopter.js";
// import { ShinySculpture } from "../../examples/shinySculpture.js";
// import { MorphTest } from "../../examples/morph.js";
import { BuildingWood, BuildingBrick } from "./building.js";
import { Snowman } from "./snowman.js";
import { Carousel } from "./carousel.js";
import { Helicopter } from "./helicopter.js";
import { Bus } from "./bus.js";
import { Track } from "./track.js";
import { Tree } from "./tree.js";
import { MiniLoader } from "./miniloader.js";
import { cubeTextureHelp } from "./skybox.js";
import { Mound } from "./mound.js";
import { FireWorkShooter } from "./firework.js"

import * as T from "../../libs/CS559-THREE/build/three.module.js";
import { AxesHelper } from "../../libs/CS559-THREE/build/three.module.js";

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
  const INTERVAL_ROW = 9;
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
   * Place the helicopter
   */
  let helicopter = new Helicopter({ x: 10, y: 15, z: 0, scale: 0.3 });
  world.add(helicopter);
  /**
   * Place the firework shooter on the helicopter
   */
  let fireWorkShooter = new FireWorkShooter({
    scene: world.scene,
    base: helicopter
    // x: 10
  });
  let axesHelper = new T.AxesHelper(5);
  fireWorkShooter.objects[0].add(axesHelper);
  world.add(fireWorkShooter);
  // helicopter.objects[0].add(fireWorkShooter.objects[0]);

  /** 
   * Place the bus track
   */
  const control_points = [
    // turn into the front row between buildings
    [-5, 10],
    [-2, 15],
    // in the front row between buildings
    [3, 16],
    [10, 16],
    [18, 16],
    // turn into the front row beside snowmen
    [21, 13],
    [22, 10],
    [21, 7],
    // in the front row beside snowmen
    [18, 5],
    [10, 5],
    [3, 5],
    // turn into the far row beside snowmen
    [0, 3],
    [-1, 0],
    [0, -3],
    // in the far row beside snowmen
    [3, -5],
    [10, -5],
    [18, -5],
    // turn into the far row between buildings    
    [21, -7],
    [22, -10],
    [21, -13],
    // in the far row between buildings
    [18, -16],
    [10, -16],
    [3, -16],
    // turn out from the far row between buildings
    [-2, -15],
    [-5, -10]
  ];
  let track = new Track({ arrayControlPoints: control_points });
  world.add(track);

  /** 
   * Place the bus
   */
  let bus = new Bus(
    {
      x: 10, y: 0, z: 0,
      scale: 1,
      track: track,
      speed: 2
    }
  );
  world.add(bus);

  /**
   * Place the big tree
   */
  let tree = new Tree(
    {
      x: 10,
      scale: 1.5
    });
  world.add(tree);
  /** 
   * The construction site
   */
  const construction_pos_x = -15;
  const construction_pos_z = -15;

  world.add(new MiniLoader({
    x: construction_pos_x,
    z: construction_pos_z,
    scale: 0.5
  }));
  // place the mound near the construction site
  world.add(new Mound({
    x: construction_pos_x,
    z: construction_pos_z - 3,
    scale: 0.3
  }));

  /** 
   * The amusemnent park
   */
  const park_pos_x = -15;
  const park_pos_z = 15;

  // Place the carousel


  world.add(new Carousel({
    x: park_pos_x,
    z: park_pos_z,
    scale: 0.7
  }));

  /**
   * Place the forest
   */
  const tree_far_pos_x = construction_pos_x - 3;
  const tree_far_pos_z = construction_pos_z;
  const tree_near_pos_x = park_pos_x + 9;
  const tree_near_pos_z = park_pos_z;
  const tree_positions = [
    // far (the construction site)
    [tree_far_pos_x - 4, tree_far_pos_z - 5],
    // [tree_far_pos_x, tree_far_pos_z - 3],
    // [tree_far_pos_x - 2, tree_far_pos_z],
    [tree_far_pos_x - 5, tree_far_pos_z],
    [tree_far_pos_x - 3, tree_far_pos_z + 4],
    [tree_far_pos_x - 5, tree_far_pos_z + 8],
    [tree_far_pos_x - 3, tree_far_pos_z + 10],
    [tree_far_pos_x - 5, tree_far_pos_z + 11],
    [tree_far_pos_x - 2, tree_far_pos_z + 11],
    // near (the amusement park)
    [tree_near_pos_x - 4, tree_near_pos_z - 5],
    [tree_near_pos_x - 2, tree_near_pos_z],
    [tree_near_pos_x - 5, tree_near_pos_z],
    [tree_near_pos_x, tree_near_pos_z + 2],
    [tree_near_pos_x - 2, tree_near_pos_z + 4],
  ];
  for (let treeIndex = 0; treeIndex < tree_positions.length; treeIndex++) {
    world.add(new Tree(
      {
        x: tree_positions[treeIndex][0],
        z: tree_positions[treeIndex][1],
        scale: 0.5
      })
    );
  }
  // add fallen trees in the construction site
  let fallenTreeA = new Tree(
    {
      x: tree_far_pos_x - 2,
      z: tree_far_pos_z,
      scale: 0.5
    }
  );
  fallenTreeA.objects[0].rotation.x = (Math.PI / 2);
  fallenTreeA.objects[0].rotation.z = (Math.PI / 4);
  world.add(fallenTreeA);

  let fallenTreeB = new Tree(
    {
      x: tree_far_pos_x,
      z: tree_far_pos_z - 3,
      scale: 0.5
    }
  );
  fallenTreeB.objects[0].rotation.x = (Math.PI / 2);
  fallenTreeB.objects[0].rotation.z = (Math.PI);
  world.add(fallenTreeB);
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


