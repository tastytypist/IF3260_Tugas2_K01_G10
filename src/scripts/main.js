import * as webgl from "./webgl.js";
import * as utils from "./utils.js";


function main() {
    /* Step1: Prepare the canvas and get webgl context */

    var canvas = document.getElementById("canvas");
    // var gl = canvas.getContext('webgl');
    var gl = webgl.defineWebGL(canvas);

    if (!gl) {
        return;
    }

    /* Step2: Define the geometry and store it in buffer objects */
    
    var vertices = [
      -0.5,0.5,0,
      -0.5,-0.5,0,
      0.5,-0.5,0,
      0.5,0.5,0
    ];
    var indices = [3,2,1,3,1,0];
    var color = utils.convertRGBA(139,0,0,1);

    webgl.createBuffer(vertices, indices);
    webgl.createShader(color);
    webgl.render(indices);

    var vertices = [
      -0.3,0.7,0,
      -0.3,-0.7,0,
      0.3,-0.7,0,
      0.3,0.7,0 
    ];
    var indices = [3,2,1,3,1,0];
    var color = utils.convertRGBA(0,0,0,1);
    webgl.createBuffer(vertices, indices);
    webgl.createShader(color);
    webgl.render(indices);

}

main();