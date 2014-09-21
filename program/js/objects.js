

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

    this.hoverover = function() {
        if (!this.selected) {
            this.material.color.set (color_hovered);
        };
        
    }
    this.hoverout = function() {
        if (!this.selected) {
            this.material.color.set (color_default);
        };
    }
    this.select = function() {
        this.material.color.set (color_selected);
        this.selected = true;
    }
    this.deselect = function() {
        this.material.color.set (color_default);
        this.selected = false;
    }
    
}

//Element.prototype = Object.create(Physijs.BoxMesh3.prototype);

Edge = function(a,b,parent) {

    var geometry =  new THREE.CylinderGeometry(cornerradius, cornerradius, edgelength+2*cornerradius, 13, 1);
    
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00, 
        map:texture,
        side:THREE.DoubleSide
    });

    this.parent = parent;
    this.neighbours = [];
    this.constraint = undefined;
    THREE.Mesh.call(this,geometry,material);

    this.selected = false;
    this.transformable = false;

    this.log = function() {
        console.log('edge');
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
};


Edge.prototype = Object.create(THREE.Mesh.prototype);

Square = function() {

    
    var geometry =  new THREE.BoxGeometry(edgelength, edgelength, cornerradius*2);//new THREE.Geometry();
    //var texture = new THREE.ImageUtils.loadTexture("textures/wood_texture1.jpg");
    var v1 = new THREE.Vector3( 10.0,  10.0, 0.0),
        v2 = new THREE.Vector3( 10.0,  0.0, 0.0),
        v3 = new THREE.Vector3( 0.0,  0.0, 0.0),
        v4 = new THREE.Vector3( 0.0,  10.0, 0.0);

    //geometry.vertices.push(v1,v2,v3,v4);
    
    var material = new THREE.MeshBasicMaterial({
                color:0x00ff00,
                map:texture,
                side:THREE.DoubleSide
    });
    Physijs.BoxMesh.call(this,geometry,material);
    this.selected = false;
    this.transformable = true; 

    var oldRotationMatrix = new THREE.Matrix4();
    
    this.edges = [];
    var e1 = new Edge(v1,v2,this),
        e2 = new Edge(v2,v3,this),
        e3 = new Edge(v3,v4,this),
        e4 = new Edge(v4,v1,this);
    e1.position.x +=edgelength/2+cornerradius;
    e2.position.x -=edgelength/2+cornerradius;
    e3.rotation.z =Math.PI/2;
    e3.position.y +=edgelength/2+cornerradius;
    e4.rotation.z =Math.PI/2;
    e4.position.y -=edgelength/2+cornerradius;

    this.add(e1);
    this.add(e2);
    this.add(e3);
    this.add(e4);

    this.edges.push(e1);
    this.edges.push(e2);
    this.edges.push(e3);
    this.edges.push(e4);

    
    this.getdefaultcolor = function(){
        if (this.mass == 0) {return color_nailed}
        else return color_default;
    }
    this.log = function() {
        console.log('square');
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

    oldRotationMatrix.extractRotation( element.matrix );
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
