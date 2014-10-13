var selectedbutton = undefined;

$(document).ready(function(){

    createcontroldiv();
    
    
    $("#addsquare").click( function(){
        executecommand('square');
    });
});


function createcontroldiv(){

    var controlcontainer = document.createElement("div");
    controlcontainer.style.cssText = "position:absolute;width:130px;height:200px;background-color:#0ff;top:50";
    controlcontainer.id = "controlwrapper";
    //controlcontainer.class = ".controlwrapper";
    //stats.domElement.style.left = '400px';
    

    var button = document.createElement("div");
    button.style.top = 50; 
    button.style.left = 50; 
    button.style.backgroundImage = 'url(../textures/button.png)';
    button.className = "ControlButton";
    button.id = "addsquare";
    controlcontainer.appendChild(button);

    container.appendChild(controlcontainer);

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