/**
 * Created by rofler on 11/17/16.
 */

var testToDo;
var testsBrief;
var testResults;
var gamesBrief;
var currentGame;
var currentPatient;
var patientsBrief;
var gameResults;

function getTestToDo() {

    var url_rest = base_url_rest + 'getTestToDo';

    return $.ajax({
        type: 'GET',
        url: url_rest
    }).then(function (data) {

        testToDo = data;
    });

}

function getTestById(id) {

    var url_rest = base_url_rest + 'getTestById?testId=' + id;

    return $.ajax({
        type: 'GET',
        url: url_rest
    }).then(function (data) {

        testToDo = data;
    });

}

function getTestsBrief() {

    var url_rest = base_url_rest + 'getTestsBrief';

    return $.ajax({
        type: 'GET',
        url: url_rest
    }).then(function (data) {

        testsBrief = data;
    });


}

function editTest(editedTest) {

    var url_rest = base_url_rest + 'editTest';

    return $.post(url_rest, editedTest,
        function (data, status) {
            var json = data;
            if (json != null && json['result'] == 'success') {
                //alert('logout successful');
                //window.location.reload();
            }
            else {
                alert('something is wrong:' + json['message']);
                //window.location.href = "index.html";
            }
        });

}

function addTest(newTest) {

    var url_rest = base_url_rest + 'addTest';

    return $.post(url_rest, newTest,
        function (data, status) {
            var json = data;
            if (json != null && json['result'] == 'success') {
                //alert('logout successful');
                //window.location.reload();
            }
            else {
                alert('something is wrong:' + json['message']);
                //window.location.href = "index.html";
            }
        });

}

function SetTestToDo(testId) {

    var url_rest = base_url_rest + 'setTestToDo';

    var body = {testId: testId}

    return $.post(url_rest, body,
        function (data, status) {
            var json = data;
            if (json != null && json['result'] == 'success') {
                //alert('logout successful');
                //window.location.reload();
            }
            else {
                alert('something is wrong:' + json['message']);
                //window.location.href = "index.html";
            }
        });

}

function getTestResultsById(testId) {

    var url_rest = base_url_rest + 'getTestResultsById?testId=' + testId;

    return $.ajax({
        type: 'GET',
        url: url_rest
    }).then(function (data) {

        testResults = data;
    });

}


function getAllGamesBrief() {

    var url_rest = base_url_rest + 'getAllGamesBrief';

    return $.ajax({
        type: 'GET',
        url: url_rest
    }).then(function (data) {

        gamesBrief = data;
    });

}

function getGameByID(gameID, gameType) {

    var url_rest = base_url_rest + 'getGameById?id=' + gameID + '&type=' + gameType;

    return $.ajax({
        type: 'GET',
        url: url_rest
    }).then(function (data) {

        currentGame = data;
    });

}

function SetGameToDo(gameID, gameType) {

    var url_rest = base_url_rest + 'setGameToDo';

    var body = {
        id: gameID,
        type: gameType
    }

    return $.post(url_rest, body,
        function (data, status) {
            var json = data;
            if (json != null && json['result'] == 'success') {
                //alert('logout successful');
                //window.location.reload();
            }
            else {
                alert('something is wrong:' + json['message']);
                //window.location.href = "index.html";
            }
        });

}

function editGame(gameID, gameType, editedGame) {

    var url_rest = base_url_rest + 'editGame';

    console.log(editedGame);

    var body = {
        id: gameID,
        type: gameType,
        game: editedGame
    }

    return $.post(url_rest, body,
        function (data, status) {
            var json = data;
            if (json != null && json['result'] == 'success') {
                //alert('logout successful');
                //window.location.reload();
            }
            else {
                alert('something is wrong:' + json['message']);
                //window.location.href = "index.html";
            }
        });

}

function addGame(gameType, patient, patientId, gameToAdd) {

    var url_rest = base_url_rest + 'addGame';

    console.log(gameToAdd);

    var body = {
        custom_name: patient,
        type: gameType,
        game: gameToAdd.game,
        patientId: patientId
    }

    return $.post(url_rest, body,
        function (data, status) {
            var json = data;
            if (json != null && json['result'] == 'success') {
                //alert('logout successful');
                //window.location.reload();
            }
            else {
                alert('something is wrong:' + json['message']);
                //window.location.href = "index.html";
            }
        });

}


function getPatientsBrief() {

    var url_rest = base_url_rest + 'getPatientsBrief';

    return $.ajax({
        type: 'GET',
        url: url_rest
    }).then(function (data) {

        patientsBrief = data;
    });

}


function getPatients() {

    var url_rest = base_url_rest + 'getPatients';

    return $.ajax({
        type: 'GET',
        url: url_rest
    }).then(function (data) {

        patientsBrief = data;
    });

}


function getPatientById(id) {

    var url_rest = base_url_rest + 'getPatientById?id=' + id;

    return $.ajax({
        type: 'GET',
        url: url_rest
    }).then(function (data) {

        currentPatient = data;
    });

}


function addPatient(newPatient) {

    var url_rest = base_url_rest + 'addPatient';

    var body = {
        name: newPatient.name,
        left_hand: newPatient.left_hand,
        bi_num: newPatient.bi_num,
        date_of_birth: newPatient.date_of_birth,
        email: newPatient.email,
        last_name: newPatient.last_name,
        language: newPatient.language
    };

    console.log(body);

    return $.post(url_rest, body,
        function (data, status) {
            var json = data;
            if (json != null && json['result'] == 'success') {
                //alert('logout successful');
                //window.location.reload();
            }
            else {
                alert('something is wrong:' + json['message']);
                //window.location.href = "index.html";
            }
        });
}


function removePatient(patientId) {

    var url_rest = base_url_rest + 'removePatient';

    var body = {
        id: patientId
    };

    console.log(body);

    return $.post(url_rest, body,
        function (data, status) {
            var json = data;
            if (json != null && json['result'] == 'success') {
                //alert('logout successful');
                //window.location.reload();
            }
            else {
                alert('something is wrong:' + json['message']);
                //window.location.href = "index.html";
            }
        });
}


function getGameResultsByPatient(id) {

    var url_rest = base_url_rest + 'getGameResultsByPatient?id=' + id;

    return $.ajax({
        type: 'GET',
        url: url_rest
    }).then(function (data) {

        gameResults = data;
    });

}


function getGamesBriefByPatient(id) {

    var url_rest = base_url_rest + 'getGamesBriefByPatient?id=' + id;

    return $.ajax({
        type: 'GET',
        url: url_rest
    }).then(function (data) {

        gamesBrief = data;
    });

}