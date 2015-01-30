/**
 * the earth demo
 * by Mofei(http://www.zhuwenlong.com/)
 * based on three.js (http://threejs.org/)
 */

var GLOBAL = {};

//new scence camera and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
camera.position.set(0, 0, 200);
camera.lookAt(scene.position);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


controls = new THREE.OrbitControls(camera, renderer.domElement);

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



//create a earth
var geometry = new THREE.SphereGeometry(GLOBAL.earthRadius = 100, 200, 200);
var earthTexture = new THREE.ImageUtils.loadTexture('img/Earth_Map.jpg');
// var earthTexture = new THREE.ImageUtils.loadTexture('img/world.jpg');
var earthMaterial = new THREE.MeshBasicMaterial({
    map: earthTexture
});
var earth = new THREE.Mesh(geometry, earthMaterial);
earth.position.set(0, 0, 0);
earth.rotateY((Math.PI / 180) * -90);

scene.add(earth);
////////////////////////
var earthGlowMaterial = new THREE.ShaderMaterial({
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
var earthGlow = new THREE.Mesh(geometry.clone(), earthGlowMaterial.clone());

earthGlow.position = earth.position;
earthGlow.scale.multiplyScalar(1.01);
scene.add(earthGlow);







var GOLBAL_Points = [];
//


var particleGroup;

/**
 * convert the lat and lon to the point on the erath
 **/
function latlonToPoint(lat, lon, radius) {
    var lonY = (lon / 90) * radius;
    var logRadius = Math.sqrt(Math.pow(radius, 2) - Math.pow(lonY, 2));
    var latRotation = (Math.PI / 180) * lat;

    var startX = logRadius * Math.sin(latRotation);
    var startY = lonY;
    var startZ = logRadius * Math.cos(latRotation);

    return new THREE.Vector3(startX, startY, startZ);
}

/**
 * create uniqueID
 */
var uniqueId = (function() {
    var count = 0;
    return function() {
        var timeStamp = +new Date();
        var countStr = count.toString();
        var temp = [countStr];
        for (var i = 0; i < 5 - countStr.length; i++) {
            temp.unshift('0');
        }
        // console.log(temp,'??');
        var id = timeStamp + temp.join('');
        count++;
        if (count >= 99999) {
            count = 0;
        }
        return id;
    }
})();

function addLine(obj) {
    var id = uniqueId();
    GLOBAL.line = GLOBAL.line || {};
    GLOBAL.line[id] = {};
    //get the point;
    var deep = 10;
    var deeplat = (obj.end[0] - obj.start[0]) / deep;
    var deeplon = (obj.end[1] - obj.start[1]) / deep;

    var points = [];
    // 
    for (var i = 0; i < deep; i++) {
        // latlonToPoint[]
        var lat = obj.start[0] + deeplat * i;
        var lon = obj.start[1] + deeplon * i;
        // console.log(lat, lon)
        var C = 1.1;

        points.push(latlonToPoint(lat, lon, GLOBAL.earthRadius * 1.05));
    }

    var curve = new THREE.SplineCurve3(points);

    //draw line
    var geometry = new THREE.Geometry();
    geometry.vertices = curve.getPoints(100);

    GLOBAL.line[id].info = GLOBAL.line[id].info || {};
    GLOBAL.line[id].info.vertices = geometry.vertices;

    //TODO REMOVE
    GOLBAL_Points.push(geometry.vertices);

    var material = new THREE.LineBasicMaterial({
        color: '#00ff00'
    });

    var curveObject = new THREE.Line(geometry, material);
    scene.add(curveObject);
    //


    //create a ball
    var ball = new THREE.SphereGeometry(5, 50, 50);
    var ballGlowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            "c": {
                type: "f",
                value: 0.0,
            },
            "p": {
                type: "f",
                value: 2.0
            },
            glowColor: {
                type: "c",
                value: new THREE.Color('green')
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



    var ballObject = new THREE.Mesh(ball.clone(), ballGlowMaterial.clone());
    particleGroup = new THREE.Object3D();
    particleGroup.add(ballObject);

    ballObject.verIndex = 0;
    ballObject.totalIndex = GLOBAL.line[id].info.vertices.length;
    ballObject.speed = obj.speed;
    GLOBAL.line[id].balls = GLOBAL.line[id].balls || [];
    GLOBAL.line[id].balls.push(ballObject);

    // console.log(id, GLOBAL.line[id].balls[0].verIndex, '@@@');
    scene.add(particleGroup);
    //
}

// var obj = {
//     start: [0, 10],
//     end: [40, -90],
//     speed: ''
// }

// addLine(obj);

// var obj = {
//     start: [-40, 10],
//     end: [80, -90],
//     speed: ''
// }

// addLine(obj);

for (var i = 0; i < 5; i++) {

    var obj = {
            start: [parseInt(Math.random() * 360 - 180), parseInt(Math.random() * 180 - 90)],
            end: [parseInt(Math.random() * 360 - 180), parseInt(Math.random() * 180 - 90)],
            speed: parseInt(Math.random() * 4000) + 2000
        }
        // console.log(obj);
    addLine(obj);
}

// console.log(GLOBAL.line);

//readin the sence


// var theindex = 0;
var clock = new THREE.Clock(true);
clock.start();

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
    readenBall();
    earthGlow.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, earthGlow.position);
}
render();


// var lastTime = +new Date();


// console.log('XXXXX', lastTime)

function readenBall() {
    // var now = +new Date();
    // var time = now - lastTime||now;
    // console.log();
    // lastTime = now;

    // var speed = parseInt(theindex / 3);
    // return false;
    var timePass = clock.getDelta();
    for (var i in GLOBAL.line) {
        // console.log(GLOBAL.line[i].info.vertices.length);
        var line = GLOBAL.line[i];
        var balls = line.balls;
        var ballsLen = balls.length;
        for (var j = 0; j < ballsLen; j++) {
            var ball = balls[0];
            // console.log(ball.speed);
            var step = ball.totalIndex / ball.speed;
            ball.verIndex += timePass * 1000 * step;
            // console.log(ballIndex, ball.totalIndex,ballIndex >= ball.totalIndex);
            var ballIndex = parseInt(ball.verIndex);
            // console.log(ballIndex, ball.totalIndex,ballIndex >= ball.totalIndex);‘
            console.log(ballIndex, ball.totalIndex);
            var vertext = line.info.vertices[ballIndex];
            if (vertext) {
                ball.position.x = vertext.x;
                ball.position.y = vertext.y;
                ball.position.z = vertext.z;
            }

            ball.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, ball.position);
            // console.log(line.info.vertices[ball.verIndex]);
            // console.log(balls[0].verIndex++)

            if (ballIndex >= ball.totalIndex - 1) {
                // console.log('XXXXXXX')
                ball.verIndex = 0;
            }
        }

    }

    // particleGroup
    // console.log(theindex);

    // for (var c = 0; c < particleGroup.children.length; c++) {
    //     theindex++;
    //     var sprite = particleGroup.children[c];
    //     sprite.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, sprite.position);
    //     if (speed >= GOLBAL_Points[0].length - 1) {
    //         theindex = 0;
    //     };
    //     sprite.position.x = GOLBAL_Points[0][speed].x;
    //     sprite.position.y = GOLBAL_Points[0][speed].y;
    //     sprite.position.z = GOLBAL_Points[0][speed].z;
    // }
}
