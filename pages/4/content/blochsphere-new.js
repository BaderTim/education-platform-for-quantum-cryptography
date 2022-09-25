/* eslint-disable no-undef */
var width = 800;
var height = 400;
var scene = new THREE.Scene();

var xmaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
var ymaterial = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
var zmaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );

var vecmaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );

//.................Objekte.............................................

scene.background = new THREE.Color(0x283044);

//Camera
var camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
scene.add( camera )
//Camera position
camera.position.z = 5;
camera.position.x= 3;
camera.position.y = 2;
camera.lookAt(new THREE.Vector3(0,0,0));


var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( width, height );
document.getElementById("threejs-bloch").appendChild( renderer.domElement );

var controls = new THREE.OrbitControls (camera,renderer.domElement);
controls.target.set(0,0,0);

var light = generatePointLight(0xffffff, 1);
light.name="light";
var light2 = generatePointLight(0xffffff, 1);
light2.name="light2";

var ambLight = new THREE.AmbientLight( 0x404040 ,0.5); // soft white light
scene.add( ambLight );

scene.add(light);
light.position.x = 3;
light.position.y =2;
light.position.z = 5;

scene.add(light2);
light2.position.x = -3;
light2.position.y =-2;
light2.position.z = -5;


//Achsen erzeugen
var xAxis = generateAxis(xmaterial, new THREE.Vector3(1.5,0,0));
scene.add(xAxis);
var yAxis = generateAxis(ymaterial, new THREE.Vector3(0,0,1.5));
scene.add(yAxis);

var zAxis = generateAxis(zmaterial, new THREE.Vector3(0,1.5,0));
scene.add(zAxis);


//Bloch sphere erzeugen
var sphere = genSphere();
scene.add( sphere );

//vektor erzeugen
var vec = generateVec(vecmaterial);
vec.position.x=0;
vec.position.y=-0.5;
vec.position.z=0;

var box = new THREE.Box3().setFromObject( vec );
                                
// Reset mesh position:
box.getCenter(vec.position);
vec.position.multiplyScalar(-1);
var pivot = new THREE.Group();
scene.add(pivot);
pivot.add(vec);
pivot.name="vector";
//rotateXGate();
//rotateHGate();


function update(renderer,scene, camera, controls)
{
    renderer.render( scene, camera );
    //hier Animationen einfügen


    controls.update();
    requestAnimationFrame(function(){
        update(renderer,scene,camera, controls);
    });
}

function generateVec(vecmaterial){
    var geometry = new THREE.CylinderGeometry( 0, 0.05, 1, 8 );
    return new THREE.Mesh( geometry, vecmaterial );
}

function rotateXGate(){
   
    var vec = scene.getObjectByName("vector");
    vec.rotation.x+=Math.PI;
    //vec.rotateX(Math.PI);
}
function rotateYGate(){
   
    var vec = scene.getObjectByName("vector");
    //vec.rotateZ(Math.PI);
    vec.rotation.z+=Math.PI;
}
function rotateZGate(){
    var vec = scene.getObjectByName("vector");
    //vec.rotateY(Math.PI);
    vec.rotation.y+=Math.PI;
}
function rotateHGate(){
    var vec = scene.getObjectByName("vector");
    vec.rotation.z += Math.PI/2;
    //vec.rotateZ(Math.PI/2);
    //vec.rotateX(Math.PI);
    vec.rotation.x += Math.PI;
    vec.normalize();
}

function genSphere() {
    var txtrHW = 360;
  
    var txtrData = new Uint8Array(4 * txtrHW * txtrHW);
    for (var w = 0; w < txtrHW; w++) {
      for (var h = 0; h < txtrHW; h++) {
          var stride = ((h * txtrHW) + w) * 4;
          txtrData[stride] = 255; // red
          txtrData[stride + 1] = 255; // green
        txtrData[stride + 2] = 255; // blue
        if (w % 45 == 0 || h % 45 == 0) {
          txtrData[stride + 3] = 255; // alfa; opaque
        } else {
          txtrData[stride + 3] = 0; // alfa; transparen
        }
      }
    }
  
    var sphereTexture = new THREE.DataTexture(txtrData, txtrHW, txtrHW, THREE.RGBAFormat);
    sphereTexture.needsUpdate = true;
    var sphereMaterial = new THREE.MeshPhongMaterial({
      map: sphereTexture,
      shininess: 0.0,
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: false});
  
    var sphereGeometry = new THREE.SphereGeometry(1.0, 64, 64);
    var local_sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    local_sphere.position.z = 0;
    local_sphere.position.x = 0;
    scene.add(local_sphere);
    return local_sphere;
  }

function generatePointLight(color,intensity){
    return new THREE.PointLight(color,intensity);
}

function generateAxis(material,vec){
    var points = [];
    points.push( new THREE.Vector3( 0, 0, 0 ) );
    points.push( vec );
    var geometry = new THREE.BufferGeometry().setFromPoints( points );

    return new THREE.Line( geometry, material );
}
  
 
update(renderer,scene,camera,controls);