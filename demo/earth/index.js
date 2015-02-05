/**
 * the earth demo
 * by Mofei(http://www.zhuwenlong.com/)
 * based on three.js (http://threejs.org/)
 */

var GLOBAL = {};

//new scence camera and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
camera.position.set(100, 85, -40);
camera.lookAt(scene.position);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


controls = new THREE.OrbitControls(camera, renderer.domElement);

// SKYBOX
// var skyBoxGeometry = new THREE.SphereGeometry(5000, 200, 200);
// skyBoxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
// var skyBoxTexture = new THREE.ImageUtils.loadTexture('img/sky.jpg');
// skyBoxTexture.magFilter = THREE.NearestFilter;
// skyBoxTexture.mapping = THREE.SphericalReflectionMapping;
// skyBoxTexture.wrapS = THREE.RepeatWrapping;
// skyBoxTexture.wrapT = THREE.RepeatWrapping;
// var skyBoxMaterial = new THREE.MeshBasicMaterial({
//     map: skyBoxTexture,
//     side: THREE.BackSide
// });
// var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
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
    // var lonY = (lon / 90) * radius;
    var lonY = Math.sin(lon * Math.PI / 180) * radius;
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


var ball = new THREE.SphereGeometry(0.5, 30, 30);

function addLine(obj) {
    var id = uniqueId();
    GLOBAL.line = GLOBAL.line || {};
    GLOBAL.line[id] = {};
    //get the point;
    var deep = 10;

    //TODO FIXELAT
    var deeplat = (obj.end[0] - obj.start[0]) / deep;

    var deeplon = (obj.end[1] - obj.start[1]) / deep;

    var points = [];
    // 
    for (var i = 0; i < deep; i++) {
        var lat = obj.start[0] + deeplat * i;
        var lon = obj.start[1] + deeplon * i;
        var C = 1.1;

        points.push(latlonToPoint(lat, lon, GLOBAL.earthRadius * 1.05));
    }

    var curve = new THREE.SplineCurve3(points);

    //draw line
    var linesGeo = new THREE.Geometry();
    linesGeo.vertices = curve.getPoints(100);

    GLOBAL.line[id].info = GLOBAL.line[id].info || {};
    GLOBAL.line[id].info.vertices = linesGeo.vertices;

    //TODO REMOVE
    GOLBAL_Points.push(linesGeo.vertices);

    var color = '#' + parseInt(Math.random() * 255).toString(16) + parseInt(Math.random() * 255).toString(16) + parseInt(Math.random() * 255).toString(16);
    // var color = '#' + parseInt(Math.random() * 255).toString(16) + 'ffff';
    var material = new THREE.LineBasicMaterial({
        color: color,
        opacity: 0.5,
        transparent: true,
        linewidth: 3,
        // linecap:'square'
    });
    // material.transparent = true;

    var curveObject = new THREE.Line(linesGeo, material);
    scene.add(curveObject);
    //

    // return false
    //create a ball

    var ballColor = '#' + parseInt(Math.random() * 255).toString(16) + parseInt(Math.random() * 255).toString(16) + parseInt(Math.random() * 255).toString(16);
    var ballGlowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            "c": {
                type: "f",
                value: 0.0,
            },
            "p": {
                type: "f",
                value: 10.0
            },
            "glowColor": {
                type: "c",
                value: new THREE.Color(ballColor)
            },
            "viewVector": {
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

    var totalIndex = GLOBAL.line[id].info.vertices.length;
    GLOBAL.line[id].balls = GLOBAL.line[id].balls || [];
    var perStep = totalIndex / obj.balls;
    // console.log(totalIndex, i);

    for (var i = 0; i < obj.balls; i++) {
        var ballObject = new THREE.Mesh(ball.clone(), ballGlowMaterial.clone());
        ballObject.verIndex = perStep * i;
        ballObject.totalIndex = totalIndex;
        ballObject.speed = obj.speed;
        GLOBAL.line[id].balls.push(ballObject);
        scene.add(ballObject);
    }
}



var points = ["117.024967", "36.682785", "116.395645", "39.929986", "117.024967", "36.682785", "117.210813", "39.14393", "117.024967", "36.682785", "116.863806", "38.297615", "117.024967", "36.682785", "121.487899", "31.249162", "117.024967", "36.682785", "117.188107", "34.271553", "117.024967", "36.682785", "113.649644", "34.75661", "117.024967", "36.682785", "114.3162", "30.581084", "117.024967", "36.682785", "117.282699", "31.866942", "117.024967", "36.682785", "120.219375", "30.259244", "117.024967", "36.682785", "108.953098", "34.2778"]
for (var i = 0; i < points.length; i += 4) {
    var obj = {
        start: [parseInt(points[i]), parseInt(points[i + 1])],
        end: [parseInt(points[i + 2]), parseInt(points[i + 3])],
        balls: parseInt(1),
        speed: parseInt(Math.random() * 4000) + 4000
    }

    addLine(obj);
}

// for (var i = 0; i < 100; i++) {
//     var obj = {
//         start: [parseInt(Math.random() * 360 - 180), parseInt(Math.random() * 180 - 90)],
//         end: [parseInt(Math.random() * 360 - 180), parseInt(Math.random() * 180 - 90)],
//         balls: '0'||parseInt(Math.random() * 10 + 1),
//         speed: parseInt(Math.random() * 4000) + 4000
//     }

//     addLine(obj);
// }

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

function readenBall() {

    var timePass = clock.getDelta();
    for (var i in GLOBAL.line) {
        // console.log(i);

        // console.log(GLOBAL.line[i].info.vertices.length);
        var line = GLOBAL.line[i];
        var balls = line.balls;
        var ballsLen = balls.length;
        // console.log(balls.length);
        for (var j = 0; j < ballsLen; j++) {
            var ball = balls[j];
            // console.log(ball.speed);
            var step = ball.totalIndex / ball.speed;
            ball.verIndex += timePass * 1000 * step;
            // console.log(ballIndex, ball.totalIndex,ballIndex >= ball.totalIndex);
            var ballIndex = parseInt(ball.verIndex);

            if (ballIndex >= ball.totalIndex) {
                ball.verIndex = ballIndex = 0;
            }

            var vertext = line.info.vertices[ballIndex];
            try {
                ball.position.x = vertext.x;
                ball.position.y = vertext.y;
                ball.position.z = vertext.z;
            } catch (e) {
                console.log(ballIndex, ball.totalIndex, ballIndex >= ball.totalIndex)
            }


            ball.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, ball.position);

        }

    }

}
