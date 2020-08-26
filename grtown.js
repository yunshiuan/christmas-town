/*jshint esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 *
 * This is the main file - it creates the world, populates it with
 * objects and behaviors, and starts things running
 *
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 *
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
 */

import { GrWorld } from "./libs/Framework/GrWorld.js";
import * as Helpers from "./libs/Libs/helpers.js";
import { WorldUI } from "./libs/Framework/WorldUI.js";
import * as T from "./libs/THREE/build/three.module.js";

// import {main} from "../examples/main.js";
import { main } from "./myLib/myLib.js";
import { GroundPlane } from "./myLib/groundPlane.js";

/**
 * The Graphics Town Main -
 * This builds up the world and makes it go...
 */
function grtown() {
  /** 
   * Add lights
   */
  let dir_light = new T.DirectionalLight("#ff8000", 0.5);
  dir_light.position.set(5, 3, 5);
  dir_light.target.position.set(0, 0, 0);
  let amb = new T.AmbientLight("white", 0.7);

  /** 
   * Make the world
   */
  // use my customized ground plane
  let groundPlane = new GroundPlane({
    y: 0,
    width: 50,
    height: 50,
    // color is defined by the color map
    // color: "white"
  });
  let world = new GrWorld({
    // canvas size (pixels)
    width: 800,
    height: 600,
    groundplane: groundPlane,
    lookfrom: new T.Vector3(groundPlane.width * 0.6, 30, groundPlane.height),
    lookat: new T.Vector3(0, 0, 0),
    // groundplanesize: 25,
    // groundplanecolor: "white",
    lights: [dir_light, amb]
  });

  /** 
   * set up the world
   */
  main(world);

  /** 
   * build and run the UI
   */
  // only after all the objects exist can we build the UI
  // @ts-ignore       // we're sticking a new thing into the world
  world.ui = new WorldUI(world);

  /** 
   * Animate the world
   */
  world.go();
}
Helpers.onWindowOnload(grtown);
