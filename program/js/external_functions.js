


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
    if (a.parent == b.parent) return;
    transformhelper.detach();
    deselectcorners();
    var connectora = a.getconnector();
    console.log('connectora position: '+connectora.position);
    var connectorb = b.getconnector();
    console.log('connectorb position: '+connectorb.position);
    if (connectora == connectorb) return;
    connectora.mergeWithConnector(connectorb);
    console.log('merged position: '+connectorb.position);
    physicson();
}

function disconnectcorners(corner,face){
    transformhelper.detach();
    deselectcorners();
    physicson()
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
    if (a.parent == b.parent) return;
    transformhelper.detach();
    deselectedges();
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

    connectcorners(a1,b1);
    connectcorners(a2,b2);
    //physicson();
}
function disconnectedges(a,b){
    transformhelper.detach();
    deselectedges();
    physicson()
  var a1 = a.corners[0];
  var a2 = a.corners[1];

  disconnectcorners(a1,b);
  disconnectcorners(a2,b);
}

function addtoedge(element,edge){

    updatematrices(element.edges[0]);
    var inverse = new THREE.Matrix4();
    inverse.getInverse(element.edges[0].matrixWorld);
    element.applyMatrix(inverse);

    //return;
    element.applyMatrix(edge.matrixWorld.clone());
    updatematrices(element);
    element.__dirtyPosition = true;
    element.__dirtyRotation = true;
    connectedges(element.edges[0],edge);

}

function nail(mymesh){
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
        if (obj instanceof Element){

            var factor = 0.89;
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


