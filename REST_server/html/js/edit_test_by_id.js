/**
 * Created by Ricardo on 06/12/2016.
 */
/**
 * Created by rofler on 11/17/16.
 */
function outputUpdateTimePerTest(vol) {
    document.querySelector('#TimePerTest').value = vol;
}

function outputUpdate(vol, targetId) {
    document.querySelector('#' + targetId).value = vol;
}

$("#editTest_form").on('submit', function (e) {

    e.preventDefault();


    var newTest = testToDo;

    newTest.id = $('#inputID')[0].value;
    newTest.custom_name= $('#inputTestName')[0].value;
    newTest.time_per_test = $('#inputTimePerTest')[0].value;

    var hands = document.getElementById('inputHands').getElementsByClassName('optionsRadios');
    for (var temp = 0; temp < hands.length; temp++) {
        if (hands[temp].checked == true) {
            newTest.hand = hands[temp].value;
            break;
        }
    }

    //lvl1
    newTest.lvl1.vertical_distance = $('#inputLVL1_vertical_distance')[0].value;
    newTest.lvl1.hold_time = $('#inputLVL1_hold_time')[0].value;
    newTest.lvl1.tunnel_space = $('#inputLVL1_tunnel_space')[0].value;

    //lvl2
    newTest.lvl2.vertical_distance = $('#inputLVL2_vertical_distance')[0].value;
    newTest.lvl2.horizontal_distance = $('#inputLVL2_horizontal_distance')[0].value;
    newTest.lvl2.hold_time = $('#inputLVL2_hold_time')[0].value;
    newTest.lvl2.tunnel_space = $('#inputLVL2_tunnel_space')[0].value;

    //lvl3
    newTest.lvl3.margin = $('#inputLVL3_margin')[0].value;
    newTest.lvl3.hold_time = $('#inputLVL3_hold_time')[0].value;
    newTest.lvl3.iterations = $('#inputLVL3_iterations')[0].value;

    //lvl4
    newTest.lvl4.total_index_counts = $('#inputLVL4_total_index_counts')[0].value;
    newTest.lvl4.total_middle_counts = $('#inputLVL4_total_middle_counts')[0].value;

    //lvl5
    newTest.lvl5.total_ring_counts = $('#inputLVL5_total_ring_counts')[0].value;
    newTest.lvl5.total_pinky_counts = $('#inputLVL5_total_pinky_counts')[0].value;


    console.log(JSON.stringify(newTest))
    console.log("form submit");


    $.when(editTest(newTest)).done(function (test) {
        console.log("post done");
    });


    window.location.reload();
});

function populateForm(test) {

    //global
    $('#inputID')[0].value = test.id;
    $('#inputTestName')[0].value = test.custom_name;
    $('#inputTimePerTest')[0].value = test.time_per_test;
    outputUpdateTimePerTest(test.time_per_test)

    var hands = document.getElementById('inputHands').getElementsByClassName('optionsRadios');
    for (var temp = 0; temp < hands.length; temp++) {
        if (hands[temp].value == test.hand) {
            hands[temp].checked = true;
            break;
        }
    }

    //lvl1
    $('#inputLVL1_vertical_distance')[0].value = test.lvl1.vertical_distance;
    outputUpdate(test.lvl1.vertical_distance, 'LVL1_vertical_distance');
    $('#inputLVL1_hold_time')[0].value = test.lvl1.hold_time;
    outputUpdate(test.lvl1.hold_time, 'LVL1_hold_time');
    $('#inputLVL1_tunnel_space')[0].value = test.lvl1.tunnel_space;
    outputUpdate(test.lvl1.tunnel_space, 'LVL1_tunnel_space');

    //lvl2
    $('#inputLVL2_vertical_distance')[0].value = test.lvl2.vertical_distance;
    outputUpdate(test.lvl2.vertical_distance, 'lvl2_vertical_distance');
    $('#inputLVL2_horizontal_distance')[0].value = test.lvl2.horizontal_distance;
    outputUpdate(test.lvl2.horizontal_distance, 'lvl2_horizontal_distance');
    $('#inputLVL2_hold_time')[0].value = test.lvl2.hold_time;
    outputUpdate(test.lvl2.hold_time, 'lvl2_hold_time');
    $('#inputLVL2_tunnel_space')[0].value = test.lvl2.tunnel_space;
    outputUpdate(test.lvl2.tunnel_space, 'lvl2_tunnel_space');

    //lvl3
    $('#inputLVL3_margin')[0].value = test.lvl3.margin;
    outputUpdate(test.lvl3.margin, 'lvl3_margin');
    $('#inputLVL3_hold_time')[0].value = test.lvl3.hold_time;
    outputUpdate(test.lvl3.hold_time, 'lvl3_hold_time');
    $('#inputLVL3_iterations')[0].value = test.lvl3.iterations;
    outputUpdate(test.lvl3.iterations, 'lvl3_iterations');

    //lvl4
    $('#inputLVL4_total_index_counts')[0].value = test.lvl4.total_index_counts;
    outputUpdate(test.lvl4.total_index_counts, 'lvl4_total_index_counts');
    $('#inputLVL4_total_middle_counts')[0].value = test.lvl4.total_middle_counts;
    outputUpdate(test.lvl4.total_middle_counts, 'lvl4_total_middle_counts');

    //lvl5
    $('#inputLVL5_total_ring_counts')[0].value = test.lvl5.total_ring_counts;
    outputUpdate(test.lvl5.total_ring_counts, 'lvl5_total_ring_counts');
    $('#inputLVL5_total_pinky_counts')[0].value = test.lvl5.total_pinky_counts;
    outputUpdate(test.lvl5.total_pinky_counts, 'lvl5_total_pinky_counts');


}

$(document).ready(function () {

    console.log("doc ready");

    document.getElementById('inputHands').getElementsByClassName('optionsRadios')
    var id = getQueryVariable("id");

    $.when(getTestById(id)).done(function (test) {

        console.log("about to print");
        console.log(testToDo.id);

        populateForm(testToDo);


    });
    //getTestToDo();


});
