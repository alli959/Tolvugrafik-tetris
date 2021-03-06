/////////////////////////////////////////////////////////////////
//    S�nid�mi � T�lvugraf�k
//     W�ragrindarteningur teikna�ur tvisvar fr� mismunandi
//     sj�narhorni til a� f� v��sj�nar�hrif (me� gleraugum)
//
//    Hj�lmt�r Hafsteinsson, febr�ar 2019
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var NumVertices  = 456;

var NumBlock = 24;

totalFloor = 0;

var points = [];
var colors = [];




var vBuffer;
var blockBuffer;
var vPosition;


var xBoxPoints = [0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3];

var yBoxPoints = [1,0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0,
    -0.1, -0.2, -0.3, -0.4, -0.5, -0.6, -0.7, -0.8, -0.9, -11];
    
    
    var zBoxPoints = [0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3];
    
var floor = Array(zBoxPoints.length);

var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = -3.0;
var eyesep = 0.2;

var proLoc;
var mvLoc;

var xPos = 3;
var yPos = 10;
var zPos = 3;

var counter = 0;
var maxCounter = 20;

var blockTrans = [];


var yBlockTranslator = 0.0;
var zBlockTranslator = 0.0;
var xBlockTranslator = 0.0;


//create Floor
for(var z = 3; z >= -3; z-=1){
    floor[z] = Array(yBoxPoints.length);
    for(var y = 10; y>=-10; y-= 1){
        floor[z][y] = Array(xBoxPoints.length);
        for(var x = 3; x>=-3; x-=1){
            floor[z][y][x] = false;

        }
    }
}

console.log(floor);

console.log(floor[0][-1][2]);




function addLines(){
    vertMaker(-0.3, 0.3, -1.0, 1.0, -0.3, 0.3);
    vertMaker(-0.3, 0.3, -0.9, 0.9, -0.3, 0.3);
    vertMaker(-0.3, 0.3, -0.8, 0.8, -0.3, 0.3);
    vertMaker(-0.3, 0.3, -0.7, 0.7, -0.3, 0.3);
    vertMaker(-0.3, 0.3, -0.6, 0.6, -0.3, 0.3);
    vertMaker(-0.3, 0.3, -0.5, 0.5, -0.3, 0.3);
    vertMaker(-0.3, 0.3, -0.4, 0.4, -0.3, 0.3);
    vertMaker(-0.3, 0.3, -0.3, 0.3, -0.3, 0.3);
    vertMaker(-0.3, 0.3, -0.2, 0.2, -0.3, 0.3);
    vertMaker(-0.3, 0.3, -0.1, 0.1, -0.3, 0.3);
    vertMaker(-0.3, 0.3,  0.0, 0.0, -0.3, 0.3);
    vertMaker(-0.15, 0.15,  1.0, 1.0, -0.3, 0.3);
    vertMaker(-0.0, 0.0,  1.0, 1.0, -0.3, 0.3);
    vertMaker(-0.15, 0.15,  0.9, 0.9, -0.3, 0.3);
    vertMaker(-0.0, 0.0,  0.9, 0.9, -0.3, 0.3);
    
}
// the 8 vertices of the cube
var v = [
 

];

function vertMaker(lowX, highX, lowY, highY, lowZ, highZ){

    vert = [
        vec3(lowX, lowY, highZ),
        vec3(lowX, highY, highZ),
        vec3(highX, highY, highZ),
        vec3(highX, lowY, highZ),
        vec3(lowX, lowY, lowZ),
        vec3(lowX, highY, lowZ),
        vec3(highX, highY, lowZ),
        vec3(highX, lowY, lowZ),
    ]

    for(var i = 0; i<vert.length; i++){
        v.push(vert[i]);
    }

    magic(v.length-8);

}




function magic(magicNumber){
    var tempLines = [
        v[0+magicNumber], v[1+magicNumber], v[1+magicNumber], v[2+magicNumber]
        , v[2+magicNumber], v[3+magicNumber], v[3+magicNumber], v[0+magicNumber],
        v[4+magicNumber], v[5+magicNumber], v[5+magicNumber], v[6+magicNumber],
         v[6+magicNumber], v[7+magicNumber], v[7+magicNumber], v[4+magicNumber],
        v[0+magicNumber], v[4+magicNumber], v[1+magicNumber], v[5+magicNumber],
         v[2+magicNumber], v[6+magicNumber], v[3+magicNumber], v[7+magicNumber],
    ];
    console.log(tempLines);
    for(var i = 0; i<24; i++){
        lines.push(tempLines[i]);
    }
}


var lines = [];
            



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
    /*
    vec3( -0.3,  0.9,  -0.2 ),
    vec3( -0.3,  1.0,  -0.2 ),
    vec3(  0.0,  1.0,  -0.2 ),
    vec3(  0.0,  0.9,  -0.2 ),
    vec3( -0.3,  0.9,  -0.3 ),
    vec3( -0.3,  1.0, -0.3 ),
    vec3(  0.0,  1.0, -0.3 ),
    vec3(  0.0,  0.9, -0.3 )*/

    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    addLines();
    NumVertices = lines.length;
    vertMaker(0.0, 0.3, 0.9, 1.0, -0.2, -0.3);
    
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
            case 68: 
                xBlockTranslator -= 0.3;
                break;
            case 65:
                xBlockTranslator += 0.3; 
                break;
            case 83:
                zBlockTranslator -= 0.1;
                break;
            case 87:
                zBlockTranslator += 0.1;
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

    var tempY

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.disable( gl.DEPTH_TEST );

    // Vinstra auga...
    var mv = lookAt( vec3(0.0-eyesep/2.0, 0.0, zDist),
                      vec3(0.0, 0.0, zDist+2.0),
                      vec3(0.0, 1.0, 0.0) );
    mv = mult( mv, mult( rotateX(spinX), rotateY(spinY) ) );

    // Vinstri mynd er � rau�u...
    gl.uniform4fv( colorLoc, vec4(1.0, 0.0, 0.0, 0.3) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.LINES, 0, NumVertices );



    /*TODO boolean breyta eftir því hvernig hann snýr*/
    
    for(var i = xPos; i>0; i--){
        console.log(xPos);
        if(floor[zPos][yPos-1][i] == true){
            console.log(yBlockTranslator);
            blockTrans.push(vec3(0.0, yBlockTranslator+0.1, 0.0));
            /*TODO*/
            for(var j = xPos; j >0; j-- ){
                floor[zPos][yPos][j] = true;
            }
            yPos = 10;
            xPos = 3;
            zPos = 3;
            yBlockTranslator = 0.0;
        break;
        }
    }


    if(blockTrans.length != 0){
        for(var i = 0; i<blockTrans.length; i++){
            gl.uniform4fv(colorLoc, vec4(0.0, 1.0, 0.0, 1.0));
            block = blockTrans[i];
            mv = mult(mv, translate(block[0], block[1], block[2]));
            gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
            gl.drawArrays(gl.LINES, NumVertices, 24);
            mv = mult(mv, translate(-block[0], -block[1], -block[2]));

            
        }
    }


    

    gl.uniform4fv(colorLoc, vec4(0.0, 0.0, 0.0, 1.0))

    //collision for front side
    if(zBlockTranslator < 0.0){
        zBlockTranslator = 0.0
    };

    //collision for back side
    if(zBlockTranslator > 0.5){
        zBlockTranslator = 0.5
    };

    //collision for left side
    if(xBlockTranslator > 0.0){
        xBlockTranslator = 0.0
    };

    //collision for left side
    if(xBlockTranslator < -0.3){
        xBlockTranslator = -0.3
    };

    if(counter >= maxCounter){

        yPos -= 1;
        
        counter = 0;
        yBlockTranslator = yBlockTranslator - 0.1;
        if(yBlockTranslator <= -2.0){
            //TODO boolean fyrir hvernig cubinn snýr
            for(var i = xPos; i>0; i--){
                floor[zPos][yPos][i] = true;
                blockTrans.push(vec3(0.0, yBlockTranslator+0.1, 0.0));
                yPos = 10;
                zPos = 6;
                xPos = 6;
            }
            /*TODO*/
            yBlockTranslator = 0.0;

            /*TODO*/



        }
        mv = mult(mv, translate(0.0, yBlockTranslator, 0.0));
        gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
        gl.drawArrays(gl.LINES, NumVertices, 24);


    
    }

    else{
        counter += 1;
        mv = mult(mv, translate(xBlockTranslator, yBlockTranslator, zBlockTranslator));
        gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
        gl.drawArrays(gl.LINES, NumVertices, 24);
    }
   /* gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays(gl.LINES, NumVertices+NumBlock, totalFloor);*/
    
    // H�gra auga...
    mv = lookAt( vec3(0.0+eyesep/2.0, 0.0, zDist),
                      vec3(0.0, 0.0, zDist+2.0),
                      vec3(0.0, 1.0, 0.0) );
    mv = mult( mv, mult( rotateX(spinX), rotateY(spinY) ) );




    requestAnimFrame( render );
}

