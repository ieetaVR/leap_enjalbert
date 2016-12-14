/**
 * Created by Ricardo on 13/12/2016.
 */
// external js: isotope.pkgd.js

function outputUpdate(vol, targetId) {
    document.querySelector('#' + targetId).value = vol;
}

function init_isotope() {
    // init Isotope
    var $grid = $('.grid').isotope({
        itemSelector: '.element-item',
        layoutMode: 'fitRows',
        getSortData: {
            name: '.name',
            symbol: '.symbol',
            number: '.number parseInt',
            category: '[data-category]',
            weight: function (itemElem) {
                var weight = $(itemElem).find('.weight').text();
                return parseFloat(weight.replace(/[\(\)]/g, ''));
            }
        }
    });

// filter functions
    var filterFns = {
        // show if number is greater than 50
        numberGreaterThan50: function () {
            var number = $(this).find('.number').text();
            return parseInt(number, 10) > 50;
        },
        // show if name ends with -ium
        ium: function () {
            var name = $(this).find('.name').text();
            return name.match(/ium$/);
        }
    };

// bind filter button click
    $('#filters').on('click', 'button', function () {
        var filterValue = $(this).attr('data-filter');
        // use filterFn if matches value
        filterValue = filterFns[filterValue] || filterValue;
        $grid.isotope({filter: filterValue});
    });

// bind sort button click
    $('#sorts').on('click', 'button', function () {
        var sortByValue = $(this).attr('data-sort-by');
        $grid.isotope({sortBy: sortByValue});
    });

// change is-checked class on buttons
    $('.button-group').each(function (i, buttonGroup) {
        var $buttonGroup = $(buttonGroup);
        $buttonGroup.on('click', 'button', function () {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $(this).addClass('is-checked');
        });
    });

    $grid.on('click', '.element-item', function () {

        console.log(this.children[1].innerHTML);

        gameType = this.children[2].innerText;
        gameID = this.children[3].innerText;

        $.when(getGameByID(gameID, gameType)).done(function () {

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

            $('#inputTotalTime' + gameType)[0].value = currentGame.total_time;
            outputUpdate(currentGame.total_time, 'TotalTime' + gameType);

            $('.modal-title').text(currentGame['name']);
            $('.modal-patient').text(currentGame['custom_name']);

            $('#modalGame' + gameType).modal();
            $('#modalGame' + gameType).modal('show');

        });
    });
}

$("form button[type=submit]").click(function() {
    $("button[type=submit]", $(this).parents("form")).removeAttr("clicked");
    $(this).attr("clicked", "true");
});

$("#modalGame0").on('submit', function (e) {
    e.preventDefault();
    var val = $("#modalGame0 :button[type=submit][clicked=true]").val();
    console.log("Game 0 - submit type: " + val);

    if(val == "setToDo")
    {
        SetGameToDo(gameID, gameType);
    }
    else
    {

    }
    $('#modalGame' + gameType).modal('hide');
});

$("#modalGame1").on('submit', function (e) {
    e.preventDefault();
    var val = $("#modalGame1 :button[type=submit][clicked=true]").val();
    console.log("Game 1 - submit type: " + val);

    if(val == "setToDo")
    {
        SetGameToDo(gameID, gameType);
    }
    else
    {

    }
    $('#modalGame' + gameType).modal('hide');
});

$("#modalGame2").on('submit', function (e) {
    e.preventDefault();
    var val = $("#modalGame2 :button[type=submit][clicked=true]").val();
    console.log("Game 2 - submit type: " + val);

    if(val == "setToDo")
    {
        SetGameToDo(gameID, gameType);
    }
    else
    {

    }
    $('#modalGame' + gameType).modal('hide');
});

$("#modalGame3").on('submit', function (e) {
    e.preventDefault();
    var val = $("#modalGame3 :button[type=submit][clicked=true]").val();
    console.log("Game 3 - submit type: " + val);

    if(val == "setToDo")
    {
        SetGameToDo(gameID, gameType);
    }
    else
    {

    }
    $('#modalGame' + gameType).modal('hide');
});

$("#modalGame4").on('submit', function (e) {
    e.preventDefault();
    var val = $("#modalGame4 :button[type=submit][clicked=true]").val();
    console.log("Game 4 - submit type: " + val);

    if(val == "setToDo")
    {
        SetGameToDo(gameID, gameType);
    }
    else
    {

    }
    $('#modalGame' + gameType).modal('hide');
});

var gameType;
var gameID;

function populateIsotope(games) {

    for (var i = 0; i < games.length; i++) {

        var game = games[i];
        var color;

        switch (game['type']) {
            case 0:
                color = 'metalloid ';
                break;
            case 1:
                color = 'transition';
                break;
            case 2:
                color = 'post-transition';
                break;
            case 3:
                color = 'alkaline-earth';
                break;
            case 4:
                color = 'alkali';
                break;
            default:
                color = 'noble-gas';
                break;
        }

        $('.grid').append('' +
            '<div class="element-item ' + color + ' ' + 'game' + game['type'] + ' inner-transition " >' +
            '<h3 class="name">' + game['custom_name'] + '</h3> ' +
            '<p class="symbol">' + game['name'] + '</p> ' +
            '<p class="number">' + game['type'] + '</p> ' +
            '<p class="weight">' + game['id'] + '</p> ' +
            '</div>');
    }

    //$('.grid').append('    <div class="element-item actinoid metal inner-transition " data-category="actinoid">        <h3 class="name">Plutonium</h3>        <p class="symbol">Pu</p>        <p class="number">94</p>        <p class="weight">(244)</p>        </div>');

    init_isotope();

}


$(document).ready(function () {

    $.when(getAllGamesBrief()).done(function () {
        populateIsotope(gamesBrief);
    });

});
