
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

function test3(){

    var equis = [];
    var rects = [];

    for (var i = 2 - 1; i >= 0; i--) {
        var equi = new Equilat();
        objectgroup.push(equi);
        scene.add(equi);
        equi.initconstraints();
        equis.push(equi);
    };
    for (var i = 2 - 1; i >= 0; i--) {
        var rect = new RightAngled();
        objectgroup.push(rect);
        scene.add(rect);
        rect.initconstraints();
        rects.push(rect);
    };

    rotatearoundaxis(rects[0],'X',Math.PI/2);
    updatematrices(rects[0]);
    nail(rects[0]);
    connectcorners(equis[0].corners[0],rects[0].corners[0]);
    connectcorners(equis[1].corners[0],rects[0].corners[1]);
    connectedges(rects[1].edges[1],equis[0].edges[1]);
    connectedges(rects[1].edges[2],equis[1].edges[1]);

}

function test4(){
    var p = [{"type":"Equilat","edges":"[{\"id\":85,\"corners\":\"[{\\\"id\\\":82,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":-103.4800033569336,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":83,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":177.5,\\\\\\\"13\\\\\\\":471.6700134277344,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":0.8660253882408142,\\\"1\\\":-0.5,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0.5,\\\"5\\\":0.8660253882408142,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":37.0099983215332,\\\"13\\\":228.3350067138672,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":86,\"corners\":\"[{\\\"id\\\":83,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":177.5,\\\\\\\"13\\\\\\\":471.6700134277344,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":84,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":458.4800109863281,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":0.8660253882408142,\\\"1\\\":0.5,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":-0.5,\\\"5\\\":0.8660253882408142,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":317.989990234375,\\\"13\\\":228.3350067138672,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":87,\"corners\":\"[{\\\"id\\\":84,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":458.4800109863281,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":82,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":-103.4800033569336,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":2.220446049250313e-16,\\\"1\\\":1,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":-1,\\\"5\\\":2.220446049250313e-16,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"}]","corners":"[{\"id\":82,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":-103.4800033569336,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":83,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":471.6700134277344,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":84,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":458.4800109863281,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"}]","matrixWorld":"{\"elements\":{\"0\":0.9835506677627563,\"1\":0.10244519263505936,\"2\":-0.14877192676067352,\"3\":0,\"4\":-0.06679503619670868,\"5\":-0.5589644908905029,\"6\":-0.8264968395233154,\"7\":0,\"8\":-0.16782885789871216,\"9\":0.8228387236595154,\"10\":-0.5429270267486572,\"11\":0,\"12\":-63.775089263916016,\"13\":1227.409912109375,\"14\":231.21531677246094,\"15\":1}}"},{"type":"Equilat","edges":"[{\"id\":92,\"corners\":\"[{\\\"id\\\":89,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":-103.4800033569336,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":90,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":177.5,\\\\\\\"13\\\\\\\":471.6700134277344,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":0.8660253882408142,\\\"1\\\":-0.5,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0.5,\\\"5\\\":0.8660253882408142,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":37.0099983215332,\\\"13\\\":228.3350067138672,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":93,\"corners\":\"[{\\\"id\\\":90,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":177.5,\\\\\\\"13\\\\\\\":471.6700134277344,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":91,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":458.4800109863281,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":0.8660253882408142,\\\"1\\\":0.5,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":-0.5,\\\"5\\\":0.8660253882408142,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":317.989990234375,\\\"13\\\":228.3350067138672,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":94,\"corners\":\"[{\\\"id\\\":91,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":458.4800109863281,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":89,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":-103.4800033569336,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":2.220446049250313e-16,\\\"1\\\":1,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":-1,\\\"5\\\":2.220446049250313e-16,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"}]","corners":"[{\"id\":89,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":-103.4800033569336,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":90,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":471.6700134277344,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":91,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":458.4800109863281,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"}]","matrixWorld":"{\"elements\":{\"0\":0.643746018409729,\"1\":-0.4523605704307556,\"2\":0.617220401763916,\"3\":0,\"4\":-0.26516395807266235,\"5\":-0.8884633183479309,\"6\":-0.37459471821784973,\"7\":0,\"8\":0.7178294658660889,\"9\":0.077479287981987,\"10\":-0.6918944716453552,\"11\":0,\"12\":90.48294830322266,\"13\":1477.7728271484375,\"14\":-112.1520767211914,\"15\":1}}"},{"type":"Equilat","edges":"[{\"id\":103,\"corners\":\"[{\\\"id\\\":100,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":-103.4800033569336,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":101,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":177.5,\\\\\\\"13\\\\\\\":471.6700134277344,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":0.8660253882408142,\\\"1\\\":-0.5,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0.5,\\\"5\\\":0.8660253882408142,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":37.0099983215332,\\\"13\\\":228.3350067138672,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":104,\"corners\":\"[{\\\"id\\\":101,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":177.5,\\\\\\\"13\\\\\\\":471.6700134277344,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":102,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":458.4800109863281,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":0.8660253882408142,\\\"1\\\":0.5,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":-0.5,\\\"5\\\":0.8660253882408142,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":317.989990234375,\\\"13\\\":228.3350067138672,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":105,\"corners\":\"[{\\\"id\\\":102,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":458.4800109863281,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":100,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":-103.4800033569336,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":2.220446049250313e-16,\\\"1\\\":1,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":-1,\\\"5\\\":2.220446049250313e-16,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"}]","corners":"[{\"id\":100,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":-103.4800033569336,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":101,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":471.6700134277344,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":102,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":458.4800109863281,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"}]","matrixWorld":"{\"elements\":{\"0\":-0.33202144503593445,\"1\":-0.5578154921531677,\"2\":0.7606598734855652,\"3\":0,\"4\":0.3085475265979767,\"5\":-0.8262693285942078,\"6\":-0.47125065326690674,\"7\":0,\"8\":0.8913809657096863,\"9\":0.07823435217142105,\"10\":0.44645190238952637,\"11\":0,\"12\":-3.3673808574676514,\"13\":1467.286865234375,\"14\":-97.03533935546875,\"15\":1}}"},{"type":"CornerConnector","corners":"[{\"id\":101,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":471.6700134277344,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":83,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":471.6700134277344,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":90,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":471.6700134277344,\\\"14\\\":0,\\\"15\\\":1}}\"}]","position":"{\"x\":80.17609405517578,\"y\":978.26611328125,\"z\":-179.82330322265625}"},{"type":"Equilat","edges":"[{\"id\":115,\"corners\":\"[{\\\"id\\\":112,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":-103.4800033569336,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":113,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":177.5,\\\\\\\"13\\\\\\\":471.6700134277344,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":0.8660253882408142,\\\"1\\\":-0.5,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0.5,\\\"5\\\":0.8660253882408142,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":37.0099983215332,\\\"13\\\":228.3350067138672,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":116,\"corners\":\"[{\\\"id\\\":113,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":177.5,\\\\\\\"13\\\\\\\":471.6700134277344,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":114,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":458.4800109863281,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":0.8660253882408142,\\\"1\\\":0.5,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":-0.5,\\\"5\\\":0.8660253882408142,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":317.989990234375,\\\"13\\\":228.3350067138672,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":117,\"corners\":\"[{\\\"id\\\":114,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":458.4800109863281,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":112,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":-103.4800033569336,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":2.220446049250313e-16,\\\"1\\\":1,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":-1,\\\"5\\\":2.220446049250313e-16,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"}]","corners":"[{\"id\":112,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":-103.4800033569336,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":113,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":471.6700134277344,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":114,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":458.4800109863281,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"}]","matrixWorld":"{\"elements\":{\"0\":0.4373658001422882,\"1\":0.8823675513267517,\"2\":0.1736050695180893,\"3\":0,\"4\":0.881521463394165,\"5\":-0.38248345255851746,\"6\":-0.276814728975296,\"7\":0,\"8\":-0.17785127460956573,\"9\":0.27410590648651123,\"10\":-0.9451111555099487,\"11\":0,\"12\":-104.17378997802734,\"13\":1309.4049072265625,\"14\":273.5260009765625,\"15\":1}}"},{"type":"Equilat","edges":"[{\"id\":124,\"corners\":\"[{\\\"id\\\":121,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":-103.4800033569336,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":122,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":177.5,\\\\\\\"13\\\\\\\":471.6700134277344,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":0.8660253882408142,\\\"1\\\":-0.5,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0.5,\\\"5\\\":0.8660253882408142,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":37.0099983215332,\\\"13\\\":228.3350067138672,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":125,\"corners\":\"[{\\\"id\\\":122,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":177.5,\\\\\\\"13\\\\\\\":471.6700134277344,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":123,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":458.4800109863281,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":0.8660253882408142,\\\"1\\\":0.5,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":-0.5,\\\"5\\\":0.8660253882408142,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":317.989990234375,\\\"13\\\":228.3350067138672,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":126,\"corners\":\"[{\\\"id\\\":123,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":458.4800109863281,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":121,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":-103.4800033569336,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":2.220446049250313e-16,\\\"1\\\":1,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":-1,\\\"5\\\":2.220446049250313e-16,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"}]","corners":"[{\"id\":121,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":-103.4800033569336,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":122,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":471.6700134277344,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":123,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":458.4800109863281,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"}]","matrixWorld":"{\"elements\":{\"0\":0.09641734510660172,\"1\":0.3150720000267029,\"2\":0.9441575407981873,\"3\":0,\"4\":0.6882163286209106,\"5\":-0.7063893675804138,\"6\":0.1654464155435562,\"7\":0,\"8\":0.7190702557563782,\"9\":0.6338326930999756,\"10\":-0.28494593501091003,\"11\":0,\"12\":47.68820571899414,\"13\":1560.53125,\"14\":-70.32535552978516,\"15\":1}}"},{"type":"CornerConnector","corners":"[{\"id\":122,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":471.6700134277344,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":91,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":458.4800109863281,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":84,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":458.4800109863281,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":113,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":471.6700134277344,\\\"14\\\":0,\\\"15\\\":1}}\"}]","position":"{\"x\":388.4726257324219,\"y\":1282.69677734375,\"z\":175.41409301757812}"},{"type":"Equilat","edges":"[{\"id\":133,\"corners\":\"[{\\\"id\\\":130,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":-103.4800033569336,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":131,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":177.5,\\\\\\\"13\\\\\\\":471.6700134277344,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":0.8660253882408142,\\\"1\\\":-0.5,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0.5,\\\"5\\\":0.8660253882408142,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":37.0099983215332,\\\"13\\\":228.3350067138672,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":134,\"corners\":\"[{\\\"id\\\":131,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":177.5,\\\\\\\"13\\\\\\\":471.6700134277344,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":132,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":458.4800109863281,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":0.8660253882408142,\\\"1\\\":0.5,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":-0.5,\\\"5\\\":0.8660253882408142,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":317.989990234375,\\\"13\\\":228.3350067138672,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":135,\"corners\":\"[{\\\"id\\\":132,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":458.4800109863281,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"},{\\\"id\\\":130,\\\"matrix\\\":\\\"{\\\\\\\"elements\\\\\\\":{\\\\\\\"0\\\\\\\":1,\\\\\\\"1\\\\\\\":0,\\\\\\\"2\\\\\\\":0,\\\\\\\"3\\\\\\\":0,\\\\\\\"4\\\\\\\":0,\\\\\\\"5\\\\\\\":1,\\\\\\\"6\\\\\\\":0,\\\\\\\"7\\\\\\\":0,\\\\\\\"8\\\\\\\":0,\\\\\\\"9\\\\\\\":0,\\\\\\\"10\\\\\\\":1,\\\\\\\"11\\\\\\\":0,\\\\\\\"12\\\\\\\":-103.4800033569336,\\\\\\\"13\\\\\\\":-15,\\\\\\\"14\\\\\\\":0,\\\\\\\"15\\\\\\\":1}}\\\"}]\",\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":2.220446049250313e-16,\\\"1\\\":1,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":-1,\\\"5\\\":2.220446049250313e-16,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"}]","corners":"[{\"id\":130,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":-103.4800033569336,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":131,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":471.6700134277344,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":132,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":458.4800109863281,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"}]","matrixWorld":"{\"elements\":{\"0\":0.10051877051591873,\"1\":0.32347941398620605,\"2\":0.9408809542655945,\"3\":0,\"4\":-0.4398480951786041,\"5\":-0.8337922096252441,\"6\":0.3336528241634369,\"7\":0,\"8\":0.8924290537834167,\"9\":-0.4473830759525299,\"10\":0.05847006291151047,\"11\":0,\"12\":30.79696273803711,\"13\":1557.9296875,\"14\":-68.65895080566406,\"15\":1}}"},{"type":"CornerConnector","corners":"[{\"id\":130,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":-103.4800033569336,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":100,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":-103.4800033569336,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":89,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":-103.4800033569336,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":121,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":-103.4800033569336,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"}]","position":"{\"x\":27.789947509765625,\"y\":1537.9658203125,\"z\":-170.45152282714844}"},{"type":"CornerConnector","corners":"[{\"id\":131,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":177.5,\\\"13\\\":471.6700134277344,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":82,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":-103.4800033569336,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":102,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":458.4800109863281,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":112,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":-103.4800033569336,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"}]","position":"{\"x\":-160.79217529296875,\"y\":1223.989501953125,\"z\":258.9570617675781}"},{"type":"CornerConnector","corners":"[{\"id\":114,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":458.4800109863281,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":123,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":458.4800109863281,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"},{\"id\":132,\"matrix\":\"{\\\"elements\\\":{\\\"0\\\":1,\\\"1\\\":0,\\\"2\\\":0,\\\"3\\\":0,\\\"4\\\":0,\\\"5\\\":1,\\\"6\\\":0,\\\"7\\\":0,\\\"8\\\":0,\\\"9\\\":0,\\\"10\\\":1,\\\"11\\\":0,\\\"12\\\":458.4800109863281,\\\"13\\\":-15,\\\"14\\\":0,\\\"15\\\":1}}\"}]","position":"{\"x\":81.64370727539062,\"y\":1715.8056640625,\"z\":360.13531494140625}"}];
    loadlog(p);
}