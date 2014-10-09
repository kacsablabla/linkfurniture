


var scene = new Physijs.Scene;//THREE.Scene();
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100000 );
//var renderer = new THREE.WebGLRenderer();
var renderer //= new THREE.WebGLRenderer( { antialias: true, canvas: canvas} );
var objectgroup = [];
var defaultmaterial = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0xAAAAAA, specular: 0x111111, shininess: 200 } );
//scene.add(objectgroup);
var physicssimulationcounter = 500;
var physicssimulation = false;
var currentIntersected,raycaster;
var mouse = new THREE.Vector2();
var orbitcontrol;
var transformcontrol;
//var controllee;
var mousedown = false;
var mousemoved = false;
var mousedragging = false;
var selectededges = [];
var selectedcorners = [];
var canvas = document.getElementById('viewer');
var gravity = new THREE.Vector3( 0, 0, 0 );
var scale = 0.01;
var boxsize = 20000;
var helpervisibility = true;
var light_ambient;
var light_spot;
var light_directional;

var transformhelper = new TransformHelper();
scene.add(transformhelper);


function main_init() {
    renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas} );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;

    loadmeshes();

    camera.position.set(1060.698, 792.767722,988.59642); 
    projector = new THREE.Projector();
    raycaster = new THREE.Raycaster();
    raycaster.linePrecision = 0.3;

    scene.setGravity(gravity);
    
    // LIGHTS

    light_ambient = new THREE.AmbientLight( 0x777777 );
    scene.add( light_ambient );
    addspotlight();
    addShadowedLight(1500,1500,1500,0xffffff,0.33);

    var urls = [
      'textures/skybox/sky/right.jpg',
      'textures/skybox/sky/left.jpg',
      'textures/skybox/sky/top.jpg',
      'textures/skybox/sky/bottom.jpg',
      'textures/skybox/sky/front.jpg',
      'textures/skybox/sky/back.jpg'
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
      new THREE.BoxGeometry(boxsize, boxsize, boxsize),
      skyBoxMaterial
    );

    scene.add(skybox);
    
    var table = new Table();
    scene.add(table);
    
    orbitcontrol = new THREE.OrbitControls( camera );
    orbitcontrol.addEventListener( 'change', update );
    canvas.addEventListener( 'mousedown', onDocumentMouseDown, false );
    canvas.addEventListener( 'mouseup', onDocumentMouseUp, false );
    canvas.addEventListener( 'mousemove', onDocumentMouseMove, false );
    canvas.addEventListener( 'click', onDocumentMouseClick, false );
    
    scene.add( new THREE.GridHelper( boxsize/2, edgelength ) );

    transformcontrol = new THREE.TransformControls( camera, renderer.domElement );

    transformcontrol.addEventListener( 'change', render );

    canvas.addEventListener( 'keydown', function ( event ) {
        
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
            transformhelper.detach( );
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
        transformhelper.update();
        if (physicssimulation) {
            physicsautooff();
            scene.simulate(); // run physic
        };
        
        renderer.render( scene, camera );
    }
    function update() {
        //check camera position
        var limit = boxsize/2-100;
        if (camera.position.x>=limit)camera.position.x = limit;
        if (camera.position.y>=limit)camera.position.y = limit;
        if (camera.position.z>=limit)camera.position.z = limit;
        if (camera.position.x<=-limit)camera.position.x = -limit;
        if (camera.position.y<=-limit)camera.position.y = -limit;
        if (camera.position.z<=-limit)camera.position.z = -limit;
    }
    animate();
    
    
};
function selectmousetarget(){
    var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
    projector.unprojectVector( vector, camera );

    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

    var intersects = raycaster.intersectObjects( objectgroup, true);
    var closestintersection;
    for (var i = 0; intersects.length > i; i++) {

        if (intersects[i].object.visible){

            closestintersection = intersects[i].object;
            break;
        }
    };

    if ( closestintersection  ) {

        if ( currentIntersected !== undefined ) {

            hoverout(currentIntersected);
        }

        currentIntersected = closestintersection;
        hoverover(currentIntersected);
        

    } else {

        if ( currentIntersected !== undefined ) {

            hoverout(currentIntersected);
        }
        currentIntersected = undefined;
    }
};

function onDocumentMouseClick(){
    if (!mousemoved) {
        if (currentIntersected == undefined) {
            deselectcorners();
            deselectedges();
            transformhelper.detach();
            orbitcontrol.enabled = true;
        }
        else if (currentIntersected.transformable) {
            physicssimulation = false;
            transformhelper.attach( currentIntersected);
            orbitcontrol.enabled = false; 
        }
        else{
            select(currentIntersected);
            if (currentIntersected instanceof Edge) selectededges.push(currentIntersected);
            else if (currentIntersected instanceof Corner ||
             currentIntersected instanceof CornerConnector) selectedcorners.push(currentIntersected);
            
            }
        ;
    };
    
}

function onDocumentMouseDown( event ) {
    canvas.focus();
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
    if (mousedown) {
        mousedragging = true;
    }
    else selectmousetarget();
    mousemoved = true;

    var rect = canvas.getBoundingClientRect();
    mouse.x = ( (event.clientX-rect.left)/ window.innerWidth ) * 2 - 1;
    mouse.y = - ( (event.clientY-rect.top) / window.innerHeight ) * 2 + 1;
    


}


function addspotlight(){
    light_spot = new THREE.SpotLight( 0xffffff, 0.33, 0, Math.PI / 2, 1 );
    light_spot.position.set( boxsize/4, boxsize/4, boxsize/4 );
    light_spot.target.position.set( 0, 0, 0 );

    light_spot.castShadow = true;

    light_spot.shadowCameraNear = 1200;
    light_spot.shadowCameraFar = boxsize/2;
    light_spot.shadowCameraFov = 50;

    light_spot.shadowBias = 0.00001;
    light_spot.shadowDarkness = 0.18;

    scene.add( light_spot );
}

function addShadowedLight( x, y, z, color, intensity ) {

    light_directional = new THREE.DirectionalLight( color, intensity );
    light_directional.position.set( x, y, z )
    scene.add( light_directional );

    light_directional.castShadow = true;
     //light_directional.shadowCameraVisible = true;

    var d = 1;
    light_directional.shadowCameraLeft = -d;
    light_directional.shadowCameraRight = d;
    light_directional.shadowCameraTop = d;
    light_directional.shadowCameraBottom = -d;

    light_directional.shadowCameraNear = 1;
    light_directional.shadowCameraFar = 3000;

    light_directional.shadowMapWidth = 1024;
    light_directional.shadowMapHeight = 1024;

    light_directional.shadowBias = -0.005;
    light_directional.shadowDarkness = 0.015;

}





