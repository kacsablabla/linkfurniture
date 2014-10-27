


var scene = new Physijs.Scene;//THREE.Scene();
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100000 );
var renderer //= new THREE.WebGLRenderer( { antialias: true, canvas: canvas} );
var objectgroup = [];
var defaultmaterial = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0xAAAAAA, specular: 0x111111, shininess: 200 } );
var physicssimulationcounter = 500;
var physicssimulation = false;
var currentIntersected,raycaster,intersectionpoint;
var mouse = new THREE.Vector2();
var orbitcontrol;
var transformcontrol;
var mousedown = false;
var mousemoved = false;
var mousedragging = false;
var selectededges = [];
var selectedcorners = [];
var selectedelements = [];
var canvas = document.getElementById('viewer');
var gravity = new THREE.Vector3( 0, 0, 0 );
var scale = 0.01;
var boxsize = 20000;
var helpervisibility = true;
var light_ambient;
var light_spot;
var light_directional;
var container = document.getElementById( "container" );
var transformhelper = new TransformHelper();
var transformtype ; // 0:translate, 1:rotate
scene.add(transformhelper);


function main_init() {

    
    //Stats
    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.right = '0px';
    //stats.domElement.style.left = '400px';
    container.appendChild( stats.domElement );
    

    renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );
    container.appendChild(renderer.domElement);
    renderer.domElement.id = "renderercanvas";
    //renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;

    loadmeshes();

    camera.position.set(1060.698, 792.767722,988.59642); 
    projector = new THREE.Projector();
    raycaster = new THREE.Raycaster();
    raycaster.linePrecision = 0.3;

    scene.setGravity(gravity);
    
    // LIGHTS

    light_ambient = new THREE.AmbientLight( 0x999999 );
    scene.add( light_ambient );
    addspotlight();
    addShadowedLight(1500,1500,1500,0xffffff,0.33);

    var urls = [
      'textures/skybox/sky/right.jpg',
      'textures/skybox/sky/left.jpg',
      'textures/skybox/sky/top.jpg',
      'textures/skybox/sky/bottom.jpg',
      'textures/skybox/sky/front.jpg',
      //'textures/ant.jpg',
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
    orbitcontrol.addEventListener( 'change', orbitupdate );
    //renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
    //renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
    //renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
    //renderer.domElement.addEventListener( 'click', onDocumentMouseClick, false );
    window.addEventListener( 'resize', onWindowResize, false );

    onWindowResize();

    function onWindowResize( event ) {

        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( container.offsetWidth, container.offsetHeight );

    }
    
    scene.add( new THREE.GridHelper( boxsize/2, edgelength ) );

    transformcontrol = new THREE.TransformControls( camera, renderer.domElement );

    transformcontrol.addEventListener( 'change', transformupdate );

    container.addEventListener( 'keydown', function ( event ) {
        
        switch ( event.keyCode ) {
          case 81: // Q
            //transformcontrol.setSpace( transformcontrol.space == "local" ? "world" : "local" );
            break;
          case 87: // W
            transformtype = 0;
            return;
            transformcontrol.setMode( "translate" );
            break;
          case 69: // E
            transformtype = 1;
            return;
            transformcontrol.setMode( "rotate" );
            break;
          case 70: // F
            transformhelper.detach( );
            orbitcontrol.enabled = true;
            break;
          case 84: // E
            transformtype = 0;
            break;
          case 82: // R
            transformtype = 1;
            //transformcontrol.setMode( "scale" );
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

        stats.update(); 
        if (physicssimulation) {
            physicsautooff();
            scene.simulate(); // run physic
        };
        renderer.render( scene, camera );
    }
    function orbitupdate() {
        //check camera position
        var limit = boxsize/2-100;
        if (camera.position.x>=limit)camera.position.x = limit;
        if (camera.position.y>=limit)camera.position.y = limit;
        if (camera.position.z>=limit)camera.position.z = limit;
        if (camera.position.x<=-limit)camera.position.x = -limit;
        if (camera.position.y<=-limit)camera.position.y = -limit;
        if (camera.position.z<=-limit)camera.position.z = -limit;
    }
    function transformupdate() {

        transformcontrol.update();
        transformhelper.update();
        for (var i = objectgroup.length - 1; i >= 0; i--) {
            if (objectgroup[i] instanceof CornerConnector) continue;
            objectgroup[i].rendercallback();
            boundposition(objectgroup[i]);
        };

    }
    animate();

    function boundposition(element){

        /*
        var limit = boxsize/2-200;
        if (element.position.x>=limit)element.position.x = limit;
        if (element.position.y>=limit)element.position.y = limit;
        if (element.position.z>=limit)element.position.z = limit;
        if (element.position.x<=-limit)element.position.x = -limit;
        if (element.position.y<=20)element.position.y = 0;
        if (element.position.z<=-limit)element.position.z = -limit;
        */
    }
    
    
};
function selectmousetarget(){
    var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
    projector.unprojectVector( vector, camera );

    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

    var intersects = raycaster.intersectObjects( objectgroup, true);
    var closestintersection;
    for (var i = 0; intersects.length > i; i++) {

        if (intersects[i].object.visible && !(intersects[i].object instanceof Element)){

            closestintersection = intersects[i].object;
            intersectionpoint = intersects[i];
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

function onDocumentMouseClick(event){
    //console.log('mouseclick');
    if (event.button !=0) return;
    if (mousemoved<=2) {
        if (currentIntersected == undefined) {
            deselectall();
            transformhelper.detach();
            orbitcontrol.enabled = true;
        }
        else if (currentIntersected instanceof ElementVisualizer) {
            physicssimulation = false;
            transformhelper.detach();
            select(currentIntersected);
            selectedelements.push(currentIntersected.parent);
            performfunction();
            //transformhelper.attach( currentIntersected);
            //orbitcontrol.enabled = false; 
        }
        else{
            select(currentIntersected);
            transformhelper.detach();
            if (currentIntersected instanceof Edge){
                selectededges.push(currentIntersected);
                performfunction();
            } 
            else if (currentIntersected instanceof Corner ||
             currentIntersected instanceof CornerConnector){
                selectedcorners.push(currentIntersected);
                //currentIntersected.realconnector.visible = true;
                //console.log(currentIntersected.parent.corners.indexOf(currentIntersected))
                performfunction();
            } 
            if (currentIntersected instanceof Visualizer) {
                selectedcorners.push(currentIntersected.parent);
                performfunction();
            }
        };
    };
    
}

function onDocumentMouseDown( event ) {
    //console.log('mousedown');
    if (event.button !=0 ) return;
    container.focus();
    event.preventDefault();
    mousedown = true;
    mousedragging = false;
    mousemoved = 0;
    if (currentIntersected != undefined ) {
        var multipletransform = false;
        if (transformtype >1) multipletransform = true;

        if (transformtype == 1|| transformtype == 3) {

            transformhelper.detach();
            var intersected ;
            if (currentIntersected instanceof Visualizer)intersected = currentIntersected.parent.corners[0];
            if (currentIntersected instanceof Corner)intersected = currentIntersected;
            if (currentIntersected instanceof Edge)intersected = currentIntersected;
            if (intersected != undefined) {
                intersected = intersected.getbrotherforelement(selectedelements[0]);
                var edge = intersected.parent.getcrossededge(intersected);
                if (edge != undefined) {
                    transformcontrol.setMode( "rotate" );
                    transformhelper.attach( intersected.parent, edge,multipletransform);
                    transformcontrol.pointerDownIntersect("Y",intersectionpoint);
                };

            };
        };

        if (transformtype == 0 || transformtype == 2) {
            
            transformhelper.detach();
            var intersected ;
            var edge;
            if (currentIntersected instanceof Edge){
                intersected = currentIntersected.parent;
                edge = currentIntersected;
            }
            if (currentIntersected instanceof ElementVisualizer) {
                edge = currentIntersected.parent;
                intersected = currentIntersected.parent;
            };
            if (intersected != undefined) {

                transformcontrol.setMode( "translate" );
                if (edge == intersected) {
                    edge = intersected.edges[0];
                    transformhelper.attach( intersected,edge,multipletransform);
                    transformcontrol.pointerDownIntersect("Z",intersectionpoint);
                }
                else {
                    transformhelper.attach( intersected,edge,multipletransform);
                    transformcontrol.pointerDownIntersect("Y",intersectionpoint)
                };
                

            };
        };
        
        
    };
    
}
function onDocumentMouseUp( event ) {
    //console.log('mouseup');
    if (event.button !=0) return;
    event.preventDefault();
    mousedown = false;
    transformhelper.detach();
    //transformhelper.detach();
    
}

function onDocumentMouseMove( event ) {
    //console.log('mousemove');
    if (event.button !=0) return;
    event.preventDefault();
    if (mousedown) {
        mousedragging = true;
    }
    else selectmousetarget();
    mousemoved += 1;
    //container.offsetWidth, container.offsetHeight
    var rect = container.getBoundingClientRect();
    mouse.x = ( (event.clientX-rect.left)/ container.offsetWidth ) * 2 - 1;
    mouse.y = - ( (event.clientY-rect.top) / container.offsetHeight ) * 2 + 1;

    //if (mousedragging) {
        //transformhelper.attach( currentIntersected)
    //};

}


function addspotlight(){
    light_spot = new THREE.SpotLight( 0xffffff, 0.33, 0, Math.PI / 2, 1 );
    light_spot.position.set( 0, boxsize/2, boxsize/2 );
    light_spot.target.position.set( 0, 0, 0 );

    light_spot.castShadow = true;

    light_spot.shadowCameraNear = boxsize/2.5;
    light_spot.shadowCameraFar = boxsize*1.3;
    light_spot.shadowMapWidth = 2048;
    light_spot.shadowMapHeight = 2048;
    light_spot.shadowCameraFov = 100;

    light_spot.shadowBias = 0.00001;
    light_spot.shadowDarkness = 0.18;
    //light_spot.shadowCameraVisible = true;
    light_spot.angle = Math.PI/2;

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




