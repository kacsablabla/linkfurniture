

var logs = [];

function log(action,arg1,arg2){

    var log;
    switch(action){
        case 'connectedges':
            log = action+' '+getindexforelement(arg1.parent)+' '+getindexforedge(arg1.parent,arg1)+' '+getindexforelement(arg2.parent)+' '+getindexforedge(arg2.parent,arg2);
            break;
        case 'connectcorners':
            log = action+' '+getindexforelement(arg1.getconnector())+' '+getindexforelement(arg2.getconnector());
            break;
        case 'add':
            log = action+' '+arg1+' '+getindexforelement(arg2);
            break;
        case 'nail':
            log = action+' '+getindexforelement(arg1);
            break;
        case 'disconnectedge':
            log = action+' '+getindexforelement(arg1.parent)+' '+getindexforedge(arg1.parent,arg1)+' '+getindexforelement(arg2);
            break;
        case 'disconnectcorner':
            //log = action+' '+getindexforelement(arg1.parent)+' '+getindexforedge(arg1.parent,arg1)+' '+getindexforelement(arg2);
            break;
    }
    console.log(log);
    logs.push(log);
}

function poplog(){

    var log = logs.pop().split(' ');
    switch(log[0]){
        case 'connectedges':
            var element = objectgroup[log[1]];
            disconnectedges(element.edges[log[2]],element);
            break;
        case 'connectcorners':
            //log = action+' '+getindexforelement(arg1.getconnector())+' '+getindexforelement(arg2.getconnector());
            break;
        case 'add':
            scene.remove(objectgroup.pop());
            break;
        case 'nail':
            nail(log[1]);
            break;
        case 'disconnectedge':
            //connectedges(objectgroup[log[1]].edges[log[2]],selectededges[1]);
            //log = action+' '+getindexforelement(arg1.parent)+' '+getindexforedge(arg1.parent,arg1)+' '+getindexforelement(arg2);
            break;
        case 'disconnectcorner':
            //log = action+' '+getindexforelement(arg1.parent)+' '+getindexforedge(arg1.parent,arg1)+' '+getindexforelement(arg2);
            break;
    }
    
}

function getindexforelement(element){
    for (var i = objectgroup.length - 1; i >= 0; i--) {
        if (objectgroup[i] == element)return i;
    };
}

function getindexforedge(element,edge){
    for (var i = element.edges.length - 1; i >= 0; i--) {
        if (element.edges[i] == edge)return i;
    };
}

function getindexforcorner(element,corner){
    for (var i = element.corners.length - 1; i >= 0; i--) {
        if (element.corners[i] == corner)return i;
    };
}

function savelog(){
    var blob = new Blob(log, {type: "text/plain;charset=utf-8"});
    saveAs(blob, "mylog.txt");
}

function loadlog(){
    var blob = new Blob(log, {type: "text/plain;charset=utf-8"});
    saveAs(blob, "mylog.txt");
}