import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.TorusGeometry(15, 3, 3, 8);
const material = new THREE.MeshStandardMaterial({
  color: 0x696969,
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff, 100);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

const addStar = () => {
  const geometry = new THREE.SphereGeometry(0.25, 6, 4);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  const sphere = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  sphere.position.set(x, y, z);

  scene.add(sphere);
};

Array(200).fill().forEach(addStar);

const loader = new THREE.CubeTextureLoader();
loader.setPath("./src/textures/");

const textureCube = loader.load([
  "skyboxRight.jpg",
  "skyboxLeft.jpg",
  "skyboxUp.jpg",
  "skyboxDown.jpg",
  "skyboxBack.jpg",
  "skyboxFront.jpg",
]);

scene.background = textureCube;

const animate = () => {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  controls.update();
  renderer.render(scene, camera);
};

animate();
