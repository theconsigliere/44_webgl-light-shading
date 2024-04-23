import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import GUI from "lil-gui"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import shadingVertexShader from "./shaders/shading/vertex.glsl"
import shadingFragmentShader from "./shaders/shading/fragment.glsl"

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// Loaders
const gltfLoader = new GLTFLoader()

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 7
camera.position.y = 7
camera.position.z = 7
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 3
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/**
 * Material
 */
const config = {
  color: "#ffffff",
  intensity: 0.2,
}

const material = new THREE.ShaderMaterial({
  vertexShader: shadingVertexShader,
  fragmentShader: shadingFragmentShader,
  uniforms: {
    uColor: new THREE.Uniform(new THREE.Color(config.color)),
    uIntensity: new THREE.Uniform(config.intensity),
  },
})

gui.addColor(config, "color").onChange(() => {
  material.uniforms.uColor.value.set(config.color)
})

gui
  .add(config, "intensity")
  .min(0)
  .max(1)
  .step(0.01)
  .onChange(() => {
    material.uniforms.uIntensity.value = config.intensity
  })

/**
 * Objects
 */
// Torus knot
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
  material
)
torusKnot.position.x = 3
scene.add(torusKnot)

// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(), material)
sphere.position.set(-3, 0, 0)
scene.add(sphere)

// Suzanne
let suzanne = null
// gltfLoader.load(
//     './suzanne.glb',
//     (gltf) =>
//     {
//         suzanne = gltf.scene
//         suzanne.traverse((child) =>
//         {
//             if(child.isMesh)
//                 child.material = material
//         })
//         scene.add(suzanne)
//     }
// )

let mxkLogo = null
gltfLoader.load("./mxk-logo.glb", (gltf) => {
  mxkLogo = gltf.scene

  mxkLogo.traverse((child) => {
    console.log(child)
    if (child.isMesh) child.material = material
  })

  mxkLogo.scale.set(0.35, 0.35, 0.35)
  //   mxkLogo.rotation.set(Math.PI / 2, 0, 0)
  mxkLogo.position.set(0, 0, 0)

  //   mxkLogo.rotation.x = Math.PI / 2
  scene.add(mxkLogo)
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Rotate objects
  if (suzanne) {
    suzanne.rotation.x = -elapsedTime * 0.1
    suzanne.rotation.y = elapsedTime * 0.2
  }

  if (mxkLogo) {
    mxkLogo.rotation.z = -elapsedTime * 0.1
    mxkLogo.rotation.x = elapsedTime * 0.01
  }

  sphere.rotation.x = -elapsedTime * 0.1
  sphere.rotation.z = elapsedTime * 0.2

  torusKnot.rotation.x = -elapsedTime * 0.1
  torusKnot.rotation.y = elapsedTime * 0.2

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
