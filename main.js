import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Torus
const geometry = new THREE.TorusGeometry(16, 2, 8, 6);
const material = new THREE.MeshStandardMaterial({
  color: 0x696969,
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Lights
const pointLight = new THREE.PointLight(0xffffff, 500);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.03);
scene.add(ambientLight);

// Paths
const texturesPath = "./src/textures/";
const normalMapPath = "./src/normalMaps/";

// Avatar
const avatarTextureLoader = new THREE.TextureLoader();
avatarTextureLoader.setPath(texturesPath);

const avatarTexture = avatarTextureLoader.load("avatar.jpg");

const avatarCube = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: avatarTexture })
);
avatarCube.position.set(3, 0, 0);
let avatarCubeMove = 0.003; // move speed for up and down movement of an avatarCube

scene.add(avatarCube);

// Planet
const planetTextureLoader = new THREE.TextureLoader();
planetTextureLoader.setPath(texturesPath);
const planetNormalMapLoader = new THREE.TextureLoader();
planetNormalMapLoader.setPath(normalMapPath);

const planetTexture = planetTextureLoader.load("planetTexture.jpg");
const planetNormalMap = planetNormalMapLoader.load("planetNormalMap.jpg");

const planet = new THREE.Mesh(
  new THREE.SphereGeometry(15, 32, 32),
  new THREE.MeshStandardMaterial({
    map: planetTexture,
    normalMap: planetNormalMap,
  })
);
planet.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), 15);
planet.position.x += 30;
planet.position.y -= 25;
planet.position.z += 25;

scene.add(planet);

// Stars
const addStar = () => {
  const geometry = new THREE.BoxGeometry(0.35, 0.35, 0.35);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  const sphere = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(150));
  sphere.position.set(x, y, z);

  scene.add(sphere);
};

Array(200).fill().forEach(addStar);

// SkyBox
const loader = new THREE.TextureLoader();
loader.setPath(texturesPath);
const texture = loader.load("skyBox.jpg", () => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  scene.background = texture;
});

// Scroll handling
const moveOnScroll = (e) => {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;

  avatarCube.rotateY(-0.01);
  avatarCube.position.x = 3 - scrollTop * 0.0005;

  planet.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.0006);

  camera.position.set(
    // From the center
    scrollTop * 0.004,
    scrollTop * -0.004,
    10 + scrollTop * 0.01

    // // To the center
    // 22.192 - scrollTop * 0.004,
    // -22.192 - scrollTop * -0.004,
    // 65.5 - scrollTop * 0.01
  );
  controls.update();
};

const animate = () => {
  requestAnimationFrame(animate);

  // Planet rotation
  planet.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.0002);

  // avatarCube rotation and movement
  avatarCube.rotateY(0.001);
  if (avatarCube.position.y >= 2 || avatarCube.position.y <= -2) {
    avatarCubeMove *= -1;
  }
  avatarCube.position.y += avatarCubeMove;

  torus.rotation.x += 0.001;
  torus.rotation.y += 0.0005;
  torus.rotation.z += 0.001;

  renderer.render(scene, camera);
};

document.addEventListener("scroll", moveOnScroll);
animate();
