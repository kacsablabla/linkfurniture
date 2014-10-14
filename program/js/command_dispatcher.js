var activefunction = undefined;
var infobox;

$(document).ready(function(){

    main_init();
    createcontroldiv();

//renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
    //renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
    //renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
    //renderer.domElement.addEventListener( 'click', onDocumentMouseClick, false );

    $("#renderercanvas").mousedown( function(event){
        onDocumentMouseDown(event);
    });
    $("#renderercanvas").mouseup( function(event){
        onDocumentMouseUp(event);
    });
    $("#renderercanvas").mousemove( function(event){
        onDocumentMouseMove(event);
    });
    $("#renderercanvas").click( function(event){
        onDocumentMouseClick(event);
    });

    $(".ControlContainer").click( function(event){
        
    });

    $(".ControlButton").not("#addsquare,#addequilat,#addrightangle,#save,#physics,#load").click(  function(event){

        $(this).addClass('selected').siblings().removeClass('selected')

    });
   

    $("#addsquare").click( function(event){
        executecommand('square');
        event.stopPropagation();
    });
    
    $("#addequilat").click( function(event){
        executecommand('equilat');
        event.stopPropagation();
    });
    $("#addrightangle").click( function(event){
        executecommand('rightangle');
        event.stopPropagation();
    });
    $("#Connect").click( function(event){
        setactivefunction("connect");
        //executecommand('connect');
        event.stopPropagation();
    });
    $("#Disconnect").click( function(event){
        setactivefunction("disconnect");
        //executecommand('disconnect');
        event.stopPropagation();
    });
    $("#rotation").click( function(event){
        setactivefunction("rotation");
        //transformtype = 1;
        event.stopPropagation();
    });
    $("#rotationall").click( function(event){
        setactivefunction("rotationall");
        //executecommand('nail');
        event.stopPropagation();
    });
    $("#translation").click( function(event){
        setactivefunction("translation");
        //transformtype = 0;
        event.stopPropagation();
    });
    $("#translationall").click( function(event){
        setactivefunction("translationall");
        //executecommand('nail');
        event.stopPropagation();
    });
    $("#physics").click( function(event){
        setactivefunction("physics");
        //executecommand('nail');
        event.stopPropagation();
    });
    $("#peasantblinding").click( function(event){
        setactivefunction("peasantblinding");
        event.stopPropagation();
    });
    $("#delete").click( function(event){
        setactivefunction("delete");
        event.stopPropagation();
    });
    $("#lock").click( function(event){
        setactivefunction("lock");
        //executecommand('nail');
        event.stopPropagation();
    });
    $("#save").click( function(event){
        savelog();
        event.stopPropagation();
    });
    $("#load").click( function(event){
        loadlog();
        event.stopPropagation();
    });

});


function createcontroldiv(){

    infobox = document.createElement("div");
    //button.style.backgroundImage = 'url(../textures/icons/peasantblinding.png)';
    infobox.className = "InfoBox";
    infobox.id = "ib";
    container.appendChild(infobox);
    infobox.innerHTML = "";
    
    var topmenu = document.createElement("div");
    topmenu.id = "TopMenu";
    container.appendChild(topmenu);
    
/*
    var controlcontainer = document.createElement("div");
    controlcontainer.className = "ControlContainer";
    //controlcontainer.style.backgroundImage = 'url(../textures/controlcontainerbg.png)';
    //controlcontainer.style.opacity = 0.2;
    controlcontainer.id = "controlwrapper";
    //stats.domElement.style.left = '400px';
    container.appendChild(controlcontainer);
    */
    var topiconcount = 8;
    var topspacing = 100/(topiconcount+2);
    var leftcount = 4;
    var leftspacing = 100/(leftcount+2);
    var rightcount = 4;
    var rightspacing = 100/(rightcount+2);
    var margin = 0;
    //var distance = 95;


    var button = document.createElement("div");
    button.style.top = leftspacing+"%"; 
    button.style.left = margin+"%"; 
    button.style.backgroundImage = 'url(../textures/icons/rightangle.png)';
    button.className = "ControlButton";
    button.id = "addrightangle";
    container.appendChild(button);

    button = document.createElement("div");
    button.style.top = 2*leftspacing+"%"; 
    button.style.left = margin+"%"; 
    button.style.backgroundImage = 'url(../textures/icons/square.png)';
    button.className = "ControlButton";
    button.id = "addsquare";
    container.appendChild(button);

    button = document.createElement("div");
    button.style.top = 3*leftspacing+"%"; 
    button.style.left = margin+"%"; 
    button.style.backgroundImage = 'url(../textures/icons/equilat.png)';
    button.id = "addequilat";
    button.className = "ControlButton";
    container.appendChild(button);

    button = document.createElement("div");
    button.className = "ControlButton";
    button.style.top = 4*leftspacing+"%";  
    button.style.left = margin+"%"; 
    button.style.backgroundImage = 'url(../textures/icons/delete.png)';
    button.className = "ControlButton";
    button.id = "delete";
    container.appendChild(button);


   
    button = document.createElement("div");
    button.style.top = margin+"%"; 
    button.style.left = topspacing+"%";//margin+distance; 
    button.style.backgroundImage = 'url(../textures/icons/connect.png)';
    button.className = "ControlButton";
    button.id = "Connect";
    container.appendChild(button);

    button = document.createElement("div");
    button.style.top = margin+"%"; 
    button.style.left = 2*topspacing+"%"; 
    button.style.backgroundImage = 'url(../textures/icons/disconnect.png)';
    button.className = "ControlButton";
    button.id = "Disconnect";
    container.appendChild(button);

    button = document.createElement("div");
    button.style.top = margin+"%"; 
    button.style.left = 3*topspacing+"%"; 
    button.style.backgroundImage = 'url(../textures/icons/rotation.png)';
    button.className = "ControlButton";
    button.id = "rotation";
    container.appendChild(button);

    button = document.createElement("div");
    button.style.top = margin+"%"; 
    button.style.left = 4*topspacing+"%"; 
    button.style.backgroundImage = 'url(../textures/icons/rotationall.png)';
    button.className = "ControlButton";
    button.id = "rotationall";
    container.appendChild(button);

    button = document.createElement("div");
    button.style.top = margin+"%"; 
    button.style.left = 5*topspacing+"%"; 
    button.style.backgroundImage = 'url(../textures/icons/translation.png)';
    button.className = "ControlButton";
    button.id = "translation";
    container.appendChild(button);

    button = document.createElement("div");
    button.style.top = margin+"%"; 
    button.style.left = 6*topspacing+"%"; 
    button.style.backgroundImage = 'url(../textures/icons/translationall.png)';
    button.className = "ControlButton";
    button.id = "translationall";
    container.appendChild(button);

    button = document.createElement("div");
    button.style.top = margin+"%"; 
    button.style.left = 7*topspacing+"%"; 
    button.style.backgroundImage = 'url(../textures/icons/lock.png)';
    button.className = "ControlButton";
    button.id = "lock";
    container.appendChild(button);

    button = document.createElement("div");
    button.style.top = margin+"%"; 
    button.style.left = 8*topspacing+"%"; 
    button.style.backgroundImage = 'url(../textures/icons/physics.png)';
    button.className = "ControlButton";
    button.id = "physics";
    container.appendChild(button);





    button = document.createElement("div");
    button.style.top = rightspacing+"%"; 
    button.style.right = margin+"%"; 
    button.style.backgroundImage = 'url(../textures/icons/peasantblinding.png)';
    button.className = "ControlButton";
    button.id = "peasantblinding";
    container.appendChild(button);

    button = document.createElement("div");
    button.style.top = rightspacing*2+"%"; 
    button.style.right = margin+"%"; 
    button.style.backgroundImage = 'url(../textures/icons/undo.png)';
    button.className = "ControlButton";
    button.id = "undo";
    container.appendChild(button);

    button = document.createElement("div");
    button.style.top = rightspacing*3+"%"; 
    button.style.right = margin+"%";
    button.style.backgroundImage = 'url(../textures/icons/load.png)';
    button.className = "ControlButton";
    button.id = "load";
    container.appendChild(button);

    button = document.createElement("div");
    button.style.top = rightspacing*4+"%"; 
    button.style.right = margin+"%";
    button.style.backgroundImage = 'url(../textures/icons/save.png)';
    button.className = "ControlButton";
    button.id = "save";
    container.appendChild(button);



}

function setactivefunction(newfunction){
    if (newfunction == activefunction) {return};
    if (activefunction ==  "peasantblinding"||newfunction ==  "peasantblinding") {
        peasantblinding();
    };
    if (activefunction ==  "translation" || activefunction ==  "rotation") {
        transformtype = -1;
    };
    if (newfunction == "translation") transformtype = 0;
    if (newfunction == "rotation") transformtype = 1;
    if (newfunction == "translationall") transformtype = 2;
    if (newfunction == "rotationall") transformtype = 3;
    if (newfunction == "physics") physicson();
    deselectall();
    switch(newfunction){
        case "connect":
            infobox.innerHTML = "Click on 2 edges, or 2 corners on different elements to connect them!";
            break;
        case "disconnect":
            infobox.innerHTML = "Click on an element, and a corner or edge to disconnect the element from the corner or edge!";
            break;
        case "delete":
            infobox.innerHTML = "Click on an element to remove it!";
            break;
        case "lock":
            infobox.innerHTML = "Click on an element to fix it's position!";
            break;
        case "translation":
            infobox.innerHTML = "Drag the edges of the elements to move it along them, or drag the element to move it perpendicular to it's plane!";
            break;
        case "rotation":
            infobox.innerHTML = "Drag the edges of the squares, or the corners of the triangles to rotate them!";
            break;
        default:
            infobox.innerHTML = "";
            break;

    }
    activefunction = newfunction;
}

function performfunction(){
    switch(activefunction){

        case "connect":
            var success = false;
            if (selectedcorners.length>1) {
                if (connectcorners(selectedcorners[0],selectedcorners[1]))success = true;
            }
            else if (selectededges.length>1 && !success) {
                if (connectedges(selectededges[0],selectededges[1])) success = true;
            };
            if (success) {
                deselectall();
                physicson();
            }
            break;
        case "disconnect":
            if (selectedelements.length == 0) return;
            var success = false
            for (var i = selectedcorners.length - 1; i >= 0; i--) {
                for (var j = selectedelements.length - 1; j >= 0; j--) {
                    if(disconnectcorners(selectedcorners[i],selectedelements[j])) success = true;
                };
            };
            for (var i = selectededges.length - 1; i >= 0; i--) {
                for (var j = selectedelements.length - 1; j >= 0; j--) {
                    if (disconnectedges(selectededges[i],selectedelements[j])) success = true;
                };
            };
            if (success) {
                deselectall();
                physicson();
            }
            break;
        case "delete":
            if (selectedelements.length>0) removeelement(selectedelements[0]);
            break;
        case "lock":
            if (selectedelements.length>0) {
                nail(selectedelements[0]);
                deselectall();
            };
            break;
    }
}

function executecommand(command){

    command = command ?  command.split() : document.getElementById('command').value.split();
    switch(command[0]){
        case 'test1':
            test1();
            break;
        case 'test2':
            test3();
            break;
        case 'test4':
            test4();
            break;
        case 'clear':
            clearscene();
            break;

        case 'square':
            var s = new Square();
            objectgroup.push(s);
            scene.add(s);
            s.initconstraints();

            log('add','square',s);
            if (selectededges.length > 0) {
                addtoedge(s,selectededges[0]);
            };
            physicson();
            break;
        case 'equilat':
            var s = new Equilat();
            objectgroup.push(s);
            scene.add(s);
            s.initconstraints();

            log('add','equilat',s);
            if (selectededges.length > 0) {
                addtoedge(s,selectededges[0]);
            };
            physicson();
            
            break;
        case 'rightangle':
            var s = new RightAngled();
            objectgroup.push(s);
            scene.add(s);
            s.initconstraints();

            log('add','rightangle',s);
            if (selectededges.length > 0) {
                addtoedge(s,selectededges[0]);
            };
            physicson();
            break;
        case 'connect':
            if (selectededges.length == 2){
                log('connectedges',selectededges[0],selectededges[1]);
                connectedges(selectededges[0],selectededges[1]);}
            else if (selectedcorners.length == 2) {
                log('connectcorners',selectedcorners[0],selectedcorners[1]);
                connectcorners(selectedcorners[0],selectedcorners[1]);}
            break;
        case 'nail':
            if (selectedelements.length == 0) return;
            nail(selectedelements[0]);
            break;
        case 'disconnect':
            if (selectedcorners.length == 1 && transformhelper.target != undefined){
                log('disconnectcorner',selectedcorners[0],transformhelper.target);
                disconnectcorners(selectedcorners[0],transformhelper.target);
            }
            else if (selectededges.length == 1 && transformhelper.target != undefined){
                log('disconnectedge',selectededges[0],transformhelper.target);
                disconnectedges(selectededges[0],transformhelper.target);
            }
            break;
    }
}

var dictionary = {
    1:{hu:"hello vilag",de:"guten tag welt",en:"hello world"}
};