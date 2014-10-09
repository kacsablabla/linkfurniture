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
            if (transformhelper.target == undefined) return;
            nail(transformhelper.target);
            log('nail',transformhelper.target);
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