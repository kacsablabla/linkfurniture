
//performance test adds 25 squares
function test1(){
    for (var i = 25 - 1; i >= 0; i--) {
        var s = new Square();
        objectgroup.push(s);
        scene.add(s);
        s.initconstraints();
    };
    physicsswitch();
};

//connection test 1
function test2(){
    var squares = [];

    for (var i = 2 - 1; i >= 0; i--) {
        var s = new Square();
        objectgroup.push(s);
        scene.add(s);
        s.initconstraints();
        squares.push(s);
    };
    
    squares[0].position.set(edgelength*2,edgelength*2,50);

    //rotatearoundaxis(squares[0],'X',Math.PI/3);
    squares[0].matrixAutoUpdate = false;
    squares[0].updateMatrix();
    //squares[0].matrixAutoUpdate = true;
    squares[0].updateMatrixWorld();
    squares[0].matrixAutoUpdate = true;
    nail(squares[0]);
    //return;

    //var connectora = squares[0].corners[3].getconnector();
    connectcorners(squares[0].corners[3],squares[1].corners[3]);
    squares[0].__dirtyPosition = true;
    squares[0].__dirtyRotation = true;
    //connectedges(squares[0].edges[2],squares[2].edges[1]);

};