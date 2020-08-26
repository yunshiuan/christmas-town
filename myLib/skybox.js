/*jshint esversion: 6 */
// @ts-check

import * as T from "../../libs/THREE/build/three.module.js";

/**
* Read in a set of textures from HDRI Heaven, as converted by 
* https://www.360toolkit.co/convert-spherical-equirectangular-to-cubemap
* 
* this uses a specific naming convention, and seems to (usually) swap bottom and front,
* so I provide to undo this
* 
* @param {string} name 
* @param {string} [ext="png"] - the file type
* @param {boolean} [swapBottomFront=true]
*/
export function cubeTextureHelp(name, ext = "png", swapBottomFront = true) {
  let texture = new T.CubeTextureLoader().load([
    name + "Right." + ext,
    name + "Left." + ext,
    name + "Top." + ext,
    name + (swapBottomFront ? "Front." : "Bottom.") + ext,
    name + "Back." + ext,
    name + (swapBottomFront ? "Bottom." : "Front.") + ext
  ]);
  // texture.needsUpdate = true;
  return texture;
}