


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
var controllee;
var mousedown = false;
var mousemoved = false;
var mousedragging = false;
var selectededges = [];
var selectedcorners = [];
var canvas = document.getElementById('viewer');
var gravity = new THREE.Vector3( 0, 0, 0 );
var scale = 0.01;
var boxsize = 20000;

function main_init() {
    renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas} );
    renderer.setSize( window.innerWidth, window.innerHeight );
    loadmeshes();

    camera.position.set(1060.698, 792.767722,988.59642); 
    projector = new THREE.Projector();
    raycaster = new THREE.Raycaster();
    raycaster.linePrecision = 0.3;

    scene.setGravity(gravity);
    
    


    
    //renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer

    
    

    // Skybox
    
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
    //skybox.position.set(0,49999,0);//add(0,5000,0);

    scene.add(skybox);
    


    /*
    var material = new THREE.MeshLambertMaterial({
        envMap: cubemap
    });
    mesh = new THREE.Mesh( new THREE.BoxGeometry( 10000000, 10000000, 10000000 ), material );
    scene.add( mesh );

    

    // Materials
    var table_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( 'textures/wood_texture1.jpg' ), ambient: 0x888888 }),
        .9, // high friction
        .2 // low restitution
    );
    table_material.map.wrapS = table_material.map.wrapT = THREE.RepeatWrapping;
    table_material.map.repeat.set( 5, 5 );

    // Table
    var table = new Physijs.BoxMesh(
        new THREE.BoxGeometry(50, 1, 50),
        material,
        0, // mass
        { restitution: .2, friction: .8 }
    );
    table.position.y = -10;
    table.receiveShadow = true;
    scene.add( table );
    
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
    //document.body.appendChild( renderer.domElement );
    var table = new Table();
    scene.add(table);
    
    orbitcontrol = new THREE.OrbitControls( camera );
    orbitcontrol.addEventListener( 'change', update );
    canvas.addEventListener( 'mousedown', onDocumentMouseDown, false );
    canvas.addEventListener( 'mouseup', onDocumentMouseUp, false );
    canvas.addEventListener( 'mousemove', onDocumentMouseMove, false );
    canvas.addEventListener( 'click', onDocumentMouseClick, false );
    
    scene.add( new THREE.GridHelper( boxsize/2, edgelength ) );
   
    

    

    /*
    var square1 = new Square();
    objectgroup.push(square1);
    scene.add(square1);
    square1.initconstraints();
    */

   
    
    transformcontrol = new THREE.TransformControls( camera, renderer.domElement );

    transformcontrol.addEventListener( 'change', render );

    canvas.addEventListener( 'keydown', function ( event ) {
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
        if (physicssimulation) {
            physicsautooff();
            scene.simulate(); // run physic
        };
        
        renderer.render( scene, camera );
    }
    function update() {
        //check camera position
        var lowerlimit = boxsize/2+100;
        var upperlimit = boxsize/2-100;
        if (camera.position.x>=upperlimit)camera.position.x = upperlimit;
        if (camera.position.y>=upperlimit)camera.position.y = upperlimit;
        if (camera.position.z>=upperlimit)camera.position.z = upperlimit;
        if (camera.position.x<=-lowerlimit)camera.position.x = -lowerlimit;
        if (camera.position.y<=-lowerlimit)camera.position.y = -lowerlimit;
        if (camera.position.z<=-lowerlimit)camera.position.z = -lowerlimit;
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

function executecommand(command){

    command = command ?  command.split() : document.getElementById('command').value.split();
    console.log(command);
    switch(command[0]){
        case 'test1':
            for (var i = 25 - 1; i >= 0; i--) {
                var s = new Square();
                objectgroup.push(s);
                scene.add(s);
                s.initconstraints();
            };
            physicsswitch();
            //select (s.edges[0]);
            //bindedges(selectededges[0],s.edges[0]);
            
            break;

        case 'square':
            //if (selectededges.length == 0)return;
            var s = new Square();
            objectgroup.push(s);
            scene.add(s);
            s.initconstraints();
            //select (s.edges[0]);
            //bindedges(selectededges[0],s.edges[0]);
            
            break;
        case 'equilat':
            var s = new Equilat();
            objectgroup.push(s);
            scene.add(s);
            s.initconstraints();
            
            break;
        case 'rightangle':
            var s = new RightAngled();
            objectgroup.push(s);
            scene.add(s);
            s.initconstraints();
            
            break;
        case 'connect':
            if (selectededges.length == 2)
                connectedges(selectededges[0],selectededges[1]);
            else if (selectedcorners.length == 2) 
                connectcorners(selectedcorners[0],selectedcorners[1]);
            //bindedges(selectededges[0],selectededges[1]);
            break;
        case 'nail':
            nail(selectededges[0]);
            break;
        case 'disconnect':
            if (selectedcorners.length == 1 && controllee != undefined)
                disconnectcorners(selectedcorners[0],controllee);
            else if (selectededges.length == 1 && controllee != undefined)
                disconnectedges(selectededges[0],controllee);
            break;
    }
}

function deselectedges(){
    for (var i = selectededges.length - 1; i >= 0; i--) {
        deselect(selectededges[i]);
    };
    selectededges = [];
}
function deselectcorners(){

    for (var i = selectedcorners.length - 1; i >= 0; i--) {
        deselect(selectedcorners[i]);
    };
    selectedcorners = [];
}

function connectcorners(a,b){
    deselectcorners();
    physicson()
    var connectora = a.getconnector();
    var connectorb = b.getconnector();
    //return;
    //connectorb.position.copy(connectora.position);
    connectora.mergeWithConnector(connectorb);
    scene.remove(connectorb);
}

function disconnectcorners(corner,face){
    deselectcorners();
    physicson()
   var connector = corner.getconnector();
   var corner
   for (var i = connector.corners.length - 1; i >= 0; i--) {
       if (connector.corners[i].parent == face) {
            corner = connector.corners[i];
            break;
        }
   };
   if (connector.removecorner(corner)) corner.visible = true;
    
   
}

function connectedges(a,b){
    deselectedges();
    physicson()
    var a1 = a.corners[0];
    var a2 = a.corners[1];
    var b1 = b.corners[0];
    var b2 = b.corners[1];

    var normaldist = a1.position.distanceToSquared(b1.position)+a2.position.distanceToSquared(b2.position);
    var crossdist = a1.position.distanceToSquared(b2.position)+a2.position.distanceToSquared(b1.position);
    if (crossdist<normaldist) {var temp = b1; b1 = b2; b2 = temp;};

    connectcorners(a1,b1);
    connectcorners(a2,b2);
}

function disconnectedges(a,b){
    deselectedges();
    physicson()
  var a1 = a.corners[0];
  var a2 = a.corners[1];

  disconnectcorners(a1,b);
  disconnectcorners(a2,b);
}


function nail(mymesh){
    if (mymesh.mass !=0){
        mymesh.mass = 0;
        mymesh.material.color.set (color_nailed);
    }
    else{
        mymesh.mass = 5;
        mymesh.material.color.set (color_default);
    };
    
    /*
    var constraint = new Physijs.PointConstraint(
        mymesh, // First object to be constrained
        mymesh.position // point in the scene to apply the constraint
    );
    scene.addConstraint( constraint );
    */

}

function physicsswitch(){
    if (! physicssimulation) physicson();
    else{
        physicsoff();
    }
}
function physicsoff(){
};

function physicson(){
    if (physicssimulation) return;
    /*for (var i = objectgroup.length - 1; i >= 0; i--) {
            objectgroup[i].__dirtyPosition = true;
            objectgroup[i].__dirtyRotation = true;
    };*/
    physicssimulationcounter = 150;
    physicssimulation = true;
    scene.onSimulationResume();
}

function physicsautooff(){

    var shouldstopphysics = true;
    physicssimulationcounter--;
    if (physicssimulationcounter >=0) {
        shouldstopphysics = false;
    };
    
    for (var i = objectgroup.length - 1; i >= 0; i--) {
        var obj = objectgroup[i]
        if (obj instanceof Square){


            //obj.setAngularFactor(new THREE.Vector3(0.8,0.8,0.8));
            //obj.setLinearFactor(new THREE.Vector3(0.8,0.8,0.8));
             
            var linear = obj.getLinearVelocity();
            obj.setLinearVelocity(linear.multiplyScalar(0.7));

            var angular = obj.getAngularVelocity();
            obj.setAngularVelocity(angular.multiplyScalar(0.7));

            if (shouldstopphysics == true) {
                //console.log('linear: '+linearlen+" angular:" + angularlen);
                if (linear.length()>1 || angular.length()>1) shouldstopphysics = false;
            };
            //console.log('linear: '+linear.length()+" angular:" + angular.length())
            //obj.setLinearVelocity(obj.getLinearVelocity().multiplyScalar(0.95));
        }
        
    };

    if (shouldstopphysics) physicssimulation = false;
}
function gravityswitch(){
    if (gravity.y == 0) {gravity.y = -7}
    else {gravity.y = 0;}
    
    scene.setGravity(gravity);
    
}

function changed(){
    alert('changed');
}


