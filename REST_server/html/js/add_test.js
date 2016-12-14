/**
 * Created by Ricardo on 06/12/2016.
 */

$("#editTest_form").on('submit', function (e) {

    e.preventDefault();


    var newTest = {};//testToDo;

    //newTest.id = $('#inputID')[0].value;
    newTest.custom_name = $('#inputTestName')[0].value;
    newTest.time_per_test = $('#inputTimePerTest')[0].value;

    var hands = document.getElementById('inputHands').getElementsByClassName('optionsRadios');
    for (var temp = 0; temp < hands.length; temp++) {
        if (hands[temp].checked == true) {
            newTest.hand = hands[temp].value;
            break;
        }
    }

    //lvl1
    newTest.lvl1 = {};
    newTest.lvl1.vertical_distance = $('#inputLVL1_vertical_distance')[0].value;
    newTest.lvl1.hold_time = $('#inputLVL1_hold_time')[0].value;
    newTest.lvl1.tunnel_space = $('#inputLVL1_tunnel_space')[0].value;

    //lvl2
    newTest.lvl2 = {};
    newTest.lvl2.vertical_distance = $('#inputLVL2_vertical_distance')[0].value;
    newTest.lvl2.horizontal_distance = $('#inputLVL2_horizontal_distance')[0].value;
    newTest.lvl2.hold_time = $('#inputLVL2_hold_time')[0].value;
    newTest.lvl2.tunnel_space = $('#inputLVL2_tunnel_space')[0].value;

    //lvl3
    newTest.lvl3 = {};
    newTest.lvl3.margin = $('#inputLVL3_margin')[0].value;
    newTest.lvl3.hold_time = $('#inputLVL3_hold_time')[0].value;
    newTest.lvl3.iterations = $('#inputLVL3_iterations')[0].value;

    //lvl4
    newTest.lvl4 = {};
    newTest.lvl4.total_index_counts = $('#inputLVL4_total_index_counts')[0].value;
    newTest.lvl4.total_middle_counts = $('#inputLVL4_total_middle_counts')[0].value;

    //lvl5
    newTest.lvl5 = {};
    newTest.lvl5.total_ring_counts = $('#inputLVL5_total_ring_counts')[0].value;
    newTest.lvl5.total_pinky_counts = $('#inputLVL5_total_pinky_counts')[0].value;


    console.log(JSON.stringify(newTest))
    console.log("form submit");


    $.when(addTest(newTest)).done(function (test) {
        console.log("post done");
    });


    window.location.href = "allEnj.html";
});

function outputUpdateTimePerTest(vol) {
    document.querySelector('#TimePerTest').value = vol;
}

function outputUpdate(vol, targetId) {
    document.querySelector('#' + targetId).value = vol;
}

