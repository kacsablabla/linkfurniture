


var scene = new Physijs.Scene;//THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var objectgroup = [];
var defaultmaterial = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0xAAAAAA, specular: 0x111111, shininess: 200 } );
//scene.add(objectgroup);
var physicssimulation = false;
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

    scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
    /*
    scene.addEventListener(
            'update',
            function() {
                scene.simulate( undefined, 2 );
                //physics_stats.update();
            }
        );
*/
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

        if ( intersects.length > 0 ) {

            if ( currentIntersected !== undefined ) {

                hoverout(currentIntersected);
            }

            currentIntersected = intersects[ 0 ].object;
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
            for (var i = selectededges.length - 1; i >= 0; i--) {
                deselect(selectededges[i]);
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
            select(currentIntersected);
            selectededges.push(currentIntersected);
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
            var s = new Square();
            objectgroup.push(s);
            scene.add(s);
            break;
        case 'connect':
            bindedges();
            break;
        case 'nail':
            nail(selectededges[0]);
            break;
    }
}

function bindedges(){
    var dir =  selectededges[0].getaxis();
    var origin =selectededges[0].getposition();
    var length = 10;
    var hex = 0xffff00;

    var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
    scene.add( arrowHelper );
    arrowHelper.scale = 10;

    var constraint = new Physijs.HingeConstraint(
        selectededges[0].parent, // First object to be constrained
         // OPTIONAL second object - if omitted then physijs_mesh_1 will be constrained to the scene
        origin, // point in the scene to apply the constraint
        dir// Axis along which the hinge lies - in this case it is the X axis
    );
    constraint.scene = scene;
    scene.addConstraint( constraint );
    constraint.setLimits(
        1, // minimum angle of motion, in radians
        2, // maximum angle of motion, in radians
        0.1, // applied as a factor to constraint error
        0.0 // controls bounce at limit (0.0 == no bounce)
    );
    //constraint.enableAngularMotor( target_velocity, acceration_force );
    //constraint.disableMotor();
    /*
    var constraint = new Physijs.DOFConstraint(
        selectededges[0], // First object to be constrained
        selectededges[1], // OPTIONAL second object - if omitted then physijs_mesh_1 will be constrained to the scene
        new THREE.Vector3( 0, 10, 0 ) // point in the scene to apply the constraint
        //new THREE.Vector3( 1, 0, 0 ) // Axis along which the hinge lies - in this case it is the X axis
    );
    scene.addConstraint( constraint );

    constraint.setLimits(
        90, // minimum angle of motion, in radians
        270 // maximum angle of motion, in radians
    );
    //constraint.enableAngularMotor( target_velocity, acceration_force );
    //constraint.disableMotor();
    */

}
function nail(mymesh){
    var constraint = new Physijs.PointConstraint(
        mymesh, // First object to be constrained
        new THREE.Vector3( 0, 10, 0 ) // point in the scene to apply the constraint
    );
    scene.addConstraint( constraint );

}

function physicsswitch(){
    if (physicssimulation == false) {
        for (var i = objectgroup.length - 1; i >= 0; i--) {
            objectgroup[i].__dirtyPosition = true;
            objectgroup[i].__dirtyRotation = true;
        };
    };
    physicssimulation = !physicssimulation;
    if (physicssimulation) scene.onSimulationResume();
}
/*

<script type="text/javascript">
    
    'use strict';
    
    Physijs.scripts.worker = '../physijs_worker.js';
    Physijs.scripts.ammo = 'examples/js/ammo.js';
    
    var initScene, initEventHandling, render, createTower,
        renderer, render_stats, physics_stats, scene, dir_light, am_light, camera,
        table, blocks = [], table_material, block_material, intersect_plane,
        selected_block = null, mouse_position = new THREE.Vector3, block_offset = new THREE.Vector3, _i, _v3 = new THREE.Vector3;
    
    initScene = function() {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        document.getElementById( 'viewport' ).appendChild( renderer.domElement );
        
        render_stats = new Stats();
        render_stats.domElement.style.position = 'absolute';
        render_stats.domElement.style.top = '1px';
        render_stats.domElement.style.zIndex = 100;
        document.getElementById( 'viewport' ).appendChild( render_stats.domElement );

        physics_stats = new Stats();
        physics_stats.domElement.style.position = 'absolute';
        physics_stats.domElement.style.top = '50px';
        physics_stats.domElement.style.zIndex = 100;
        document.getElementById( 'viewport' ).appendChild( physics_stats.domElement );
        
        scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });
        scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
        scene.addEventListener(
            'update',
            function() {

                if ( selected_block !== null ) {
                    
                    _v3.copy( mouse_position ).add( block_offset ).sub( selected_block.position ).multiplyScalar( 5 );
                    _v3.y = 0;
                    selected_block.setLinearVelocity( _v3 );
                    
                    // Reactivate all of the blocks
                    _v3.set( 0, 0, 0 );
                    for ( _i = 0; _i < blocks.length; _i++ ) {
                        blocks[_i].applyCentralImpulse( _v3 );
                    }
                }

                scene.simulate( undefined, 1 );
                physics_stats.update();
            }
        );
        
        camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        camera.position.set( 25, 20, 25 );
        camera.lookAt(new THREE.Vector3( 0, 7, 0 ));
        scene.add( camera );
        
        // ambient light
        am_light = new THREE.AmbientLight( 0x444444 );
        scene.add( am_light );

        // directional light
        dir_light = new THREE.DirectionalLight( 0xFFFFFF );
        dir_light.position.set( 20, 30, -5 );
        dir_light.target.position.copy( scene.position );
        dir_light.castShadow = true;
        dir_light.shadowCameraLeft = -30;
        dir_light.shadowCameraTop = -30;
        dir_light.shadowCameraRight = 30;
        dir_light.shadowCameraBottom = 30;
        dir_light.shadowCameraNear = 20;
        dir_light.shadowCameraFar = 200;
        dir_light.shadowBias = -.001
        dir_light.shadowMapWidth = dir_light.shadowMapHeight = 2048;
        dir_light.shadowDarkness = .5;
        scene.add( dir_light );
        
        // Materials
        table_material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( 'images/wood.jpg' ), ambient: 0xFFFFFF }),
            .9, // high friction
            .2 // low restitution
        );
        table_material.map.wrapS = table_material.map.wrapT = THREE.RepeatWrapping;
        table_material.map.repeat.set( 5, 5 );
        
        block_material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( 'images/plywood.jpg' ), ambient: 0xFFFFFF }),
            .4, // medium friction
            .4 // medium restitution
        );
        block_material.map.wrapS = block_material.map.wrapT = THREE.RepeatWrapping;
        block_material.map.repeat.set( 1, .5 );
        
        // Table
        table = new Physijs.BoxMesh(
            new THREE.CubeGeometry(50, 1, 50),
            table_material,
            0, // mass
            { restitution: .2, friction: .8 }
        );
        table.position.y = -.5;
        table.receiveShadow = true;
        scene.add( table );
        
        createTower();
        
        intersect_plane = new THREE.Mesh(
            new THREE.PlaneGeometry( 150, 150 ),
            new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })
        );
        intersect_plane.rotation.x = Math.PI / -2;
        scene.add( intersect_plane );

        initEventHandling();
        
        requestAnimationFrame( render );
        scene.simulate();
    };
    
    render = function() {
        requestAnimationFrame( render );
        renderer.render( scene, camera );
        render_stats.update();
    };
    
    createTower = (function() {
        var block_length = 6, block_height = 1, block_width = 1.5, block_offset = 2,
            block_geometry = new THREE.CubeGeometry( block_length, block_height, block_width );
        
        return function() {
            var i, j, rows = 16,
                block;
            
            for ( i = 0; i < rows; i++ ) {
                for ( j = 0; j < 3; j++ ) {
                    block = new Physijs.BoxMesh( block_geometry, block_material );
                    block.position.y = (block_height / 2) + block_height * i;
                    if ( i % 2 === 0 ) {
                        block.rotation.y = Math.PI / 2.01; // #TODO: There's a bug somewhere when this is to close to 2
                        block.position.x = block_offset * j - ( block_offset * 3 / 2 - block_offset / 2 );
                    } else {
                        block.position.z = block_offset * j - ( block_offset * 3 / 2 - block_offset / 2 );
                    }
                    block.receiveShadow = true;
                    block.castShadow = true;
                    scene.add( block );
                    blocks.push( block );
                }
            }
        }
    })();
    
    initEventHandling = (function() {
        var _vector = new THREE.Vector3,
            projector = new THREE.Projector(),
            handleMouseDown, handleMouseMove, handleMouseUp;
        
        handleMouseDown = function( evt ) {
            var ray, intersections;
            
            _vector.set(
                ( evt.clientX / window.innerWidth ) * 2 - 1,
                -( evt.clientY / window.innerHeight ) * 2 + 1,
                1
            );

            projector.unprojectVector( _vector, camera );
            
            ray = new THREE.Raycaster( camera.position, _vector.sub( camera.position ).normalize() );
            intersections = ray.intersectObjects( blocks );

            if ( intersections.length > 0 ) {
                selected_block = intersections[0].object;
                
                _vector.set( 0, 0, 0 );
                selected_block.setAngularFactor( _vector );
                selected_block.setAngularVelocity( _vector );
                selected_block.setLinearFactor( _vector );
                selected_block.setLinearVelocity( _vector );

                mouse_position.copy( intersections[0].point );
                block_offset.subVectors( selected_block.position, mouse_position );
                
                intersect_plane.position.y = mouse_position.y;
            }
        };
        
        handleMouseMove = function( evt ) {
            
            var ray, intersection,
                i, scalar;
            
            if ( selected_block !== null ) {
                
                _vector.set(
                    ( evt.clientX / window.innerWidth ) * 2 - 1,
                    -( evt.clientY / window.innerHeight ) * 2 + 1,
                    1
                );
                projector.unprojectVector( _vector, camera );
                
                ray = new THREE.Raycaster( camera.position, _vector.sub( camera.position ).normalize() );
                intersection = ray.intersectObject( intersect_plane );
                mouse_position.copy( intersection[0].point );
            }
            
        };
        
        handleMouseUp = function( evt ) {
            
            if ( selected_block !== null ) {
                _vector.set( 1, 1, 1 );
                selected_block.setAngularFactor( _vector );
                selected_block.setLinearFactor( _vector );
                
                selected_block = null;
            }
            
        };
        
        return function() {
            renderer.domElement.addEventListener( 'mousedown', handleMouseDown );
            renderer.domElement.addEventListener( 'mousemove', handleMouseMove );
            renderer.domElement.addEventListener( 'mouseup', handleMouseUp );
        };
    })();
    
    window.onload = initScene;
    
    </script>


<script type="text/javascript">
    
    'use strict';
    
    Physijs.scripts.worker = '../physijs_worker.js';
    Physijs.scripts.ammo = 'examples/js/ammo.js';
    
    var initScene, render,
        ground_material, car_material, wheel_material, wheel_geometry,
        projector, renderer, render_stats, physics_stats, scene, ground_geometry, ground, light, camera,
        car = {};
    
    initScene = function() {
        projector = new THREE.Projector;
        
        
        scene = new Physijs.Scene;
        scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
        scene.addEventListener(
            'update',
            function() {
                scene.simulate( undefined, 2 );
                physics_stats.update();
            }
        );
        
        
        // Materials
        ground_material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( 'images/rocks.jpg' ) }),
            .8, // high friction
            .4 // low restitution
        );
        ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
        ground_material.map.repeat.set( 3, 3 );
        
        // Ground
        ground = new Physijs.BoxMesh(
            new THREE.CubeGeometry(100, 1, 100),
            ground_material,
            0 // mass
        );
        ground.receiveShadow = true;
        scene.add( ground );
        
        
        // Car
        car_material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ color: 0xff6666 }),
            .8, // high friction
            .2 // low restitution
        );
        
        wheel_material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ color: 0x444444 }),
            .8, // high friction
            .5 // medium restitution
        );
        wheel_geometry = new THREE.CylinderGeometry( 2, 2, 1, 8 );
        
        car.body = new Physijs.BoxMesh(
            new THREE.CubeGeometry( 10, 5, 7 ),
            car_material,
            1000
        );
        car.body.position.y = 10;
        car.body.receiveShadow = car.body.castShadow = true;
        scene.add( car.body );
        
        car.wheel_fl = new Physijs.CylinderMesh(
            wheel_geometry,
            wheel_material,
            500
        );
        car.wheel_fl.rotation.x = Math.PI / 2;
        car.wheel_fl.position.set( -3.5, 6.5, 5 );
        car.wheel_fl.receiveShadow = car.wheel_fl.castShadow = true;
        scene.add( car.wheel_fl );
        car.wheel_fl_constraint = new Physijs.DOFConstraint(
            car.wheel_fl, car.body, new THREE.Vector3( -3.5, 6.5, 5 )
        );
        scene.addConstraint( car.wheel_fl_constraint );
        car.wheel_fl_constraint.setAngularLowerLimit({ x: 0, y: -Math.PI / 8, z: 1 });
        car.wheel_fl_constraint.setAngularUpperLimit({ x: 0, y: Math.PI / 8, z: 0 });
        
        car.wheel_fr = new Physijs.CylinderMesh(
            wheel_geometry,
            wheel_material,
            500
        );
        car.wheel_fr.rotation.x = Math.PI / 2;
        car.wheel_fr.position.set( -3.5, 6.5, -5 );
        car.wheel_fr.receiveShadow = car.wheel_fr.castShadow = true;
        scene.add( car.wheel_fr );
        car.wheel_fr_constraint = new Physijs.DOFConstraint(
            car.wheel_fr, car.body, new THREE.Vector3( -3.5, 6.5, -5 )
        );
        scene.addConstraint( car.wheel_fr_constraint );
        car.wheel_fr_constraint.setAngularLowerLimit({ x: 0, y: -Math.PI / 8, z: 1 });
        car.wheel_fr_constraint.setAngularUpperLimit({ x: 0, y: Math.PI / 8, z: 0 });
        
        car.wheel_bl = new Physijs.CylinderMesh(
            wheel_geometry,
            wheel_material,
            500
        );
        car.wheel_bl.rotation.x = Math.PI / 2;
        car.wheel_bl.position.set( 3.5, 6.5, 5 );
        car.wheel_bl.receiveShadow = car.wheel_bl.castShadow = true;
        scene.add( car.wheel_bl );
        car.wheel_bl_constraint = new Physijs.DOFConstraint(
            car.wheel_bl, car.body, new THREE.Vector3( 3.5, 6.5, 5 )
        );
        scene.addConstraint( car.wheel_bl_constraint );
        car.wheel_bl_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 });
        car.wheel_bl_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
        
        car.wheel_br = new Physijs.CylinderMesh(
            wheel_geometry,
            wheel_material,
            500
        );
        car.wheel_br.rotation.x = Math.PI / 2;
        car.wheel_br.position.set( 3.5, 6.5, -5 );
        car.wheel_br.receiveShadow = car.wheel_br.castShadow = true;
        scene.add( car.wheel_br );
        car.wheel_br_constraint = new Physijs.DOFConstraint(
            car.wheel_br, car.body, new THREE.Vector3( 3.5, 6.5, -5 )
        );
        scene.addConstraint( car.wheel_br_constraint );
        car.wheel_br_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 });
        car.wheel_br_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
        
        
        
        requestAnimationFrame( render );
        scene.simulate();
    };
    
    render = function() {
        requestAnimationFrame( render );
        renderer.render( scene, camera );
        render_stats.update();
    };
    
    window.onload = initScene;
    
    </script>
*/