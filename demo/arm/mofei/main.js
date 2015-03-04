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
rotating.add(visual);
scene.add(rotating);

//sphere
var lookupCanvas = document.createElement('canvas');
lookupCanvas.width = 256;
lookupCanvas.height = 1;

var lookupTexture = new THREE.Texture(lookupCanvas);
lookupTexture.magFilter = THREE.NearestFilter;
lookupTexture.minFilter = THREE.NearestFilter;
lookupTexture.needsUpdate = true;




var indexedMapTexture = THREE.ImageUtils.loadTexture("images/indexed5.png");
// indexedMapTexture.needsUpdate = true;
indexedMapTexture.magFilter = THREE.NearestFilter;
indexedMapTexture.minFilter = THREE.NearestFilter;



var outlinedMapTexture = THREE.ImageUtils.loadTexture('images/outline5.png');
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
    }
};


var shaderMaterial = new THREE.ShaderMaterial({
    // opacity: 0.1,
    // blending: THREE.AdditiveBlending,
    // transparent: true,
    // depthTest: true,
    // depthWrite: false,
    // transparent: true,
    uniforms: uniforms,
    vertexShader: document.getElementById('globeVertexShader').textContent,
    fragmentShader: document.getElementById('globeFragmentShader').textContent,
});

var earth = new THREE.Mesh(new THREE.SphereGeometry(100, 40, 40), shaderMaterial);
// earth.doubleSided = false;
earth.rotation.x = Math.PI;
earth.rotation.y = -Math.PI / 2;
earth.rotation.z = Math.PI;
earth.id = "base";
rotating.add(earth);



/****************/
var points0 = ["117.024967", "36.682785", "116.395645", "39.929986", "117.024967", "36.682785", "117.210813", "39.14393", "117.024967", "36.682785", "116.863806", "38.297615", "117.024967", "36.682785", "121.487899", "31.249162", "117.024967", "36.682785", "117.188107", "34.271553", "117.024967", "36.682785", "113.649644", "34.75661", "117.024967", "36.682785", "114.3162", "30.581084", "117.024967", "36.682785", "117.282699", "31.866942", "117.024967", "36.682785", "120.219375", "30.259244", "117.024967", "36.682785", "108.953098", "34.2778"]
var points1 = ["110.330802", "20.022071", "110.365067", "21.257463", "110.330802", "20.022071", "116.395645", "39.929986", "110.330802", "20.022071", "121.487899", "31.249162", "110.330802", "20.022071", "108.297234", "22.806493", "110.330802", "20.022071", "120.219375", "30.259244", "110.330802", "20.022071", "113.649644", "34.75661", "110.330802", "20.022071", "104.067923", "30.679943", "110.330802", "20.022071", "114.3162", "30.581084", "110.330802", "20.022071", "106.530635", "29.544606", "110.330802", "20.022071", "112.979353", "28.213478"]

var points = points0.concat(points1);

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


curves(pointsToPlace(points));



var render = function() {
    renderer.clear();
    renderer.render(scene, camera);
    particleUpdate(rotating);
    requestAnimationFrame(render);
};


highlightArea();
render();



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

function drawStar(lines) {
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

            size.push(Math.random() * 20);
            var color = new THREE.Color('#' + parseInt(Math.random() * 255).toString(16) + parseInt(Math.random() * 255).toString(16) + parseInt(Math.random() * 255).toString(16));
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

function curves(lonlats) {

    var lines = [];

    var theCurves = new THREE.Geometry();

    var lineColors = [];

    for (var i in lonlats) {
        var start = lonlats[i].start;
        var end = lonlats[i].end;
        var curve = getCurve(lonlatToVet3(start[0], start[1]), lonlatToVet3(end[0], end[1]));
        var color = '#' + parseInt(Math.random() * 255).toString(16) + parseInt(Math.random() * 255).toString(16) + parseInt(Math.random() * 255).toString(16);
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
        linewidth: 1
    }));
    curvesLin.renderDepth = false;
    visual.add(curvesLin);

    drawStar(lines);
}

/**
 *  lonlatToVet3
 *  @param  longitude   {number}
 *  @param  latitude    {number}
 **/

function lonlatToVet3(longitude, latitude) {
    var rad = 100;
    var lon = longitude - 90;
    var lat = latitude;

    var phi = Math.PI / 2 - lat * Math.PI / 180 - Math.PI * 0.01;
    var theta = 2 * Math.PI - lon * Math.PI / 180 + Math.PI * 0.06;

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
    var vertexCountDesired = Math.floor(distanceBetweenCountryCenter * 0.02 + 6) * 2;

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
    ctx.fillStyle = 'rgb(30,30,30)';
    ctx.fillRect(0, 0, 1, 1);

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

    function onDocumentMouseMove(event) {
        getPickedColor()
        isClick = false;
        var pmouseX = mouseX;
        var pmouseY = mouseY;

        mouseX = event.clientX - window.innerWidth * 0.5;
        mouseY = event.clientY - window.innerHeight * 0.5;

        if (dragging) {
            var rotateVYD = (mouseX - pmouseX) / 2 * Math.PI / 180;
            var rotateVXD = (mouseY - pmouseY) / 2 * Math.PI / 180;
            //x is coefficient, depend on camera's scale,the big the small;
            var x = zVal > 1 ? (1 / (zVal * 8)) : 1;
            // console.log(zVal);
            rotateVY += rotateVYD * x;
            rotateVX += rotateVXD * x;
            rotating.rotation.x = rotateVX;
            rotating.rotation.y = rotateVY;
        }
    }


    //animate first time
    var time = 0;
    var step = 50;
    var animation = 0;
    // camera.scale.z = 1;
    function initMove() {
        time++
        rotating.rotation.x = rotateVX = (0.65 / step) * time;
        rotating.rotation.y = rotateVY = -(1.6 / step) * time;
        camera.scale.z = zVal = (2.2 / step) * time;
        if (time === step) {
            clearInterval(animation);
        }
    }
    initMove();
    animation = setInterval(initMove, 1000 / 60);
    //************

    function onDocumentMouseDown(event) {
        dragging = isClick = true;
        pressX = mouseX;
        pressY = mouseY;
        // rotateX = 0;
        // rotateY = 0;
    }

    function onDocumentMouseUp(event) {
        // d3Graphs.zoomBtnMouseup();
        dragging = false;
        if (isClick) {
            getPickedColor()
        }
    }

    function onDoucmentClick(evert) {
        // console.log(mouseX, mouseY);
        // getPickedColor()
    }

    function getPickedColor() {
        highlightArea();
        rotating.remove(visual);
        uniforms['outlineLevel'].value = 0;
        lookupTexture.needsUpdate = true;

        // renderer.autoClear = false;
        // renderer.autoClearColor = false;
        // renderer.autoClearDepth = false;
        // renderer.autoClearStencil = false;

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

        // console.log(buf,'@@@')
        // return false;
        // {"10":"湖南","11":"陕西","12":"广东","13":"吉林","14":"河北","15":"湖北","16":"贵州","17":"山东","18":"江西","19":"河南","20":"辽宁","21":"山西","22":"安徽","23":"福建","24":"浙江","25":"江苏","26":"重庆","27":"宁夏","28":"海南","29":"台湾","31":"北京","32":"天津","33":"上海","34":"香港","35":"澳门","01":"新疆","02":"西藏","03":"内蒙古","04":"青海","05":"四川","06":"黑龙江","07":"甘肃","08":"云南","09":"广西"}


        renderer.autoClear = true;
        renderer.autoClearColor = true;
        renderer.autoClearDepth = true;
        renderer.autoClearStencil = true;


        gl.preserveDrawingBuffer = false;
        // setTimeout(function() {
        rotating.add(visual);
        uniforms['outlineLevel'].value = 1;
        highlightArea(buf[0]);
        // },5000)
        var colorIndex = buf[0] < 10 ? '0' + buf[0] : buf[0];

        console.log(colorIndex,cityColor[colorIndex])


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

        if (delta) {
            camera.scale.z += delta * 0.1;
            zVal = camera.scale.z;
            zVal = zVal > 3 ? 3 : zVal;
            zVal = zVal < 0.5 ? 0.5 : zVal;
            camera.scale.z = zVal;
        }

        event.returnValue = false;
    }

})();
