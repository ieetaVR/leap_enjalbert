/*** Requirements ****/
var http = require('http');
var express = require('express');
var app = express();
var fs = require("fs");
var async = require("async");
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile');

/****Final Variables & Templates****/
var patients_path = __dirname + '/data/patients.json';
var enjalbert_tests_path = __dirname + '/data/enjalbert_tests.json';
var games_path = __dirname + '/data/5_games.json';
var game_results_path = __dirname + '/data/game_results.json';
var local_variables_path = __dirname + '/data/local_variables.json';
var test_results_path = __dirname + "/data/test_results.json";

var max_vertical_distance = 5;
var min_vertical_distance = -5;
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

function getTestResultsById(tests, id) {

    var result = [];

    //if not
    for (var i = 0; i < tests.length; i++) {
        if (tests[i].test_id == id) {
            result[result.length] = tests[i];
        }
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

function testIsRight_enjalbert(test, editing) {

    var result = true;

    console.log("testIsRight_enjalbert: entered.")

    //global
    var len = Object.keys(test).length;
    if (editing == false && len != 8) {
        console.log("fail on 0");
        result = false;
    }
    else if (editing == true && len != 9) {
        console.log("fail on 0");
        result = false;
    }
    else if (test.custom_name == null) {
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


function getGameById(games, id, type) {

    var result = null;

    //if not
    for (var i = 0; i < games.length; i++) {
        if (games[i].type == type) {
            console.log("private getGameById: type found");
            for (var j = 0; j < games[i].instances.length; j++) {
                console.log("private getGameById: comparing " + games[i].instances[j].id + " and " + id);
                if (games[i].instances[j].id == id) {
                    console.log("private getGameById: game found");
                    result = games[i].instances[j];
                    result['name'] = games[i]['name'];
                    break;
                }
            }
            break;
        }
    }

    return result;
}

function removeGameById(games, id, type) {

    //if not
    for (var i = 0; i < games.length; i++) {
        if (games[i].type == type) {
            console.log("private removeGameById: type found");
            for (var j = 0; j < games[i].instances.length; j++) {
                console.log("private removeGameById: comparing " + games[i].instances[j].id + " and " + id);
                if (games[i].instances[j].id == id) {
                    console.log("private removeGameById: game found");
                    games[i].instances.splice(j, 1);
                    break;
                }
            }
            break;
        }
    }

    return games;
}

function getTypeQueue(games, type) {

    var result = null;

    //if not
    for (var i = 0; i < games.length; i++) {
        if (games[i].type == type) {
            console.log("private getTypeQueue: type found");
            result = games[i].instances;
            break;
        }
    }

    return result;
}

function gameIsOK(gameType, game) {

    var result = true;

    console.log("private function gameIsOK: entered.");

    //global
    var len = Object.keys(game).length;

    game.left_hand = game.left_hand == "true";

    if ((game.left_hand == null || (game.left_hand != false && game.left_hand != true)) ||
        (game.total_time == null || game.total_time < 0 || game.total_time > 60) ||
        (game.language == null || game.language < 0 || game.language > 1)
    ) {
        result = false;
    }

    gameType = parseInt(gameType);

    if (result != false) {
        switch (gameType) {
            case 0:
                console.log("private function gameIsOK: game type 0.");
                if (len == 6) {
                    if (
                        (game.distance == null || game.distance < 0.1 || game.distance > 1.5) ||
                        (game.time_to_hold == null || game.time_to_hold < 0 || game.time_to_hold > 10) ||
                        (game.total_interactions == null || game.total_interactions < 1 || game.total_interactions > 10) ||
                        (game.time_between_interactions == null || game.time_between_interactions < 0 || game.time_between_interactions > 10)
                    ) {
                        console.log("private function gameIsOK: bad parameters.");
                        result = false;
                    }
                }
                else {
                    console.log("private function gameIsOK: wrong len.");
                }
                break;
            case 1:
                if (len == 6) {
                    if (
                        (game.green_apple_quantity == null || game.green_apple_quantity < 1 || game.green_apple_quantity > 10) ||
                        (game.red_apple_quantity == null || game.red_apple_quantity < 1 || game.red_apple_quantity > 10) ||
                        (game.apple_margin == null || game.apple_margin < 0 || game.apple_margin > 1) ||
                        (game.time_between_interactions == null || game.time_between_interactions < 0 || game.time_between_interactions > 10)
                    ) {
                        result = false;
                    }
                }
                break;
            case 2:
                if (len == 6) {
                    if (
                        (game.grab_margin == null || game.grab_margin < 0 || game.grab_margin > 1.5) ||
                        (game.time_to_hold == null || game.time_to_hold < 0 || game.time_to_hold > 10) ||
                        (game.total_interactions == null || game.total_interactions < 1 || game.total_interactions > 10) ||
                        (game.time_between_interactions == null || game.time_between_interactions < 0 || game.time_between_interactions > 10)
                    ) {
                        result = false;
                    }
                }
                break;
            case 3:
                if (len == 5) {
                    if (
                        (game.item_margin == null || game.item_margin < 0.1 || game.item_margin > 1.5) ||
                        (game.pinch_margin == null || game.pinch_margin < 0 || game.pinch_margin > 50) ||
                        (game.iterations_per_finger == null || game.iterations_per_finger < 1 || game.iterations_per_finger > 10)
                    ) {
                        result = false;
                    }
                }
                break;
            case 4:
                if (len == 4) {
                    if (
                        (game.pinch_margin == null || game.pinch_margin < 0 || game.pinch_margin > 50) ||
                        (game.total_interactions == null || game.total_interactions < 1 || game.total_interactions > 10)
                    ) {
                        result = false;
                    }
                }
                break;
        }
    }


    if (result == true) {
        console.log("private function gameIsOK: game passed!");
    }

    return result;

}

function setGameUp(game, gameType) {

    console.log("private function setGameUp: entered." + game.left_hand);

    //game.left_hand = game.left_hand == "true";
    game.total_time = parseInt(game.total_time);
    game.language = parseInt(game.language);

    gameType = parseInt(gameType);

    switch (gameType) {
        case 0:
            game.distance = parseFloat(game.distance);
            game.time_to_hold = parseInt(game.time_to_hold);
            game.total_interactions = parseInt(game.total_interactions);
            game.time_between_interactions = parseInt(game.time_between_interactions);
            break;
        case 1:
            game.green_apple_quantity = parseInt(game.green_apple_quantity);
            game.red_apple_quantity = parseInt(game.red_apple_quantity);
            game.apple_margin = parseFloat(game.apple_margin);
            game.time_between_interactions = parseInt(game.time_between_interactions);
            break;
        case 2:
            game.grab_margin = parseFloat(game.grab_margin);
            game.time_to_hold = parseInt(game.time_to_hold);
            game.total_interactions = parseInt(game.total_interactions);
            game.time_between_interactions = parseInt(game.time_between_interactions);
            break;
        case 3:
            game.item_margin = parseFloat(game.item_margin);
            game.pinch_margin = parseFloat(game.pinch_margin);
            game.iterations_per_finger = parseInt(game.iterations_per_finger);
            break;
        case 4:
            game.pinch_margin = parseFloat(game.pinch_margin);
            game.total_interactions = parseInt(game.total_interactions);
            break;
    }

    return game;
}

function editGame(games, game, id, type) {

    var newGames = null;

    //if not
    for (var i = 0; i < games.length; i++) {
        if (games[i].type == type) {
            console.log("private editGame: type found");
            for (var j = 0; j < games[i].instances.length; j++) {
                console.log("private editGame: comparing " + games[i].instances[j].id + " and " + id);
                if (games[i].instances[j].id == id) {
                    console.log("private editGame: game found");
                    game.id = games[i].instances[j].id;
                    game.custom_name = games[i].instances[j].custom_name;
                    games[i].instances[j] = game;
                    newGames = games;
                    break;
                }
            }
            break;
        }
    }

    return newGames;

}

function addGame(games, game, id, type, custom_name) {

    var newGames = null;

    //if not
    for (var i = 0; i < games.length; i++) {
        if (games[i].type == type) {
            console.log("private addGame: type found");

            game.id = id;
            game.custom_name = custom_name;
            games[i].instances[games[i].instances.length] = game;
            newGames = games;

            break;
        }
    }

    return newGames;

}

function addDefaultGame(games, game, id, type, custom_name) {

    var newGames = null;

    //if not
    for (var i = 0; i < games.length; i++) {
        if (games[i].type == type) {
            console.log("private addDefaultGame: type found");

            game.id = id;
            game.custom_name = custom_name;
            games[i].instances[games[i].instances.length] = game;
            newGames = games;

            break;
        }
    }

    return newGames;

}

function patientIsInList(patientList, patient_name) {

    var result = -1;

    //if not
    for (var i = 0; i < patientList.length; i++) {
        if (patientList[i].name == patient_name) {
            console.log("private patientIsInList: name found");
            result = i;
            break;
        }
    }

    return result;

}

function addPatientToList(patientList, game, gameType, gameName) {

    var patientPos = patientIsInList(patientList, game.custom_name);

    if (patientPos != -1) {
        console.log("private addPatientToList: patient " + game.custom_name + " already in list");
        patientList[patientPos].games[patientList[patientPos].games.length] = {
            type: gameType,
            id: game.id,
            name: gameName
        };
    }
    else {
        console.log("private addPatientToList: patient " + game.custom_name + " not in list");
        patientList[patientList.length] = {
            name: game.custom_name,
            games: [{type: gameType, id: game.id, name: gameName}]
        };
    }

    return patientList;

}

function patientIsInDb(patients, bi_num) {

    var result = false;

    for (var i = 0; i < patients.length; i++) {
        if (patients[i].bi_num == bi_num) {
            result = true;
            break;
        }
    }

    return result;

}

function patientById(patients, id) {

    var result = null;

    for (var i = 0; i < patients.length; i++) {
        if (patients[i].id == id) {
            result = i;
            break;
        }
    }

    return result;

}

function fitGameToPatient(game, gameType, patient) {

    var newGame = game;


    console.log("private function fitGameToPatient: entered");

    newGame.left_hand = patient.left_hand;
    newGame.language = patient.language;

    gameType = parseInt(gameType);

    switch (gameType) {
        case 0:
            console.log("private function fitGameToPatient: gameType 0");
            newGame.distance = patient.lift_max_height;
            break;
        case 1:

            break;
        case 2:
            newGame.grab_margin = patient.grab_open_margin;
            break;
        case 3:
            newGame.pinch_margin = patient.middle_pinch_margin;
            break;
        case 4:
            newGame.pinch_margin = patient.pinky_pinch_margin;
            break;
    }

    return newGame;
}

function patientIdByGameId(patients, gameID) {

    var result = null;
    var found = false;

    for (var i = 0; i < patients.length && found == false; i++) {
        for (var j = 0; j < patients[i].games.length; j++) {
            if (gameID == patients[i].games[j].id) {
                result = patients[i].id;
                found = true;
                break;
            }
        }
    }

    return result;

}

function patientByGameId(patients, gameID) {

    var result = null;
    var found = false;

    for (var i = 0; i < patients.length && found == false; i++) {
        for (var j = 0; j < patients[i].games.length; j++) {
            if (gameID == patients[i].games[j].id) {
                result = patients[i];
                found = true;
                break;
            }
        }
    }

    return result;

}

function patientHasGame(patients, patientId, gameType) {
    var result = false;

    for (var i = 0; i < patients.length; i++) {
        if (patients[i].id == patientId) {
            for (var j = 0; j < patients[i].games.length; j++) {
                if (patients[i].games[j].type == gameType) {
                    result = true;
                    break;
                }
            }
            break;
        }
    }

    return result;

}

function updatePatient(oldPatient, newData) {

    oldPatient.lift_max_height = parseFloat(newData.lift_max_height);
    oldPatient.grab_open_margin = parseFloat(newData.grab_open_margin);
    oldPatient.grab_close_margin = parseFloat(newData.grab_close_margin);
    oldPatient.index_pinch_margin = parseFloat(newData.index_pinch_margin);
    oldPatient.middle_pinch_margin = parseFloat(newData.middle_pinch_margin);
    oldPatient.ring_pinch_margin = parseFloat(newData.ring_pinch_margin);
    oldPatient.pinky_pinch_margin = parseFloat(newData.pinky_pinch_margin);

    return oldPatient;

}

function removeGamesFromPatient(patient, games) {

    for (var i = 0; i < patient.games.length; i++) {
        games = removeGameById(games, patient.games[i].id, patient.games[i].type);
    }

    return games;

}

function findSomethingBySomething(list, something, toFind) {

    var result = -1;

    for (var i = 0; i < list.length; i++) {

        //console.log('private getUserPosByToken: checking user ' + users[i].username);
        //console.log('private getUserPosByToken: user ' + users[i].username + ' token ' + users[i].current_token);

        if ((typeof toFind) == "string") {
            //console.log('private findSomethingBySomething: it\'s a string.');
            toFind = toFind.toLowerCase();
            list[i][something] = list[i][something].toLowerCase();
            //console.log('private findSomethingBySomething: comparing ' + toFind + ' ' + list[i][something] +'.')
        }

        if (list[i][something] == toFind) {
            console.log('private findSomethingBySomething: found.');
            result = i;
            break;
        }
    }
    return result;

}

function getGameResults(game_results, gameType, gameId) {

    var typePos = findSomethingBySomething(game_results, "type", gameType);
    var gamePos = findSomethingBySomething(game_results[typePos].instances, "id", gameId);

    return game_results[typePos].instances[gamePos];

}

/************************** PATIENTS **************************/

/**** GET METHODS ****/

app.get('/getPatientsBrief', function (req, res) {

    console.log('getPatientsBrief: entered');
    var filesPath = [patients_path];

    async.map(filesPath, function (filePath, cb) { //reading files or dir
        fs.readFile(filePath, 'utf8', cb);
    }, function (err, results) {
        var patients = JSON.parse(results[0]);

        var patientsBrief = [];
        var thisPatient;

        for (var i = 0; i < patients.length; i++) {
            thisPatient = {};
            thisPatient.id = patients[i].id;
            thisPatient.name = patients[i].name;

            patientsBrief.push(thisPatient);
        }

        //console.log(token)

        if (patientsBrief != null) {
            res.status(200).json(patientsBrief);
        }
        else {
            res.status(200).json({
                result: 'fail'
            });
        }
    });
});

app.get('/getPatientById', function (req, res) {

    console.log('getPatientById: entered');
    var patientId = req.query.id;
    var filesPath = [patients_path];

    if (patientId != undefined && patientId != "") {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var patients = JSON.parse(results[0]);

            var thisPatient = null;

            for (var i = 0; i < patients.length; i++) {

                if (patients[i].id == patientId) {
                    thisPatient = patients[i];
                    break;
                }
            }

            //console.log(token)

            if (thisPatient != null) {
                res.status(200).json(thisPatient);
            }
            else {
                res.status(200).json({
                    result: 'fail',
                    message: 'patient not found'
                });
            }
        });
    }
    else {
        res.status(400).json({
            result: 'fail',
            message: 'patientId parameter missing.'
        });
    }
});

app.get('/getPatients', function (req, res) {

    console.log('getPatients: entered');

    var patientList = [];
    var filesPath = [patients_path];

    async.map(filesPath, function (filePath, cb) { //reading files or dir
        fs.readFile(filePath, 'utf8', cb);
    }, function (err, results) {
        var patientList = JSON.parse(results[0]);

        /*
         for (var i = 0; i < games.length; i++) {
         for (var j = 0; j < games[i].instances.length; j++) {
         patientList = addPatientToList(patientList, games[i].instances[j], games[i].type, games[i].name);
         }
         }*/

        res.status(200).json(patientList);

    });

});

app.get('/getGameResultsByPatient', function (req, res) {

    console.log('getGameResults: entered');
    var patientId = req.query.id;
    var filesPath = [patients_path, game_results_path];

    if (patientId != undefined && patientId != "") {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var patients = JSON.parse(results[0]);
            var game_results = JSON.parse(results[1]);

            var thisPatient = null;

            for (var i = 0; i < patients.length; i++) {

                if (patients[i].id == patientId) {
                    thisPatient = patients[i];
                    break;
                }
            }

            //console.log(token)

            if (thisPatient != null) {

                var gameResultsToSend = [];

                for (i = 0; i < thisPatient.games.length; i++) {

                    //console.log('getGameResults: searching type ' + thisPatient.games[i].type + ' id ' + thisPatient.games[i].id);
                    gameResultsToSend.push({
                        type: thisPatient.games[i].type,
                        results: getGameResults(game_results, thisPatient.games[i].type, thisPatient.games[i].id)
                    });
                }
                res.status(200).json({
                    result: 'success',
                    results: gameResultsToSend
                });

            }
            else {
                res.status(200).json({
                    result: 'fail',
                    message: 'patient not found'
                });
            }
        });
    }
    else {
        res.status(400).json({
            result: 'fail',
            message: 'patientId parameter missing.'
        });
    }
});

/**** POST methods ****/

app.post('/addPatient', function (req, res) {

    console.log('addPatient: entered');
    req.body.left_hand = req.body.left_hand == "true";
    req.body.bi_num = parseInt(req.body.bi_num);
    req.body.language = parseInt(req.body.language);
    console.log(req.body);
    var newPatient = req.body;

    var patientBirthday = req.body.date_of_birth;
    var filesPath = [patients_path, local_variables_path, games_path, game_results_path];

    if (req.body.language != undefined && req.body.language != null && patientBirthday != undefined && patientBirthday != null && newPatient.name != undefined && newPatient.name != null && newPatient.left_hand != undefined && newPatient.left_hand != null && (newPatient.left_hand == false || newPatient.left_hand == true) && newPatient.bi_num != undefined && newPatient.bi_num != null) {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var patients = JSON.parse(results[0]);
            var local_variables = JSON.parse(results[1]);
            var games = JSON.parse(results[2]);
            var game_results = JSON.parse(results[3]);

            if (patientIsInDb(patients, newPatient.bi_num) == false) {
                var patientToPush = JSON.parse(JSON.stringify(patients[0]));
                local_variables.patients.last_patient_id = local_variables.patients.last_patient_id + 1;
                patientToPush.id = local_variables.patients.last_patient_id;
                patientToPush.name = newPatient.name;
                patientToPush.left_hand = newPatient.left_hand;
                patientToPush.bi_num = newPatient.bi_num;
                patientToPush.date_of_birth = newPatient.date_of_birth;
                patientToPush.email = newPatient.email;
                patientToPush.last_name = newPatient.last_name;
                patientToPush.language = newPatient.language;
                patientToPush.register_date = new Date();
                patientToPush.last_calibration_date = "never";
                patientToPush.lift_max_height = 0.1;
                patientToPush.grab_open_margin = 0.9;

                patientToPush.games = [];


                for (var i = 0; i < games.length; i++) {
                    var gameId = local_variables['5_games'].last_games['type_' + games[i].type] + 1;

                    var editedGame = games[i].instances[0];

                    var gameToAdd = getGameById(games, gameId, games[i].type);

                    if (gameToAdd == null) {
                        var customName = patientToPush.name + ' ' + patientToPush.last_name + ' - ' + games[i].name;
                        games = addGame(JSON.parse(JSON.stringify(games)), editedGame, gameId, games[i].type, customName);

                        local_variables['5_games'].last_games['type_' + games[i].type] = local_variables['5_games'].last_games['type_' + games[i].type] + 1;

                        patientToPush.games.push({
                            type: games[i].type,
                            id: gameId,
                            name: getGameById(games, 0, games[i].type).name
                        });

                        game_results[games[i].type].instances.push({
                            id: gameId,
                            results_desktop: [],
                            results_vr: []
                        });


                    }
                    else {
                        console.log('addPatient: trouble editing game.');
                        res.status(400).json({
                            result: 'fail',
                            message: 'trouble adding default game.'
                        });
                        return;
                    }


                }


                patients.push(patientToPush);

                fs.writeFile(patients_path, JSON.stringify(patients), function (err) {
                    console.error(err)
                });

                fs.writeFile(games_path, JSON.stringify(games), function (err) {
                    console.error(err)
                });

                fs.writeFile(local_variables_path, JSON.stringify(local_variables), function (err) {
                    console.error(err)
                });

                fs.writeFile(game_results_path, JSON.stringify(game_results), function (err) {
                    console.error(err)
                });

                res.status(200).json({
                    result: 'success'
                });
            }
            else {
                res.status(400).json({
                    result: 'fail',
                    message: 'patient with same bi number found.'
                });
            }


        });
    }
    else {
        console.log('addPatient: bad parameters');
        res.status(400).json({
            result: 'fail',
            message: 'parameters wrong or missing.'
        });
    }
});

app.post('/removePatient', function (req, res) {

    console.log('removePatient: entered');
    var patientId = req.body.id;
    console.log(req.body);

    var filesPath = [patients_path, games_path];

    if (patientId != undefined && patientId != null && patientId != 0) {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var patients = JSON.parse(results[0]);
            var games = JSON.parse(results[1]);

            var patientPos = patientById(patients, patientId);

            if (patientPos != null) {
                games = removeGamesFromPatient(patients[patientPos], games);

                patients.splice(patientPos, 1);

                console.log('removePatient: patients\n' + JSON.stringify(patients));

                fs.writeFile(patients_path, JSON.stringify(patients), function (err) {
                    console.error(err)
                });
                fs.writeFile(games_path, JSON.stringify(games), function (err) {
                    console.error(err)
                });


                res.status(200).json(games);

            }
            else {
                console.log('removePatient: patient not found');
                res.status(400).json({
                    result: 'fail',
                    message: 'parameters wrong or missing.'
                });
            }

        });
    }
    else {
        console.log('removePatient: bad parameters');
        res.status(400).json({
            result: 'fail',
            message: 'parameters wrong or missing.'
        });
    }
});

app.post('/updatePatientData', function (req, res) {

    console.log('updatePatientData: entered');
    var patientData = req.body;
    var patientID = req.body.id;
    var filesPath = [patients_path];

    if (patientID != null && patientID != undefined) {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var patients = JSON.parse(results[0]);

            var patientPos = patientById(patients, patientID);

            if (patientPos != null) {
                //console.log(patients[patientPos]);
                patients[patientPos] = updatePatient(patients[patientPos], patientData);
                //console.log(patients[patientPos]);

                fs.writeFile(patients_path, JSON.stringify(patients), function (err) {
                    console.error(err)
                });

                res.status(200).json({
                    result: 'success'
                });
            }
            else {
                res.status(400).json({
                    result: 'fail',
                    message: 'Patient doesn\'t exist.'
                });
            }

        });
    }
    else {
        res.status(400).json({
            result: 'fail',
            message: 'parameters wrong or missing.'
        });
    }
});

//remove patient


/************************** TESTS **************************/

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
        var lastTestId = local_variables.enjalbert_test['last_test_id'];
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

app.get('/getTestsBrief', function (req, res) {

    console.log('getTestsBrief: entered');
    var filesPath = [enjalbert_tests_path];

    async.map(filesPath, function (filePath, cb) { //reading files or dir
        fs.readFile(filePath, 'utf8', cb);
    }, function (err, results) {
        var enjalbert_tests = JSON.parse(results[0]);

        var testsBrief = JSON.parse('[]');

        for (var i = 0; i < enjalbert_tests.length; i++) {
            testsBrief[i] = JSON.parse('{}');
            testsBrief[i].id = enjalbert_tests[i].id;
            testsBrief[i].custom_name = enjalbert_tests[i].custom_name;
        }

        //console.log(token)

        if (testsBrief.length != 0) {
            res.status(200).json(testsBrief);
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
        var testToDo = local_variables.enjalbert_test['test_to_do'];
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

app.get('/getTestResultsById', function (req, res) {

    console.log('getTestResultsById: entered');
    var testId = req.query.testId;
    var filesPath = [test_results_path];

    if (testId != null) {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var test_results = JSON.parse(results[0]);

            var results_to_return = getTestResultsById(test_results, testId);

            if (results_to_return != null) {
                res.status(200).json(results_to_return);
            }
            else {
                res.status(200).json({
                    result: 'fail',
                    message: 'testId not found'
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

app.get('/getAllTestResults', function (req, res) {

    console.log('getAllTestResults: entered function');
    var filesPath = [test_results_path];

    async.map(filesPath, function (filePath, cb) { //reading files or dir
        fs.readFile(filePath, 'utf8', cb);
    }, function (err, results) {
        var testResultsList = JSON.parse(results[0]);

        res.status(200).json(testResultsList);


    });

});

/**** POST methods ****/

app.post('/addTest', function (req, res) {

    console.log('addTest: entered function');
    var newTest = req.body;
    var filesPath = [local_variables_path, enjalbert_tests_path];

    if (testIsRight_enjalbert(newTest, false)) {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var local_variables = JSON.parse(results[0]);
            var enjalbert_tests = JSON.parse(results[1]);

            console.log('addTest: input test passed.')
            var newTestId = local_variables.enjalbert_test['last_test_id'] + 1;
            local_variables.enjalbert_test['last_test_id'] = newTestId;
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
    else {
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

    if (testIsRight_enjalbert(newTest, true)) {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var local_variables = JSON.parse(results[0]);
            var enjalbert_tests = JSON.parse(results[1]);

            var testPos = getTestPosById(enjalbert_tests, newTest['id']);
            if (testPos != null) {
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
            else {
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
            message: 'test parameters don\'t fit.'
        });
    }

});

app.post('/setTestToDo', function (req, res) {

    console.log('setTestToDo: entered function');
    var testId = req.body.testId;
    var filesPath = [local_variables_path, enjalbert_tests_path];

    if (testId != null) {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var local_variables = JSON.parse(results[0]);
            var enjalbert_tests = JSON.parse(results[1]);

            var testPos = getTestPosById(enjalbert_tests, testId);
            if (testPos != null) {
                console.log('setTestToDo: input testId passed.')

                //write the change
                local_variables.enjalbert_test['test_to_do'] = testId;

                //console.log(JSON.stringify(enjalbert_tests));

                fs.writeFile(local_variables_path, JSON.stringify(local_variables), function (err) {
                    console.error(err)
                });

                res.status(200).json({
                    result: 'success'
                });
            }
            else {
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

app.post('/sendTestResults', function (req, res) {

    console.log('sendTestResults: entered function');
    var testResults = req.body;
    var filesPath = [test_results_path];

    if (testResults != null) {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var testResultsList = JSON.parse(results[0]);

            console.error(JSON.stringify(testResults))

            testResults = JSON.parse(JSON.stringify(testResults).replace(/\"/g, '"'));
            console.error(JSON.stringify(testResults))

            testResultsList[testResultsList.length] = testResults;

            //write the change
            fs.writeFile(test_results_path, JSON.stringify(testResultsList), function (err) {
                console.error(err)
            });


            res.status(200).json({
                result: 'success'
            });


        });
    }
    else {
        res.status(400).json({
            result: 'fail',
            message: 'testId parameter missing.'
        });
    }

});


/************************** GAMES **************************/

/**** GET METHODS ****/

app.get('/getLastGame', function (req, res) {

    console.log('getLastGame: entered');

    var gameType = req.query.type;
    var filesPath = [local_variables_path, games_path];

    if (gameType != null && gameType != undefined && gameType != "") {

        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var local_variables = JSON.parse(results[0]);
            var games = JSON.parse(results[1]);

            if (local_variables['5_games']['last_games']['type_' + gameType] != undefined) {
                var lastGameId = local_variables['5_games']['last_games']['type_' + gameType];
                console.log("getLastGame: last game id = " + lastGameId);
                var lastGame = getGameById(games, lastGameId, gameType);
                //console.log(token)

                if (lastGame != null) {
                    res.status(200).json(lastGame);
                }
                else {
                    res.status(200).json({
                        result: 'fail'
                    });
                }
            }
            else {
                console.log("getLastGame: type wrong, searched for: " + 'type' + gameType);
                res.status(200).json({
                    result: 'fail',
                    message: "bad game type"
                });
            }
        });
    }
    else {
        console.log("getLastGame: no type");
        res.status(200).json({
            result: 'fail',
            message: "bad game type"
        });
    }
});

app.get('/getGamesBrief', function (req, res) {

    console.log('getGamesBrief: entered');

    var gameType = req.query.type;
    var filesPath = [games_path];

    if (gameType != null && gameType != undefined && gameType != "") {

        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var games = JSON.parse(results[0]);

            var typeQueue = getTypeQueue(games, gameType);

            if (typeQueue != null) {
                var gamesBrief = JSON.parse('[]');

                for (var i = 0; i < typeQueue.length; i++) {
                    gamesBrief[i] = JSON.parse('{}');
                    gamesBrief[i].id = typeQueue[i].id;
                    gamesBrief[i].custom_name = typeQueue[i].custom_name;
                }

                //console.log(token)

                if (gamesBrief.length != 0) {
                    res.status(200).json(gamesBrief);
                }
                else {
                    res.status(200).json({
                        result: 'fail'
                    });
                }
            }
            else {
                res.status(200).json({
                    result: 'fail'
                });
            }

        });
    }
    else {
        console.log("getGamesBrief: no type");
        res.status(200).json({
            result: 'fail',
            message: "bad game type"
        });
    }
});

app.get('/getGamesBriefByPatient', function (req, res) {

    console.log('getGamesBriefByPatient: entered');
    var patientId = req.query.id;
    var filesPath = [patients_path, games_path];

    if (patientId != undefined && patientId != "") {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var patients = JSON.parse(results[0]);
            var games = JSON.parse(results[1]);

            var thisPatient = null;

            for (var i = 0; i < patients.length; i++) {

                if (patients[i].id == patientId) {
                    thisPatient = patients[i];
                    break;
                }
            }

            //console.log(token)

            if (thisPatient != null) {

                var gamesToSend = [];

                for (i = 0; i < thisPatient.games.length; i++) {

                    //console.log('getGameResults: searching type ' + thisPatient.games[i].type + ' id ' + thisPatient.games[i].id);
                    gamesToSend.push({
                        type: thisPatient.games[i].type,
                        game: getGameById(games, thisPatient.games[i].id, thisPatient.games[i].type)
                    });
                }
                res.status(200).json({
                    result: 'success',
                    results: gamesToSend
                });

            }
            else {
                res.status(200).json({
                    result: 'fail',
                    message: 'patient not found'
                });
            }
        });
    }
    else {
        res.status(400).json({
            result: 'fail',
            message: 'patientId parameter missing.'
        });
    }
});

app.get('/getAllGamesBrief', function (req, res) {

    console.log('getAllGamesBrief: entered');

    var filesPath = [games_path];

    async.map(filesPath, function (filePath, cb) { //reading files or dir
        fs.readFile(filePath, 'utf8', cb);
    }, function (err, results) {
        var games = JSON.parse(results[0]);


        var gamesBrief = JSON.parse('[]');

        for (var a = 0; a < games.length; a++) {
            var typeQueue = getTypeQueue(games, games[a].type);

            if (typeQueue != null) {

                for (var i = 0; i < typeQueue.length; i++) {
                    var pos = gamesBrief.length;
                    gamesBrief[pos] = JSON.parse('{}');
                    gamesBrief[pos].id = typeQueue[i].id;
                    gamesBrief[pos].custom_name = typeQueue[i].custom_name;
                    gamesBrief[pos].type = games[a].type;
                    gamesBrief[pos].name = games[a].name;
                }
            }
        }
        if (gamesBrief.length != 0) {
            res.status(200).json(gamesBrief);
        }
        else {
            res.status(200).json({
                result: 'fail'
            });
        }

    });

});

app.get('/getGameToDo', function (req, res) {

    console.log('getGameToDo: entered');

    var filesPath = [local_variables_path, games_path, patients_path];

    async.map(filesPath, function (filePath, cb) { //reading files or dir
        fs.readFile(filePath, 'utf8', cb);
    }, function (err, results) {
        var local_variables = JSON.parse(results[0]);
        var games = JSON.parse(results[1]);
        var patients = JSON.parse(results[2]);

        var gameToDoType = local_variables['5_games']['game_to_do_type'];
        var gameToDoId = local_variables['5_games']['game_to_do_id'];
        console.log("getGameToDo: game id = " + gameToDoId);
        var gameToDo = getGameById(games, gameToDoId, gameToDoType);

        gameToDo = fitGameToPatient(gameToDo, gameToDoType, patientByGameId(patients, gameToDoId));

        gameToDo['type'] = parseInt(gameToDoType);

        //console.log(token)

        if (gameToDo != null) {
            res.status(200).json(gameToDo);
        }
        else {
            res.status(200).json({
                result: 'fail'
            });
        }

    });

});

app.get('/getGameById', function (req, res) {

    console.log('getGameById: entered');

    var gameType = req.query.type;
    var gameID = req.query.id;
    var filesPath = [games_path, patients_path];

    if ((gameType != null && gameType != undefined && gameType != "") && (gameID != null && gameID != undefined && gameID != "")) {

        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var games = JSON.parse(results[0]);
            var patients = JSON.parse(results[1]);

            var gameToGive = getGameById(games, gameID, gameType);

            var patient = patientByGameId(patients, gameID);

            if (patient == null) {
                console.log("null patient");
            }

            gameToGive = fitGameToPatient(gameToGive, gameType, patient);

            //console.log(token)

            if (gameToGive != null) {
                gameToGive.type = parseInt(gameType);
                res.status(200).json(gameToGive);
            }
            else {
                res.status(200).json({
                    result: 'fail'
                });
            }

        });
    }
    else {
        console.log("getGameById: no type or id");
        res.status(200).json({
            result: 'fail',
            message: "bad game type or id"
        });
    }
});

/**** POST methods ****/

app.post('/setGameToDo', function (req, res) {

    console.log('setGameToDo: entered function');
    var gameId = req.body.id;
    var gameType = req.body.type;
    var filesPath = [local_variables_path, games_path];

    if (gameId != null && gameType != null) {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var local_variables = JSON.parse(results[0]);
            var games = JSON.parse(results[1]);

            var testPos = getGameById(games, gameId, gameType);
            if (testPos != null) {
                console.log('setGameToDo: input parameters passed.')

                //write the change
                local_variables['5_games']['game_to_do_type'] = gameType;
                local_variables['5_games']['game_to_do_id'] = gameId;

                //console.log(JSON.stringify(enjalbert_tests));

                fs.writeFile(local_variables_path, JSON.stringify(local_variables), function (err) {
                    console.error(err)
                });

                res.status(200).json({
                    result: 'success'
                });
            }
            else {
                res.status(400).json({
                    result: 'fail',
                    message: 'game doesn\'t exist.'
                });
            }
        });
    }
    else {
        res.status(400).json({
            result: 'fail',
            message: 'game parameters missing.'
        });
    }

});

app.post('/editGame', function (req, res) {

    console.log('editGame: entered function');
    var gameId = req.body.id;
    var gameType = req.body.type;

    var editedGame = req.body.game;

    var filesPath = [games_path];

    console.log(JSON.stringify(req.body));


    console.log("private function setGameUp: entered." + editedGame.left_hand);

    if (gameId != null && gameType != null && editedGame != null && gameIsOK(gameType, editedGame) == true) {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var games = JSON.parse(results[0]);

            console.log("private function setGameUp: entered." + editedGame.left_hand);
            editedGame = setGameUp(editedGame, gameType);

            var gameToEdit = getGameById(games, gameId, gameType);

            if (gameToEdit != null) {

                var newGames = editGame(games, editedGame, gameId, gameType);

                if (newGames != null) {
                    fs.writeFile(games_path, JSON.stringify(newGames), function (err) {
                        console.error(err)
                    });
                    console.log('editGame: success');
                    res.status(200).json({
                        result: 'success'
                    });
                }
                else {
                    console.log('editGame: trouble editing game.');
                    res.status(400).json({
                        result: 'fail',
                        message: 'trouble editing game.'
                    });
                }

            }
            else {
                console.log('editGame: game doesn\'t exist.');
                res.status(400).json({
                    result: 'fail',
                    message: 'game doesn\'t exist.'
                });
            }

        });
    }
    else {
        console.log('editGame: parameters wrong or missing.');
        res.status(400).json({
            result: 'fail',
            message: 'parameters wrong or missing.'
        });
    }

});

app.post('/addGame', function (req, res) {

    console.log('addGame: entered function');

    var gameType = req.body.type;
    gameType = parseInt(gameType);
    var customName = req.body.custom_name;
    var patientId = req.body.patientId;

    var editedGame = req.body.game;

    var filesPath = [games_path, local_variables_path, patients_path, game_results_path];

    console.log(JSON.stringify(req.body));

    if (patientId != undefined && patientId != null && customName != null && gameType != null && editedGame != null && gameIsOK(gameType, editedGame) == true) {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var games = JSON.parse(results[0]);
            var local_variables = JSON.parse(results[1]);
            var patients = JSON.parse(results[2]);
            game_results = JSON.parse(results[3]);

            var gameId = local_variables['5_games'].last_games['type_' + gameType] + 1;

            editedGame = setGameUp(editedGame, gameType);

            var gameToAdd = getGameById(games, gameId, gameType);

            var patientHas = patientHasGame(patients, patientId, gameType);
            var patientPos = patientById(patients, patientId);

            if (gameToAdd == null && patientHas == false) {

                customName = patients[patientPos].name + ' ' + patients[patientPos].last_name + ' - ' + games[gameType].name;
                var newGames = addGame(JSON.parse(JSON.stringify(games)), editedGame, gameId, gameType, customName);

                //console.log(newGames[0]);

                if (newGames != null) {

                    local_variables['5_games'].last_games['type_' + gameType] = local_variables['5_games'].last_games['type_' + gameType] + 1;

                    patients[patientPos].games.push({
                        type: gameType,
                        id: gameId,
                        name: getGameById(games, 0, gameType).name
                    });

                    game_results[gameType].instances.push({
                        id: gameId,
                        results_desktop: [],
                        results_vr: []
                    });


                    fs.writeFile(patients_path, JSON.stringify(patients), function (err) {
                        console.error(err)
                    });

                    fs.writeFile(games_path, JSON.stringify(newGames), function (err) {
                        console.error(err)
                    });

                    fs.writeFile(local_variables_path, JSON.stringify(local_variables), function (err) {
                        console.error(err)
                    });

                    fs.writeFile(game_results_path, JSON.stringify(game_results), function (err) {
                        console.error(err)
                    });

                    console.log('addGame: success');
                    res.status(200).json({
                        result: 'success'
                    });
                }
                else {
                    console.log('addGame: trouble editing game.');
                    res.status(400).json({
                        result: 'fail',
                        message: 'trouble editing game.'
                    });
                }

            }
            else {
                console.log('addGame: game already exists o patients has game of same type.');
                res.status(400).json({
                    result: 'fail',
                    message: 'game already exists.'
                });
            }

        });
    }
    else {
        console.log('addGame: parameters wrong or missing.');
        res.status(400).json({
            result: 'fail',
            message: 'parameters wrong or missing.'
        });
    }

});

app.post('/sendGameResults', function (req, res) {

    console.log('sendGameResults: entered function');

    var gameType = req.body.type;
    gameType = parseInt(gameType);
    var usedVR = req.body.VR;
    var gameId = req.body.id;

    var resultsInstance = req.body.results;

    var filesPath = [game_results_path];

    console.log(JSON.stringify(req.body));

    if (gameId != null && gameType != null) {
        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {
            var game_results = JSON.parse(results[0]);

            var typePos = findSomethingBySomething(game_results, "type", gameType);

            if (typePos != -1) {
                var gamePos = findSomethingBySomething(game_results[typePos].instances, "id", gameId);

                if (gamePos != -1) {

                    resultsInstance.data_added = new Date();
                    usedVR = usedVR == true || usedVR == "true";
                    if (usedVR == true) {
                        game_results[typePos].instances[gamePos].results_vr.push(resultsInstance);
                    }
                    else {
                        game_results[typePos].instances[gamePos].results_desktop.push(resultsInstance);
                    }

                    //console.log('results:\n' + JSON.stringify(game_results));

                    fs.writeFile(game_results_path, JSON.stringify(game_results), function (err) {
                        console.error(err)
                    });

                    res.status(200).json({
                        result: 'success',
                        message: 'results saved.'
                    });
                }
                else {
                    console.log('sendGameResults: game id not found.');
                    res.status(400).json({
                        result: 'fail',
                        message: 'game id not found.'
                    });
                }
            }
            else {
                console.log('sendGameResults: game type not found.');
                res.status(400).json({
                    result: 'fail',
                    message: 'game type not found.'
                });
            }

        });
    }
    else {
        console.log('sendGameResults: parameters wrong or missing.');
        res.status(400).json({
            result: 'fail',
            message: 'parameters wrong or missing.'
        });
    }


});

/**** Put server running ****/

var server = app.listen(8090, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("REST app listening at http://%s:%s", host, port);

});


/********************* Break! beyond this point only web page stuff! ***********************/


var wepPage_express = require("express");
var wepPage_app2 = wepPage_express();
var wepPage_router = wepPage_express.Router();
var wepPage_path = __dirname + '/html/';

var db_url = "http://localhost:8090/";
var proxy = require('http-proxy').createProxyServer({
    host: db_url,
    // port: 80
});
wepPage_router.use(
    [
        '/rest_server'
    ],
    function (req, res, next) {

        console.log(req.url);

        proxy.web(req, res, {
            target: db_url
        }, next);
    });


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