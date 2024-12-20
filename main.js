import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Plantクラスを定義
function Plant(plantId = 1, growStage = 10) {
    this.plantId = plantId;
    this.growStage = growStage;
    this.waterLevel = 0;
    this.lastWatered = Date.now();
    this.initPlant = function () {
        let queryParams = new URLSearchParams(window.location.search);
        let plantId = queryParams.get('plant_id');
        let growStage = queryParams.get('grow_stage');
        this.plantId = plantId ? parseInt(plantId) : 1;
        this.growStage = growStage ? parseInt(growStage) : 10;
    }
    this.loader = new GLTFLoader();
    this.loadModel = async function (scene) {
        const dataPath = `./public/${this.plantId}/${this.growStage}.glb`;
        return new Promise((resolve, reject) => {
            this.loader.load(dataPath, (gltf) => {
                this.model = gltf.scene;
                scene.add(this.model);
                resolve(this.model);
            }, undefined, (error) => {
                console.error(error);
                reject(error);
            });
        });
    }
    this.waterPlant = function () {
        this.waterLevel += 1;
        this.lastWatered = Date.now();
    }
    this.updateGrowth = function () {
        const now = Date.now();
        const timeSinceLastWatered = (now - this.lastWatered) / 1000; // in seconds

        if (timeSinceLastWatered > 30) {
            this.waterLevel -= 1; // 30秒以上経過していたら水を減らす
        }

        if (this.waterLevel > 5) {
            this.growStage += 1; // 水あげていると成長する
            this.waterLevel = 0; // 水の量リセット
        } else if (this.waterLevel < 0) {
            this.growStage -= 1; // 水をあげていないと成長が止まる
            this.waterLevel = 0; // 水の量リセット
        }

        // 成長ステージの最小値を1に設定
        this.growStage = Math.max(1, this.growStage);
    }
}

// シーン、カメラ、レンダラーの設定
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc9d9e7);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 照明を追加
const ambientLight = new THREE.AmbientLight(0xffffff, 3); // 環境光
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(ambientLight);
scene.add(directionalLight);

// カメラの位置を設定
camera.position.set(1, 1, -1);

// モデルを回転させるためのOrbitControlsを追加
const controls = new OrbitControls(camera, renderer.domElement);

// Plantオブジェクトを作成
const plant = new Plant();
plant.initPlant();

// 3Dモデルの読み込み
async function initializeModel() {
    await plant.loadModel(scene);
    animate();
}

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    plant.updateGrowth();
}

// モデルをロードしてアニメーション開始
initializeModel();

// ウィンドウリサイズ時にレンダラーとカメラを調整
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 定期的に水をあげる
setInterval(() => {
    plant.waterPlant();
}, 10000); // Water the plant every 10 seconds

