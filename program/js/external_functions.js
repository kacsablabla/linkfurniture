


function deselectedges(){
    for (var i = selectededges.length - 1; i >= 0; i--) {
        deselect(selectededges[i]);
    };
    selectededges = [];
}
function deselectcorners(){

    for (var i = selectedcorners.length - 1; i >= 0; i--) {
        deselect(selectedcorners[i]);
        selectedcorners[i].realconnector.visible = false;
    };
    selectedcorners = [];
}

function deselectelements(){

    for (var i = selectedelements.length - 1; i >= 0; i--) {
        deselect(selectedelements[i].visualmesh);
    };
    selectedelements = [];
}

function deselectall(){
    deselectedges();
    deselectcorners();
    deselectelements();
}

function connectcorners(a,b){
    if (a.parent == b.parent) return false;
    transformhelper.detach();
    //deselectall();
    var connectora = a.getconnector();
    //console.log('connectora position: '+connectora.position);
    var connectorb = b.getconnector();
    //console.log('connectorb position: '+connectorb.position);
    if (connectora == connectorb) return false;
    connectora.mergeWithConnector(connectorb);
    //console.log('merged position: '+connectorb.position);
    return true;
    //physicson();
}

function disconnectcorners(corner,face){
    if (corner.connector == undefined) return false;
    transformhelper.detach();
   var connector = corner.getconnector();
   var corner
   for (var i = connector.corners.length - 1; i >= 0; i--) {
       if (connector.corners[i].parent == face) {
            corner = connector.corners[i];
            break;
        }
   };
   if (connector.removecorner(corner)) corner.visible = true;
    return corner.visible;
   
}

function connectedges(a,b){
    if (a.parent == b.parent) return false;
    transformhelper.detach();
    var a1 = a.corners[0];
    var a2 = a.corners[1];
    var b1 = b.corners[0];
    var b2 = b.corners[1];

    var a1pos = a.parent.localToWorld(a1.position.clone());
    var a2pos = a.parent.localToWorld(a2.position.clone());
    var b1pos = b.parent.localToWorld(b1.position.clone());
    var b2pos = b.parent.localToWorld(b2.position.clone());

    var normaldist = a1pos.distanceToSquared(b1pos)+a2pos.distanceToSquared(b2pos);
    var crossdist = a1pos.distanceToSquared(b2pos)+a2pos.distanceToSquared(b1pos);
    if (crossdist<normaldist) {var temp = b1; b1 = b2; b2 = temp;};

    if (a1.isconnectedto(b2)) {var temp = b1; b1 = b2; b2 = temp;}
    else if (a2.isconnectedto(b1)) {
        var temp = b1; b1 = b2; b2 = temp;
    };
    var s1 = connectcorners(a1,b1);
    var s2 = connectcorners(a2,b2);
    return(s1||s2);
}
function disconnectedges(a,b){
    transformhelper.detach();

    //deselectall();
    //physicson()
  var a1 = a.corners[0];
  var a2 = a.corners[1];

  var s1 = disconnectcorners(a1,b);
  var s2 = disconnectcorners(a2,b);
  return(s1||s2);
}

function addtoedge(element,edge){

    var appropriateedge = undefined;
    var cornerdistance = edge.cornerdistance;
    for (var i = element.edges.length - 1; i >= 0; i--) {
        if (Math.abs(element.edges[i].cornerdistance - cornerdistance) < 5){
            appropriateedge = element.edges[i];
            break;
        }
    };
    if (!appropriateedge) return;
    updatematrices(appropriateedge);
    var inverse = new THREE.Matrix4();
    inverse.getInverse(appropriateedge.matrixWorld);
    element.applyMatrix(inverse);

    //return;
    element.applyMatrix(edge.matrixWorld.clone());
    updatematrices(element);
    element.__dirtyPosition = true;
    element.__dirtyRotation = true;
    connectedges(appropriateedge,edge);

}
function removeelement(element){
    deselectall();
    for (var i = element.corners.length - 1; i >= 0; i--) {
        disconnectcorners(element.corners[i],element);
    };
    for (var i = element.corners.length - 1; i >= 0; i--) {
        var c = element.corners[i];
        if (c.connector != undefined) {

            var connector = c.connector;
            var corner;
            while((corner = connector.corners.pop()) != null){

                constraint = connector.constraints[corner.id];
                scene.removeConstraint(constraint);
            }
            connector.constraints = {};
            connector.corners = [];
            // 
            objectgroup.splice(objectgroup.indexOf(connector),1);
            scene.remove(connector);
        };

    };
    objectgroup.splice(objectgroup.indexOf(element),1);
    scene.remove(element);
}
function nail(mymesh){
    //if (mymesh.mass != elementmass_nailed) {mymesh.mass = elementmass_nailed;return;};
    //mymesh.mass = elementmass;
    mymesh.nailed = !mymesh.nailed;
    if (mymesh.nailed) mymesh.nailedMatrix = mymesh.matrixWorld.clone();
}

function physicsswitch(){
    if (! physicssimulation) physicson();
    else{
        physicsoff();
    }
}
function physicsoff(){
    physicssimulation = false;
};

function physicson(){
    if (physicssimulation) return;
    transformhelper.detach();
    for (var i = objectgroup.length - 1; i >= 0; i--) {
        objectgroup[i].__dirtyRotation = true;
        objectgroup[i].__dirtyPosition = true;
    };
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
        if (obj instanceof Element || obj instanceof CornerConnector){

            var factor = 0.92;
            //if (obj.nailed) {factor = 0};
             
            var linear = obj.getLinearVelocity();
            obj.setLinearVelocity(linear.multiplyScalar(factor));

            var angular = obj.getAngularVelocity();
            obj.setAngularVelocity(angular.multiplyScalar(factor));

            if (shouldstopphysics == true) {
                if (linear.length()>1 || angular.length()>1) shouldstopphysics = false;
            };
        }
        
    };

    if (shouldstopphysics) physicssimulation = false;
}

function peasantblinding(){
    if (helpervisibility) {
        hideedges();
    }
    else {
        showedges();
    }
    helpervisibility = !helpervisibility;
}

function gravityswitch(){
    if (gravity.y == 0) {gravity.y = -7}
    else {gravity.y = 0;}
    
    scene.setGravity(gravity);
    
}

function clearscene(){
    var constraints = scene._constraints;
   for (var i in constraints) {
        var constraint = constraints[i];
        scene.removeConstraint(constraint);
   };
   for (var i = objectgroup.length - 1; i >= 0; i--) {
       scene.remove (objectgroup[i]);
   };

    selectededges = [];
    selectedcorners = [];
    objectgroup = [];
    physicsoff();

}


