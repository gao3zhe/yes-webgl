var earthGL = document.getElementById('Earth');

var scene = new THREE.Scene();

//reader
var renderer = new THREE.WebGLRenderer({
    antialias: false
});
renderer.autoClear = false;
renderer.sortObjects = false;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#222', 1);
earthGL.appendChild(renderer.domElement);


//camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20000);
camera.position.z = 200;
camera.position.y = 0;

var rotating = new THREE.Object3D();
scene.add(rotating);



var shadow = document.getElementById('EarthShadow');

var shadowRenderer = new THREE.WebGLRenderer({
    antialias: false
});
shadowRenderer.autoClear = false;
shadowRenderer.sortObjects = false;
shadowRenderer.setSize(window.innerWidth, window.innerHeight);
shadow.appendChild(shadowRenderer.domElement);

var shadowScene = new THREE.Scene();
var shadowRotating = new THREE.Object3D();
shadowScene.add(shadowRotating);



var render = function() {
    renderer.clear();
    renderer.render(scene, camera);
    shadowRenderer.clear();
    shadowRenderer.render(shadowScene, camera);
    requestAnimationFrame(render);
};

render();


/**
 * add earth
 */
(function() {
    var lookupCanvas = document.createElement('canvas');
    lookupCanvas.width = 256;
    lookupCanvas.height = 1;

    var lookupTexture = new THREE.Texture(lookupCanvas);
    lookupTexture.magFilter = THREE.NearestFilter;
    lookupTexture.minFilter = THREE.NearestFilter;
    lookupTexture.needsUpdate = true;



    var indexedMapTexture = THREE.ImageUtils.loadTexture("images/index.png");
    indexedMapTexture.magFilter = THREE.NearestFilter;
    indexedMapTexture.minFilter = THREE.NearestFilter;

    var outlinedMapTexture = THREE.ImageUtils.loadTexture('images/outline_blank.png');

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


    var earthMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('globeVertexShader').textContent,
        fragmentShader: document.getElementById('globeFragmentShader').textContent,
    });

    var earth = new THREE.Mesh(new THREE.SphereGeometry(100, 100, 100), earthMaterial);
    rotating.add(earth);

    /*******/
    var shadowMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture("images/index.png"),
    });
    var earthShadow = new THREE.Mesh(new THREE.SphereGeometry(100, 100, 100), shadowMaterial);
    shadowRotating.add(earthShadow);
})();


/**
 * drag
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

    function onDocumentMouseDown(event) {
        dragging = isClick = true;
        pressX = mouseX;
        pressY = mouseY;
    }

    function onDocumentMouseUp(event) {
        dragging = false;
    }

    function onDocumentMouseMove(event) {
        var clientX = event.clientX;
        var clientY = event.clientY;

        getPick(clientX - window.innerWidth * 0.5, clientY - window.innerHeight * 0.5);

        isClick = false;
        var pmouseX = mouseX;
        var pmouseY = mouseY;

        mouseX = clientX - window.innerWidth * 0.5;
        mouseY = clientY - window.innerHeight * 0.5;

        pmouseX = pmouseX || mouseX;
        pmouseY = pmouseY || mouseY;

        if (dragging) {
            var rotateVYD = (mouseX - pmouseX) / 2 * Math.PI / 180;
            var rotateVXD = (mouseY - pmouseY) / 2 * Math.PI / 180;

            var x = 0.1

            rotateVY += rotateVYD * x;
            rotateVX += rotateVXD * x;
            rotating.rotation.x = shadowRotating.rotation.x = rotateVX;
            rotating.rotation.y = shadowRotating.rotation.y = rotateVY;


        }
    }

    function getPick(x, y) {
        // console.log(x, y)
        shadowRenderer.autoClear = false;
        shadowRenderer.autoClearColor = false;
        shadowRenderer.autoClearDepth = false;
        shadowRenderer.autoClearStencil = false;

        shadowRenderer.clear();
        shadowRenderer.render(shadowScene, camera);
        var gl = shadowRenderer.context;

        gl.preserveDrawingBuffer = true;
        var buf = new Uint8Array(4);
        var mx = (x + gl.canvas.width / 2);
        var my = (-y + gl.canvas.height / 2);
        mx = Math.floor(mx);
        my = Math.floor(my);
        gl.readPixels(mx, my, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);

        shadowRenderer.autoClear = true;
        shadowRenderer.autoClearColor = true;
        shadowRenderer.autoClearDepth = true;
        shadowRenderer.autoClearStencil = true;
        gl.preserveDrawingBuffer = false;
        return buf;
    }

    function hightArea() {

    }

    document.addEventListener('mousedown', onDocumentMouseDown);
    document.addEventListener('mouseup', onDocumentMouseUp);
    document.addEventListener('mousemove', onDocumentMouseMove);

})();

(function() {

})();

// $('#Earth').hide();
// setInterval(function() {
// $('#Earth,#EarthShadow').toggle()
// }, 1000);
