import * as webgl from "./webgl.js";
import * as utils from "./utils.js";
import Object from "../models/Object.js";

let position;
let colour;
let count;
let translation = [0, 0, -500];
let rotation = [0, 0, 0];
let scale = [1, 1, 1];
let cameraAngle = 0;
let cameraRadius = 100;

function main() {
    /* Step1: Prepare the canvas and get webgl context */

    let canvas = document.getElementById("canvas");
    let gl = webgl.defineWebGL(canvas);

    if (!gl) {
        return;
    }

    let upload = document.getElementById("upload");
    upload.addEventListener('submit', function() {
        let file = document.getElementById('input-file');
        if (file.files.length === 0) {
            alert('Tidak ada file yang dipilih!')
        } else {
            const reader = new FileReader();
            let data;

            reader.readAsText(file.files[0]);
            reader.onerror = () => {console.log("Load error")};
            reader.onload  = (event) => {
                data = JSON.parse(event.target.result);
                position = data.vertices;
                count = data.vertices.length
                colour = data.colour
                let object = new Object("object", position, count, colour);
                webgl.renderObject(object);
            }
        }
    });


   position = 
   [
   // left column front
   0,   0,  0,
   0, 150,  0,
   30,   0,  0,
    0, 150,  0,
    30, 150,  0,
   30,   0,  0,

  // top rung front
   30,   0,  0,
   30,  30,  0,
  100,   0,  0,
   30,  30,  0,
   100,  30,  0,
  100,   0,  0,

  // middle rung front
   30,  60,  0,
   30,  90,  0,
   67,  60,  0,
   30,  90,  0,
   67,  90,  0,
   67,  60,  0,

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
  30,   60,  30,
  30,   30,  30,
  30,   30,   0,
  30,   60,   0,
  30,   60,  30,

  // top of middle rung
  30,   60,   0,
  67,   60,  30,
  30,   60,  30,
  30,   60,   0,
  67,   60,   0,
  67,   60,  30,

  // right of middle rung
  67,   60,   0,
  67,   90,  30,
  67,   60,  30,
  67,   60,   0,
  67,   90,   0,
  67,   90,  30,

  // bottom of middle rung.
  30,   90,   0,
  30,   90,  30,
  67,   90,  30,
  30,   90,   0,
  67,   90,  30,
  67,   90,   0,

  // right of bottom
  30,   90,   0,
  30,  150,  30,
  30,   90,  30,
  30,   90,   0,
  30,  150,   0,
  30,  150,  30,

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

  colour = 
  [
    // left column front
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,

    // top rung front
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,

    // middle rung front
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,
  200,  70, 120,

    // left column back
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,

    // top rung back
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,

    // middle rung back
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,
  80, 70, 200,

    // top
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,
  70, 200, 210,

    // top rung right
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,
  200, 200, 70,

    // under top rung
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,
  210, 100, 70,

    // between top rung and middle
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,
  210, 160, 70,

    // top of middle rung
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,
  70, 180, 210,

    // right of middle rung
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,
  100, 70, 210,

    // bottom of middle rung.
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,
  76, 210, 100,

    // right of bottom
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,
  140, 210, 80,

    // bottom
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,
  90, 130, 110,

    // left side
  160, 160, 220,
  160, 160, 220,
  160, 160, 220,
  160, 160, 220,
  160, 160, 220,
  160, 160, 220];

    count = 16 * 6; // Jumlah position/vertex
    translation = [0, 0, -500];
    rotation = [0, 0, 0];
    scale = [1, 1, 1];
    cameraAngle = 0;
    cameraRadius = 100;

    let F = new Object("F", position, count, color, translation, rotation, scale, cameraAngle, cameraRadius);

    webgl.renderObject(F);

    let property = document.getElementById("property-input");
    property.addEventListener('input', (event) => {

        // Translation
        let Tx = event.target.form[0].value;
        let Ty = event.target.form[1].value;
        let Tz = event.target.form[2].value;
        F.translation = [Tx, Ty, Tz];

        let Rx = event.target.form[3].value;
        let Ry = event.target.form[4].value;
        let Rz = event.target.form[5].value;
        F.rotation = [Rx, Ry, Rz];

        let Sx = event.target.form[6].value/100;
        let Sy = event.target.form[7].value/100;
        let Sz = event.target.form[8].value/100;
        F.scale = [Sx, Sy, Sz];

        webgl.renderObject(F);
    })

    let projection = document.getElementById("projection-input");
    projection.addEventListener('input', (event) => {
        let ca = event.target.form[0].value;
        F.cameraAngle = ca;

        let r = event.target.form[1].value;
        F.cameraRadius = r;

        let proj = event.target.form[2].value;
        F.projection = proj;

        webgl.renderObject(F);
    })


}

main();
