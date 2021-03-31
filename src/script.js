import './style.css'
import * as THREE from 'three'
import * as SimplexNoise from 'simplex-noise'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


//Textures
const loader = new THREE.TextureLoader()
const height = loader.load('height.png')
const texture = loader.load('/r.jpg')
const alpha = loader.load('/alpha.png')


let xZoom = 2
let yZoom = 200
let noiseStrength = 1.5
let simplex = new SimplexNoise();

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.PlaneGeometry(innerWidth,2,120,120);

// Materials
const material = new THREE.MeshStandardMaterial({
    color:'gray',
    map:texture
})

const plane = new THREE.Mesh(geometry,material)
plane.castShadow = true;
plane.receiveShadow = true;
plane.rotation.x = 168.5
plane.rotation.z = 435



scene.add(plane)

// gui.add(plane.rotation, 'x').min(0).max(600)
// gui.add(plane.rotation, 'y').min(0).max(600)
gui.add(plane.rotation, 'z').min(0).max(600)



// Mesh


// Lights

const pointLight = new THREE.PointLight(0xffffff, 2)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 2
camera.position.z = 3
gui.add(camera.position,'x')
gui.add(camera.position,'y')
gui.add(camera.position,'z')

scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{
    let offset = Date.now() * 0.0004;
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime
    // plane.rotation.z = elapsedTime 
    // Update Orbital Controls
    // controls.update()
    window.requestAnimationFrame(tick)

    // adjustVertices(offset)
    adjustCameraPos(offset);

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
}

function adjustCameraPos(offset) {  
    let x = camera.position.x / xZoom;
    let y = camera.position.y / yZoom;
    let noise = simplex.noise2D(x, y + offset) * noiseStrength + 1; 
    camera.position.z = noise;
  }

  // function adjustVertices(offset) {
  //   for (let i = 0; i < plane.geometry.vertices.length; i++) {
  //     let vertex = plane.geometry.vertices[i];
  //     let x = vertex.x / xZoom;
  //     let y = vertex.y / yZoom;
  //     let noise = simplex.noise2D(x, y + offset) * noiseStrength; 
  //     vertex.z = noise;
  //   }
  //   geometry.verticesNeedUpdate = true;
  //   geometry.computeVertexNormals();
  // }

tick()
