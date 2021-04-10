// import './style.css'
// import * as THREE from 'three'
// import { OrbitControls } from '../helperScripts/OrbitControls';
// import {SkyGeometry,TreesGeometry} from "../helperScripts/RollerCoaster"

// //Globals
// let parent,tubeGeometry, mesh,container,geometry
// let camera,scene,renderer,splineCamera,cameraEye,cameraHelper

// const direction = new THREE.Vector3();
// const binormal = new THREE.Vector3();
// const normal = new THREE.Vector3();
// const position = new THREE.Vector3();
// const lookAt = new THREE.Vector3();

// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// }

// //Spline
// const sampleClosedSpline = new THREE.CatmullRomCurve3( [
//     new THREE.Vector3(0, -40, -40),
//     new THREE.Vector3( 0, 40, - 40 ),
//     new THREE.Vector3( 0, 140, - 40 ),
//     new THREE.Vector3( 0, 40, 40 ),
//     new THREE.Vector3( 0, - 40, 40 )
  

// ] );

// sampleClosedSpline.curveType = 'catmullrom';
// sampleClosedSpline.closed = true;
// const spline = sampleClosedSpline;


// //Textures
// const loader = new THREE.TextureLoader()
// const texture = loader.load('/r.jpg')





// // Debug
// let gui = new dat.GUI()

// let material = new THREE.MeshLambertMaterial({
//     color:  'gray',map:texture
// })
// let wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.3, wireframe: true, transparent: true } );


// //ADD TUBE FUNCTION
// function addTube () {
//     if(mesh !== undefined){
//         parent.remove(mesh)
//         mesh.geometry.dispose()
//     }

//     const extrudePath = spline;
//     tubeGeometry = new THREE.TubeGeometry(extrudePath,100,2,3,false)

//     addGeometry(tubeGeometry)
//     setScale();

// }



// //SCALE FUNCTION
// function setScale (){
//     mesh.scale.set(4,4,4)
// }


// //GEOMETRY FUNCTION
// function addGeometry (geometry) {
//     mesh = new THREE.Mesh(geometry,material);
//     const wireframe = new THREE.Mesh(geometry,wireframeMaterial)
    
//     mesh.add(wireframe)
//     parent.add(mesh)

  

// }


// //CAMERA ANIMATE
// function animateCamera() {

//     cameraHelper.visible = false;
//     cameraEye.visible = false;

// }


// function init () {
    
//     container = document.getElementById( 'container' );
//     camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.01, 10000)
//     camera.position.set( 0, 50, 500 );
    

//     //Sky
    
//     scene = new THREE.Scene();
//     scene.background = new THREE.Color( 0xf0f0f0 );

    
    
   

//     const light = new THREE.DirectionalLight( 0xffffff );
//     light.position.set( 0, 0, 1 );
//     scene.add( light );

//     parent = new THREE.Object3D();
//     scene.add( parent );


//     splineCamera = new THREE.PerspectiveCamera( 84, sizes.width / sizes.height, 0.01, 1000 );
//     parent.add( splineCamera );

//     cameraHelper = new THREE.CameraHelper( splineCamera );
//     scene.add( cameraHelper );


//     addTube()

//     cameraEye = new THREE.Mesh( new THREE.SphereGeometry( 5 ), new THREE.MeshBasicMaterial( { color: 0xdddddd } ) );
//     parent.add( cameraEye );
//     cameraHelper.visible = false;
//     cameraEye.visible = false;

//     renderer = new THREE.WebGLRenderer( { antialias: true } );
//     renderer.setPixelRatio( window.devicePixelRatio );
//     renderer.setSize( window.innerWidth, window.innerHeight );
//     container.appendChild( renderer.domElement );



//     window.addEventListener('resize', () =>
//     {
//         // Update sizes
//         sizes.width = window.innerWidth
//         sizes.height = window.innerHeight

//         // Update camera
//         camera.aspect = sizes.width / sizes.height
//         camera.updateProjectionMatrix()

//         // Update renderer
//         renderer.setSize(sizes.width, sizes.height)
//         // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//     })
//     const controls = new OrbitControls( camera, renderer.domElement );
//     controls.minDistance = 100;
//     controls.maxDistance = 2000;
//     controls.update()


//     // renderer.render( scene, camera );

// }


// //ANIMATE


// function animate () {
//     requestAnimationFrame( animate );

//     render();
// }



// function render () {
//     // position = new THREE.Vector3();
//     const time = Date.now();
//     const looptime = 10 * 1000;
//     const t = ( time % looptime ) / looptime;

//     tubeGeometry.parameters.path.getPointAt( t, position );
//     position.multiplyScalar(4)

//     const segments = tubeGeometry.tangents.length;
//     const pickt = t * segments;
//     const pick = Math.floor( pickt );
//     const pickNext = ( pick + 1 ) % segments;

//     binormal.subVectors( tubeGeometry.binormals[ pickNext ], tubeGeometry.binormals[ pick ] );
//     binormal.multiplyScalar( pickt - pick ).add( tubeGeometry.binormals[ pick ] );

//     tubeGeometry.parameters.path.getTangentAt( t, direction );
//     const offset = 15;
//     normal.copy( binormal ).cross( direction );

//     position.add( normal.clone().multiplyScalar( offset ) );
//     splineCamera.position.copy( position );
//     cameraEye.position.copy( position );

//     tubeGeometry.parameters.path.getPointAt( ( t + 30 / tubeGeometry.parameters.path.getLength() ) % 1, lookAt );
//     lookAt.multiplyScalar( 4 );

//     splineCamera.matrix.lookAt( splineCamera.position, lookAt, normal );
//     splineCamera.quaternion.setFromRotationMatrix( splineCamera.matrix );
//     cameraHelper.update()

//     renderer.render( scene, splineCamera );

// }


// init()
// animate()


import * as THREE from 'three'
import {OrbitControls} from '../helperScripts/OrbitControls'
import {GLTFLoader} from '../helperScripts/GLTFLoader'
import * as dat from 'dat.gui'

let scene, camera, renderer,controls, planes,planes1,geometry,material,plane,plane1,geometry1,material1
let clock,time,delta,direction,speed,direction1,speed1

const gui = new dat.GUI()
const container = document.getElementById( 'container' );

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(30,window.innerWidth/window.innerHeight,1,1000)

renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#87CEFA'); //SURROUNDING COLOR
renderer.setPixelRatio(window.devicePixelRatio)
container.appendChild( renderer.domElement );


//Texture

const textureLoader = new THREE.ImageLoader()
const modelLoader =  new GLTFLoader();

modelLoader.load('../assets/low_poly_trees/scene.gltf',(gltf)=>{
  scene.add(gltf.scene)
  renderer.render(scene,camera)
})

controls = new OrbitControls(camera, renderer.domElement);
  // controls.minDistance = 500;  
    // controls.maxDistance = 500;
    controls.update()

  planes = [];
  planes1 = []

  //Main Road geometry
  let mainRoads = []
  for(let i = 0 ; i< 10 ; i++){
    let mainRoadGeometry = new THREE.PlaneBufferGeometry(1000,100,1);
    mainRoadGeometry.rotateX(Math.PI * 1.5)
      let materialMainRoadGeometry = new THREE.MeshBasicMaterial({color:'#4E8975',side:THREE.DoubleSide})
      let planeMainRoadGeometry = new THREE.Mesh(mainRoadGeometry,materialMainRoadGeometry)
      planeMainRoadGeometry.position.set(0,-11,200-i*100)
      scene.add(planeMainRoadGeometry)
      mainRoads.push(planeMainRoadGeometry)
    
  }


  // ROAD GEOMETRY
  for (let i = 0; i < 10; i++) {
    geometry = new THREE.PlaneBufferGeometry(40,100,1)
    geometry.rotateX(Math.PI * 1.5)
   
      material = new THREE.MeshBasicMaterial({color:"#000000",side:THREE.DoubleSide}) //ROAD COLOR
      
      plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, -10, -200 - i * 100);
      
      scene.add(plane);
      planes.push(plane);
    
  }
  
  //MIDDLE BARS GEOMETRY
  for(let i = 0; i < 1 ;i++){

    geometry1 = new THREE.PlaneBufferGeometry(5,40,1)
    material1 = new THREE.MeshBasicMaterial({color:'#FFFFFF'}) 
    geometry1.rotateX(Math.PI * 1.5)
    plane1 = new THREE.Mesh(geometry1, material1);
    plane1.position.set(0, -8, 200 - i * 100);
    scene.add(plane1)
    planes1.push(plane1)
  }


clock = new THREE.Clock();
time = 0
delta = 0; // Road Delta
direction = new THREE.Vector3(0, 0, 1);// Road Direction
speed = 50; //units a second..Road Speed

direction1 = new THREE.Vector3(0,0,3) // Middle Bars Direction
speed1 = speed - 10 //Middle Bars Speed

const render = () => {
    requestAnimationFrame(render);
    
    delta = clock.getDelta();
    time += delta;
    planes.forEach(function(plane) {
        plane.position.addScaledVector(direction, speed * delta);
        if (plane.position.z > 250) plane.position.z = -250 + ((plane.position.z - 2000) % 500);
    });

    planes1.forEach((plane)=>{
      plane1.position.addScaledVector(direction1, speed1 * delta);
      if (plane1.position.z > 100) plane1.position.z = -100 + ((plane1.position.z - 100) % 200);
    })


    // mainRoads.forEach((mainRoad)=>{
    //   main
    // })
    
    renderer.render(scene, camera);
}
render();