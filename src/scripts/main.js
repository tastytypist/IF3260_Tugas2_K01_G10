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
    
    /*========== Defining and storing the geometry ==========*/

    var vertices = [
      -0.5,0.5,0.0,
      -0.5,-0.5,0.0,
      0.5,-0.5,0.0,
      0.5,0.5,0.0
   ];

   var colors = [0,0,1, 1,0,0, 0,1,0, 1,0,1,];
   
   var indices = [3,2,1,3,1,0];
  
   webgl.createBuffer(vertices, indices, colors);
   webgl.render(indices);
}

main();