

var unitX = new THREE.Vector3( 1, 0, 0 );
var unitY = new THREE.Vector3( 0, 1, 0 );
var unitZ = new THREE.Vector3( 0, 0, 1 );
var color_default = 0x00ff00;
var color_hovered = 0x008888;
var color_selected = 0xff0000;
var color_nailed = 0x888800;
var texture = new THREE.ImageUtils.loadTexture("textures/wood_texture1.jpg");
var cornerradius = 0.5;
var edgelength = 10;

Element = function(geometry,material){

    this.selected = false;
    this.transformable = true; 
    Physijs.BoxMesh.call(this,geometry,material,5);
    
}

//Element.prototype = Object.create(Physijs.BoxMesh3.prototype);

Edge = function(parent) {

    parent == undefined ?  this.parent = parent : this.parent = scene;

    var geometry =  new THREE.CylinderGeometry(cornerradius, cornerradius, edgelength, 13, 1);
    
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00, 
        map:texture,
        side:THREE.DoubleSide
    });

    this.corners = {};
    Physijs.CylinderMesh.call(this,geometry,material);

    this.selected = false;
    this.transformable = false;

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
        var origin = new THREE.Vector3(0,0,0);
        var axis = new THREE.Vector3(0,edgelength/2+cornerradius,0);
        origin = this.localToWorld( origin );
        axis = this.localToWorld( axis );
        axis = axis.sub(origin);
        console.log('axis: '+axis.x + ',' + axis.y + ',' + axis.z);
        return axis;
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
        else return color_default;
    }
    this.movetoscene = function(){
        if (this.parent != scene) {
            var temppar = this.parent;
            THREE.SceneUtils.detach( this, temppar, scene );

            constraint = new Physijs.PointConstraint(this, temppar, this.position ,this.position);
            scene.addConstraint( constraint );
            this.parent = scene;
            return true;
        };
        return false;
    }
};


Edge.prototype = Object.create(Physijs.CylinderMesh.prototype);

Corner = function(parent) {

    var geometry =  new THREE.SphereGeometry( cornerradius);
    
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00, 
        map:texture,
        side:THREE.DoubleSide
    });

    parent == undefined ?  this.parent = parent : this.parent = scene;

    this.selected = false;
    this.transformable = false;

    this.edges = {};
    this.faces = {};

    Physijs.SphereMesh.call(this,geometry,material);

    this.selected = false;
    this.transformable = false;

    this.log = function() {
        console.log('corner');
    };

    this.getdefaultcolor = function(){
        if (this.mass == 0) {return color_nailed}
        else return color_default;
    }
    this.movetoscene = function(){
        if (this.parent != scene) {
            var temppar = this.parent;
            THREE.SceneUtils.detach( this, temppar, scene );

            constraint = new Physijs.PointConstraint(this, temppar, this.position,this.position );
            scene.addConstraint( constraint );
            this.parent = scene;
            this.faces[temppar.id] = constraint;
            return true;
        };
        return false;
    }
};


Corner.prototype = Object.create(Physijs.SphereMesh.prototype);

Square = function() {

    
    var geometry =  new THREE.BoxGeometry(edgelength, edgelength, cornerradius*2);
    
    var material = new THREE.MeshBasicMaterial({
                color:0x00ff00,
                map:texture,
                side:THREE.DoubleSide
    });
    Physijs.BoxMesh.call(this,geometry,material);
    this.selected = false;
    this.transformable = true; 
    
    this.corners = {};
    this.edges = {};
    
    this.getdefaultcolor = function(){
        if (this.mass == 0) {return color_nailed}
        else return color_default;
    }
    this.log = function() {
        console.log('square');
    }

    this.initconstraints = function(){
    
    this.addcorner('1');
    this.addcorner('2');
    this.addcorner('3');
    this.addcorner('4');

    
    //constraints
    /*
    constraint = new Physijs.PointConstraint(c1, this, c1.position );
    scene.addConstraint( constraint );
    constraint = new Physijs.PointConstraint(c2, this, c2.position );
    scene.addConstraint( constraint );
    constraint = new Physijs.PointConstraint(c3, this, c3.position );
    scene.addConstraint( constraint );
    constraint = new Physijs.PointConstraint(c4, this, c4.position );
    scene.addConstraint( constraint );
    */
    
    var e1 = new Edge(this);
    var e2 = new Edge(this);
    var e3 = new Edge(this);
    var e4 = new Edge(this);

    e1.rotation.z =Math.PI/2;   
    e1.position.y +=edgelength/2+cornerradius;
    e2.position.x +=edgelength/2+cornerradius;
    e3.rotation.z =Math.PI/2;
    e3.position.y -=edgelength/2+cornerradius;
    e4.position.x -=edgelength/2+cornerradius;
    

    this.add(e1);
    this.add(e2);
    this.add(e3);
    this.add(e4);

    /*
    e1.addToCorners(c1,c2,this);
    e2.addToCorners(c2,c3,this);
    e3.addToCorners(c3,c4,this);
    e4.addToCorners(c4,c1,this);

    c1.material.color.set (0x000000);
    c2.material.color.set (0x333333);
    c3.material.color.set (0x666666);
    c4.material.color.set (0xaaaaaa);


    e1.material.color.set (0x000000);
    e2.material.color.set (0x333333);
    e3.material.color.set (0x666666);
    e4.material.color.set (0xaaaaaa);
    */
    }

    this.addcorner = function(name){
        v1 = new THREE.Vector3(-(edgelength/2+cornerradius),edgelength/2+cornerradius,0),
        v2 = new THREE.Vector3(edgelength/2+cornerradius,edgelength/2+cornerradius,0);
        c = new Corner(this)
        switch(name){
            case '1':
                c.position.add(v1);
                break;
            case '2':
                c.position.add(v2);
                break;
            case '3':
                c.position.sub(v1);
                break;
            case '4':
                c.position.sub(v2);
                break;
        }
        this.corners[c.id] = name;
        this.add(c);
    }


};
Square.prototype = Object.create(Physijs.BoxMesh.prototype);

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
var rotatearountaxis =function(element, axis, angle){

    element.oldRotationMatrix.extractRotation( element.matrix );
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
