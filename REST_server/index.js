/*** Requirements ****/
var http = require('http');
var express = require('express');
var app = express();
var fs = require("fs");
var async = require("async");
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile');

/****Final Variables & Templates****/
var enjalbert_tests_path = __dirname + '/data/enjalbert_tests.json';
var local_variables_path = __dirname + '/data/local_variables.json';

var max_vertical_distance = 10;
var min_vertical_distance = 0.1;
var max_hold_time = 10;
var min_hold_time = 1;
var max_tunnel_space = 20;
var min_tunnel_space = 1;
var max_horizontal_distance = 10;
var min_horizontal_distance = 0.1;
var max_margin = 0.1;
var min_margin = 0;
var max_hold_time_lvl3 = 10;
var min_hold_time_lvl3 = 1;
var max_iterations = 5;
var min_iterations = 1;
var max_total_finger_counts = 5;
var min_total_finger_counts = 1;
var max_time_per_test = 60;
var min_time_per_test = 10;

//var enjalbert_test_template = JSON.parse('{"id": 0,"time_per_test":30,"hand": "left","lvl1":{"vertical_distance":1,"hold_time":4,"tunnel_space":1},"lvl2":{"vertical_distance":1,"horizontal_distance":1,"hold_time":4,"tunnel_space":1},"lvl3":{"margin":0.1,"hold_time":4,"iterations":2},"lvl4":{"total_index_counts":2,"total_middle_counts":2},"lvl5":{"total_ring_counts":2,"total_pinky_counts":2}}');

/**** Initial Things *****/

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({

    extended: true
}));


/**** Private functions ****/

function getTestById(tests, id) {

    var result;

    //check if id corresponds to position in array
    if (tests[id].id == id) {
        result = tests[id];
    }
    //if not
    else {
        for (var i = 0; i < tests.length; i++) {
            if (tests[i].id == id) {
                result = tests[i];
                break;
            }
        }

        result = null;
    }

    return result;
}

function getTestPosById(tests, id) {

    var result;

    //check if id corresponds to position in array
    if (tests[id] != null && tests[id].id == id) {
        result = id;
    }
    //if not
    else {
        for (var i = 0; i < tests.length; i++) {
            if (tests[i].id == id) {
                result = i;
                break;
            }
        }

        result = null;
    }

    return result;
}

function testIsRight(test, editing) {

    var result = true;

    console.log("testIsRight: entered.")

    //global
    var len = Object.keys(test).length;
    if(editing == false && len != 8)
    {
        console.log("fail on 0");
        result = false;
    }
    else if(editing == true && len !=9)
    {
        console.log("fail on 0");
        result = false;
    }
    else if(test.custom_name == null)
    {
        console.log("fail on 0.5");
        result = false;
    }
    else if (test.time_per_test == null || test.time_per_test < min_time_per_test || test.time_per_test > max_time_per_test) {
        console.log("fail on 1");
        result = false;
    }
    else if (test.hand == null || (test.hand != 'left' && test.hand != 'right')) {
        console.log("fail on 2");
        result = false;
    }

    //lvl1
    else if (test.lvl1.vertical_distance == null || (test.lvl1.vertical_distance < min_vertical_distance || test.lvl1.vertical_distance > max_vertical_distance)) {
        console.log("fail on 3");
        result = false;
    }
    else if (test.lvl1.hold_time == null || (test.lvl1.hold_time < min_hold_time || test.lvl1.hold_time > max_hold_time)) {
        console.log("fail on 4");
        result = false;
    }
    else if (test.lvl1.tunnel_space == null || (test.lvl1.tunnel_space < min_tunnel_space || test.lvl1.tunnel_space > max_tunnel_space)) {
        console.log("fail on 5");
        result = false;
    }

    //lvl2
    else if (test.lvl2.vertical_distance == null || (test.lvl2.vertical_distance < min_vertical_distance || test.lvl2.vertical_distance > max_vertical_distance)) {
        console.log("fail on 6");
        result = false;
    }
    else if (test.lvl2.horizontal_distance == null || (test.lvl2.horizontal_distance < min_horizontal_distance || test.lvl2.horizontal_distance > max_horizontal_distance)) {
        console.log("fail on 7");
        result = false;
    }
    else if (test.lvl2.hold_time == null || (test.lvl2.hold_time < min_hold_time || test.lvl2.hold_time > max_hold_time)) {
        console.log("fail on 8");
        result = false;
    }
    else if (test.lvl2.tunnel_space == null || (test.lvl2.tunnel_space < min_tunnel_space || test.lvl2.tunnel_space > max_tunnel_space)) {
        console.log("fail on 9");
        result = false;
    }

    //lvl3
    else if (test.lvl3.margin == null || (test.lvl3.margin < min_margin || test.lvl3.margin > max_margin)) {
        console.log("fail on 10");
        result = false;
    }
    else if (test.lvl3.hold_time == null || (test.lvl3.hold_time < min_hold_time_lvl3 || test.lvl3.hold_time > max_hold_time_lvl3)) {
        console.log("fail on 11");
        result = false;
    }
    else if (test.lvl3.iterations == null || (test.lvl3.iterations < min_iterations || test.lvl3.iterations > max_iterations)) {
        console.log("fail on 12");
        result = false;
    }

    //lvl4
    else if (test.lvl4.total_index_counts == null || (test.lvl4.total_index_counts < min_total_finger_counts || test.lvl4.total_index_counts > max_total_finger_counts)) {
        console.log("fail on 13");
        result = false;
    }
    else if (test.lvl4.total_middle_counts == null || (test.lvl4.total_middle_counts < min_total_finger_counts || test.lvl4.total_middle_counts > max_total_finger_counts)) {
        console.log("fail on 14");
        result = false;
    }

    //lvl5
    else if (test.lvl5.total_ring_counts == null || (test.lvl5.total_ring_counts < min_total_finger_counts || test.lvl5.total_ring_counts > max_total_finger_counts)) {
        console.log("fail on 15");
        result = false;
    }
    else if (test.lvl5.total_pinky_counts == null || (test.lvl5.total_pinky_counts < min_total_finger_counts || test.lvl5.total_pinky_counts > max_total_finger_counts)) {
        console.log("fail on 16");
        result = false;
    }

    return result;

}


/**** GET METHODS ****/

app.get('/getLastTest', function (req, res) {

    console.log('getLastTest: entered');
    var filesPath = [local_variables_path, enjalbert_tests_path];

    async.map(filesPath, function (filePath, cb) { //reading files or dir
        fs.readFile(filePath, 'utf8', cb);
    }, function (err, results) {
        var local_variables = JSON.parse(results[0]);
        var enjalbert_tests = JSON.parse(results[1]);

        console.log("local variables: " + local_variables);
        var lastTestId = local_variables['last_test_id'];
        console.log("getLastTest: last test id = " + lastTestId);
        var lastTest = getTestById(enjalbert_tests, lastTestId);
        //console.log(token)

        if (lastTest != null) {
            res.status(200).json(lastTest);
        }
        else {
            res.status(200).json({
                result: 'fail'
            });
        }
    });
});

app.get('/getTestToDo', function (req, res) {

    console.log('getTestToDo: entered');
    var filesPath = [local_variables_path, enjalbert_tests_path];

    async.map(filesPath, function (filePath, cb) { //reading files or dir
        fs.readFile(filePath, 'utf8', cb);
    }, function (err, results) {
        var local_variables = JSON.parse(results[0]);
        var enjalbert_tests = JSON.parse(results[1]);

        console.log("local variables: " + local_variables);
        var testToDo = local_variables['test_to_do'];
        console.log("getTestToDo: test to do id = " + testToDo);
        var lastTest = getTestById(enjalbert_tests, testToDo);
        //console.log(token)

        if (lastTest != null) {
            res.status(200).json(lastTest);
        }
        else {
            res.status(200).json({
                result: 'fail'
            });
        }
    });
});

app.get('/getTestById', function (req, res) {

    console.log('getTestById: entered');
    var testId = req.query.testId;
    var filesPath = [enjalbert_tests_path];

    if (testId != null) {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var enjalbert_tests = JSON.parse(results[0]);

            var test = getTestById(enjalbert_tests, testId);

            if (test != null) {
                res.status(200).json(test);
            }
            else {
                res.status(200).json({
                    result: 'fail',
                    message: 'test not found'
                });
            }
        });
    }
    else {
        res.status(400).json({
            result: 'fail',
            message: 'testId parameter missing.'
        });
    }

});

/**** POST methods ****/

app.post('/addTest', function (req, res) {

    console.log('addTest: entered function');
    var newTest = req.body;
    var filesPath = [local_variables_path, enjalbert_tests_path];

    if(testIsRight(newTest, false))
    {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var local_variables = JSON.parse(results[0]);
            var enjalbert_tests = JSON.parse(results[1]);

            console.log('addTest: input test passed.')
            var newTestId = local_variables['last_test_id']+1;
            local_variables['last_test_id'] = newTestId;
            newTest['id'] = newTestId;

            //write the test
            enjalbert_tests[enjalbert_tests.length] = newTest;

            //console.log(JSON.stringify(enjalbert_tests));

            fs.writeFile(enjalbert_tests_path, JSON.stringify(enjalbert_tests), function (err) {
                console.error(err)
            });

            fs.writeFile(local_variables_path, JSON.stringify(local_variables), function (err) {
                console.error(err)
            });

            res.status(200).json({
                result: 'success'
            });

        });
    }
    else
    {
        res.status(400).json({
            result: 'fail',
            message: 'test parameters don\'t fit.'
        });
    }

});

app.post('/editTest', function (req, res) {

    console.log('editTest: entered function');
    var newTest = req.body;
    var filesPath = [local_variables_path, enjalbert_tests_path];

    console.log(JSON.stringify(req.body));

    if(testIsRight(newTest, true))
    {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var local_variables = JSON.parse(results[0]);
            var enjalbert_tests = JSON.parse(results[1]);

            var testPos = getTestPosById(enjalbert_tests, newTest['id']);
            if(testPos != null)
            {
                console.log('editTest: input test passed.')

                //write the test
                enjalbert_tests[testPos] = newTest;

                //console.log(JSON.stringify(enjalbert_tests));

                fs.writeFile(enjalbert_tests_path, JSON.stringify(enjalbert_tests), function (err) {
                    console.error(err)
                });

                res.status(200).json({
                    result: 'success'
                });
            }
            else
            {
                res.status(400).json({
                    result: 'fail',
                    message: 'test id doesn\'t exist.'
                });
            }


        });
    }
    else
    {
        res.status(400).json({
            result: 'fail',
            message: 'test parameters don\'t fit.'
        });
    }

});

app.post('/setTestToDo', function (req, res) {

    console.log('setTestToDo: entered function');
    var testId = req.query.testId;
    var filesPath = [local_variables_path, enjalbert_tests_path];

    if (testId != null) {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var local_variables = JSON.parse(results[0]);
            var enjalbert_tests = JSON.parse(results[1]);

            var testPos = getTestPosById(enjalbert_tests, testId);
            if(testPos != null)
            {
                console.log('setTestToDo: input testId passed.')

                //write the change
                local_variables['test_to_do'] = testId;

                //console.log(JSON.stringify(enjalbert_tests));

                fs.writeFile(local_variables_path, JSON.stringify(local_variables), function (err) {
                    console.error(err)
                });

                res.status(200).json({
                    result: 'success'
                });
            }
            else
            {
                res.status(400).json({
                    result: 'fail',
                    message: 'test id doesn\'t exist.'
                });
            }


        });
    }
    else {
        res.status(400).json({
            result: 'fail',
            message: 'testId parameter missing.'
        });
    }

});


/**** Put server running ****/

var server = app.listen(8080, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("REST app listening at http://%s:%s", host, port);

});






/********************* Break! beyond this point only web page stuff! ***********************/


var wepPage_express = require("express");
var wepPage_app2 = wepPage_express();
var wepPage_router = wepPage_express.Router();
var wepPage_path = __dirname + '/html/';
wepPage_app2.use(wepPage_express.static(__dirname + '/html/'));

wepPage_router.use(function (req, res, next) {
    console.log("/" + req.method);
    next();
});

wepPage_router.get("/", function (req, res) {
    res.sendFile(wepPage_path + "index.html");
});


wepPage_app2.use("/", wepPage_router);

wepPage_app2.use(wepPage_express.static(__dirname));

wepPage_app2.use("*", function (req, res) {
    res.sendFile(wepPage_path + "404.html");
});


var webPage_server2 = wepPage_app2.listen(process.env.PORT || 5000, function () {

    var host = webPage_server2.address().address;
    var port = webPage_server2.address().port;

    console.log("Web page Live at http://%s:%s", host, port);
});