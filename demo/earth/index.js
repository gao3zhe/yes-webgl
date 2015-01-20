/**
 * the earth demo
 * by Mofei(http://www.zhuwenlong.com/)
 * based on three.js (http://threejs.org/)
 */

//new scence camera and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
camera.position.set(0, 150, 200);
camera.lookAt(scene.position);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


controls = new THREE.OrbitControls(camera, renderer.domElement);
// LIGHT
// var light = new THREE.PointLight(0xffffff);
// light.position.set(0, 150, 100);
// scene.add(light);

// var light2 = new THREE.AmbientLight(0x444444);
// scene.add(light2);

// SKYBOX
var skyBoxGeometry = new THREE.SphereGeometry(5000, 200, 200);
skyBoxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
var skyBoxTexture = new THREE.ImageUtils.loadTexture('img/sky.jpg');
skyBoxTexture.magFilter = THREE.NearestFilter;
skyBoxTexture.mapping = THREE.SphericalReflectionMapping;
skyBoxTexture.wrapS = THREE.RepeatWrapping;
skyBoxTexture.wrapT = THREE.RepeatWrapping;
var skyBoxMaterial = new THREE.MeshBasicMaterial({
    map: skyBoxTexture,
    side: THREE.BackSide
});
var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
// scene.add(skyBox);



//*********

var Shaders = {
    // 'earth': {
    //     uniforms: {
    //         'texture': {
    //             type: 't',
    //             value: null
    //         }
    //     },
    //     vertexShader: [
    //         'varying vec3 vNormal;',
    //         'varying vec2 vUv;',
    //         'void main() {',
    //         'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    //         'vNormal = normalize( normalMatrix * normal );',
    //         'vUv = uv;',
    //         '}'
    //     ].join('\n'),
    //     fragmentShader: [
    //         'uniform sampler2D texture;',
    //         'varying vec3 vNormal;',
    //         'varying vec2 vUv;',
    //         'void main() {',
    //         'vec3 diffuse = texture2D( texture, vUv ).xyz;',
    //         'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
    //         'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
    //         'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
    //         '}'
    //     ].join('\n')
    // },
    'atmosphere': {
        uniforms: {},
        vertexShader: [
            'varying vec3 vNormal;',
            'void main() {',
            'vNormal = normalize( normalMatrix * normal );',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}'
        ].join('\n'),
        fragmentShader: [
            'varying vec3 vNormal;',
            'void main() {',
            'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
            'gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;',
            '}'
        ].join('\n')
    }
};

var geometry = new THREE.SphereGeometry(100, 40, 30);

shader = Shaders['atmosphere'];
uniforms = THREE.UniformsUtils.clone(shader.uniforms);

material = new THREE.ShaderMaterial({

    uniforms: uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true

});

mesh = new THREE.Mesh(geometry, material);
mesh.scale.set(1.2, 1.2, 1.2);
// scene.add(mesh);
//*********

// var imagePrefix = "img/universe.jpg";
// var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
// var skyGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
// var materialArray = [];
// for (var i = 0; i < 6; i++)
//     materialArray.push(new THREE.MeshBasicMaterial({
//         map: THREE.ImageUtils.loadTexture(imagePrefix),
//         side: THREE.BackSide
//     }));
// var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
// var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
// scene.add(skyBox);





//create a earth
var geometry = new THREE.SphereGeometry(100, 200, 200);
var earthTexture = new THREE.ImageUtils.loadTexture('img/Earth_Map.jpg');
// var earthTexture = new THREE.ImageUtils.loadTexture('img/world.jpg');
var earthMaterial = new THREE.MeshBasicMaterial({
    map: earthTexture
});
var earth = new THREE.Mesh(geometry, earthMaterial);
earth.position.set(0, 0, 0);
scene.add(earth);
////////////////////////
var customMaterial = new THREE.ShaderMaterial({
    uniforms: {
        "c": {
            type: "f",
            value: 1.0
        },
        "p": {
            type: "f",
            value: 1.4
        },
        glowColor: {
            type: "c",
            value: new THREE.Color('#ffffff')
        },
        viewVector: {
            type: "v3",
            value: camera.position
        }
    },
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true
});
var earthGlow = new THREE.Mesh(geometry.clone(), customMaterial.clone());

earthGlow.position = earth.position;
earthGlow.scale.multiplyScalar(1.1);
scene.add(earthGlow);

//*************
var particleTexture = THREE.ImageUtils.loadTexture('img/spark.png');
particleGroup = new THREE.Object3D();
particleAttributes = {
    startSize: [],
    startPosition: [],
    randomness: []
};

var totalParticles = 40;
var radiusRange = 50;

var x = -100,
    y = 0,
    z = 0;
for (var i = 0; i < totalParticles; i++) {
    var spriteMaterial = new THREE.SpriteMaterial({
        map: particleTexture,
        useScreenCoordinates: false,
        color: 0xffffff
    });

    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(20, 20, 1.0); // imageWidth, imageHeight
    sprite.position.set(x += 5, 0, 0);
    // for a cube:
    // sprite.position.multiplyScalar( radiusRange );
    // for a solid sphere:
    // sprite.position.setLength( radiusRange * Math.random() );
    // for a spherical shell:
    // sprite.position.setLength(radiusRange * (Math.random() * 0.1 + 0.9));

    // sprite.color.setRGB( Math.random(),  Math.random(),  Math.random() ); 
    sprite.material.color.setHSL(Math.random(), 0.9, 0.7);
    // sprite.material.color.setHSL(0.3, 0.7, 0.9);

    // sprite.opacity = 0.80; // translucent particles
    sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles


    particleGroup.add(sprite);
    // add variable qualities to arrays, if they need to be accessed later
    particleAttributes.startPosition.push(sprite.position.clone());
    particleAttributes.randomness.push(Math.random());
}
// particleGroup.position.y = 0;
scene.add(particleGroup);
//*************






//readin the sence
var clock = new THREE.Clock();

function render() {
    for (var c = 0; c < particleGroup.children.length; c++) {
        var sprite = particleGroup.children[c];

        particleAttributes.startPosition[c].x += (1 + Math.random() * 2);
        if (particleAttributes.startPosition[c].x > 200) {
            particleAttributes.startPosition[c].x = 100;
        }
        // particleAttributes.startPosition[c].y
        // particleAttributes.startPosition[c].z

        sprite.position.x = particleAttributes.startPosition[c].x;
        sprite.position.y = particleAttributes.startPosition[c].y;
        sprite.position.z = particleAttributes.startPosition[c].z;
    }
    // console.log(clock.getElapsedTime());
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
    earthGlow.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, earthGlow.position);
}
render();
