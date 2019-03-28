/////////////////////////////////////////////////////////////////
//    S�nid�mi � T�lvugraf�k
//     W�ragrindarteningur teikna�ur tvisvar fr� mismunandi
//     sj�narhorni til a� f� v��sj�nar�hrif (me� gleraugum)
//
//    Hj�lmt�r Hafsteinsson, febr�ar 2019
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var NumVertices  = 144;

var points = [];
var colors = [];

var vBuffer;
var vPosition;

var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = -3.0;
var eyesep = 0.2;

var proLoc;
var mvLoc;

// the 8 vertices of the cube
var v = [
    vec3( -0.3, -1.0,  0.3 ),
    vec3( -0.3,  1.0,  0.3 ),
    vec3(  0.3,  1.0,  0.3 ),
    vec3(  0.3, -1.0,  0.3 ),
    vec3( -0.3, -1.0, -0.3 ),
    vec3( -0.3,  1.0, -0.3 ),
    vec3(  0.3,  1.0, -0.3 ),
    vec3(  0.3, -1.0, -0.3 ),

    vec3( -0.3, -0.9,  0.3 ),
    vec3( -0.3,  0.9,  0.3 ),
    vec3(  0.3,  0.9,  0.3 ),
    vec3(  0.3, -0.9,  0.3 ),
    vec3( -0.3, -0.9, -0.3 ),
    vec3( -0.3,  0.9, -0.3 ),
    vec3(  0.3,  0.9, -0.3 ),
    vec3(  0.3, -0.9, -0.3 ),

    vec3( -0.3, -0.8,  0.3 ),
    vec3( -0.3,  0.8,  0.3 ),
    vec3(  0.3,  0.8,  0.3 ),
    vec3(  0.3, -0.8,  0.3 ),
    vec3( -0.3, -0.8, -0.3 ),
    vec3( -0.3,  0.8, -0.3 ),
    vec3(  0.3,  0.8, -0.3 ),
    vec3(  0.3, -0.8, -0.3 ),

    vec3( -0.3, -0.7,  0.3 ),
    vec3( -0.3,  0.7,  0.3 ),
    vec3(  0.3,  0.7,  0.3 ),
    vec3(  0.3, -0.7,  0.3 ),
    vec3( -0.3, -0.7, -0.3 ),
    vec3( -0.3,  0.7, -0.3 ),
    vec3(  0.3,  0.7, -0.3 ),
    vec3(  0.3, -0.7, -0.3 ),

    vec3( -0.3, -0.6,  0.3 ),
    vec3( -0.3,  0.6,  0.3 ),
    vec3(  0.3,  0.6,  0.3 ),
    vec3(  0.3, -0.6,  0.3 ),
    vec3( -0.3, -0.6, -0.3 ),
    vec3( -0.3,  0.6, -0.3 ),
    vec3(  0.3,  0.6, -0.3 ),
    vec3(  0.3, -0.6, -0.3 ),

    vec3( -0.3, -0.5,  0.3 ),
    vec3( -0.3,  0.5,  0.3 ),
    vec3(  0.3,  0.5,  0.3 ),
    vec3(  0.3, -0.5,  0.3 ),
    vec3( -0.3, -0.5, -0.3 ),
    vec3( -0.3,  0.5, -0.3 ),
    vec3(  0.3,  0.5, -0.3 ),
    vec3(  0.3, -0.5, -0.3 )
];

var lines = [ v[0], v[1], v[1], v[2], v[2], v[3], v[3], v[0],
              v[4], v[5], v[5], v[6], v[6], v[7], v[7], v[4],
              v[0], v[4], v[1], v[5], v[2], v[6], v[3], v[7],
              v[8], v[9], v[9], v[10], v[10], v[11], v[11], v[8],
              v[12], v[13], v[13], v[14], v[14], v[15], v[15], v[12],
              v[8], v[12], v[9], v[13], v[10], v[14], v[11], v[15],
              v[16], v[17], v[17], v[18], v[18], v[19], v[19], v[16],
              v[20], v[21], v[21], v[22], v[22], v[23], v[23], v[20],
              v[16], v[20], v[17], v[21], v[18], v[22], v[19], v[23],
              v[24], v[25], v[25], v[26], v[26], v[27], v[27], v[24],
              v[28], v[29], v[29], v[30], v[30], v[31], v[31], v[28],
              v[24], v[28], v[25], v[29], v[26], v[30], v[27], v[31],
              v[32], v[33], v[33], v[34], v[34], v[35], v[35], v[32],
              v[36], v[37], v[37], v[38], v[38], v[39], v[39], v[36],
              v[32], v[36], v[33], v[37], v[34], v[38], v[35], v[39],
              v[40], v[41], v[41], v[42], v[42], v[43], v[43], v[40],
              v[44], v[45], v[45], v[46], v[46], v[47], v[47], v[44],
              v[40], v[44], v[41], v[45], v[42], v[46], v[43], v[47],
            ];


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(lines), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation( program, "wireColor" );
    
    proLoc = gl.getUniformLocation( program, "projection" );
    mvLoc = gl.getUniformLocation( program, "modelview" );

    var proj = perspective( 50.0, 1.0, 0.2, 100.0 );
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
            spinX = ( spinX + (e.offsetY - origY) ) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );
    
    // Event listener for keyboard
     window.addEventListener("keydown", function(e){
         switch( e.keyCode ) {
            case 38:	// upp �r
                zDist += 0.1;
                break;
            case 40:	// ni�ur �r
                zDist -= 0.1;
                break;
         }
     }  );  

    // Event listener for mousewheel
     window.addEventListener("mousewheel", function(e){
         if( e.wheelDelta > 0.0 ) {
             zDist += 0.1;
         } else {
             zDist -= 0.1;
         }
     }  );  

    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Vinstra auga...
    var mv = lookAt( vec3(0.0-eyesep/2.0, 0.0, zDist),
                      vec3(0.0, 0.0, zDist+2.0),
                      vec3(0.0, 1.0, 0.0) );
    mv = mult( mv, mult( rotateX(spinX), rotateY(spinY) ) );

    // Vinstri mynd er � rau�u...
    gl.uniform4fv( colorLoc, vec4(1.0, 0.0, 0.0, 1.0) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.LINES, 0, NumVertices );

    // H�gra auga...
    mv = lookAt( vec3(0.0+eyesep/2.0, 0.0, zDist),
                      vec3(0.0, 0.0, zDist+2.0),
                      vec3(0.0, 1.0, 0.0) );
    mv = mult( mv, mult( rotateX(spinX), rotateY(spinY) ) );

    requestAnimFrame( render );
}

