/**
 * Created by Ricardo on 02/03/2017.
 */

var patientId = parseInt(getQueryVariable('id'));
var resultsType;


function outputUpdate(vol, targetId) {
    document.querySelector('#' + targetId).value = vol;
}

function initPage() {

    $('#patientName').html(currentPatient.name + ' ' + currentPatient.last_name);


    $('#inputPatientInfo_distance')[0].value = currentPatient.lift_max_height;
    outputUpdate(currentPatient.lift_max_height, 'inputPatientInfo_distance_display');
    $('#inputPatientInfo_GrabMargin_open')[0].value = currentPatient.grab_open_margin;
    outputUpdate(currentPatient.grab_open_margin, 'inputPatientInfo_GrabMargin_open_display');
    $('#inputPatientInfo_GrabMargin_close')[0].value = currentPatient.grab_close_margin;
    outputUpdate(currentPatient.grab_close_margin, 'inputPatientInfo_GrabMargin_close_display');

    gameTable = $('#gameTable').DataTable();
    gameTable.clear();

    for (var i = 0; i < gamesBrief.results.length; i++) {

        console.log('adding ' + gamesBrief.results[i].game.id);
        gameTable.row.add([
                gamesBrief.results[i].type,
                gamesBrief.results[i].game.id,
                gamesBrief.results[i].game.custom_name,
                '<button class="btn-info">See Results</button>'
            ]
        ).draw();

    }

}


$('#gameTable tbody').on('click', 'tr button', function () {

    gameTable = $('#gameTable').DataTable();

    resultsType = parseInt(gameTable.row(this.parentNode).data()[0]);
    console.log(resultsType);

    $('#results_header').html('Game Results: ' + gameTable.row(this.parentNode).data()[2]);

    doTheChart(resultsType);

    //chosenPatient = this.value;

    //$('#ConfirmModal').modal();


});

$('#gameTable tbody').on('click', 'tr td', function (e) {


    //console.log(this.children.length);
    if (this.children.length != 0) {
        return;
    }

    gameTable = $('#gameTable').DataTable();
    //alert(gameTable.row( this ).data()[0]);

    //console.log(this);

    gameType = parseInt(gameTable.row(this).data()[0]);
    gameID = parseInt(gameTable.row(this).data()[1]);

    $.when(getGameByID(gameID, gameType)).done(function () {
        gameType = gameType.toString();

        switch (gameType) {
            case "0":
                $('#inputDistance0')[0].value = currentGame.distance;
                outputUpdate(currentGame.distance, 'distance0');
                $('#inputTimeToHold0')[0].value = currentGame.time_to_hold;
                outputUpdate(currentGame.time_to_hold, 'TimeToHold0');
                $('#inputTotalIterations0')[0].value = currentGame.total_interactions;
                outputUpdate(currentGame.total_interactions, 'TotalIterations0');
                $('#inputTimeBetweenIterations0')[0].value = currentGame.time_between_interactions;
                outputUpdate(currentGame.time_between_interactions, 'TimeBetweenIterations0');
                break;
            case "1":
                $('#inputGreenApple1')[0].value = currentGame.green_apple_quantity;
                outputUpdate(currentGame.green_apple_quantity, 'GreenApple1');
                $('#inputRedApple1')[0].value = currentGame.red_apple_quantity;
                outputUpdate(currentGame.red_apple_quantity, 'RedApple1');
                $('#inputAppleMargin1')[0].value = currentGame.apple_margin;
                outputUpdate(currentGame.apple_margin, 'AppleMargin1');
                $('#inputTimeBetweenIterations1')[0].value = currentGame.time_between_interactions;
                outputUpdate(currentGame.time_between_interactions, 'TimeBetweenIterations1');
                break;
            case "2":
                $('#inputGrabMargin2')[0].value = currentGame.grab_margin;
                outputUpdate(currentGame.grab_margin, 'GrabMargin2');
                $('#inputTimeToHold2')[0].value = currentGame.time_to_hold;
                outputUpdate(currentGame.time_to_hold, 'TimeToHold2');
                $('#inputTotalIterations2')[0].value = currentGame.total_interactions;
                outputUpdate(currentGame.total_interactions, 'TotalIterations2');
                $('#inputTimeBetweenIterations2')[0].value = currentGame.time_between_interactions;
                outputUpdate(currentGame.time_between_interactions, 'TimeBetweenIterations2');
                break;
            case "3":
                $('#inputItemMargin3')[0].value = currentGame.item_margin;
                outputUpdate(currentGame.item_margin, 'ItemMargin3');
                $('#inputPinchMargin3')[0].value = currentGame.pinch_margin;
                outputUpdate(currentGame.pinch_margin, 'PinchMargin3');
                $('#inputTotalIterations3')[0].value = currentGame.iterations_per_finger;
                outputUpdate(currentGame.iterations_per_finger, 'TotalIterations3');
                break;
            case "4":
                $('#inputPinchMargin4')[0].value = currentGame.pinch_margin;
                outputUpdate(currentGame.pinch_margin, 'PinchMargin4');
                $('#inputTotalIterations4')[0].value = currentGame.total_interactions;
                outputUpdate(currentGame.total_interactions, 'TotalIterations4');
                break;
            default:
                console.log('type default');
                break;
        }

        //common variables
        var hands = document.getElementById('inputHands' + gameType).getElementsByClassName('optionsRadios');
        if (currentGame.left_hand == true) {
            hands[0].checked = true;
        }
        else {
            hands[1].checked = true;
        }

        var lang = document.getElementById('inputLang' + gameType).getElementsByClassName('optionsRadios');
        if (currentGame.language == 0) {
            lang[0].checked = true;
        }
        else {
            lang[1].checked = true;
        }

        $('#inputTotalTime' + gameType)[0].value = currentGame.total_time;
        outputUpdate(currentGame.total_time, 'TotalTime' + gameType);

        $('.modal-title').text(currentGame['name']);
        $('.modal-patient').text(currentGame['custom_name']);

        $('#modalGame' + gameType).modal();
        $('#modalGame' + gameType).modal('show');

    });
});


$("form button[type=submit]").click(function () {
    $("button[type=submit]", $(this).parents("form")).removeAttr("clicked");
    $(this).attr("clicked", "true");
});

$("#modalGame0").on('submit', function (e) {
    e.preventDefault();
    var val = $("#modalGame0 :button[type=submit][clicked=true]").val();
    console.log("Game 0 - submit type: " + val);

    if (val == "setToDo") {
        SetGameToDo(gameID, gameType);
    }
    else {
        var editedGame = {};

        var hands = document.getElementById('inputHands' + gameType).getElementsByClassName('optionsRadios');
        if (hands[0].checked == true) {
            editedGame.left_hand = true;
        }
        else {
            editedGame.left_hand = false;
        }

        var lang = document.getElementById('inputLang' + gameType).getElementsByClassName('optionsRadios');
        if (lang[0].checked == true) {
            editedGame.language = 0;
        }
        else {
            editedGame.language = 1;
        }

        editedGame.total_time = parseInt($('#inputTotalTime' + gameType)[0].value);
        editedGame.distance = parseFloat($('#inputDistance0')[0].value);
        editedGame.time_to_hold = parseInt($('#inputTimeToHold0')[0].value);
        editedGame.total_interactions = parseInt($('#inputTotalIterations0')[0].value);
        editedGame.time_between_interactions = parseInt($('#inputTimeBetweenIterations0')[0].value);

        editGame(gameID, gameType, editedGame);
    }
    $('#modalGame' + gameType).modal('hide');
});

$("#modalGame1").on('submit', function (e) {
    e.preventDefault();
    var val = $("#modalGame1 :button[type=submit][clicked=true]").val();
    console.log("Game 1 - submit type: " + val);

    if (val == "setToDo") {
        SetGameToDo(gameID, gameType);
    }
    else {
        var editedGame = {};

        var hands = document.getElementById('inputHands' + gameType).getElementsByClassName('optionsRadios');
        if (hands[0].checked == true) {
            editedGame.left_hand = true;
        }
        else {
            editedGame.left_hand = false;
        }

        var lang = document.getElementById('inputLang' + gameType).getElementsByClassName('optionsRadios');
        if (lang[0].checked == true) {
            editedGame.language = 0;
        }
        else {
            editedGame.language = 1;
        }

        editedGame.total_time = parseInt($('#inputTotalTime' + gameType)[0].value);
        editedGame.green_apple_quantity = parseInt($('#inputGreenApple1')[0].value);
        editedGame.red_apple_quantity = parseInt($('#inputRedApple1')[0].value);
        editedGame.apple_margin = parseFloat($('#inputAppleMargin1')[0].value);
        editedGame.time_between_interactions = parseInt($('#inputTimeBetweenIterations1')[0].value);

        editGame(gameID, gameType, editedGame);
    }
    $('#modalGame' + gameType).modal('hide');
});

$("#modalGame2").on('submit', function (e) {
    e.preventDefault();
    var val = $("#modalGame2 :button[type=submit][clicked=true]").val();
    console.log("Game 2 - submit type: " + val);

    if (val == "setToDo") {
        SetGameToDo(gameID, gameType);
    }
    else {
        var editedGame = {};

        var hands = document.getElementById('inputHands' + gameType).getElementsByClassName('optionsRadios');
        if (hands[0].checked == true) {
            editedGame.left_hand = true;
        }
        else {
            editedGame.left_hand = false;
        }

        var lang = document.getElementById('inputLang' + gameType).getElementsByClassName('optionsRadios');
        if (lang[0].checked == true) {
            editedGame.language = 0;
        }
        else {
            editedGame.language = 1;
        }

        editedGame.total_time = parseInt($('#inputTotalTime' + gameType)[0].value);
        editedGame.grab_margin = parseFloat($('#inputGrabMargin2')[0].value);
        editedGame.time_to_hold = parseInt($('#inputTimeToHold2')[0].value);
        editedGame.total_interactions = parseInt($('#inputTotalIterations2')[0].value);
        editedGame.time_between_interactions = parseInt($('#inputTimeBetweenIterations2')[0].value);

        editGame(gameID, gameType, editedGame);
    }
    $('#modalGame' + gameType).modal('hide');
});

$("#modalGame3").on('submit', function (e) {
    e.preventDefault();
    var val = $("#modalGame3 :button[type=submit][clicked=true]").val();
    console.log("Game 3 - submit type: " + val);

    if (val == "setToDo") {
        SetGameToDo(gameID, gameType);
    }
    else {
        var editedGame = {};

        var hands = document.getElementById('inputHands' + gameType).getElementsByClassName('optionsRadios');
        if (hands[0].checked == true) {
            editedGame.left_hand = true;
        }
        else {
            editedGame.left_hand = false;
        }

        var lang = document.getElementById('inputLang' + gameType).getElementsByClassName('optionsRadios');
        if (lang[0].checked == true) {
            editedGame.language = 0;
        }
        else {
            editedGame.language = 1;
        }

        editedGame.total_time = parseInt($('#inputTotalTime' + gameType)[0].value);
        editedGame.item_margin = parseFloat($('#inputItemMargin3')[0].value);
        editedGame.pinch_margin = parseInt($('#inputPinchMargin3')[0].value);
        editedGame.iterations_per_finger = parseInt($('#inputTotalIterations3')[0].value);

        editGame(gameID, gameType, editedGame);
    }
    $('#modalGame' + gameType).modal('hide');
});

$("#modalGame4").on('submit', function (e) {
    e.preventDefault();
    var val = $("#modalGame4 :button[type=submit][clicked=true]").val();
    console.log("Game 4 - submit type: " + val);

    if (val == "setToDo") {
        SetGameToDo(gameID, gameType);
    }
    else {
        var editedGame = {};

        var hands = document.getElementById('inputHands' + gameType).getElementsByClassName('optionsRadios');
        if (hands[0].checked == true) {
            editedGame.left_hand = true;
        }
        else {
            editedGame.left_hand = false;
        }

        var lang = document.getElementById('inputLang' + gameType).getElementsByClassName('optionsRadios');
        if (lang[0].checked == true) {
            editedGame.language = 0;
        }
        else {
            editedGame.language = 1;
        }

        editedGame.total_time = parseInt($('#inputTotalTime' + gameType)[0].value);
        editedGame.pinch_margin = parseFloat($('#inputPinchMargin4')[0].value);
        editedGame.total_interactions = parseInt($('#inputTotalIterations4')[0].value);

        editGame(gameID, gameType, editedGame);
    }
    $('#modalGame' + gameType).modal('hide');
});

$("#patientInfo_form").on('submit', function (e) {
    e.preventDefault();

    currentPatient.lift_max_height = $('#inputPatientInfo_distance')[0].value;
    currentPatient.grab_open_margin = $('#inputPatientInfo_GrabMargin_open')[0].value;
    currentPatient.grab_close_margin = $('#inputPatientInfo_GrabMargin_close')[0].value;


    updatePatientData(currentPatient);
    location.reload();


});

var groupedData_desktop;

function doTheChart(typePos) {

    var labels_desktop = [], labels_vr = [];
    var values_success = [];
    var values_fail = [];
    var values_total = [];

    for (var i = 0; i < gameResults.results[typePos].results.results_desktop.length; i++) {
        gameResults.results[typePos].results.results_desktop[i].data_added = new Date(gameResults.results[typePos].results.results_desktop[i].data_added).toISOString().slice(0, 10);
        if (_.contains(labels_desktop, gameResults.results[typePos].results.results_desktop[i].data_added) == false) {
            labels_desktop.push(gameResults.results[typePos].results.results_desktop[i].data_added);
        }
    }
    for (i = 0; i < gameResults.results[typePos].results.results_vr.length; i++) {
        gameResults.results[typePos].results.results_vr[i].data_added = new Date(gameResults.results[typePos].results.results_vr[i].data_added).toISOString().slice(0, 10);
        if (_.contains(labels_vr, gameResults.results[typePos].results.results_vr[i].data_added) == false) {
            labels_vr.push(gameResults.results[typePos].results.results_vr[i].data_added);
        }
    }
    labels_desktop.sort();
    groupedData_desktop = _.sortBy(gameResults.results[typePos].results.results_desktop, function (d) {
        return d.data_added
    });
    groupedData_desktop = _.groupBy(groupedData_desktop, function (d) {
        return d.data_added
    });

    labels_vr.sort();
    groupedData_vr = _.sortBy(gameResults.results[typePos].results.results_vr, function (d) {
        return d.data_added
    });
    var groupedData_vr = _.groupBy(groupedData_vr, function (d) {
        return d.data_added
    });

    //console.log(groupedData_desktop);
    //console.log(labels_vr);
    //console.log(groupedData_vr);

    var success_calc;

    for (i = 0; i < labels_desktop.length; i++) {

        success_calc = _.countBy(groupedData_desktop[labels_desktop[i]], function (d) {
            return d.success == true ? 's' : 'f';
        });
        values_success.push(success_calc.s != undefined ? success_calc.s : 0);
        values_fail.push(success_calc.f != undefined ? success_calc.f : 0);
        values_total.push(values_success[values_success.length - 1] + values_fail[values_fail.length - 1])
    }

    //console.log(values_success);
    //console.log(values_fail);

    var datasets = [
        {
            label: 'total',
            data: values_total,
            backgroundColor: "#1249b2"
        },
        {
            label: 'success',
            data: values_success,
            backgroundColor: "rgba(153,255,51,0.6)"
        },
        {
            label: 'fail',
            data: values_fail,
            backgroundColor: "rgba(255,0,0,0.6)"
        }
    ];

    printChart('successChart_desktop', labels_desktop, datasets);

    values_success = [];
    values_fail = [];
    values_total = [];

    for (i = 0; i < labels_vr.length; i++) {

        success_calc = _.countBy(groupedData_vr[labels_vr[i]], function (d) {
            return d.success == true ? 's' : 'f';
        });
        values_success.push(success_calc.s != undefined ? success_calc.s : 0);
        values_fail.push(success_calc.f != undefined ? success_calc.f : 0);
        values_total.push(values_success[values_success.length - 1] + values_fail[values_fail.length - 1])
    }

    console.log(values_success);
    console.log(values_fail);

    var datasets = [
        {
            label: 'total',
            data: values_total,
            backgroundColor: "#1249b2"
        },
        {
            label: 'success',
            data: values_success,
            backgroundColor: "rgba(153,255,51,0.6)"
        },
        {
            label: 'fail',
            data: values_fail,
            backgroundColor: "rgba(255,0,0,0.6)"
        }
    ];

    printChart('successChart_vr', labels_vr, datasets);

}

function printChart(chartName, labels, datasets) {

    $('#' + chartName).replaceWith('<canvas id="' + chartName + '"></canvas>');
    var ctx = document.getElementById(chartName).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        }
    });

}

$(document).ready(function () {
    console.log('doc ready');


    $.when(getPatientById(patientId)).done(function () {
        $.when(getGamesBriefByPatient(patientId)).done(function () {
            $.when((getGameResultsByPatient(patientId)).done(function () {

                initPage();

                /*
                 var ctx = document.getElementById('successChart_desktop').getContext('2d');
                 var myChart = new Chart(ctx, {
                 type: 'line',
                 data: {
                 labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                 datasets: [{
                 label: 'success',
                 data: [12, 19, 3, 17, 6, 3, 7],
                 backgroundColor: "rgba(153,255,51,0.6)"
                 }, {
                 label: 'fail',
                 data: [2, 29, 5, 5, 2, 3, 10],
                 backgroundColor: "rgba(255,0,0,0.6)"
                 }]
                 }
                 });*/


                doTheChart(0);

            }))
        });
    });

});