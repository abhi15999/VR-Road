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


// import * as THREE from 'three'
import * as THREE from "../node_modules/three/build/three.module.js"
import {OrbitControls} from '../helperScripts/OrbitControls.js'
import {GLTFLoader} from '../helperScripts/GLTFLoader.js'
import * as dat from '../node_modules/dat.gui/build/dat.gui.module.js'

let scene, camera, renderer,controls, planes,geometry,material,plane
let clock,time,delta,direction,speed
let HouseModels = []
let TreeModels = []
let brickApartments = []
const gui = new dat.GUI()
const container = document.getElementById( 'container' );

scene = new THREE.Scene();
scene.fog = new THREE.Fog('#d5c7e8',1,700)
camera = new THREE.PerspectiveCamera(30,window.innerWidth/window.innerHeight,0.1,1000)





renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha:true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#87CEFA'); //SURROUNDING COLOR
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true;//enable shadow
container.appendChild( renderer.domElement );

const light = new THREE.AmbientLight( 0x404040, 3 ); // soft white light
scene.add( light );
scene.add( light );

window.onresize = function () {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

};


const pos_to_neg = (x) => {
  return -Math.abs(x)
}

const neg_to_pos = (x) => {
  return Math.abs(x)
}



//Texture

const textureLoader = new THREE.TextureLoader()
let modelLoader =  new GLTFLoader();

const modelURLS = {
  house:'./assets/3d/house/scene.gltf',
  trees:'./assets/3d/trees/scene.gltf',
  brickApartment:'./assets/3d/brickApartment/scene.gltf'
}


for( let i = 0; i < 5 ; i++)    //HOUSE
{
  modelLoader.load('./assets/3d/house/scene.gltf',(gltf)=>{
    let r;
    const pos = {
      x : 80,
      y:-10,
      z:-1000 * i
    }
    if(i % 2 == 0){
      r = pos_to_neg(pos.x)
      pos.x = r
    } else {
      r = neg_to_pos(pos.x)
      pos.x = r
    }
    gltf.scene.children[0].position.set(pos.x ,pos.y, pos.z )
    gltf.scene.children[0].scale.x = gltf.scene.children[0].scale.y = gltf.scene.children[0].scale.z = 8
    HouseModels.push(gltf.scene.children[0])
    scene.add(gltf.scene.children[0])
    renderer.render(scene,camera)
    
  })
}

for( let i = 0; i < 10 ; i++)   // TREES
{
  modelLoader.load(modelURLS.trees,(gltf)=>{
    let r;
    gltf.scene.children[0].scale.x = gltf.scene.children[0].scale.y = gltf.scene.children[0].scale.z = 0.1
    const pos = {
      x:-45,
      y:-10,
      z:-933*i
    }
    if(i % 2 == 0){
      r = pos_to_neg(pos.x)
      pos.x = r
    } else {
      r = neg_to_pos(pos.x)
      pos.x = r
    }
    gltf.scene.children[0].position.set(pos.x,pos.y,pos.z )
    TreeModels.push(gltf.scene.children[0])
    scene.add(gltf.scene.children[0])
    renderer.render(scene,camera)
  })
}


// for( let i = 0; i < 3 ; i++)   // BrickApartment
// {
//   modelLoader.load(modelURLS.brickApartment,(gltf)=>{
//     console.log(gltf.scene.children[0])
//     // gltf.scene.children[0].scale.x = gltf.scene.children[0].scale.y = gltf.scene.children[0].scale.z = 0.004 
//     // gltf.scene.children[0].position.set(-5 ,-1, -3 * i )
//     // leftTreeModels.push(gltf.scene.children[0])
//     // scene.add(gltf.scene.children[0])
//     renderer.render(scene,camera)
//   })
// }


controls = new OrbitControls(camera, renderer.domElement);
  // controls.minDistance = 500;  
    controls.maxDistance = 500;
    controls.update()

  planes = [];


  //Main Road geometry
  let mainRoads = []
  for(let i = 0 ; i< 10 ; i++){
    let mainRoadGeometry = new THREE.PlaneBufferGeometry(250,100,1);
    mainRoadGeometry.rotateX(Math.PI * 1.5)
    textureLoader.load('./textures/grass.jpeg',(texture)=>{

      let materialMainRoadGeometry = new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide})
      let planeMainRoadGeometry = new THREE.Mesh(mainRoadGeometry,materialMainRoadGeometry)
      planeMainRoadGeometry.position.set(0,-11,200-i*100)
      scene.add(planeMainRoadGeometry)
      mainRoads.push(planeMainRoadGeometry)
    
    })
  }


  // ROAD GEOMETRY
  for (let i = 0; i < 10; i++) {
    geometry = new THREE.PlaneBufferGeometry(40,100,1)
    geometry.rotateX(Math.PI * 1.5)

      textureLoader.load('./textures/road.jpg',(texture)=>{
        // console.log(texture)
        material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide,map:texture}) //ROAD COLOR
        
        plane = new THREE.Mesh(geometry, material);
        plane.position.set(0, -10, 200 - i * 100);
        
        scene.add(plane);
        planes.push(plane);
      })
    
  }
  

clock = new THREE.Clock();
time = 0
delta = 0; // Road Delta
direction = new THREE.Vector3(0, 0, 1);// Road Direction
speed = 50; //units a second..Road Speed


const render = () => {
    requestAnimationFrame(render);
    
    delta = clock.getDelta();
    time += delta;
    planes.forEach(function(plane) {
        plane.position.addScaledVector(direction, speed * delta);
        if (plane.position.z > 100) plane.position.z =  ((plane.position.z - 650) % 700); // IF ROAD BREAKS CHANGE -650 to more negative value..
    });

   


    mainRoads.forEach((mainRoad)=>{
      mainRoad.position.addScaledVector(direction,speed*delta)
      if (mainRoad.position.z > 100) mainRoad.position.z =  ((mainRoad.position.z - 650) % 700);
    })


    HouseModels.forEach((HouseModel)=>{
      HouseModel.position.addScaledVector(direction,speed*delta)
      if (HouseModel.position.z > 1000 ) {
        HouseModel.position.z = -1000
      }
    })

    TreeModels.forEach((TreeModel)=>{
      TreeModel.position.addScaledVector(direction,(speed -10) * delta)
      if (TreeModel.position.z > 933){
        TreeModel.position.z = -933
      }
    })
    
    renderer.render(scene, camera);
  }
render();