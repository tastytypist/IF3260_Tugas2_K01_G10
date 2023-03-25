import * as webgl from "./webgl.js";
import * as utils from "./utils.js";
import Object from "../models/Object.js";

function uploadObject() {
    fileInput = document.getElementById("fileInput");
}

function saveObject() {
    const fs = require('fs');

}

function main() {
    /* Step1: Prepare the canvas and get webgl context */

    var canvas = document.getElementById("canvas");
    var gl = webgl.defineWebGL(canvas);

    if (!gl) {
        return;
    }

   var position = 
   [
   // left column front
   0,   0,  0,
   30,   0,  0,
    0, 150,  0,
    0, 150,  0,
   30,   0,  0,
   30, 150,  0,

  // top rung front
   30,   0,  0,
  100,   0,  0,
   30,  30,  0,
   30,  30,  0,
  100,   0,  0,
  100,  30,  0,

  // middle rung front
   30,  60,  0,
   67,  60,  0,
   30,  90,  0,
   30,  90,  0,
   67,  60,  0,
   67,  90,  0,

  // left column back
    0,   0,  30,
   30,   0,  30,
    0, 150,  30,
    0, 150,  30,
   30,   0,  30,
   30, 150,  30,

  // top rung back
   30,   0,  30,
  100,   0,  30,
   30,  30,  30,
   30,  30,  30,
  100,   0,  30,
  100,  30,  30,

  // middle rung back
   30,  60,  30,
   67,  60,  30,
   30,  90,  30,
   30,  90,  30,
   67,  60,  30,
   67,  90,  30,

  // top
    0,   0,   0,
  100,   0,   0,
  100,   0,  30,
    0,   0,   0,
  100,   0,  30,
    0,   0,  30,

  // top rung right
  100,   0,   0,
  100,  30,   0,
  100,  30,  30,
  100,   0,   0,
  100,  30,  30,
  100,   0,  30,

  // under top rung
  30,   30,   0,
  30,   30,  30,
  100,  30,  30,
  30,   30,   0,
  100,  30,  30,
  100,  30,   0,

  // between top rung and middle
  30,   30,   0,
  30,   30,  30,
  30,   60,  30,
  30,   30,   0,
  30,   60,  30,
  30,   60,   0,

  // top of middle rung
  30,   60,   0,
  30,   60,  30,
  67,   60,  30,
  30,   60,   0,
  67,   60,  30,
  67,   60,   0,

  // right of middle rung
  67,   60,   0,
  67,   60,  30,
  67,   90,  30,
  67,   60,   0,
  67,   90,  30,
  67,   90,   0,

  // bottom of middle rung.
  30,   90,   0,
  30,   90,  30,
  67,   90,  30,
  30,   90,   0,
  67,   90,  30,
  67,   90,   0,

  // right of bottom
  30,   90,   0,
  30,   90,  30,
  30,  150,  30,
  30,   90,   0,
  30,  150,  30,
  30,  150,   0,

  // bottom
  0,   150,   0,
  0,   150,  30,
  30,  150,  30,
  0,   150,   0,
  30,  150,  30,
  30,  150,   0,

  // left side
  0,   0,   0,
  0,   0,  30,
  0, 150,  30,
  0,   0,   0,
  0, 150,  30,
  0, 150,   0];

    var count = 16 * 6;
    var color = [Math.random(), Math.random(), Math.random(), 1];
    var translation = [0, 0, 0];
    var rotation = [0, 0, 0];
    var scale = [1, 1, 1];

    var F = new Object("F", position, count, color, translation, rotation, scale);

    webgl.renderObject(F);

    var property = document.getElementById("property");
    property.addEventListener('input', (event) => {

        // Translation
        let Tx = event.target.form[0].value;
        let Ty = event.target.form[1].value;
        let Tz = event.target.form[2].value;
        console.log(Tx, Ty, Tz);
        F.translation = [Tx, Ty, Tz];

        let Rx = event.target.form[3].value;
        let Ry = event.target.form[4].value;
        let Rz = event.target.form[5].value;
        console.log(Rx, Ry, Rz);
        F.rotation = [Rx, Ry, Rz];

        webgl.renderObject(F);
    })

    //     /** Translation */
    // global_translation = [45, 150, 0];
    // global_rotation = [degToRad(40), degToRad(25), degToRad(325)];
    // global_scale = [1, 1, 1];
    // global_color = [Math.random(), Math.random(), Math.random(), 1];
    // count = 16
}

main();