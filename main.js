import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
   
// シーン、カメラ、レンダラーの設定
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc9d9e7);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();

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

// 3Dモデルの読み込み
async function loadModel() {
    // Luma Genie APIを使ってモデルを取得
    // const response = await fetch('https://api.luma.genie/v1/models/your-model-id'); // ここにAPIのURLを入力
    // const modelData = await response.json();

    // // モデルデータがThree.js形式であることを前提に、読み込む
    // const loader = new THREE.ObjectLoader();
    // const model = loader.parse(modelData);
    // scene.add(model);
    loader.load( './public/sun_flower_10.glb', function ( gltf ) {

        scene.add( gltf.scene );
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );
}

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// モデルをロードしてアニメーション開始
loadModel().then(animate);

// ウィンドウリサイズ時にレンダラーとカメラを調整
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});