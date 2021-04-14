import * as THREE from "../node_modules/three/build/three.module.js"
//Scene,Fog,PerspectiveCamera,WebGLRenderer,AmbientLight,TextureLoader,PlaneBufferGeometry,MeshBasicMaterial,Mesh,Clock,Vector3
import {OrbitControls} from '../helperScripts/OrbitControls.js'
import {GLTFLoader} from '../helperScripts/GLTFLoader.js'
import {VRButton} from '../helperScripts/VRButton.js'
import {NightMode} from '../helperScripts/NightMode.js'


let scene, camera, renderer,controls, planes,geometry,material,plane
let clock,time,delta,direction,speed
let HouseModels = []
let TreeModels = []


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
document.body.appendChild( VRButton.createButton( renderer ) );
document.body.appendChild( NightMode.createButton( renderer) );
document.body.appendChild( NightMode.createNaturemuteButton() );





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
  trees:'./assets/3d/trees/scene.gltf'
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