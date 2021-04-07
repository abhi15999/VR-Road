import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from '../helperScripts/OrbitControls';
import {SkyGeometry,TreesGeometry} from "../helperScripts/RollerCoaster"

//Globals
let parent,tubeGeometry, mesh,container
let camera,scene,renderer,splineCamera,cameraEye,cameraHelper

const direction = new THREE.Vector3();
const binormal = new THREE.Vector3();
const normal = new THREE.Vector3();
const position = new THREE.Vector3();
const lookAt = new THREE.Vector3();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Spline
const sampleClosedSpline = new THREE.CatmullRomCurve3( [
    new THREE.Vector3( 0, - 40, - 40 ),
    new THREE.Vector3( 0, 30, - 40 ),
    new THREE.Vector3( 0, 140, - 40 ),
    new THREE.Vector3( 0, 40, 40 ),
    new THREE.Vector3( 0, - 40, 40 )
] );

sampleClosedSpline.curveType = 'catmullrom';
sampleClosedSpline.closed = true;
const spline = sampleClosedSpline;


//Textures
const loader = new THREE.TextureLoader()
const texture = loader.load('/r.jpg')





// Debug
let gui = new dat.GUI()

let material = new THREE.MeshLambertMaterial({
    color:  'gray',map:texture
})
let wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.3, wireframe: true, transparent: true } );


//ADD TUBE FUNCTION
function addTube () {
    if(mesh !== undefined){
        parent.remove(mesh)
        mesh.geometry.dispose()
    }

    const extrudePath = spline;
    tubeGeometry = new THREE.TubeGeometry(extrudePath,100,2,3,false)

    addGeometry(tubeGeometry)
    setScale();

}



//SCALE FUNCTION
function setScale (){
    mesh.scale.set(4,4,4)
}


//GEOMETRY FUNCTION
function addGeometry (geometry) {
    mesh = new THREE.Mesh(geometry,material);
    const wireframe = new THREE.Mesh(geometry,wireframeMaterial)
    mesh.add(wireframe)
    parent.add(mesh)
}


//CAMERA ANIMATE
function animateCamera() {

    cameraHelper.visible = false;
    cameraEye.visible = false;

}


function init () {
    
    container = document.getElementById( 'container' );
    camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.01, 10000)
    camera.position.set( 0, 50, 500 );
    

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );

    const light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 0, 1 );
    scene.add( light );

    parent = new THREE.Object3D();
    scene.add( parent );


    splineCamera = new THREE.PerspectiveCamera( 84, sizes.width / sizes.height, 0.01, 1000 );
    parent.add( splineCamera );

    cameraHelper = new THREE.CameraHelper( splineCamera );
    scene.add( cameraHelper );


    addTube()

    cameraEye = new THREE.Mesh( new THREE.SphereGeometry( 5 ), new THREE.MeshBasicMaterial( { color: 0xdddddd } ) );
    parent.add( cameraEye );
    cameraHelper.visible = false;
    cameraEye.visible = false;

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );



    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 100;
    controls.maxDistance = 2000;
    controls.update()


    // renderer.render( scene, camera );

}


//ANIMATE


function animate () {
    requestAnimationFrame( animate );

    render();
}



function render () {
    // position = new THREE.Vector3();
    const time = Date.now();
    const looptime = 40 * 10000;
    const t = ( time % looptime ) / looptime;

    tubeGeometry.parameters.path.getPointAt( t, position );
    position.multiplyScalar(4)

    const segments = tubeGeometry.tangents.length;
    const pickt = t * segments;
    const pick = Math.floor( pickt );
    const pickNext = ( pick + 1 ) % segments;

    binormal.subVectors( tubeGeometry.binormals[ pickNext ], tubeGeometry.binormals[ pick ] );
    binormal.multiplyScalar( pickt - pick ).add( tubeGeometry.binormals[ pick ] );

    tubeGeometry.parameters.path.getTangentAt( t, direction );
    const offset = 15;
    normal.copy( binormal ).cross( direction );

    position.add( normal.clone().multiplyScalar( offset ) );
    splineCamera.position.copy( position );
    cameraEye.position.copy( position );

    tubeGeometry.parameters.path.getPointAt( ( t + 30 / tubeGeometry.parameters.path.getLength() ) % 1, lookAt );
    lookAt.multiplyScalar( 4 );

    splineCamera.matrix.lookAt( splineCamera.position, lookAt, normal );
    splineCamera.quaternion.setFromRotationMatrix( splineCamera.matrix );
    cameraHelper.update()

    renderer.render( scene, splineCamera );

}


init()
animate()
