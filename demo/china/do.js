var earthGL = document.getElementById('earth');

var scene = new THREE.Scene();

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);


var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20000);
camera.position.z = 1200;
camera.position.y = 00;

var rotating = new THREE.Object3D();
scene.add(rotating);

//
var earthGeometry = new THREE.SphereGeometry(600, 100, 100);
var earthMaterial = new THREE.MeshBasicMaterial({
	map:THREE.ImageUtils.loadTexture('earth2.jpg'),
	specularMap:THREE.ImageUtils.loadTexture('earth_spec.jpg')
	// lightMap: THREE.ImageUtils.loadTexture('earth_bump.jpg')
});
console.log(earthMaterial.bumpMap)
// earthMaterial.map = 
// earthMaterial.bumpMap = THREE.ImageUtils.loadTexture('earth_bump.jpg');
// earthMaterial.bumpMap =
// earthMaterial.bumpScale = 0.05;
var earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.rotation.x = Math.PI;
earth.rotation.y = -Math.PI / 2;
earth.rotation.z = Math.PI;

rotating.add(earth);



earthGL.appendChild(renderer.domElement);


var render = function() {
    renderer.clear();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
};

render();
