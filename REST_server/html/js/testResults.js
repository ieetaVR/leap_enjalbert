/**
 * Created by Ricardo on 06/12/2016.
 */

function getLastCompletedTest(test) {
    var result = [test.timestamp, 0, 'color: #f52d00'];

    if (test.lvl5 != undefined && test.lvl5.success == 1)
        result = [test.timestamp, 5, 'color: #62ff00'];
    else if (test.lvl4 != undefined && test.lvl4.success == 1)
        result = [test.timestamp, 4, 'color: #d8ff00'];
    else if (test.lvl3 != undefined && test.lvl3.success == 1)
        result = [test.timestamp, 3, 'color: #ffe000'];
    else if (test.lvl2 != undefined && test.lvl2.success == 1)
        result = [test.timestamp, 2, 'color: #f5a900'];
    else if (test.lvl1 != undefined && test.lvl1.success == 1)
        result = [test.timestamp, 1, 'color: #f57c00'];

    return result;
}

function getProperColor(timeSaved, totalTime, success) {

    var color = 'color: #f52d00';
    var perc = timeSaved / totalTime;

    if(success == 1)
    {
        if (perc > 0.9)
            color = 'color: #62ff00';
        else if (perc > 0.75)
            color = 'color: #d8ff00';
        else if (perc > 0.50)
            color = 'color: #ffe000';
        else if (perc > 0.25)
            color = 'color: #62ff00';
        else if (perc > 0)
            color = 'color: #f5a900';
    }
    else
    {
        color = 'color: rgba(56, 55, 55, 0.62)';
    }

    return color;
}

function drawCharts() {

    //variables
    var rows = [];
    var timeSaved = 0;

    //level completion

    for (var i = 0; i < testResults.length; i++) {
        rows[rows.length] = getLastCompletedTest(testResults[i]);
    }


    var data = google.visualization.arrayToDataTable([
        ['Date', 'LVL', {role: 'style'}],
        rows[0],
    ]);
    data.addRows(rows.slice(1, rows.length));

    var options = {
        title: 'Test Completion',
        hAxis: {
            title: 'Time of Trial',
            viewWindow: {
                min: [7, 30, 0],
                max: [17, 30, 0]
            }
        },
        vAxis: {
            title: 'last completed level',
            viewWindow: {
                min: 0,
                max: 5
            }
        }
    };

    var chart = new google.visualization.ColumnChart(
        document.getElementById('chart_div'));

    chart.draw(data, options);


    //lvl 1
    rows = [];

    for (i = 0; i < testResults.length; i++) {
        timeSaved = testResults[i].lvl1.total_time - testResults[i].lvl1.time_taken;
        rows[rows.length] = [testResults[i].timestamp, timeSaved, getProperColor(timeSaved, testResults[i].lvl1.total_time, testResults[i].lvl1.success)]; //getLastCompletedTest(testResults[i]);
    }


    data = google.visualization.arrayToDataTable([
        ['Date', 'Time Saved', {role: 'style'}],
        rows[0],
    ]);
    data.addRows(rows.slice(1, rows.length));

    options = {
        title: 'Lvl 1 - Time Saved',
        hAxis: {
            title: 'Time of Trial'
        },
        vAxis: {
            title: 'total time - time taken'
        }
    };

    chart = new google.visualization.ColumnChart(
        document.getElementById('chart_div2'));

    chart.draw(data, options);

    //lvl 2
    rows = [];
    timeSaved = 0;

    for (i = 0; i < testResults.length; i++) {
        if (testResults[i].lvl2 != undefined) {
            timeSaved = testResults[i].lvl2.total_time - testResults[i].lvl2.time_taken;
            rows[rows.length] = [testResults[i].timestamp, timeSaved, getProperColor(timeSaved, testResults[i].lvl1.total_time, testResults[i].lvl2.success)]; //getLastCompletedTest(testResults[i]);
        }
        else
        {
            rows[rows.length] = [testResults[i].timestamp, 0, 'color: #1'];
        }
    }


    data = google.visualization.arrayToDataTable([
        ['Date', 'Time Saved', {role: 'style'}],
        rows[0],
    ]);
    data.addRows(rows.slice(1, rows.length));

    options = {
        title: 'Lvl 2 - Time Saved',
        hAxis: {
            title: 'Time of Trial'
        },
        vAxis: {
            title: 'total time - time taken'
        }
    };

    chart = new google.visualization.ColumnChart(
        document.getElementById('chart_lvl2'));

    chart.draw(data, options);

    //lvl 3
    rows = [];
    timeSaved = 0;

    for (i = 0; i < testResults.length; i++) {
        if (testResults[i].lvl3 != undefined) {
            timeSaved = testResults[i].lvl3.total_time - testResults[i].lvl3.time_taken;
            rows[rows.length] = [testResults[i].timestamp, timeSaved, getProperColor(timeSaved, testResults[i].lvl1.total_time, testResults[i].lvl3.success)]; //getLastCompletedTest(testResults[i]);
        }
        else
        {
            rows[rows.length] = [testResults[i].timestamp, 0, 'color: #1'];
        }
    }


    data = google.visualization.arrayToDataTable([
        ['Date', 'Time Saved', {role: 'style'}],
        rows[0],
    ]);
    data.addRows(rows.slice(1, rows.length));

    options = {
        title: 'Lvl 3 - Time Saved',
        hAxis: {
            title: 'Time of Trial'
        },
        vAxis: {
            title: 'total time - time taken'
        }
    };

    chart = new google.visualization.ColumnChart(
        document.getElementById('chart_lvl3'));

    chart.draw(data, options);

    //lvl 4
    rows = [];
    timeSaved = 0;

    for (i = 0; i < testResults.length; i++) {
        if (testResults[i].lvl4 != undefined) {
            timeSaved = testResults[i].lvl4.total_time - testResults[i].lvl4.time_taken;
            rows[rows.length] = [testResults[i].timestamp, timeSaved, getProperColor(timeSaved, testResults[i].lvl1.total_time, testResults[i].lvl4.success)]; //getLastCompletedTest(testResults[i]);
        }
        else
        {
            rows[rows.length] = [testResults[i].timestamp, 0, 'color: #1'];
        }
    }


    data = google.visualization.arrayToDataTable([
        ['Date', 'Time Saved', {role: 'style'}],
        rows[0],
    ]);
    data.addRows(rows.slice(1, rows.length));

    options = {
        title: 'Lvl 4 - Time Saved',
        hAxis: {
            title: 'Time of Trial'
        },
        vAxis: {
            title: 'total time - time taken'
        }
    };

    chart = new google.visualization.ColumnChart(
        document.getElementById('chart_lvl4'));

    chart.draw(data, options);

    //lvl 5
    rows = [];
    timeSaved = 0;

    for (i = 0; i < testResults.length; i++) {
        if (testResults[i].lvl5 != undefined) {
            timeSaved = testResults[i].lvl5.total_time - testResults[i].lvl5.time_taken;
            rows[rows.length] = [testResults[i].timestamp, timeSaved, getProperColor(timeSaved, testResults[i].lvl1.total_time, testResults[i].lvl5.success)]; //getLastCompletedTest(testResults[i]);
        }
        else
        {
            rows[rows.length] = [testResults[i].timestamp, 0, 'color: #1'];
        }
    }


    data = google.visualization.arrayToDataTable([
        ['Date', 'Time Saved', {role: 'style'}],
        rows[0],
    ]);
    data.addRows(rows.slice(1, rows.length));

    options = {
        title: 'Lvl 5 - Time Saved',
        hAxis: {
            title: 'Time of Trial'
        },
        vAxis: {
            title: 'total time - time taken'
        }
    };

    chart = new google.visualization.ColumnChart(
        document.getElementById('chart_lvl5'));

    chart.draw(data, options);

}

$(document).ready(function () {

    var id = getQueryVariable("id");
    console.log("id: " + id);

    $.when(getTestResultsById(id)).done(function () {

        //console.log(testResults);

        google.charts.load('current', {packages: ['corechart', 'bar']});
        google.charts.setOnLoadCallback(drawCharts);

    });
});