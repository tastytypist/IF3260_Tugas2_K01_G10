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

   var vertices = [
    0,0,0, 0.4,0,0, 0.4, 0.4,0, 0, 0.4,0,
    0,0, 0.4, 0.4,0, 0.4, 0.4, 0.4, 0.4, 0, 0.4, 0.4,
    0,0,0, 0, 0.4,0, 0, 0.4, 0.4, 0,0, 0.4,
    0.4,0,0, 0.4, 0.4,0, 0.4, 0.4, 0.4, 0.4,0, 0.4,
    0,0,0, 0,0, 0.4, 0.4,0, 0.4, 0.4,0,0,
    0, 0.4,0, 0, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,0, 
    ];

    var colors = [
    5,3,7, 5,3,7, 5,3,7, 5,3,7,
    1,1,3, 1,1,3, 1,1,3, 1,1,3,
    0,0,1, 0,0,1, 0,0,1, 0,0,1,
    1,0,0, 1,0,0, 1,0,0, 1,0,0,
    1,1,0, 1,1,0, 1,1,0, 1,1,0,
    0,1,0, 0,1,0, 0,1,0, 0,1,0
    ];

    var indices = [
    0,1,2, 0,2,3, 4,5,6, 4,6,7,
    8,9,10, 8,10,11, 12,13,14, 12,14,15, 
    16,17,18, 16,18,19, 20,21,22, 20,22,23 
    ];

    var cubeA = new Object("Cube", vertices, colors, indices);

    var listOfObjects = [cubeA];
    webgl.renderObjects(listOfObjects);

    var property = document.getElementById("property");
    property.addEventListener('input', (event) => {

        // Translation
        let Tx = event.target.form[0].value / 100;
        let Ty = event.target.form[1].value / 100;
        let Tz = event.target.form[2].value / 100;
        console.log(Tx, Ty, Tz);
        cubeA.translation = [Tx, Ty, Tz];

        webgl.renderObjects([cubeA]);
    })
}

main();