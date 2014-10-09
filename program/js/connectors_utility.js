var squareconnectors = [];
var equilatconnectors = [];
var rightangleconnectors = [];

var connectormaterial = new THREE.MeshLambertMaterial({
    color:0xaaaaaa,
    specular: 0x333333,
    bumpMap: 0,
    side:THREE.FrontSide
});

loadconnectormeshes();

function loadconnectormeshes(){
    var loader = new THREE.STLLoader();

    loader.load( 'models/equilat/connector1.stl', function ( geometry1 ) {
        assignUVs(geometry1);
        equilatconnectors.push(geometry1);
        loader.load( 'models/equilat/connector2.stl', function ( geometry2 ) {
            assignUVs(geometry2);
            equilatconnectors.push(geometry2);
                loader.load( 'models/equilat/connector3.stl', function ( geometry3 ) {
                assignUVs(geometry3);
                equilatconnectors.push(geometry3);
            } );
        } );
    } );

    loader.load( 'models/square/connector1.stl', function ( geometry1 ) {
        assignUVs(geometry1);
        squareconnectors.push(geometry1);
        loader.load( 'models/square/connector2.stl', function ( geometry2 ) {
            assignUVs(geometry2);
            squareconnectors.push(geometry2);
                loader.load( 'models/square/connector3.stl', function ( geometry3 ) {
                assignUVs(geometry3);
                squareconnectors.push(geometry3);
                    loader.load( 'models/square/connector4.stl', function ( geometry4 ) {
                    assignUVs(geometry4);
                    squareconnectors.push(geometry4);
                } );
            } );
        } );
    } );

    loader.load( 'models/rightangle/connector1.stl', function ( geometry1 ) {
        assignUVs(geometry1);
        rightangleconnectors.push(geometry1);
        loader.load( 'models/rightangle/connector2.stl', function ( geometry2 ) {
            assignUVs(geometry2);
            rightangleconnectors.push(geometry2);
                loader.load( 'models/rightangle/connector3.stl', function ( geometry3 ) {
                assignUVs(geometry3);
                rightangleconnectors.push(geometry3);
            } );
        } );
    } );
} 


addrealconnectors = function(element,type){
    var realconnectors = undefined;
    if (type == 1) realconnectors = squareconnectors;
    if (type == 2) realconnectors = equilatconnectors;
    if (type == 3) realconnectors = rightangleconnectors;

    for (var i = 0; i < element.corners.length; i++) {
        var mesh = new THREE.Mesh(realconnectors[i],connectormaterial);
        if (helpervisibility) mesh.visible = false;
        element.add(mesh);
        element.corners[i].realconnector = mesh;
    };
};


