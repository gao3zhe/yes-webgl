var config = {
    radius: 100
}


var earthGL = document.getElementById('earth');

//snece
var scene = new THREE.Scene();
scene.matrixAutoUpdate = false;

//reader
var renderer = new THREE.WebGLRenderer({
    antialias: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;
renderer.sortObjects = false;
earthGL.appendChild(renderer.domElement);



//camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20000);
camera.position.z = 200;
camera.position.y = 0;


//rotating
var rotating = new THREE.Object3D();
var visual = new THREE.Object3D();
var citys = new THREE.Object3D();
// visual.add()
rotating.add(visual);
scene.add(rotating);
rotating.add(citys);




//sphere
var lookupCanvas = document.createElement('canvas');
lookupCanvas.width = 256;
lookupCanvas.height = 1;

var lookupTexture = new THREE.Texture(lookupCanvas);
lookupTexture.magFilter = THREE.NearestFilter;
lookupTexture.minFilter = THREE.NearestFilter;
lookupTexture.needsUpdate = true;



var indexedMapTexture = THREE.ImageUtils.loadTexture("images/map_indexed.png");
// indexedMapTexture.needsUpdate = true;
indexedMapTexture.magFilter = THREE.NearestFilter;
indexedMapTexture.minFilter = THREE.NearestFilter;



var outlinedMapTexture = THREE.ImageUtils.loadTexture('images/map_outline.png');
var blendImage = THREE.ImageUtils.loadTexture("images/earth-day4.jpg");
// outlinedMapTexture.needsUpdate = true;

var uniforms = {
    'mapIndex': {
        type: 't',
        value: indexedMapTexture
    },
    'lookup': {
        type: 't',
        value: lookupTexture
    },
    'outline': {
        type: 't',
        value: outlinedMapTexture
    },
    'outlineLevel': {
        type: 'f',
        value: 1
    },
    'blendImage': {
        type: 't',
        value: blendImage
    }
};


var shaderMaterial = new THREE.ShaderMaterial({
    // opacity: 0.1,
    // blending: THREE.AdditiveBlending,
    // transparent: true,
    // depthTest: true,
    // depthWrite: false,
    uniforms: uniforms,
    vertexShader: document.getElementById('globeVertexShader').textContent,
    fragmentShader: document.getElementById('globeFragmentShader').textContent,
});

var earth = new THREE.Mesh(new THREE.SphereGeometry(config.radius, 100, 100), shaderMaterial);
earth.doubleSided = false;
earth.rotation.x = Math.PI;
earth.rotation.y = -Math.PI / 2;
earth.rotation.z = Math.PI;
rotating.add(earth);


function showPoint(lon, lat, obj) {
    var height = Math.random() * 2;
    var box = new THREE.BoxGeometry(1, 0.8, 0.8);
    var boxMaterial = new THREE.MeshBasicMaterial({
        color: ((obj && obj.color) || 0x00ff00),
        // opacity: 0.1,
        depthTest: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
    });
    var boxs = new THREE.Mesh(box, boxMaterial);
    // boxs.rotateY(0.2)
    boxs.rotateY(Math.PI * ((lon - 100.3) / 180))
    boxs.rotateZ(Math.PI / 2 * (lat / 90))
    boxs.translateX(100);
    boxs.customer = boxs.customer || {};
    boxs.customer.height = height;
    boxs.scale.x = height;
    citys.add(boxs);
}


var beltMaterial = new THREE.MeshDepthMaterial({
    opacity: 0.5,
    color: "#fff",
    map: THREE.ImageUtils.loadTexture("images/map_indexed.png"),
    // blending: THREE.AdditiveBlending,
    transparent: true,
});
var belt = new THREE.Mesh(new THREE.SphereGeometry(config.radius + 20, 100, 100), beltMaterial);
// rotating.add(belt);



var earthGlowMaterial = new THREE.ShaderMaterial({
    uniforms: {
        "c": {
            type: "f",
            value: 0.5
        },
        "p": {
            type: "f",
            value: 1.8
        },
        glowColor: {
            type: "c",
            value: new THREE.Color('#00b3ff')
        },
        viewVector: {
            type: "v3",
            value: camera.position
        }
    },
    vertexShader: document.getElementById('glowVertexShader').textContent,
    fragmentShader: document.getElementById('glowFragmentShader').textContent,
    // side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true
});
var earthGlow = new THREE.Mesh(new THREE.SphereGeometry(config.radius, 100, 100), earthGlowMaterial);
earthGlow.position = earth.position;
earthGlow.scale.multiplyScalar(1.015);
scene.add(earthGlow);



/****************/
// var points = [24.9008, 6.66863, 24.36266, 4.542673, 24.36266, 4.542673, 23.55108, 8.590079, 23.55108, 8.590079, 35.9675, 1.378338, 35.9675, 1.378338, 39.98515, 2.760274, 39.98515, 2.760274, 31.77774, 5.059936, 31.77774, 5.059936, 30.14676, 1.2241, 30.14676, 1.2241, 29.2472, 7.96564, 29.2472, 7.96564, 33.35316, 4.35977, 33.35316, 4.35977, 25.30288, 1.424332, 25.30288, 1.424332, 32.00534, 5.903912, 32.00534, 5.903912, 33.8362, 5.627953, 33.8362, 5.627953, 26.21712, 0.55046, 26.21712, 0.55046, 15.49, 4.08841, 15.49, 4.08841, 33.5517, 6.306353, 33.5517, 6.306353, 31.77774, 5.059936, 31.77774, 5.059936, 52.24869, 0.999802, 52.24869, 0.999802, 44.49189, 6.105052, 44.49189, 6.105052, 50.18673, 4.441166, 50.18673, 4.441166, 48.32037, 7.237555, 48.32037, 7.237555, 42.78171, 3.308663, 42.78171, 3.308663, 47.5352, 9.095682, 47.5352, 9.095682, 56.8872, 3.998561, 56.8872, 3.998561, 54.73292, 5.249578, 54.73292, 5.249578, 46.10186, 4.634337, 46.10186, 4.634337, 59.33968, 4.697659, 59.33968, 4.697659, 45.81636, 5.968141, 45.81636, 5.968141, 41.35268, 9.813176, 41.35268, 9.813176, 44.82346, 0.374294, 44.82346, 0.374294, 42.09009, 1.478132, 42.09009, 1.478132, 43.95276, 8.387386, 43.95276, 8.387386, 42.45219, 9.252059, 42.45219, 9.252059, 50.89892, 0.598914, 50.89892, 0.598914, 41.26945, 9.347898, 41.26945, 9.347898, 38.04227, 8.383109, 38.04227, 8.383109, 43.06228, 4.719909, 43.06228, 4.719909, 38.76612, 8.906363, 38.76612, 8.906363, 47.95925, 6.888977, 47.95925, 6.888977, 55.72834, 7.641552, 55.72834, 7.641552, -6.23128, 6.66821, -6.23128, 6.66821, 13.74103, 0.537311, 13.74103, 0.537311, 3.15486, 1.710138, 3.15486, 1.710138, 21.04398, 5.858729, 21.04398, 5.858729, 1.35965, 3.802831, 1.35965, 3.802831, 14.58926, 21.183677, 14.58926, 21.183677, 19.73425, 6.402518, 19.73425, 6.402518, 11.5505, 4.96646, 11.5505, 4.96646, 18.0047, 2.680596, 18.0047, 2.680596, 4.94694, 14.965391, 4.94694, 14.965391, -8.5413, 25.706933, -8.5413, 25.706933, 50.45636, 0.390538, 50.45636, 0.390538, 53.91446, 7.575751, 53.91446, 7.575751, 41.71406, 4.758827, 41.71406, 4.758827, 40.34883, 9.818083, 40.34883, 9.818083, 40.20791, 4.547258, 40.20791, 4.547258, 47.00792, 8.835966, 47.00792, 8.835966, 28.58787, 7.211658, 28.58787, 7.211658, 33.75008, 3.053869, 33.75008, 3.053869, 23.73357, 0.420917, 23.73357, 0.420917, 7.05986, 0.063239, 7.05986, 0.063239, 34.53026, 9.153642, 34.53026, 9.153642, 27.699, 5.361661, 27.699, 5.361661, 5.43974, 3.642583, 5.43974, 3.642583, 27.46959, 9.666628]
// 
// var points = [116.3833, 39.9167, 121.5000, 31.2000]

var cityLocation = [
    // [116.248467, 39.873306],
    // [104.032662, 46.130379],
    // [90.786608, 45.512945],
    // [80.042586, 44.468565],
    // [72.683668, 45.097492],
    // [62.52836, 43.726097],
    // [55.758155, 45.305602],
    // [49.135128, 35.789378],
    // [28.530155, 40.886304],
    // [48.104879, 30.403927],
    // [59.584792, 24.364414],
    // [61.350933, 22.188969],
    // [76.657484, 5.869884],
    // [90.492251, 19.700352],
    // [105.210089, -7.140833],
    // [123.16585, -10.653242],
    // [108.74237, -2.417111],
    // [108.74237, 8.515632],
    // [120.222283, 23.823943],
    // [114.040791, 36.802098]
    ["106.888977", "47.959259"],
    ["47.96564", "29.24725"],
    ["54.542673", "24.362666"],
    ["37.641552", "55.728342"],
    ["46.66863", "24.90082"],

    ["58.590079", "23.551088"],
    ["51.378338", "35.967505"],
    ["32.760274", "39.985151"],
    ["35.059936", "31.777742"],
    ["31.2241", "30.146769"],

    ["44.35977", "33.353165"],
    ["51.424332", "25.302888"],
    ["35.903912", "32.005347"],
    ["35.627953", "33.83624"],
    ["50.55046", "26.217124"],
    ["44.08841", "15.498"],
    ["36.306353", "33.55173"],
    ["35.059936", "31.777742"],
    ["20.999802", "52.248698"],
    ["26.105052", "44.491896"],
    ["14.441166", "50.186732"],
    ["17.237555", "48.320371"],
    ["23.308663", "42.781717"],
    ["19.095682", "47.535206"],
    ["23.998561", "56.887208"],
    ["25.249578", "54.732926"],
    ["14.634337", "46.101863"],
    ["24.697659", "59.339686"],
    ["15.968141", "45.816366"],
    ["19.813176", "41.352683"],
    ["20.374294", "44.823464"],
    ["21.478132", "42.090097"],
    ["18.387386", "43.952765"],
    ["19.252059", "42.452198"],
    ["70.598914", "50.898928"],
    ["69.347898", "41.269451"],
    ["58.383109", "38.042273"],
    ["74.719909", "43.062282"],
    ["68.906363", "38.766129"],


    ["106.66821", "-6.231285"],
    ["100.537311", "13.741035"],
    ["101.710138", "3.154866"],
    ["105.858729", "21.043987"],
    ["103.802831", "1.359655"],
    ["121.183677", "14.589268"],
    ["96.402518", "19.734255"],
    ["104.96646", "11.550501"],
    ["102.680596", "18.00475"],
    ["114.965391", "4.946941"],
    ["125.706933", "-8.54137"],
    ["30.390538", "50.456367"],
    ["27.575751", "53.914468"],
    ["44.758827", "41.714067"],
    ["49.818083", "40.348831"],
    ["44.547258", "40.207919"],
    ["28.835966", "47.007921"],
    ["77.211658", "28.587879"],
    ["73.053869", "33.750086"],
    ["90.420917", "23.733573"],
    ["80.063239", "7.059869"],
    ["69.153642", "34.530268"],
    ["85.361661", "27.6991"],
    ["73.642583", "5.439747"],
    ["89.666628", "27.469593"]
];

// cityLocation.sort(function(a, b) {
//     return (b[0] | 0) - (a[0] | 0)
// });
// cityLocation.sort(function(a, b) {
//     return (b[1] | 0) - (a[1] | 0)
// });



// var points = [116.3833, 39.9167]
var points = [];
var level = []
for (var i = 0; i < cityLocation.length; i++) {

    if (i === 0) {
        points.push(116.3833)
        points.push(39.9167)
    } else {
        points.push(cityLocation[i - 1][0])
        points.push(cityLocation[i - 1][1])
    }
    points.push(cityLocation[i][0])
    points.push(cityLocation[i][1])

    var color;
    if (cityLocation[i][1] < 30) {
        level.push(0.9);
        color = 'red';
    } else {
        level.push(0.1);
        color = 'green';
    }
    /******/
    showPoint(cityLocation[i][0], cityLocation[i][1], {
        color: color
    })

}

// var lines = curves(pointsToPlace(points), level);
// drawStar(lines, level);
// 
function pointsToPlace(points) {
    var place = [];
    for (var i = 0; i < points.length; i += 4) {
        place.push({
            start: [points[i], points[i + 1]],
            end: [points[i + 2], points[i + 3]]
        });
    };
    return place;
}






var render = function() {
    renderer.clear();
    renderer.render(scene, camera);
    particleUpdate(rotating);
    // citysUpdate();
    requestAnimationFrame(render);

    // earthGlow.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(rotating.position, earthGlow.position);
};

earthGlow.material.uniforms.viewVector.value = camera.rotation;
highlightArea();
render();

// function citysUpdate() {
//     // var sons = citys.children;
//     // for (var i in sons) {
//         // sons[i].scale.x += 0.1;
//         // console.log(sons[i].customer)
//     // }
// }

function particleUpdate(tar) {
    var sons = tar.children;
    for (var i in sons) {
        var son = sons[i];
        var update = son.update;
        update && update(son);
        particleUpdate(son);
    }
}


/**
 * draw start on the line
 * @param {Array} lines the lines
 * @return {[type]}
 */
var pSystem;

function drawStar(lines, level) {

    // return false;

    var particlesGeo = new THREE.Geometry();

    //init the vertices and the size , color of all the vertices
    var size = [];
    var colors = [];
    var vertices = [];
    for (var i in lines) {
        var linePoints = lines[i].vertices;
        for (var j = 0; j < linePoints.length; j++) {
            var index = j;
            var star = linePoints[index].clone();
            star.play = {};
            star.play.path = linePoints;
            star.play.index = index;
            vertices.push(star);

            // if (j === 0) {
            // size.push(80);
            // } else {
            size.push(25);
            // }


            var color;
            // console.log
            if (level && level[i]) {
                var R = (255 * level[i]) | 0;
                // R = (R + 150) > 255 ? 255 : (R + 150);
                var G = 255 - R;
                var B = 0;
                // red = (red).toString(16)
                // green = (green).toString(16)
                // red = red.length <= 1 ? '0' + red : red;
                // green = green.length <= 1 ? '0' + green : green;
                // color = '#' + red + green + '00';
                color = 'rgb(' + R + ',' + G + ',' + B + ')';
                // console.log(level[i],red);
            } else {
                color = '#' + parseInt(Math.random() * 255).toString(16) + parseInt(Math.random() * 255).toString(16) + parseInt(Math.random() * 255).toString(16);
            }

            var color = new THREE.Color(color);


            // color = new THREE.Color('skyblue');
            colors.push(color);
        }
    }

    particlesGeo.vertices = vertices;
    particlesGeo.colors = colors;

    /**********/
    var uniforms = {
        amplitude: {
            type: "f",
            value: 1.0
        },
        color: {
            type: "c",
            value: new THREE.Color('#ffffff')
        },
        texture: {
            type: "t",
            value: THREE.ImageUtils.loadTexture("images/particleA.png")
        },
    };

    var attributes = {
        size: {
            type: 'f',
            value: size
        },
        customColor: {
            type: 'c',
            value: colors
        }
    };

    var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        attributes: attributes,
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        // sizeAttenuation: true,
    });
    visual.remove(pSystem);
    pSystem = new THREE.PointCloud(particlesGeo, shaderMaterial);
    pSystem.dynamic = true;

    pSystem.update = function(self) {

        var vertices = self.geometry.vertices;

        for (var i in vertices) {

            var particle = vertices[i];

            var path = particle.play.path;

            var index = particle.play.index;
            index = index >= path.length ? 0 : index;

            var nextIndex = index + 1;
            nextIndex = nextIndex >= path.length ? 0 : nextIndex;

            particle.play.offset = particle.play.offset || 0;


            particle.play.offset += 0.01;

            if (particle.play.offset > 1) {
                particle.play.offset = 0;
                index = particle.play.index = nextIndex;
            }
            var nowPos = particle.play.path[index];
            var nextPos = particle.play.path[nextIndex];

            particle.copy(nowPos);

            particle.lerp(nextPos, particle.play.offset);

        }
        self.geometry.verticesNeedUpdate = true;
    }
    visual.add(pSystem);
}


/**
 * draw curver from the lon and lat
 * @param  {Array}  lonlats
 * @return undefined
 */
var curvesLin;

function curves(lonlats, level) {

    var lines = [];

    var theCurves = new THREE.Geometry();

    var lineColors = [];

    for (var i in lonlats) {
        var start = lonlats[i].start;
        var end = lonlats[i].end;
        var curve = getCurve(lonlatToVet3(start[0], start[1]), lonlatToVet3(end[0], end[1]));
        var color;
        // console.log
        if (level && level[i]) {
            var R = (255 * level[i]) | 0;
            // R = (R + 150) > 255 ? 255 : (R + 150);
            var G = 255 - R;
            var B = 0;
            // red = (red).toString(16)
            // green = (green).toString(16)
            // red = red.length <= 1 ? '0' + red : red;
            // green = green.length <= 1 ? '0' + green : green;
            // color = '#' + red + green + '00';
            color = 'rgb(' + R + ',' + G + ',' + B + ')';
            // console.log(level[i],red);
        } else {
            color = '#' + parseInt(Math.random() * 255).toString(16) + parseInt(Math.random() * 255).toString(16) + parseInt(Math.random() * 255).toString(16);
        }
        // console.log(color)

        for (var j in curve.vertices) {
            var lineColor = new THREE.Color(color); //14497804
            lineColors.push(lineColor);
        }
        lines.push(curve);
        theCurves.merge(curve);
    }

    theCurves.colors = lineColors;
    visual.remove(curvesLin);
    curvesLin = new THREE.Line(theCurves, new THREE.LineBasicMaterial({
        color: 0xffffff,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        vertexColors: true,
        linewidth: 4
    }));
    curvesLin.renderDepth = false;

    visual.add(curvesLin);

    return lines;
}

/**
 *  lonlatToVet3
 *  @param  longitude   {number}
 *  @param  latitude    {number}
 **/

function lonlatToVet3(longitude, latitude) {

    var rad = config.radius;
    var lon = longitude - 80;
    var lat = latitude;

    var phi = Math.PI / 2 - lat * Math.PI / 180 - Math.PI * 0.000;
    var theta = 2 * Math.PI - lon * Math.PI / 180 + Math.PI * 0.113;

    var center = new THREE.Vector3();
    center.x = Math.sin(phi) * Math.cos(theta) * rad;
    center.y = Math.cos(phi) * rad;
    center.z = Math.sin(phi) * Math.sin(theta) * rad;
    return center;
}

/**
 *  getCurve
 *  @param  start   vet3  the start point
 *  @param  end     vet3  the end point
 */
function getCurve(start, end) {
    var globeRadius = 1000;
    var vec3_origin = new THREE.Vector3();
    // var distanceBetweenCountryCenter = start.clone().subSelf(end).length();
    var distanceBetweenCountryCenter = start.clone().sub(end).length();

    //  how high we want to shoot the curve upwards
    var anchorHeight = globeRadius + distanceBetweenCountryCenter * 0.7;

    //  midpoint for the curve
    // var mid = start.clone().lerpSelf(end, 0.5);
    var mid = start.clone().lerp(end, 0.5);
    var midLength = mid.length()
    mid.normalize();
    mid.multiplyScalar(midLength + distanceBetweenCountryCenter * 0.7);

    //  the normal from start to end
    var normal = (new THREE.Vector3()).subVectors(start, end);
    normal.normalize();

    /*                   
                The curve looks like this:
                
                midStartAnchor---- mid ----- midEndAnchor
              /                                           \
             /                                             \
            /                                               \
    start/anchor                                         end/anchor

        splineCurveA                            splineCurveB
    */

    var distanceHalf = distanceBetweenCountryCenter * 0.5;

    var startAnchor = start;
    var midStartAnchor = mid.clone().add(normal.clone().multiplyScalar(distanceHalf));
    var midEndAnchor = mid.clone().add(normal.clone().multiplyScalar(-distanceHalf));
    var endAnchor = end;

    //  now make a bezier curve out of the above like so in the diagram
    var splineCurveA = new THREE.CubicBezierCurve3(start, startAnchor, midStartAnchor, mid);
    // splineCurveA.updateArcLengths();

    var splineCurveB = new THREE.CubicBezierCurve3(mid, midEndAnchor, endAnchor, end);
    // splineCurveB.updateArcLengths();

    //  how many vertices do we want on this guy? this is for *each* side
    var vertexCountDesired = Math.floor(distanceBetweenCountryCenter * 0.02 + 6) * 1.5;

    //  collect the vertices
    var points = splineCurveA.getPoints(vertexCountDesired);

    //  remove the very last point since it will be duplicated on the next half of the curve
    points = points.splice(0, points.length - 1);
    points = points.concat(splineCurveB.getPoints(vertexCountDesired));

    //  add one final point to the center of the earth
    //  we need this for drawing multiple arcs, but piled into one geometry buffer
    points.push(vec3_origin);

    //  create a line geometry out of these
    var curveGeometry = new THREE.Geometry();
    curveGeometry.vertices = points;

    return curveGeometry;
}


function highlightArea(index) {

    var ctx = lookupCanvas.getContext('2d');
    ctx.clearRect(0, 0, 256, 1);
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, 1, 1);
    // console.log(index)
    if (index) {
        var fillCSS = '#333333';
        ctx.fillStyle = fillCSS;
        ctx.fillRect(index, 0, 1, 1);
    } else {
        for (var i = 1; i < 1000; i++) {
            var fillCSS = '#000000';
            ctx.fillStyle = fillCSS;
            ctx.fillRect(i, 0, 1, 1);
        }
    }

    lookupTexture.needsUpdate = true;

}


/**
 * city color
 */

var cityColor = {
    "16": "湖南",
    "17": "陕西",
    "18": "广东",
    "19": "吉林",
    "20": "河北",
    "21": "湖北",
    "22": "贵州",
    "23": "山东",
    "24": "江西",
    "25": "河南",
    "32": "辽宁",
    "33": "山西",
    "34": "安徽",
    "35": "福建",
    "36": "浙江",
    "37": "江苏",
    "38": "重庆",
    "39": "宁夏",
    "40": "海南",
    "41": "台湾",
    "49": "北京",
    "50": "天津",
    "51": "上海",
    "52": "香港",
    "53": "澳门",
    "01": "新疆",
    "02": "西藏",
    "03": "内蒙古",
    "04": "青海",
    "05": "四川",
    "06": "黑龙江",
    "07": "甘肃",
    "08": "云南",
    "09": "广西"
};
/**
 * for the key events
 */
(function() {
    var dragging, mouseX, mouseY,
        isClick,
        rotateX = 0,
        rotateY = 0,
        rotateVX = 0,
        rotateVY = 0,
        rotateXMax = 90 * Math.PI / 180,
        zVal = 1;

    document.addEventListener('mousedown', onDocumentMouseDown);
    document.addEventListener('mouseup', onDocumentMouseUp);
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('click', onDoucmentClick);
    document.addEventListener('mousewheel', onMouseWheel);
    document.addEventListener('DOMMouseScroll', onMouseWheel)

    document.addEventListener('touchstart', onDocumentMouseDown);
    document.addEventListener('touchend', onDocumentMouseUp);
    document.addEventListener('touchmove', onDocumentMouseMove);
    // document.addEventListener('click', onDoucmentClick);
    // document.addEventListener('mousewheel', onMouseWheel);
    // document.addEventListener('DOMMouseScroll', onMouseWheel)

    /**
     * the tips of city
     */
    var followMouse = (function() {
        var tar = $('<div class="OP_cityflow" style=" background:rgba(0,0,0,0.6); padding:5px 10px; border-radius:4px; border:1px solid #333; display:none; position:absolute; z-index:100; color:white;"></div>')
        $('body').append(tar);
        return function(cityIndex, event) {
            cityIndex = cityIndex < 10 ? '0' + cityIndex : cityIndex;
            var city = cityColor[cityIndex];
            if (city === undefined) {
                tar.hide();
            } else {
                tar.css({
                    'top': event.pageY + 5,
                    'left': event.pageX + 10,
                }).html(city).show();
            }
        }
    })();

    /**
     * auto move by mouse
     */
    var moveBymouse = function(e) {
        var offsetX = event.pageX - document.body.clientWidth / 2
        var offsetY = document.body.clientHeight / 2 - event.pageY
        var offsetXP = offsetX / document.body.clientWidth;
        var offsetYP = offsetY / document.body.clientHeight;

        var rx = rotateVX - 0.1 * offsetYP;
        var ry = rotateVY + 0.1 * offsetXP;
        rotating.rotation.x = rx;
        rotating.rotation.y = ry;
    }


    function onDocumentMouseMove(event) {
        var cityX = getPickedColor();

        // followMouse(cityX[0], event);

        // moveBymouse(event)

        var clientX = event.clientX || event.touches[0].pageX;
        var clientY = event.clientY || event.touches[0].pageY;

        isClick = false;
        var pmouseX = mouseX;
        var pmouseY = mouseY;
        // console.log()
        mouseX = clientX - window.innerWidth * 0.5;
        mouseY = clientY - window.innerHeight * 0.5;

        pmouseX = pmouseX || mouseX;
        pmouseY = pmouseY || mouseY;

        if (dragging) {
            var rotateVYD = (mouseX - pmouseX) / 2 * Math.PI / 180;
            var rotateVXD = (mouseY - pmouseY) / 2 * Math.PI / 180;
            //x is coefficient, depend on camera's scale,the big the small;
            // var x = zVal > 1 ? (1 / (zVal*10 )) : 1;
            var x = 0.1
                // console.log(x)
                // console.log(zVal);
            rotateVY += rotateVYD * x;
            rotateVX += rotateVXD * x;
            rotating.rotation.x = rotateVX;
            rotating.rotation.y = rotateVY;
            // console.log(mouseX , pmouseX)
        }
    }


    /**
     * load all the images then start work
     */
    var images = ["images/indexed5.png", "images/outline7.png", "images/particleA.png"]

    loadImg(0);

    function loadImg(i) {
        var image = new Image();
        image.onload = function() {
            if (i < images.length - 1) {
                loadImg(++i);
            }
            imageOk();
        }
        image.src = images[i];
        $('.loadingSubText').html('加载图片资源：' + images[i]);
    }

    var imageOk = (function() {
        var count = 0;
        var total = images.length;
        return function() {
            if (++count >= total) {
                // console.log('!!!!')
                open();

            }
            $('.loadingProgress').css({
                'width': (count / total) * 100 + '%'
            });
            // console.log(',,,,,,', ++count, total);
        }
    })();


    function open() {
        $('.loading').css({
            'opacity': '0'
        });
        setTimeout(function() {
            $('.loading').hide();
            initMove();
        }, 500)
    }

    //animate first time
    var time = 0;
    var step = 50;
    var animation = 0;
    // camera.scale.z = 1;
    function initMove() {

        time++;
        rotating.rotation.x = rotateVX = (0.30 / step) * time;
        rotating.rotation.y = rotateVY = (0.735 / step) * time;
        camera.scale.z = zVal = (1 / step) * time;
        if (time === step) {
            clearInterval(animation);
            turnaround();
        }
    }

    function turnaround() {
        var intervalId = setInterval(function() {
            rotating.rotation.y = rotateVY += 0.04;
            if (rotating.rotation.y >= 4) {
                clearInterval(intervalId);
                zoomToChina();
            }
        }, 16);
    }

    function zoomToChina() {
        //-0.04402649398590776, _y: 4.5
        //

        animationTo(rotating.rotation.y, 4.7, 400, function(value) {
            rotating.rotation.y = rotateVY = value;
        });
        animationTo(rotating.rotation.x, 0.49, 400, function(value) {
            rotating.rotation.x = rotateVX = value;
        });
        // animationTo(rotating.rotation.z, 300, 400, function(value) {
        //     rotating.rotation.z  = value;
        // });
        // animationTo(camera.position.y, 40, 400, function(value) {
        //     camera.position.y = value;
        // });

        animationTo(camera.fov, 55, 400, function(value) {
            camera.fov = value;
            camera.updateProjectionMatrix();
            moveToEnd();
        });
    }

    function moveToEnd() {
        // return false
        animationTo(rotating.rotation.y, 5.82, 2000, function(value) {
            rotating.rotation.y = rotateVY = value;
        }, function() {
            setInterval(function() {
                rotateVY += 0.0004;
                rotating.rotation.y = rotateVY;
            }, 16);
        });
        setTimeout(function() {
            showTitle();
        }, 1600);
        // animationTo(rotating.rotation.x, -0.07, 2000, function(value) {
        //     rotating.rotation.x = rotateVX = value;
        // }, function() {
        //     showTitle();
        // });
    }

    function showTitle() {
        textShow();
        $('.cover').css('opacity', 1);
    }

    animation = setInterval(initMove, 1000 / 60);
    //************

    function onDocumentMouseDown(event) {
        dragging = isClick = true;
        pressX = mouseX;
        pressY = mouseY;
    }

    function onDocumentMouseUp(event) {
        // d3Graphs.zoomBtnMouseup();
        dragging = false;
        if (isClick) {
            var color = getPickedColor();
        }
    }

    function onDoucmentClick(evert) {
        // console.log(mouseX, mouseY);
        // getPickedColor()
    }

    function getPickedColor() {
        highlightArea();
        rotating.remove(visual);
        rotating.remove(citys);
        uniforms['outlineLevel'].value = 0;
        lookupTexture.needsUpdate = true;

        renderer.clear();
        renderer.render(scene, camera);

        var gl = renderer.context;
        gl.preserveDrawingBuffer = true;


        var mx = (mouseX + renderer.context.canvas.width / 2);
        var my = (-mouseY + renderer.context.canvas.height / 2);
        mx = Math.floor(mx);
        my = Math.floor(my);

        var buf = new Uint8Array(4);
        gl.readPixels(mx, my, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);

        renderer.autoClear = true;
        renderer.autoClearColor = true;
        renderer.autoClearDepth = true;
        renderer.autoClearStencil = true;


        gl.preserveDrawingBuffer = false;

        rotating.add(visual);
        rotating.add(citys);
        uniforms['outlineLevel'].value = 1;
        highlightArea(buf[0]);

        var colorIndex = buf[0] < 10 ? '0' + buf[0] : buf[0];

        return buf;

    }

    var zoom = {
        inprogress: false,
        goToGolbal: function() {
            var self = this;
            if (self.inprogress) {
                return false;
            }
            self.inprogress = true;
            animationTo(camera.position.y, 0, 400, function(value) {
                camera.position.y = value;
            });
            animationTo(camera.fov, 75, 400, function(value) {
                camera.fov = value;
                camera.updateProjectionMatrix();
            });
            animationTo(rotating.rotation.x, 0.6, 400, function(value) {
                rotating.rotation.x = rotateVX = value;
            });

            setTimeout(function() {
                self.inprogress = false;
            }, 500);
        },
        goTOArea: function() {
            var self = this;
            if (self.inprogress) {
                return false;
            }
            self.inprogress = true;
            animationTo(camera.position.y, 40, 400, function(value) {
                camera.position.y = value;
            });

            animationTo(camera.fov, 40, 400, function(value) {
                camera.fov = value;
                camera.updateProjectionMatrix();;
            });
            animationTo(rotating.rotation.x, -0.23, 400, function(value) {
                rotating.rotation.x = rotateVX = value;
            });
            setTimeout(function() {
                self.inprogress = false;
            }, 500);
        }
    }

    //mouse wheel
    function onMouseWheel(event) {
        var delta = 0;

        if (event.wheelDelta) {
            //IE opera
            delta = event.wheelDelta / 120;
        } else if (event.detail) {
            //  firefox
            delta = -event.detail / 3;
        }


        // if (delta) {
        //     camera.scale.z += delta * 0.1;
        //     zVal = camera.scale.z;
        //     zVal = zVal > 3 ? 3 : zVal;
        //     zVal = zVal < 0.5 ? 0.5 : zVal;
        //     camera.scale.z = zVal;
        // }

        if (delta < 0) {
            zoom.goTOArea()
        } else if (delta > 0) {
            zoom.goToGolbal()
        }

        event.returnValue = false;
    }


    function animationTo(start, end, time, callback, finishfn) {
        var times = time / 16;
        var d = (end - start) / times;
        // console.log(d)
        var doTimes = 0;
        // var t = new Date();
        var intervalId = setInterval(function() {
            ++doTimes;
            start += d;
            callback && callback(start);
            if (doTimes >= times) {
                if (start < end) {
                    callback && callback(end);
                    // finishfn && finishfn(end);
                }
                finishfn && finishfn(end);
                // console.log(new Date() - t)
                clearInterval(intervalId);
            }
        }, 16);

        this.intervalId = intervalId;

        return intervalId;
    };
    animationTo.prototype.stop = function() {
        clearInterval(this.intervalId);
    }

})();

function textShow() {
    setTimeout(function() {
        $('.cover .line-1').css({
            'left': "20%",
            'width': "60%"
        })
        $('.cover .line-2').css({
            'right': "20%",
            'width': "60%"
        })
        setTimeout(function() {
            $('.cover .line-1').css({
                'left': "-10%",
                'width': "120%",
            });
            $('.cover .line-2').css({
                'right': "-10%",
                'width': "120%",
            })
            $('.cover .line-1,.cover .line-2').css({
                'transition': 'all 0.1s ease-in'
            }).css({
                "-webkit-transform": 'rotate(-10deg)'
            });
            setTimeout(function() {
                $('.cover .line-1').css({
                    'margin-top': '-120px'
                });
                $('.cover .line-2').css({
                    'margin-bottom': '-120px'
                });
                $('.cover .title').css({
                    'font-size': '200px'
                })
                setTimeout(function() {
                    $('.cover .line-1').css({
                        'margin-top': '-80px'
                    });
                    $('.cover .line-2').css({
                        'margin-bottom': '-80px'
                    })
                    $('.cover .title').css({
                        'font-size': '120px'
                    })
                }, 200)
            }, 200)
        }, 800)

    }, 1000)

}

// $('')
