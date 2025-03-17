import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const isProduction = import.meta.env.PROD;
const scene = new THREE.Scene();
initWorld();

const container = document.getElementById( 'container' );
const camera = new THREE.PerspectiveCamera(70, 1, 1, 1000);
camera.position.set(-1.4028079450698143, 0.2287497181721581, 0.2642033983225704);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setAnimationLoop(animate);
setSizes();
container.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);

let directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(-10, 0, 10);
scene.add(directionalLight);
directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);
directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(10, 0, 10);
scene.add(directionalLight);

const controls = new OrbitControls( camera, renderer.domElement );
controls.autoRotateSpeed = 0.2;
controls.enableZoom = false; // This doesn't work on mobiles
controls.maxZoom = 4;
controls.minZoom = 1;
controls.touches.TWO = controls.touches.ONE;
controls.autoRotate = true;
controls.update();

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(isProduction
	? 'https://table-360.ru/wp-content/uploads/2025/03/3D/jsm/libs/draco/'
	: 'jsm/libs/draco/');
dracoLoader.setDecoderConfig({ type: 'js' });
loader.setDRACOLoader(dracoLoader);

loader.load(isProduction
	? 'https://table-360.ru/wp-content/uploads/2025/03/ПС.600.Фото.glb'
	: 'ПС.600.Фото.glb', function (object) {
	const model = object.scene;
	model.position.set(-1.22, -1.22, -1.22);
	scene.add(model);
}, undefined, function ( error ) {
	console.error( error );
} );
	
window.onresize = () => setSizes();

function setSizes() {
	const width = container.clientWidth;
	const height = Math.max(width / 2.5, window.screen.height / 2);
	camera.aspect = width / height;
	camera.zoom = window.screen.height / window.screen.width > 1.5 ? 2.8 : 4;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
}

function initWorld() {
    const sphere = new THREE.SphereGeometry(1, 64, 64);
    sphere.scale(-1, 1, 1);

    const texture = new THREE.Texture();
    const material = new THREE.MeshBasicMaterial({
        map: texture
    });

	const imageLoader = new THREE.ImageLoader();
	imageLoader.load(isProduction
		? 'https://table-360.ru/wp-content/uploads/2025/03/background.webp'
		: 'background.webp', (image) => {
        texture.image = image;
        texture.needsUpdate = true;
    });

	const mesh = new THREE.Mesh(sphere, material);
    scene.add(mesh);
}

function animate() {
	camera.lookAt(scene.position);
	renderer.render(scene, camera);
	controls.update();
}
