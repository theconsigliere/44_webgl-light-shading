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
  ambientColor: "#ffffff",
  ambientIntensity: 0.0,
  directionalLightPosition: new THREE.Vector3(0, 0, 3),
  dirLightColour: "#554fab",
  pointLightPosition: new THREE.Vector3(0, 3, 0),
  pointLightColour: "#f25050",
  pointLightDecay: 0.25,
}

const material = new THREE.ShaderMaterial({
  vertexShader: shadingVertexShader,
  fragmentShader: shadingFragmentShader,
  uniforms: {
    uColor: new THREE.Uniform(new THREE.Color(config.ambientColor)),
    uIntensity: new THREE.Uniform(config.ambientIntensity),
    uDirLightPosition: new THREE.Uniform(config.directionalLightPosition),
    uDirLightColour: new THREE.Uniform(new THREE.Color(config.dirLightColour)),
    uPointLightPosition: new THREE.Uniform(config.pointLightPosition),
    uPointLightColour: new THREE.Uniform(
      new THREE.Color(config.pointLightColour)
    ),
    uPointLightDecay: new THREE.Uniform(config.pointLightDecay),
  },
})

const AmbientFolder = gui.addFolder("Ambient Light")

AmbientFolder.addColor(config, "ambientColor").onChange(() => {
  material.uniforms.uColor.value.set(config.ambientColor)
})

AmbientFolder.add(config, "ambientIntensity")
  .min(0)
  .max(1)
  .step(0.01)
  .onChange(() => {
    material.uniforms.uIntensity.value = config.ambientIntensity
  })

const dirLightFolder = gui.addFolder("Directional Light")

dirLightFolder
  .addColor(config, "dirLightColour")
  .name("Colour")
  .onChange(() => {
    material.uniforms.uDirLightColour.value.set(config.dirLightColour)
    directionalLightHelper.material.color.set(config.dirLightColour)
  })

dirLightFolder
  .add(config.directionalLightPosition, "x")
  .min(-10)
  .max(10)
  .step(0.01)
  .name("x")
  .onChange(() => {
    material.uniforms.uDirLightPosition.value.x =
      config.directionalLightPosition.x
    directionalLightHelper.position.x = config.directionalLightPosition.x
  }).add

dirLightFolder
  .add(config.directionalLightPosition, "y")
  .min(-10)
  .max(10)
  .step(0.01)
  .name("y")
  .onChange(() => {
    material.uniforms.uDirLightPosition.value.y =
      config.directionalLightPosition.y
    directionalLightHelper.position.y = config.directionalLightPosition.y
  })

dirLightFolder
  .add(config.directionalLightPosition, "z")
  .min(-10)
  .max(10)
  .step(0.01)
  .name("z")
  .onChange(() => {
    material.uniforms.uDirLightPosition.value.z =
      config.directionalLightPosition.z
    directionalLightHelper.position.z = config.directionalLightPosition.z
  })

const PointFolder = gui.addFolder("Point Light")

PointFolder.addColor(config, "pointLightColour")
  .name("Colour")
  .onChange(() => {
    material.uniforms.uPointLightColour.value.set(config.pointLightColour)
    pointLightHelper.material.color.set(config.pointLightColour)
  })

PointFolder.add(config.pointLightPosition, "x")
  .min(-10)
  .max(10)
  .step(0.01)
  .name("x")
  .onChange(() => {
    material.uniforms.uPointLightPosition.value.x = config.pointLightPosition.x
    pointLightHelper.position.x = config.pointLightPosition.x
  })

PointFolder.add(config.pointLightPosition, "y")
  .min(-10)
  .max(10)
  .step(0.01)
  .name("y")
  .onChange(() => {
    material.uniforms.uPointLightPosition.value.y = config.pointLightPosition.y
    pointLightHelper.position.y = config.pointLightPosition.y
  })

PointFolder.add(config.pointLightPosition, "z")
  .min(-10)
  .max(10)
  .step(0.01)
  .name("z")
  .onChange(() => {
    material.uniforms.uPointLightPosition.value.z = config.pointLightPosition.z
    pointLightHelper.position.z = config.pointLightPosition.z
  })

PointFolder.add(config, "pointLightDecay")
  .min(0)
  .max(1)
  .step(0.01)
  .name("Decay")
  .onChange(() => {
    material.uniforms.uPointLightDecay.value = config.pointLightDecay
  })

/**
 * Light helpers
 */
const directionalLightHelper = new THREE.Mesh(
  new THREE.PlaneGeometry(),
  new THREE.MeshBasicMaterial()
)

directionalLightHelper.material.color = new THREE.Color(config.dirLightColour)
directionalLightHelper.material.side = THREE.DoubleSide
directionalLightHelper.position.set(
  config.directionalLightPosition.x,
  config.directionalLightPosition.y,
  config.directionalLightPosition.z
)

scene.add(directionalLightHelper)

const pointLightHelper = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.1, 2),
  new THREE.MeshBasicMaterial()
)

pointLightHelper.material.color = new THREE.Color(config.pointLightColour)
pointLightHelper.material.side = THREE.DoubleSide
pointLightHelper.position.set(
  config.pointLightPosition.x,
  config.pointLightPosition.y,
  config.pointLightPosition.z
)

scene.add(pointLightHelper)

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
