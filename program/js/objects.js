

var unitX = new THREE.Vector3( 1, 0, 0 );
var unitY = new THREE.Vector3( 0, 1, 0 );
var unitZ = new THREE.Vector3( 0, 0, 1 );
var color_default = 0xffffff;
var color_hovered = 0x008888;
var color_selected = 0xff0000;
var color_nailed = 0xfcd6a9;
var color_default_connector = 0x888888;

var elementmass = 500;
var elementmass_nailed = 500000;
var texture = new THREE.ImageUtils.loadTexture("textures/wood_texture2.jpg");
var cornerradius_symbolic = 6.5;
var cornerradius_show = 17;
var edgelength = 510;
var squaregeom;
var equigeom;
var rectgeom;

var elementmaterial = new THREE.MeshLambertMaterial({
    color:color_default,
    ambient: color_default,
    bumpMap: 0,
    map:texture,
    side:THREE.FrontSide
});

function loadmeshes(){
    var loader = new THREE.STLLoader();
    loader.load( 'models/square/element.stl', function ( geometry ) {
        squaregeom = geometry;
        assignUVs(squaregeom);
    } );
    loader.load( 'models/equilat/element.stl', function ( geometry ) {
        equigeom = geometry;
        assignUVs(equigeom);
    } );
    loader.load( 'models/rightangle/element.stl', function ( geometry ) {
        rectgeom = geometry;
        assignUVs(rectgeom);
    } );

} 


TransformHelper = function(){

    this.target = undefined;
    this.thingstomove = [];
    this.refelement;
    this.oldmatrix;
    this.geometry =  new THREE.CylinderGeometry(19, 19, 500, 13, 1);
    
    this.material = new THREE.MeshBasicMaterial({
        color: 0x000000, 
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
        transformcontrol.attach(this);
        this.thingstomove.push(target);
        this.oldmatrix = this.matrixWorld.clone();
    }
    this.setrefelement = function(refelement){
        
        var inverse = new THREE.Matrix4();
        inverse.getInverse(this.matrixWorld);
        this.applyMatrix(inverse);
        this.applyMatrix(refelement.matrixWorld.clone());
        updatematrices(this);
    };

    this.updatetarget = function(target){

        var oldinverse = (new THREE.Matrix4()).getInverse(this.oldmatrix);
        var transitionmatrix = (new THREE.Matrix4()).multiplyMatrices(this.matrixWorld,oldinverse);
        //var center = target.center;//target.localToWorld(target.center);
        //var centertranslation = (new THREE.Matrix4()).makeTranslation(center.x,center.y,center.z);
        //var centertranslationinverse = (new THREE.Matrix4()).makeTranslation(-center.x,-center.y,-center.z);

        //target.applyMatrix(centertranslationinverse );
        target.applyMatrix(transitionmatrix.clone());
        //target.applyMatrix(centertranslation);
        updatematrices(target);
        target.__dirtyPosition = true;
        target.__dirtyRotation = true;
        /*
        var targetinverse = new THREE.Matrix4();
        var refinverse = new THREE.Matrix4();
        targetinverse.getInverse(this.target.matrixWorld);
        refinverse.getInverse(this.refelement.matrix);
        this.target.applyMatrix(targetinverse);
        this.target.applyMatrix(refinverse);
        this.target.applyMatrix(this.matrixWorld.clone());
        updatematrices(this.target);
        this.target.__dirtyPosition = true;
        this.target.__dirtyRotation = true;

        
        var targetmatrix = (new THREE.Matrix4()).multiplyMatrices(this.matrixWorld,target.matrixWorld);
        
        
        var refinverse = new THREE.Matrix4();
        targetinverse.getInverse(target.matrixWorld);
        refinverse.getInverse(this.refelement.matrix);
        target.applyMatrix(targetinverse);
        target.applyMatrix(refinverse);
        target.applyMatrix(this.matrixWorld.clone());
        
        var targetinverse = new THREE.Matrix4();
        targetinverse.getInverse(target.matrixWorld);
        target.applyMatrix(targetinverse);
        target.applyMatrix(targetmatrix);
        //target.matrixWorld = targetmatrix;
        updatematrices(target);
        target.__dirtyPosition = true;
        target.__dirtyRotation = true;
        */
    }

    this.detach = function(){

        if (this.target == undefined) return;
        this.refelement = undefined;
        transformcontrol.detach(this);
        this.target = undefined;
        this.thingstomove = [];
    }
    this.update = function(){
        for (var i = this.thingstomove.length - 1; i >= 0; i--) {
            this.updatetarget(this.thingstomove[i]);
        };
        this.oldmatrix = this.matrixWorld.clone();
        
    }
}
TransformHelper.prototype = Object.create(THREE.Mesh.prototype);

Visualizer = function(geometry){

    this.geometry =  geometry;
    
    var material = new THREE.MeshBasicMaterial({
        color: color_default_connector, 
        transparent: true, 
        opacity: 0.8,
        side:THREE.FrontSide
    });
    THREE.Mesh.call(this,this.geometry,material);
    this.selected = false;

    this.getdefaultcolor = function(){
        if (this.mass == 0) {return color_nailed}
        else return color_default_connector;
    }
}
Visualizer.prototype = Object.create(THREE.Mesh.prototype);

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
    this.connector_show = new Visualizer(new THREE.SphereGeometry(cornerradius_show),material);

    this.constraints = {};
    this.corners = [];

    Physijs.SphereMesh.call(this,geometry,material,1);
    this.add(this.connector_show);
    //this.visible = false;

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
        if (this.corners.length == 0) {
            objectgroup.splice(objectgroup.indexOf(this),1);
            scene.remove(this);
        };
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
    this.toJSON = function(){
        return {
            'type':'CornerConnector',
            'corners':JSON.stringify(this.corners), 
            'position':JSON.stringify(this.position)
        }
    };

    this.parsejson = function(jsn){
        loadingmap[jsn['id']]= this;
        var pos = JSON.parse(jsn['position']);
        this.position.set(pos.x,pos.y,pos.z);
        updatematrices(this);
        var corners = JSON.parse(jsn['corners']);
        for (var i = 0; i < corners.length; i++) {
            var c = loadingmap[corners[i].id];
            var newconstraint = c.connecttoconnector(this);
            this.addcorner(c,newconstraint);
        };
    }

}

CornerConnector.prototype = Object.create(Physijs.SphereMesh.prototype);

Edge = function(c1,c2,parent) {

    parent == undefined ?  this.parent = parent : this.parent = scene;
    var reallength = c1.position.distanceTo(c2.position)-2*cornerradius_symbolic;

    this.geometry =  new THREE.CylinderGeometry(cornerradius_show, cornerradius_show, reallength, 13, 1);
    
    var material = new THREE.MeshBasicMaterial({
        color: color_default_connector, 
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

    var angle = (new THREE.Vector3(0,1,0)).angleTo(c1.position.clone().sub(c2.position));
    this.rotation.z = angle;

    this.othercorner = function(corner){
        if (this.corners[0] == corner)return this.corners[1];
        return this.corners[0];
    }

    /*
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
    */
    this.getdefaultcolor = function(){
        if (this.mass == 0) {return color_nailed}
        else return color_default_connector;
    }

    this.toJSON = function(){
        return {
            'id':this.id,
            'corners':JSON.stringify(this.corners), 
            'matrix':JSON.stringify(this.matrix),
        };
    };
    this.parsejson = function(jsn){
        
        loadingmap[jsn['id']]= this;
        this.applyMatrix(JSON.parse(jsn['matrix']));

    }
};


Edge.prototype = Object.create(THREE.Mesh.prototype);



Corner = function(parent) {

    var geometry =  new THREE.SphereGeometry( cornerradius_show);
    
    var material = new THREE.MeshBasicMaterial({
        color: color_default_connector, 
        transparent: true, 
        opacity: 0.8,
        side:THREE.FrontSide
    });

    parent == undefined ?  this.parent = parent : this.parent = scene;

    this.realconnector = undefined;
    this.selected = false;
    this.transformable = false;
    this.connector = undefined;

    THREE.Mesh.call(this,geometry,material);

    this.getdefaultcolor = function(){
        if (this.mass == 0) {return color_nailed}
        else return color_default_connector;
    }

    this.getconnector = function(){
        if (this.connector == undefined) {
            var connector = new CornerConnector();
            scene.add(connector);
            objectgroup.push(connector);
            this.configureconnector(connector);
            constraint = this.connecttoconnector(connector);
        };
        return this.connector;
    }

    this.configureconnector = function(connector){
        var pos = this.parent.localToWorld(new THREE.Vector3(0,0,0).copy(this.position))
        connector.position.set(pos.x,pos.y,pos.z);
        updatematrices(connector);
        connector.__dirtyPosition = true;
        connector.__dirtyRotation = true;
    }

    this.connecttoconnector = function(connector){
        this.visible = false;
        this.connector = connector;
        var constraint = new Physijs.PointConstraint(connector,this.parent, connector.position,this.parent.localToWorld(new THREE.Vector3(0,0,0).copy(this.position) ));
        scene.addConstraint(constraint);
        connector.corners.push(this);
        connector.constraints[this.id] = constraint;
        return constraint;
    }
    this.isconnectedto = function(othercorner){
        if (this.connector == undefined) return false;
        if (othercorner.connector == undefined) return false;
        if (this.connector == othercorner.connector) return true;
        return false;
    }
    this.toJSON = function(){
        return {
            'id':this.id,
            'matrix':JSON.stringify(this.matrix),
        };
    };
    this.parsejson = function(jsn){

        loadingmap[jsn['id']]= this;
        this.applyMatrix(JSON.parse(jsn['matrix']));
        updatematrices(this);
    }
    this.rendercallback = function(){
        if (this.connector == undefined) return;
        this.configureconnector(this.connector);
    }

};
Corner.prototype = Object.create(THREE.Mesh.prototype);

ElementVisualizer = function(geometry){
    THREE.Mesh.call(this,geometry,elementmaterial.clone());
    this.selected = false;

    this.getdefaultcolor = function(){
        if (this.parent.nailed) {return color_nailed}
        else return color_default;
    }
}
ElementVisualizer.prototype = Object.create(THREE.Mesh.prototype);

Element = function(geometry){

    this.selected = false;
    this.transformable = true; 
    this.corners = [];
    this.edges = [];
    this.nailed = false;
    this.nailedMatrix = undefined;
    this.visualmesh = new ElementVisualizer(this.geometry);
    this.center = new THREE.Vector3();

    for (var i = this.cornerpositions.length - 1; i >= 0; i--) {
        this.center.add(this.cornerpositions[i]);
    };
    this.center.divideScalar(this.cornerpositions.length);

    var spheregeometry =  new THREE.SphereGeometry( 4);
    spheregeometry.applyMatrix( new THREE.Matrix4().makeTranslation(this.center.x,this.center.y,this.center.z) );
    //Physijs.ConvexMesh.call(this,this.geometry,elementmaterial.clone(),elementmass);
    Physijs.ConvexMesh.call(this,spheregeometry,elementmaterial.clone(),elementmass);
    //this.visible = false;
    this.add( this.visualmesh);

    this.initconstraints = function(){

        for (var i = 0; i < this.cornerpositions.length; i++) {
            this.addcorner(this.cornerpositions[i]);
        };
        for (var i = 0; i < this.corners.length; i++) {
            var e;
            if (i == this.corners.length-1) e = new Edge(this.corners[i],this.corners[0],this);
            else e = new Edge(this.corners[i],this.corners[i+1],this);
            this.add(e);
            this.edges.push(e);
        };
        this.addconnectors();

    }
    this.addcorner = function(p){
        c = new Corner(this);
        c.position.set(p.x,p.y,p.z);
        this.corners.push(c);
        this.add(c);
        return c;
    }

    this.getdefaultcolor = function(){
        if (this.nailed) {return color_nailed}
        else return color_default;
    }
    this.getselectededge = function(){
        for (var i = selectededges.length - 1; i >= 0; i--) {
            var edge = getindexforedge(this,selectededges[i]);
            if (edge != undefined){
                return this.edges[edge];
            }
        };
        return this.edges[0];
    }
    this.getcrossededge = function(helper){
        
        if (this.corners.length == 4 && helper instanceof Edge) {
            var index = getindexforedge(this,helper);
            return this.edges[(index+2)%4];
        }
        if (this.corners.length == 3 && helper instanceof Corner){
            var index = getindexforcorner(this,helper);
            return this.edges[(index+1)%3];
        }
        return undefined;
    }
    this.parsejson = function(jsn){

        loadingmap[jsn['id']]= this;
        var edges = JSON.parse(jsn['edges']);
        var corners = JSON.parse(jsn['corners']);
        for (var i = 0; i < corners.length; i++) {
            var c = new Corner(this);
            this.corners.push(c)
            this.add(c);
            c.parsejson(corners[i]);
        };
        
        for (var i = 0; i < edges.length ; i++) {
            var e = new Edge(this.corners[i],this.corners[(i+1)%corners.length],this);
            this.edges.push(e)
            this.add(e);
            e.parsejson(edges[i]);
        };
        this.addconnectors();
        this.applyMatrix (JSON.parse(jsn['matrixWorld']));
        updatematrices(this);
    }
    this.rendercallback = function(){
        if (!this.nailed) return;
        this.matrix = this.nailedMatrix;
        this.matrix.decompose(this.position, this.quaternion, this.scale);
        this.__dirtyRotation = true;
        this.__dirtyPosition = true;
        for (var i = this.corners.length - 1; i >= 0; i--) {
            this.corners[i].rendercallback();
        };
    }
}
Element.prototype = Object.create(Physijs.ConvexMesh.prototype);

Square = function() {

    this.cornerpositions = [
        new THREE.Vector3(-6.5,-6.5,0),
        new THREE.Vector3(-6.5,516.5,0),
        new THREE.Vector3(516.5,516.5,0),
        new THREE.Vector3(516.5,-6.5,0)
    ];
    this.geometry = squaregeom;
    Element.call(this,this.geometry);

    this.addconnectors = function(){
        addrealconnectors(this,1);
    };

    this.toJSON = function(){
        return {
            'type':'Square',
            'edges':JSON.stringify(this.edges),
            'corners':JSON.stringify(this.corners), 
            'matrixWorld':JSON.stringify(this.matrixWorld)
        }
    }
};
Square.prototype = Object.create(Element.prototype);

Equilat = function() {
    
    this.cornerpositions = [
        new THREE.Vector3(-11.26,-6.5,0),
        new THREE.Vector3(250.24,446.43,0),
        new THREE.Vector3(511.74,-6.5,0)
    ];
    this.geometry = equigeom; 
    Element.call(this,this.geometry);
    
    this.addconnectors = function(){
        addrealconnectors(this,2);
    };

    this.toJSON = function(){
        return {
            'type':'Equilat',
            'edges':JSON.stringify(this.edges),
            'corners':JSON.stringify(this.corners), 
            'matrixWorld':JSON.stringify(this.matrixWorld)
        }
    };
};
Equilat.prototype = Object.create(Element.prototype);

RightAngled = function() {
    
    this.cornerpositions = [
        new THREE.Vector3(-6.5,-6.5,0),
        new THREE.Vector3(-6.5,516.5,0),
        new THREE.Vector3(516.5,-6.5,0)
    ];
    this.geometry = rectgeom; 
    Element.call(this,this.geometry);

    this.addconnectors = function(){
        addrealconnectors(this,3);
    };

    this.toJSON = function(){
        return {
            'type':'RightAngled',
            'edges':JSON.stringify(this.edges),
            'corners':JSON.stringify(this.corners), 
            'matrixWorld':JSON.stringify(this.matrixWorld)
        }
    };

};
RightAngled.prototype = Object.create(Element.prototype);


Table = function(){

    var tabletexture = new THREE.ImageUtils.loadTexture('textures/skybox/sky/bottom.jpg');
    //tabletexture.wrapS = THREE.MirroredRepeatWrapping;
    //tabletexture.wrapT = THREE.RepeatWrapping;
    //tabletexture.repeat.set( 14, 14 );

    var material = new THREE.MeshBasicMaterial({
                //color:0xffffff,
                map:tabletexture,
                side:THREE.FrontSide
    });
    
    var geometry = new THREE.PlaneGeometry(20000,20000,5,5);

    Physijs.PlaneMesh.call(this,geometry,material);
    this.receiveShadow = true;
    rotatearoundaxis(this,'X',-Math.PI/2);
    this.position.y = -100;

};

Table.prototype = Object.create(Physijs.PlaneMesh.prototype);

var hoverover = function(element) {
    if (element.selected == undefined)return;
    if (!element.selected) {
        element.material.color.set (color_hovered);
        if (element instanceof ElementVisualizer) {element.material.ambient.set(color_hovered)};
    };
    
}
var hoverout = function(element) {
    if (element.selected == undefined)return;
    if (!element.selected) {
        element.material.color.set (element.getdefaultcolor());
        if (element instanceof ElementVisualizer) {element.material.ambient.set(element.getdefaultcolor())};
    };
}
var select = function(element) {
    if (element.selected == undefined)return;
    element.material.color.set (color_selected);
    if (element instanceof ElementVisualizer) {element.material.ambient.set(color_selected)};
    element.selected = true;
}
var deselect = function(element) {
    if (element.selected == undefined)return;
    if (element instanceof CornerConnector) {element = element.connector_show};
    element.material.color.set (element.getdefaultcolor());
    if (element instanceof ElementVisualizer) {element.material.ambient.set(element.getdefaultcolor())};
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

function hideedges(){
    for (var i = objectgroup.length - 1; i >= 0; i--) {
        var obj = objectgroup[i];
        if (obj instanceof CornerConnector) obj.visible = false;
        else if (obj instanceof Element) {
            obj.visualmesh.castShadow = true;
            obj.visualmesh.receiveShadow = true;
            for (var j = obj.edges.length - 1; j >= 0; j--) {
                obj.edges[j].visible = false;
            };
            for (var j = obj.corners.length - 1; j >= 0; j--) {
                obj.corners[j].visible = false;
                obj.corners[j].realconnector.visible = true;
            };
        };
    };
}
function showedges(){
    for (var i = objectgroup.length - 1; i >= 0; i--) {
        var obj = objectgroup[i];
        if (obj instanceof CornerConnector) obj.visible = true;
        else if (obj instanceof Element) {
            obj.visualmesh.castShadow = false;
            obj.visualmesh.receiveShadow = false;
            for (var j = obj.edges.length - 1; j >= 0; j--) {
                obj.edges[j].visible = true;
            };
            for (var j = obj.corners.length - 1; j >= 0; j--) {
                if (obj.corners[j].connector == undefined) obj.corners[j].visible = true;
                obj.corners[j].realconnector.visible = false;
            };
        };
    };
}


function getindexforelement(element){
    for (var i = objectgroup.length - 1; i >= 0; i--) {
        if (objectgroup[i] == element)return i;
    };
}

function getindexforedge(element,edge){
    var edgeconnected = false;
    var c1,c2;
    if (edge.corners[0].connector != undefined && edge.corners[1].connector !=undefined){
        edgeconnected = true;
        c1 = edge.corners[0].connector;
        c2 = edge.corners[1].connector;
    } 

    for (var i = element.edges.length - 1; i >= 0; i--) {
        if (element.edges[i] == edge)return i;
        if (!edgeconnected) continue;
        if (element.edges[i].corners[0].connector != undefined && element.edges[i].corners[1].connector !=undefined) {
            var c3 = element.edges[i].corners[0].connector;
            var c4 = element.edges[i].corners[1].connector;

            if ((c3==c1&&c4==c2) || (c3==c2&&c4==c1))return i;
        };
    };
}

function getindexforcorner(element,corner){
    for (var i = element.corners.length - 1; i >= 0; i--) {
        if (element.corners[i] == corner)return i;
    };
}
