

var unitX = new THREE.Vector3( 1, 0, 0 );
var unitY = new THREE.Vector3( 0, 1, 0 );
var unitZ = new THREE.Vector3( 0, 0, 1 );
var color_default = 0x888888;
var color_hovered = 0x008888;
var color_selected = 0xff0000;
var color_nailed = 0xbbbbbb;
var color_default_connector = 0x888888;

var mass = undefined;
var texture = new THREE.ImageUtils.loadTexture("textures/wood_texture1.jpg");
var cornerradius = 8;
var offset = 15;
var cornerradius_symbolic = 19;
var edgelength = 510;
var squaregeom;
var equigeom;
var rectgeom;

function loadmeshes(){
    var loader = new THREE.STLLoader();
    loader.load( 'models/elements/ascii/simple/square.stl', function ( geometry ) {
        squaregeom = geometry;
        assignUVs(squaregeom);
    } );
    loader.load( 'models/elements/ascii/simple/equi.stl', function ( geometry ) {
        equigeom = geometry;
        assignUVs(equigeom);
    } );
    loader.load( 'models/elements/ascii/simple/rect.stl', function ( geometry ) {
        rectgeom = geometry;
        assignUVs(rectgeom);
    } );

} 


TransformHelper = function(){

    this.target = undefined;
    this.refelement;
    this.geometry =  new THREE.CylinderGeometry(19, 19, 500, 13, 1);
    
    this.material = new THREE.MeshBasicMaterial({
        color: 0x888888, 
        side:THREE.FrontSide
    });
    THREE.Mesh.call(this,this.geometry,this.material);
    this.visible = false;
    this.attach = function(target,refelement){

        if (this.target != undefined) return;
        if(refelement == undefined) refelement = target.getselectededge();
        this.refelement = refelement;
        this.target = target;
        this.setrefelement(refelement);
        //THREE.SceneUtils.attach( target, scene, this );
        transformcontrol.attach(this);
    }
    this.setrefelement = function(refelement){
        
        var inverse = new THREE.Matrix4();
        inverse.getInverse(this.matrixWorld);
        this.applyMatrix(inverse);
        this.applyMatrix(refelement.matrixWorld.clone());
        updatematrices(this);
    };

    this.updatetarget = function(){

        var targetinverse = new THREE.Matrix4();
        var refinverse = new THREE.Matrix4();
        targetinverse.getInverse(this.target.matrixWorld);
        refinverse.getInverse(this.refelement.matrix);
        this.target.applyMatrix(targetinverse);
        this.target.applyMatrix(refinverse);
        this.target.applyMatrix(this.matrixWorld.clone());
        updatematrices(this.target);
    }

    this.detach = function(){

        if (this.target == undefined) return;
        this.refelement = undefined;
        transformcontrol.detach(this);
        this.target = undefined;
    }
    this.update = function(){
        if (this.target == undefined)return;
        this.updatetarget();
    }
}
//initrotationhelper();
/*
function initrotationhelper(){
    var geometry =  new THREE.CylinderGeometry(19, 19, 500, 13, 1);
    
    var material = new THREE.MeshBasicMaterial({
        color: 0x888888, 
        //map:texture,
        //transparent: true, 
        //opacity: 0.8,
        side:THREE.FrontSide
    });

    var mesh = new THREE.Mesh(geometry,material);
    transformhelper.add(mesh);
}
*/


TransformHelper.prototype = Object.create(THREE.Mesh.prototype);

CornerConnector = function(){
    
    var geometry =  new THREE.SphereGeometry( cornerradius_symbolic);
    
    var material = new THREE.MeshBasicMaterial({
        color: color_default_connector, 
        transparent: true, 
        opacity: 0.8,
        side:THREE.FrontSide
    });

    this.selected = false;
    this.transformable = false;

    this.constraints = {};
    this.corners = [];

    Physijs.SphereMesh.call(this,geometry,material,mass);

    this.addcorner = function(corner,constraint){
        this.constraints[corner.id] = constraint;
    }

    this.removecorner = function(corner){
        var constraint = this.constraints[corner.id];
        if (constraint == undefined) return false;
        corner.connector = undefined;
        scene.removeConstraint(constraint);
        var index = this.corners.indexOf(corner);
        if (index <0) return;
        this.corners.splice(index,1);
        delete this.constraints[corner.id];
        return true;
    }

    this.getconnector = function(){return this};
    this.mergeWithConnector = function(otherconnector){
        var corner;
        var constraint;
        while((corner = otherconnector.corners.pop()) != null){
            constraint = otherconnector.constraints[corner.id];
            scene.removeConstraint(constraint);
            var newconstraint = corner.connecttoconnector(this);
            this.addcorner(corner,newconstraint);
        }
        otherconnector.constraints = {};
        otherconnector.corners = [];
        // 
        objectgroup.splice(objectgroup.indexOf(otherconnector),1);
        scene.remove(otherconnector);


    }
    this.clearconnector = function(){
        for (var i = this.corners.length - 1; i >= 0; i--) {
            var corner = this.corners[i];
            var constraint = this.constraints[corner.id];
        };
    }

    this.getdefaultcolor = function(){
        if (this.mass == 0) {return color_nailed}
        else return color_default_connector;
    }

}

CornerConnector.prototype = Object.create(Physijs.SphereMesh.prototype);

EdgeConnector = function(){

    var geometry =  new THREE.CylinderGeometry(cornerradius_symbolic, cornerradius_symbolic, edgelength, 13, 1);
    
    var material = new THREE.MeshBasicMaterial({
        color: color_default_connector, 
        //map:texture,
        transparent: true, 
        opacity: 0.8,
        side:THREE.FrontSide
    });

    Physijs.CylinderMesh.call(this,geometry,material);

    this.getdefaultcolor = function(){
        if (this.mass == 0) {return color_nailed}
        else return color_default_connector;
    }
}

EdgeConnector.prototype = Object.create(Physijs.CylinderMesh.prototype);
//Element.prototype = Object.create(Physijs.BoxMesh3.prototype);

Edge = function(c1,c2,parent,length) {

    parent == undefined ?  this.parent = parent : this.parent = scene;
    var reallength
    length == undefined ?  reallength = edgelength : reallength = length;

    this.geometry =  new THREE.CylinderGeometry(cornerradius_symbolic, cornerradius_symbolic, reallength, 13, 1);
    
    var material = new THREE.MeshBasicMaterial({
        color: color_default_connector, 
        //map:texture,
        transparent: true, 
        opacity: 0.8,
        side:THREE.FrontSide
    });

    this.corners = [c1,c2];
    THREE.Mesh.call(this,this.geometry,material);

    this.selected = false;
    this.transformable = false;

    var pos = c1.position.clone();
    pos.add(c2.position);
    pos.divideScalar(2);
    this.position.copy(pos);

    this.othercorner = function(corner){
        if (this.corners[0] == corner)return this.corners[1];
        return this.corners[0];
    }
    this.log = function() {
        console.log('edge');
    };

    this.addToCorners = function(c1,c2,face){

        var axis = this.getaxis();
        var pointb1 = this.position.clone().sub(axis);
        var pointb2 = this.position.clone().add(axis);
        var constraint
        constraint = new Physijs.PointConstraint(c1, this, c1.position,pointb1 );
        constraint.positionb = face.worldToLocal(pointb1);
        scene.addConstraint( constraint );
        constraint = new Physijs.PointConstraint(c2, this, c2.position,pointb1 );
        constraint.positionb = face.worldToLocal(pointb2);
        scene.addConstraint( constraint );
    };

    this.getaxis = function(){
        var axis = this.corners[0].position.clone();
        axis.sub(this.corners[1].position);
        axis = this.localToWorld(axis);
        console.log('axis: '+axis.x + ',' + axis.y + ',' + axis.z);
        return axis;
        /*
        var origin = new THREE.Vector3(0,0,0);
        var axis = new THREE.Vector3(0,edgelength/2+offset,0);
        origin = this.localToWorld( origin );
        axis = this.localToWorld( axis );
        axis = axis.sub(origin);
        
        return axis;
        */
    };

    this.geteuler = function(){
        var axis = new THREE.Euler (0,1,0);
        axis.setFromRotationMatrix( this.matrixWorld );
        console.log('euler: '+axis.x + ',' + axis.y + ',' + axis.z);
        return axis;
    };

    this.getposition = function(){
        var position = new THREE.Vector3();
        position.setFromMatrixPosition( this.matrixWorld );
        console.log('position: '+position.x + ',' + position.y + ',' + position.z);
        return position;
    };
    this.getdefaultcolor = function(){
        if (this.mass == 0) {return color_nailed}
        else return color_default_connector;
    }
};


Edge.prototype = Object.create(THREE.Mesh.prototype);



Corner = function(parent) {

    var geometry =  new THREE.SphereGeometry( cornerradius_symbolic);
    
    var material = new THREE.MeshBasicMaterial({
        color: color_default_connector, 
        transparent: true, 
        opacity: 0.8,
        side:THREE.FrontSide
    });

    parent == undefined ?  this.parent = parent : this.parent = scene;

    this.selected = false;
    this.transformable = false;
    this.connector = undefined;

    THREE.Mesh.call(this,geometry,material);



    this.log = function() {
        console.log('corner');
    };

    this.getdefaultcolor = function(){
        if (this.mass == 0) {return color_nailed}
        else return color_default_connector;
    }

    this.getconnector = function(){
        if (this.connector == undefined) {
            var connector = new CornerConnector();
            scene.add(connector);
            objectgroup.push(connector);
            var pos = this.parent.localToWorld(new THREE.Vector3(0,0,0).copy(this.position))
            connector.position.set(pos.x,pos.y,pos.z);
            connector.matrixAutoUpdate = false;
            connector.updateMatrix();
            connector.updateMatrixWorld();
            connector.matrixAutoUpdate = true;
            this.visible = false;
            constraint = this.connecttoconnector(connector);
        };
        return this.connector;
    }
    this.connecttoconnector = function(connector){
        this.connector = connector;
        var constraint = new Physijs.PointConstraint(connector,this.parent, connector.position,this.parent.localToWorld(new THREE.Vector3(0,0,0).copy(this.position) ));
        scene.addConstraint(constraint);
        connector.corners.push(this);
        connector.constraints[this.id] = constraint;
        return constraint;
    }
};


Corner.prototype = Object.create(THREE.Mesh.prototype);

Square = function() {

    var material = new THREE.MeshBasicMaterial({
                color:color_default,
                map:texture,
                side:THREE.FrontSide
    });

        
    this.geometry = squaregeom; //new THREE.Geometry();


    Physijs.ConvexMesh.call(this,this.geometry,material,mass);

    //geometry.merge(this);

    this.position.set( 0, 0, 0 );

    this.center = new THREE.Vector3(edgelength/2,edgelength/2,cornerradius)

    this.selected = false;
    this.transformable = true; 
    
    this.corners = [];
    this.edges = [];
    
    this.getdefaultcolor = function(){
        if (this.mass == 0) {return color_nailed}
        else return color_default;
    }
    this.log = function() {
        console.log('square');
    }

    this.initconstraints = function(){
        var c1 = this.addcorner('1');
        var c2 = this.addcorner('2');
        var c3 = this.addcorner('3');
        var c4 = this.addcorner('4');

        
        var e1 = new Edge(c1,c2,this);
        var e2 = new Edge(c2,c3,this);
        var e3 = new Edge(c3,c4,this);
        var e4 = new Edge(c4,c1,this);

        e1.rotation.z =Math.PI/2;   
        e3.rotation.z =Math.PI/2;

        this.add(e1);
        this.add(e2);
        this.add(e3);
        this.add(e4);


        this.edges.push(e1);
        this.edges.push(e2);
        this.edges.push(e3);
        this.edges.push(e4);
        /*
        this.geometry.merge(e1.geometry);
        this.geometry.merge(e2.geometry);
        this.geometry.merge(e3.geometry);
        this.geometry.merge(e4.geometry);
        */
    }

    this.addcorner = function(name){
        var centerpos = new THREE.Vector3(0,0,0);
        centerpos.copy(this.center);
        v1 = new THREE.Vector3(-edgelength/2-offset,edgelength/2+offset,0),
        v2 = new THREE.Vector3(edgelength/2+offset,edgelength/2+offset,0);
        c = new Corner(this)
        switch(name){
            case '1':
                centerpos.add(v1)
                break;
            case '2':
                centerpos.add(v2);
                break;
            case '3':
                centerpos.sub(v1);
                break;
            case '4':
                centerpos.sub(v2);
                break;
        }
        c.position.set(centerpos.x,centerpos.y,centerpos.z);// = center;
        this.corners.push(c);
        this.add(c);
        return c;
    }
    this.getselectededge = function(){
        for (var i = selectededges.length - 1; i >= 0; i--) {
            var edge = getindexforedge(this,selectededges[i]);
            if (edge != undefined){
                return selectededges[i];
            }
        };
        return this.edges[0];
    }


};
Square.prototype = Object.create(Physijs.ConvexMesh.prototype);

RightAngled = function() {
    
    var material = new THREE.MeshBasicMaterial({
                color:color_default,
                map:texture,
                side:THREE.FrontSide
    });

        
    this.geometry = rectgeom; //new THREE.Geometry();


    Physijs.ConvexMesh.call(this,this.geometry,material,mass);

    //geometry.merge(this);

    this.position.set( 0, 0, 0 );

    this.center = new THREE.Vector3(edgelength/2,edgelength/2,cornerradius)

    this.selected = false;
    this.transformable = true; 
    
    this.corners = [];
    this.edges = [];
    
    this.getdefaultcolor = function(){
        if (this.mass == 0) {return color_nailed}
        else return color_default;
    }
    this.log = function() {
        console.log('right');
    }

    this.initconstraints = function(){
        var c1 = this.addcorner('1');
        var c2 = this.addcorner('2');
        var c3 = this.addcorner('3');

        
        var e1 = new Edge(c1,c2,this,Math.sqrt(2)*edgelength);
        var e2 = new Edge(c2,c3,this);
        var e3 = new Edge(c3,c1,this);

        e1.rotation.z =Math.PI/4;   
        e2.rotation.z =Math.PI/2;
        

        this.add(e1);
        this.add(e2);
        this.add(e3);
        //this.add(e4);


        this.edges.push(e1);
        this.edges.push(e2);
        this.edges.push(e3);

    }

    this.addcorner = function(name){
        var centerpos = new THREE.Vector3(0,0,0);
        centerpos.copy(this.center);
        v1 = new THREE.Vector3(-edgelength/2-offset,edgelength/2+offset,0),
        v2 = new THREE.Vector3(edgelength/2+offset,edgelength/2+offset,0);
        c = new Corner(this)
        switch(name){
            case '1':
                centerpos.add(v1)
                break;
            case '2':
                centerpos.sub(v1);
                break;
            case '3':
                centerpos.sub(v2);
                break;
        }
        c.position.set(centerpos.x,centerpos.y,centerpos.z);// = center;
        this.corners.push(c);
        this.add(c);
        return c;
    }
    this.getselectededge = function(){
        for (var i = selectededges.length - 1; i >= 0; i--) {
            var edge = getindexforedge(this,selectededges[i]);
            if (edge != undefined){
                return selectededges[i];
            }
        };
        return this.edges[0];
    }

};
RightAngled.prototype = Object.create(Physijs.ConvexMesh.prototype);

Equilat = function() {

    var material = new THREE.MeshBasicMaterial({
                color:color_default,
                map:texture,
                side:THREE.FrontSide
    });

        
    this.geometry = equigeom; //new THREE.Geometry();


    Physijs.ConvexMesh.call(this,this.geometry,material,mass);

    //geometry.merge(this);

    this.position.set( 0, 0, 0 );

    this.center = new THREE.Vector3(edgelength/2,edgelength/2,cornerradius)

    this.selected = false;
    this.transformable = true; 
    
    this.corners = [];
    this.edges = [];
    
    this.getdefaultcolor = function(){
        if (this.mass == 0) {return color_nailed}
        else return color_default;
    }
    this.log = function() {
        console.log('equi');
    }

    this.initconstraints = function(){
        var c1 = this.addcorner('1');
        var c2 = this.addcorner('2');
        var c3 = this.addcorner('3');

        
        var e1 = new Edge(c1,c2,this);
        var e2 = new Edge(c2,c3,this);
        var e3 = new Edge(c3,c1,this);

        e1.rotation.z -=Math.PI/6;   
        e2.rotation.z =Math.PI/6;
        e3.rotation.z = Math.PI/2;
        
        this.add(e1);
        this.add(e2);
        this.add(e3);


        this.edges.push(e1);
        this.edges.push(e2);
        this.edges.push(e3);
        /*
        this.geometry.merge(e1.geometry);
        this.geometry.merge(e2.geometry);
        this.geometry.merge(e3.geometry);
        this.geometry.merge(e4.geometry);
        */

    }

    this.addcorner = function(name){
        var centerpos = new THREE.Vector3(0,0,0);
        centerpos.copy(this.center);
        v1 = new THREE.Vector3(-edgelength/2-offset,edgelength/2+offset,0),
        v2 = new THREE.Vector3(edgelength/2+offset,edgelength/2+offset,0);
        c = new Corner(this)
        switch(name){
            case '1':
                centerpos.sub(v2);
                break;
            case '2':
                centerpos.add(new THREE.Vector3(0,(Math.sqrt(3)/2-0.5)*edgelength+Math.sqrt(2*(offset*offset)),0));
                break;
            case '3':
                centerpos.sub(v1);
                break;
        }
        c.position.set(centerpos.x,centerpos.y,centerpos.z);// = center;
        this.corners.push(c);
        this.add(c);
        return c;
    }
    this.getselectededge = function(){
        for (var i = selectededges.length - 1; i >= 0; i--) {
            var edge = getindexforedge(this,selectededges[i]);
            if (edge != undefined){
                return selectededges[i];
            }
        };
        return this.edges[0];
    }
};


Equilat.prototype = Object.create(Physijs.ConvexMesh.prototype);



Table = function(){

    var tabletexture = new THREE.ImageUtils.loadTexture('textures/skybox/sky/bottom.jpg');
    var material = new THREE.MeshBasicMaterial({
                //color:0xffffff,
                map:tabletexture,
                side:THREE.FrontSide
    });

        
    var geometry = new THREE.PlaneGeometry(20000,20000,5,5); //new THREE.Geometry();
    //geometry.computeBoundingBox();

    Physijs.PlaneMesh.call(this,geometry,material);
    rotatearoundaxis(this,'X',-Math.PI/2);
    this.position.y = -100;

};

Table.prototype = Object.create(Physijs.PlaneMesh.prototype);

var hoverover = function(element) {
    if (element.selected == undefined)return;
    if (!element.selected) {
        element.material.color.set (color_hovered);
    };
    
}
var hoverout = function(element) {
    if (element.selected == undefined)return;
    if (!element.selected) {
        element.material.color.set (element.getdefaultcolor());
    };
}
var select = function(element) {
    if (element.selected == undefined)return;
    element.material.color.set (color_selected);
    element.selected = true;
}
var deselect = function(element) {
    if (element.selected == undefined)return;
    element.material.color.set (element.getdefaultcolor());
    element.selected = false;
}
var rotatearoundaxis =function(element, axis, angle){

    
    var oldRotationMatrix = new THREE.Matrix4().extractRotation( element.matrix );
    var quaternionXYZ = new THREE.Quaternion();
    var quaternionX = new THREE.Quaternion();
    var quaternionY = new THREE.Quaternion();
    var quaternionZ = new THREE.Quaternion();
    var quaternionE = new THREE.Quaternion();

    quaternionXYZ.setFromRotationMatrix( oldRotationMatrix );
    quaternionX.setFromAxisAngle( unitX, angle );
    quaternionY.setFromAxisAngle( unitY, angle );
    quaternionZ.setFromAxisAngle( unitZ, angle);

    if ( axis == "X" ) quaternionXYZ.multiplyQuaternions( quaternionXYZ, quaternionX );
    if ( axis == "Y" ) quaternionXYZ.multiplyQuaternions( quaternionXYZ, quaternionY );
    if ( axis == "Z" ) quaternionXYZ.multiplyQuaternions( quaternionXYZ, quaternionZ );

    element.quaternion.copy( quaternionXYZ );
    element.updateMatrixWorld();
}

assignUVs = function( geometry ){

    geometry.computeBoundingBox();

    var max     = geometry.boundingBox.max;
    var min     = geometry.boundingBox.min;

    var offset  = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range   = new THREE.Vector2(max.x - min.x, max.y - min.y);

    geometry.faceVertexUvs[0] = [];
    var faces = geometry.faces;

    for (i = 0; i < geometry.faces.length ; i++) {

      var v1 = geometry.vertices[faces[i].a];
      var v2 = geometry.vertices[faces[i].b];
      var v3 = geometry.vertices[faces[i].c];

      geometry.faceVertexUvs[0].push([
        new THREE.Vector2( ( v1.x + offset.x ) / range.x , ( v1.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v2.x + offset.x ) / range.x , ( v2.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v3.x + offset.x ) / range.x , ( v3.y + offset.y ) / range.y )
      ]);

    }

    geometry.uvsNeedUpdate = true;

}
function updatematrices(element){
    element.matrixAutoUpdate = false;
    element.updateMatrix();
    element.updateMatrixWorld();
    element.matrixAutoUpdate = true;

    element.__dirtyPosition = true;
    element.__dirtyRotation = true;
}

function rotateAroundWorldAxis(object, axis, radians) {
    var rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    //  rotWorldMatrix.multiply(object.matrix);
    // new code for Three.JS r55+:
    rotWorldMatrix.multiply(object.matrix);                // pre-multiply

    object.matrix = rotWorldMatrix;

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js pre r59:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // code for r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}
