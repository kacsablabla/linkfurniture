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

exportconnectors = function(){
    var connectors = [];
    for (var i = objectgroup.length - 1; i >= 0; i--) {
        if (objectgroup[i] instanceof CornerConnector) {
            connectors.push(objectgroup[i]);
        }; 
    };
    connectors = connectors.sort(function(a,b){
        if (b.corners.length > a.corners.length)return -1;
        if (b.corners.length < a.corners.length)return 1;
        return 0;
    });

    var elements = []
    for (var i = objectgroup.length - 1; i >= 0; i--) {
        if (objectgroup[i] instanceof Element) {
            elements.push(objectgroup[i]);
        }; 
    };
    var corners = [];
    for (var i = elements.length - 1; i >= 0; i--) {
        for (var j = elements[i].corners.length - 1; j >= 0; j--) {
            if (elements[i].corners[j].connector == undefined) {
                corners.push(elements[i].corners[j]);
            };
            
        };
    };

    var zip = new JSZip();
    var main = zip.folder("linkfurniture");
    var connectorsfolder = main.folder("connectors");
    var imagesfolder = main.folder("images");

    mergedconnectors = [];
    for (var i = connectors.length - 1; i >= 0; i--) {
        var generatedstl = stlFromGeometry(getmergedconnector(connectors[i]));
        //mergedconnectors.push();
        connectorsfolder.file("connector"+i+".stl",generatedstl);
        console.log("connector export"+i);
    };
    for (var i = corners.length - 1; i >= 0; i--) {
        var generatedstl = stlFromGeometry(corners[i].realconnector.geometry);
        //mergedconnectors.push();
        connectorsfolder.file("simpleconnector"+i+".stl",generatedstl);
        console.log("simpleconnector export"+i);
    };
    var loader = new THREE.STLLoader();
    var geom = loader.parseASCII(mergedconnectors[0]);
    assignUVs(geom);
    var mesh = new THREE.Mesh(geom,connectormaterial);
    scene.add(mesh);

    var savable = new Image();
    savable.src = renderer.domElement.toDataURL();
    imagesfolder.file("image.png", savable.src.substr(savable.src.indexOf(',')+1), {base64: true});
    var content = zip.generate({type:"blob"});
    saveAs(content, "test_zip.zip");
}
getmergedconnector = function(connector){
    var merged = new THREE.Geometry();
    for (var i = connector.corners.length - 1; i >= 0; i--) {
        merged.merge(connector.corners[i].realconnector.geometry.clone(),connector.corners[i].parent.matrixWorld);
    };
    return merged;
}


function create_zip(blobs) {
    var zip = new JSZip();
    for (var i = blobs.length - 1; i >= 0; i--) {
        var blob = blobs[i];
        zip.add("blob"+i+"png",blob);
    };
    content = zip.generate();
    saveAs(content, "test_zip.zip");
}


