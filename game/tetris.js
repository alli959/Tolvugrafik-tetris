/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Hnútalitari er látinn reikna snúning út frá breytunni
//     theta, sem er send yfir
//
//    Hjálmtýr Hafsteinsson, febrúar 2019
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var NumVertices  = 36;

var drawValue = 8;

var lineBuffer;

var vBuffer;
var floorBuffer;

var vPosition;

var points = [];
var colors = [];

var locColor;

var vColor;

var cFloorBuffer;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var tester = false;


var stack = [];
var stackColors = [];

var axis = 0;
var theta = [ 0, 0, 0 ];

var boxScale = 2;
var xBoxPoints = [-0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3]
var yBoxPoints = [-1,-0.9, -0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1, 0.0,
                 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];




var zBoxPoints = [-0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3];


var yBlockPosition = 0.90;

var yBlockFalldown = -0.1;

var yBlockTranslator = 0.0;







var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var thetaLoc;







var vertices = [
    vec3( -0.3, -1.0,  0.3 ),
    vec3( -0.3,  1.0,  0.3 ),
    vec3(  0.3,  1.0,  0.3 ),
    vec3(  0.3, -1.0,  0.3 ),
    vec3( -0.3, -1.0, -0.3 ),
    vec3( -0.3,  1.0, -0.3 ),
    vec3(  0.3,  1.0, -0.3 ),
    vec3(  0.3, -1.0, -0.3 ),



    //blocks

    vec3( -0.3,  0.9,  -0.2 ),
    vec3( -0.3,  1.0,  -0.2 ),
    vec3(  0.0,  1.0,  -0.2 ),
    vec3(  0.0,  0.9,  -0.2 ),
    vec3( -0.3,  0.9,  -0.3 ),
    vec3( -0.3,  1.0, -0.3 ),
    vec3(  0.0,  1.0, -0.3 ),
    vec3(  0.0,  0.9, -0.3 )
];


var testLine = [
    vec3(-0.3,-0.9, 0.0),
    vec3(0.3, -0.9, 0.0)
];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    colorCube();


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );


    vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    
    


    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

   


    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    proLoc = gl.getUniformLocation(program, "projection");
    thetaLoc = gl.getUniformLocation(program, "rotation"); 

    var proj = perspective( 90.0, 1.0, 0.1, 100.0 );
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));
    
    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	    spinY = ( spinY + (origX - e.offsetX) ) % 360;
            spinX = ( spinX + (origY - e.offsetY) ) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );
    
    render();
}




var drawcounter = 0;


function addFloor(magicNumber){
    quad( 2+magicNumber, 3+magicNumber, 7+magicNumber, 6+magicNumber );
    quad( 1+magicNumber, 0+magicNumber, 3+magicNumber, 2+magicNumber );
    quad( 3+magicNumber, 0+magicNumber, 4+magicNumber, 7+magicNumber );
    quad( 6+magicNumber, 5+magicNumber, 1+magicNumber, 2+magicNumber );
    quad( 4+magicNumber, 5+magicNumber, 6+magicNumber, 7+magicNumber );
    quad( 5+magicNumber, 4+magicNumber, 0+magicNumber, 1+magicNumber );
}

function colorCube()
{

    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );

    //block

    quad(9, 8, 11, 10);
    quad(10, 11, 15, 14);
    quad(11, 8, 12, 15);
    quad(14, 13, 9, 10);
    quad(12, 13, 14, 15);
    quad(13, 12, 8, 9);


}


var colorCounter = 0;
function quad(a, b, c, d) 
{



    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ],   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];


    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );
    
        // for solid colored faces use
        if(a > 7){
            counter += 1;
            if(counter == 37){
                drawValue += 8;
                counter = 0;
            }
            colors.push(vertexColors[a-drawValue]);
        }
        else{

            colors.push(vertexColors[a]);
        }

    }
    


}





var counter = 0;

var maxCounter = 20;


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    /*draw box*/


    var ctm = lookAt( vec3(1.2, 1.0, 2.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0) );



    ctm = mult(ctm, rotateX(spinX));
    ctm = mult(ctm, rotateY(spinY));

    ctm = mult( ctm, scalem( boxScale, boxScale, boxScale ) );


    gl.disable( gl.DEPTH_TEST );
    gl.uniformMatrix4fv(thetaLoc, false, flatten(ctm));


    
    gl.drawArrays( gl.TRIANGLES, 0, 36);




    




    gl.enable( gl.DEPTH_TEST);
    if(counter >= maxCounter ){
        counter = 0;
        yBlockTranslator = yBlockTranslator - 0.1;
        ctm = mult( ctm, translate( 0.0, yBlockTranslator, 0.0 ) );
        if(yBlockTranslator <= -2.0){
            var tempvertices = vertices.slice(8, 16);
            console.log(tempvertices);

            for(var i = 0; i<tempvertices; i++){
                value = tempvertices[i];
                value[1] -= 2;
                vertices.push(value);
            }

            console.log(vertices);
            console.log("drawValue",drawValue);

            addFloor(drawValue+16);





            


            /*for(var i = 0; i<ptemp.length; i++){
                var point = ptemp[i];
                point[1] -= 2;

                points.push(point);
                colors.push(ctemp[i]);
            }*/


            yBlockTranslator = 0.0;

        }
        gl.uniformMatrix4fv(thetaLoc, false, flatten(ctm));
        gl.drawArrays( gl.TRIANGLES, 36, 36);
    }
    else{
        counter += 1;
        ctm = mult( ctm, translate( 0.0, yBlockTranslator, 0.0 ) );
        gl.uniformMatrix4fv(thetaLoc, false, flatten(ctm));

        gl.drawArrays( gl.TRIANGLES, 36, 36);
    }


    if(points.length > 64){
        gl.drawArrays( gl.TRIANGLES, 64, 36);
    }






    






    


/*
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv(vColor, flatten(vec4(0.0, 0.0, 0.0, 1.0)))
    gl.drawArrays(gl.TRIANGLE_STRIPS, NumVertices, 2);*/
    




    


    requestAnimFrame( render );
}

