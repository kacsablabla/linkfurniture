


var scene = new Physijs.Scene;//THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
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

function main_init() {

    scene.setGravity(gravity);
    
    scene.addEventListener(
        'update',
        function() {
            physicssimulationcounter--;
            if (physicssimulationcounter <=0) {
                //physicssimulation = false;
            };
            if (true || controllee != undefined)
                for (var i = objectgroup.length - 1; i >= 0; i--) {
                    var obj = objectgroup[i]
                    if (obj instanceof Square){

                        //obj.setAngularFactor(new THREE.Vector3(0.8,0.8,0.8));
                        //obj.setLinearFactor(new THREE.Vector3(0.8,0.8,0.8));
                         
                        var linear = obj.getLinearVelocity();
                        obj.setLinearVelocity(linear.multiplyScalar(0.98));

                        var angular = obj.getAngularVelocity();
                        obj.setAngularVelocity(angular.multiplyScalar(0.98));

                        //obj.setLinearVelocity(obj.getLinearVelocity().multiplyScalar(0.95));
                    }
                    
                };
                
            //physics_stats.update();
        }
    );
    

    projector = new THREE.Projector();

    
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
    objectgroup.push(square1);
    scene.add(square1);
    square1.initconstraints();
    

    camera.position.z =8;
    
    
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
            scene.simulate(); // run physic
        };
        
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
            renderer.render( scene, camera );
    }
    function update() {

    }
    animate();
    
    
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

function executecommand(command){

    command = command ?  command.split() : document.getElementById('command').value.split();
    console.log(command);
    switch(command[0]){
        case 'square':
            //if (selectededges.length == 0)return;
            var s = new Square();
            objectgroup.push(s);
            scene.add(s);
            s.initconstraints();
            //select (s.edges[0]);
            //bindedges(selectededges[0],s.edges[0]);
            
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
    var connectora = a.getconnector();
    var connectorb = b.getconnector();
    //return;
    //connectorb.position.copy(connectora.position);
    connectora.mergeWithConnector(connectorb);
    scene.remove(connectorb);
}

function disconnectcorners(corner,face){
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
  var a1 = a.corners[0];
  var a2 = a.corners[1];
  var b1 = b.corners[0];
  var b2 = b.corners[1];

  connectcorners(a1,b1);
  connectcorners(a2,b2);
}

function disconnectedges(a,b){

  var a1 = a.corners[0];
  var a2 = a.corners[1];

  disconnectcorners(a1,b);
  disconnectcorners(a2,b);
}

function bindedges(a,b){

    if (b == undefined ) {
        return;
    };
  

    if (!(a.parent.mass == 0 || b.parent.mass == 0)) {
        //a.parent.mass = 0;
    };
    

    var axisa =  a.getaxis();
    var posa = a.getposition();
    var pointa1 = posa.clone().sub(axisa);
    var pointa2 = posa.clone().add(axisa);
    axisa.multiplyScalar(0.5);

    var axisb =  b.getaxis();
    var posb = b.getposition();
    var pointb1 = posb.clone().sub(axisb);
    var pointb2 = posb.clone().add(axisb);

    var simpledistancesum = pointa1.distanceToSquared(pointb1)+pointa2.distanceToSquared(pointb2);
    var crossdistancesum = pointa1.distanceToSquared(pointb2)+pointa2.distanceToSquared(pointb1);

    if (crossdistancesum < simpledistancesum) {
        var temp = pointb1;
        pointb1 = pointb2;
        pointb2 = temp;
    };
    var length = 10;
    var hex = 0xffff00;


    var arrowHelper = new THREE.ArrowHelper( axisa, posa, length, hex );
    scene.add( arrowHelper );
    arrowHelper.scale = 10;
    
    //constraint1
    var constraint1 = new Physijs.PointConstraint(
        a.parent, // First object to be constrained
        b.parent, // OPTIONAL second object - if omitted then physijs_mesh_1 will be constrained to the scene
        pointa1 // point in the scene to apply the constraint
    );
    constraint1.positionb  = b.parent.worldToLocal(pointb1);//b.parent.worldToLocal(b.position.clone())// window.Phisijs.convertWorldPositionToObject( b.position, b.parent ).clone();
    constraint1.scene = scene;
    scene.addConstraint( constraint1 ,true);

    //constraint2
    var constraint2 = new Physijs.PointConstraint(
        a.parent, // First object to be constrained
        b.parent, // OPTIONAL second object - if omitted then physijs_mesh_1 will be constrained to the scene
        pointa2 // point in the scene to apply the constraint
    );
    constraint2.positionb  = b.parent.worldToLocal(pointb2);//b.parent.worldToLocal(b.position.clone())// window.Phisijs.convertWorldPositionToObject( b.position, b.parent ).clone();
    constraint2.scene = scene;
    scene.addConstraint( constraint2 ,true);


    

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
    if (physicssimulation == false) {
        for (var i = objectgroup.length - 1; i >= 0; i--) {
            objectgroup[i].__dirtyPosition = true;
            objectgroup[i].__dirtyRotation = true;
        };
        physicssimulationcounter = 500;
    };
    physicssimulation = !physicssimulation;
    if (physicssimulation) scene.onSimulationResume();
}

function gravityswitch(){
    if (gravity.y == 0) {gravity.y = -7}
    else {gravity.y = 0;}
    
    scene.setGravity(gravity);
    
}

function changed(){
    alert('changed');
}


