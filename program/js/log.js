

var logs = [];
var serialized;
var loadingmap = {};

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


function savelog(){

    var objects = JSON.stringify(objectgroup);
    //console.log(objects);
    serialized = objects;
    return;

    var blob = new Blob(log, {type: "text/plain;charset=utf-8"});
    saveAs(blob, "mylog.txt");
}

function loadlog(parsed){
    loadingmap = {};
    if (parsed == undefined)parsed = JSON.parse(serialized);
    for (var i = parsed.length - 1; i >= 0; i--) {
        var o = parsed[i];
        var s = undefined;
        switch(o['type']){
            case 'Square':
                s = new Square();
                break;
            case 'RightAngled':
                s = new RightAngled();
                break;
            case 'Equilat':
                s = new Equilat();
                break;
        }
        if (s != undefined) {
            s.parsejson(parsed[i]);
            scene.add(s);
            objectgroup.push(s); 
        };
    };

    for (var i = parsed.length - 1; i >= 0; i--) {
        var o = parsed[i];
        var s = undefined;
        switch(o['type']){
            case 'CornerConnector':
                s = new CornerConnector();
                break;
        }
        if (s != undefined) {
            scene.add(s);
            objectgroup.push(s); 
            s.parsejson(parsed[i]);
        };
    };
    return;
    var blob = new Blob(log, {type: "text/plain;charset=utf-8"});
    saveAs(blob, "mylog.txt");
}