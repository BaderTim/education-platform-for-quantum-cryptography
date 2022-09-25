/* eslint-disable no-undef */
var width = 800;
var height = 400;
var points=[];//points of the vextor


var scene = new THREE.Scene();


scene.background = new THREE.Color(0x283044);
var camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
scene.add( camera )

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( width, height );
document.getElementById("threejs-bloch").appendChild( renderer.domElement );

var controls = new THREE.OrbitControls (camera,renderer.domElement);
controls.target.set(0,0,0);
var sphere = genSphere();// initBlochSphere(1.25,20,20);
sphere.name ="sphere";
scene.add( sphere );

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


//Camera position
camera.position.z = 5;
camera.position.x= 3;
camera.position.y = 2;
camera.lookAt(new THREE.Vector3(0,0,0));

var xAxis = genLine(new THREE.Vector3(2, 0, 0), 0x00FF00,"x");
var yAxis = genLine(new THREE.Vector3(0, 2, 0), 0xFF0000,"z");
var zAxis = genLine(new THREE.Vector3(0, 0, 2), 0x0000FF,"y");


scene.add(xAxis);
scene.add(yAxis);
scene.add(zAxis);

function update(renderer,scene, camera, controls)
{
    renderer.render( scene, camera );
    //hier Animationen einfügen


    //Objekte nach Name bekommen
    //var vec = scene.getObjectByName("vec1");
    //vec.rotation.x+=0.002;

    controls.update();
    requestAnimationFrame(function(){
        update(renderer,scene,camera, controls);
    });
}
/*function initBlochSphere(r,w,h)
{
    var geometry = new THREE.SphereGeometry( r,w,h);
    var material = new THREE.MeshPhongMaterial( { color:"rgb(255,255,255)", wireframe:true, opacity:0.5, transparent:true} );
    var sphere = new THREE.Mesh( geometry, material );
    return sphere;
};*/
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

function genLine(position, lineColor,name) {
    var lineMaterial = new THREE.LineBasicMaterial({color: lineColor});
    var lineGeometry = new THREE.BufferGeometry();
    
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(position);
    lineGeometry.setFromPoints(points);
    
    var line = new THREE.Line(lineGeometry, lineMaterial);
    line.name=name;
    //Schrift hinzufügen
  /*  var nameGeometry = new THREE.TextGeometry(name, {
        
        size: 0.1,
        height: 0.01 });
      var nameMaterial = new THREE.MeshPhongMaterial({color: lineColor});
      line.stateName = new THREE.Mesh(nameGeometry, nameMaterial);
      line.stateName.position.set(position.x, position.y, position.z);
      line.stateName.position.multiplyScalar(0.7);
      scene.add(line.stateName);*/
    return line;
  }

  
  function addState(x, y, z, color, name,scene) {
    var vec = new THREE.Vector3(x, z, y); // Three.js swaps y and z for some reason
    vec.normalize();
   // vec.clampLength(1,1);
    var vector = genLine(vec, color, name);
    scene.add(vector);
 

  }
  
  function updateState(name,scene,x,y,z){
    var vector = scene.getObjectByName(name);
    
    scene.remove(vector); //entfernen des alten vectors funktioniert nicht 
    points[1]= new THREE.Vector3(x,y,z).normalize();
    vector.geometry.setFromPoints(points);
  
    scene.add(vector);
    
  }
 /* function genLine(position, lineColor, name) {
    var lineMaterial = new THREE.LineBasicMaterial({color: lineColor});
    var lineGeometry = new THREE.BufferGeometry();
    var points=[];
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(position);
    lineGeometry.setFromPoints(points);
    
    var line = new THREE.Line(lineGeometry, lineMaterial);

  line.stateName = null;
  line.name = name;
  var loader = new FontLoader();
  loader.load("./droid_serif_regular.typeface.json",
    function (font) {
      var nameGeometry = new THREE.TextGeometry(name, {
        font: font,
        size: 0.1,
        height: 0.01 });
      var nameMaterial = new THREE.MeshPhongMaterial({color: lineColor});
      line.stateName = new THREE.Mesh(nameGeometry, nameMaterial);
      line.stateName.position.set(position.x, position.y, position.z);
      line.stateName.position.multiplyScalar(0.7);
      scene.add(line.stateName);
    }, null, function(err) {
      console.log( err );
    });


  scene.add(line);

  return line;
}*/
update(renderer,scene,camera,controls);