/**
 * Created by Ricardo on 06/12/2016.
 */
$(document).ready(function () {

    $.when(getTestsBrief()).done(function () {
        populateTable(testsBrief);
    });

});

var id;

function populateTable(testsBrief) {

    var t = $('#enjTestTable').DataTable();

    for (var it = 0; it< testsBrief.length; it++)
    {
        t.row.add( [
            testsBrief[it]['id'],
            testsBrief[it]['custom_name']
        ] ).draw( false );
    }
}

$('#enjTestTable tbody').on('click', 'tr', function () {

    /*$('#edit_track_modal_track_number')[0].value = $(this).children()[0].innerText;
     $('#edit_track_modal_track_title')[0].value = $(this).children()[1].innerText;
     oldTrackNumber = $(this).children()[0].innerText;
     oldTrackTitle = $(this).children()[1].innerText;
     */
    console.log( $(this).children()[1].innerText);
    id = $(this).children()[0].innerText;
    $('#modalTitle')[0].innerText = $(this).children()[1].innerText;

    $('#testEditModal').modal();
    $('#testEditModal').modal('show');
    $(this).toggleClass('selected');
});

$('#btn_Edit').on('click', function () {

    window.location.href = "editEnjalbertTest.html?id="+ id;

});


$('#btn_Set_default').on('click', function () {

    $.when(SetTestToDo(id)).done(function () {
        $('#testEditModal').modal();
        $('#testEditModal').modal('hide');
    });

});

$('#btn_Get_Results').on('click', function () {

    window.location.href = "enjalbertTestResults.html?id="+ id;

});

$('#btn_Add_test').on('click', function () {

    window.location.href = "addEnjalbertTest.html";

});