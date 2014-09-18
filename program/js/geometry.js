


var scene = new Physijs.Scene;//THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var objectgroup = new THREE.Object3D();
var defaultmaterial = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0xAAAAAA, specular: 0x111111, shininess: 200 } );
scene.add(objectgroup);
var currentIntersected,raycaster;
var mouse = new THREE.Vector2();
var radius = 100, theta = 0;
var orbitcontrol;
var transformcontrol;
var controllee;
var mousedown = false;
var mousemoved = false;
var mousedragging = false;
var selectededges = [];
var canvas = document.getElementById('viewer');

function main_init() {
    
    projector = new THREE.Projector();

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer

    renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas} );
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Skybox

    var urls = [
      'textures/skybox/darkgloom_right.jpg',
      'textures/skybox/darkgloom_left.jpg',
      'textures/skybox/darkgloom_top.jpg',
      'textures/skybox/darkgloom_top.jpg',
      'textures/skybox/darkgloom_front.jpg',
      'textures/skybox/darkgloom_back.jpg'
    ];

    var cubemap = THREE.ImageUtils.loadTextureCube(urls); // load textures
    cubemap.format = THREE.RGBFormat;

    var shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib
    shader.uniforms['tCube'].value = cubemap; // apply textures to shader

    // create shader material
    var skyBoxMaterial = new THREE.ShaderMaterial( {
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide
    });

    // create skybox mesh
    var skybox = new THREE.Mesh(
      new THREE.BoxGeometry(1000, 1000, 1000),
      skyBoxMaterial
    );

    scene.add(skybox);
    var material = new THREE.MeshLambertMaterial({
        envMap: cubemap
    });
    mesh = new THREE.Mesh( new THREE.BoxGeometry( 100000, 100000, 100000 ), material );
    scene.add( mesh );

    raycaster = new THREE.Raycaster();
    raycaster.linePrecision = 0.3;


    /*
    var PI2 = Math.PI * 2;
    var program = function ( context ) {

        context.beginPath();
        context.arc( 0, 0, 0.5, 0, PI2, true );
        context.fill();

    }

    sphereInter = new THREE.Sprite(
        new THREE.SpriteCanvasMaterial( {
            color: 0xff0000,
            program: program }
        )
    );
    sphereInter.scale.x = sphereInter.scale.y = 10;
    sphereInter.visible = false;
    //scene.add( sphereInter );
    */
    document.body.appendChild( renderer.domElement );
    
    
    orbitcontrol = new THREE.OrbitControls( camera );
    orbitcontrol.addEventListener( 'change', update );
    canvas.addEventListener( 'mousedown', onDocumentMouseDown, false );
    canvas.addEventListener( 'mouseup', onDocumentMouseUp, false );
    canvas.addEventListener( 'mousemove', onDocumentMouseMove, false );
    canvas.addEventListener( 'click', onDocumentMouseClick, false );
    
    scene.add( new THREE.GridHelper( 500, 100 ) );
   
    

    var loader = new THREE.STLLoader();
    loader.addEventListener( 'load', function ( event ) {

        var geometry = event.content;
        var mesh = new THREE.Mesh( geometry, defaultmaterial );

        mesh.position.set( 0, - 0.37, - 0.6 );
        //mesh.rotation.set( - Math.PI / 2, 0, 0 );
        mesh.scale.set( 0.1, 0.1, 0.1 );

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        scene.add( mesh );

    } );
    //loader.load( 'http://localhost:8000/Documents/BME/szakdoga/program/models/1.stl' );


    
    var square1 = new Square();
    var square2 = new Square();
    objectgroup.add(square1);
    //square1.add(square2);
    //square2.position.y +=10;
    //square1.rotate("X",30);
    

    camera.position.z =8;
    
    
    transformcontrol = new THREE.TransformControls( camera, renderer.domElement );

    transformcontrol.addEventListener( 'change', render );

    window.addEventListener( 'keydown', function ( event ) {
        //console.log(event.which);
        switch ( event.keyCode ) {
          case 81: // Q
            transformcontrol.setSpace( transformcontrol.space == "local" ? "world" : "local" );
            break;
          case 87: // W
            transformcontrol.setMode( "translate" );
            break;
          case 69: // E
            transformcontrol.setMode( "rotate" );
            break;
          case 70: // E
            transformcontrol.detach( controllee );
            orbitcontrol.enabled = true;
            break;
          case 82: // R
            transformcontrol.setMode( "scale" );
            break;
        case 187:
        case 107: // +,=,num+
            transformcontrol.setSize( transformcontrol.size + 0.1 );
            break;
        case 189:
        case 10: // -,_,num-
            transformcontrol.setSize( Math.max(transformcontrol.size - 0.1, 0.1 ) );
            break;
        }            
    });

    
    scene.add( transformcontrol );

    function animate() {

        requestAnimationFrame( animate );

        render();

    }
    function render() {
        transformcontrol.update();
        //orbitcontrol.update();
        // find intersections
        scene.simulate(); // run physic
        var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
        projector.unprojectVector( vector, camera );

        raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

        var intersects = raycaster.intersectObjects( objectgroup.children, true);

        if ( intersects.length > 0 ) {

            if ( currentIntersected !== undefined ) {

                currentIntersected.hoverout();
            }

            currentIntersected = intersects[ 0 ].object;
            currentIntersected.hoverover();
            

        } else {

            if ( currentIntersected !== undefined ) {

                currentIntersected.hoverout();
            }

            currentIntersected = undefined;
        }
            renderer.render( scene, camera );
    }
    function update() {

    }
    animate();
    
    
};

function onDocumentMouseClick(){
    if (!mousemoved) {
        if (currentIntersected == undefined) {
            for (var i = selectededges.length - 1; i >= 0; i--) {
                selectededges[i].deselect();
            };
            selectededges = [];
            transformcontrol.detach(controllee)
            controllee = null;
            orbitcontrol.enabled = true;
        }
        else if (currentIntersected.transformable) {
            controllee = currentIntersected;
            transformcontrol.attach( controllee); 
            orbitcontrol.enabled = false; 
        }
        else{
            currentIntersected.select();
            selectededges.push(currentIntersected);
        }
        ;
    };
    
}

function onDocumentMouseDown( event ) {

    event.preventDefault();
    mousedown = true;
    mousedragging = false;
    mousemoved = false;
    
}
function onDocumentMouseUp( event ) {

    event.preventDefault();
    mousedown = false;
    
}

function onDocumentMouseMove( event ) {

    event.preventDefault();
    if (mousedown) {mousedragging = true};
    mousemoved = true;

    var rect = canvas.getBoundingClientRect();
    mouse.x = ( (event.clientX-rect.left)/ window.innerWidth ) * 2 - 1;
    mouse.y = - ( (event.clientY-rect.top) / window.innerHeight ) * 2 + 1;
    


}

function addShadowedLight( x, y, z, color, intensity ) {

    var directionalLight = new THREE.DirectionalLight( color, intensity );
    directionalLight.position.set( x, y, z )
    scene.add( directionalLight );

    directionalLight.castShadow = true;
    // directionalLight.shadowCameraVisible = true;

    var d = 1;
    directionalLight.shadowCameraLeft = -d;
    directionalLight.shadowCameraRight = d;
    directionalLight.shadowCameraTop = d;
    directionalLight.shadowCameraBottom = -d;

    directionalLight.shadowCameraNear = 1;
    directionalLight.shadowCameraFar = 4;

    directionalLight.shadowMapWidth = 1024;
    directionalLight.shadowMapHeight = 1024;

    directionalLight.shadowBias = -0.005;
    directionalLight.shadowDarkness = 0.15;

}
