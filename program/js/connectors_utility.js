var low45;
var low60;
var low90;
var connectormaterial = new THREE.MeshLambertMaterial({
    color:0xaaaaaa,
    specular: 0x333333,
    bumpMap: 0,
    side:THREE.FrontSide
});

loadconnectormeshes();

function loadconnectormeshes(){
    var loader = new THREE.STLLoader();
    //loader.load( 'models/connectors/45low.stl', function ( geometry ) {
    loader.load( 'models/equilat/equilatcorner1.stl', function ( geometry ) {
        low45 = geometry;
        assignUVs(low45);
    } );
    //loader.load( 'models/connectors/60low.stl', function ( geometry ) {
    loader.load( 'models/equilat/equilatcorner2.stl', function ( geometry ) {
        low60 = geometry;
        assignUVs(low60);
    } );
    //loader.load( 'models/connectors/90low.stl', function ( geometry ) {
    loader.load( 'models/equilat/equilatcorner3.stl', function ( geometry ) {
        low90 = geometry;
        assignUVs(low90);
    } );
} 


Connector = function(type){
    switch(type){
        case 45:
            this.geometry = low45;
            break;
        case 60:
            this.geometry = low60;
            break;
        case 90:
            this.geometry = low90;
            break;
    }
    this.corner = undefined;
    //Physijs.ConcaveMesh.call(this,this.geometry,connectormaterial,20);
    THREE.Mesh.call(this,this.geometry,connectormaterial);
    this.position.set(0,0,0);
    this.selected = false;
    this.transformable = true; 
    objectgroup.push(this);

    this.addtocorner = function(corner){

        this.corner = corner;
        var inverse = new THREE.Matrix4();
        inverse.getInverse(this.matrixWorld);
        this.applyMatrix(inverse);
        this.applyMatrix(corner.matrixWorld.clone());
        updatematrices(this);
    }
    this.getselectededge = function(){
        return this;
    }
    this.getdefaultcolor = function(){
        if (this.mass == 0) {return color_nailed}
        else return color_default;
    }
}

//Connector.prototype = Object.create(Physijs.ConcaveMesh.prototype);
Connector.prototype = Object.create(THREE.Mesh.prototype);

function createconnectormesh(){
    var object = new Connector(60);
    scene.add(object);
    object = new Connector(45);
    scene.add(object);
    object = new Connector(90);
    scene.add(object);
    //object.addtocorner(selectedcorners[0]);
};


