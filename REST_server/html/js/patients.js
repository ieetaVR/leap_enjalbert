/**
 * Created by Ricardo on 26/01/2017.
 */

var patientTable;
var chosenPatient;

function calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function populateTable() {

    var age;
    var hand = "right";

    patientTable = $('#patientTable').DataTable();
    patientTable.clear();

    for (var i = 0; i < patientsBrief.length; i++) {

        age = calculateAge(new Date(patientsBrief[i].date_of_birth));
        hand = "right";
        if (patientsBrief[i].left_hand == true) {
            hand = "left";
        }


        /*patientTable.row.add({
         "id": patientsBrief[i].id,
         "First name": patientsBrief[i].name,
         "Last name": patientsBrief[i].last_name,
         "Email": patientsBrief[i].email,
         "BI Number": patientsBrief[i].bi_num,
         "Affected Hand": hand,
         "Age": age,
         "Start Date": patientsBrief[i].register_date,
         "Last Calibration": patientsBrief[i].last_calibration_date,
         "Maximum Hand Lift": patientsBrief[i].lift_max_height,
         "Maximum Hand Open": patientsBrief[i].grab_open_margin,
         "Maximum Hand Close": patientsBrief[i].grab_close_margin,
         "Index Pinch Proximity": patientsBrief[i].index_pinch_margin,
         "Middle Pinch Proximity": patientsBrief[i].middle_pinch_margin,
         "Ring Pinch Proximity": patientsBrief[i].ring_pinch_margin,
         "Pinky Pinch Proximity": patientsBrief[i].pinky_pinch_margin
         }
         ).draw();*/

        patientTable.row.add([
                patientsBrief[i].id,
                patientsBrief[i].name,
                patientsBrief[i].last_name,
                patientsBrief[i].email,
                patientsBrief[i].bi_num,
                hand,
                age,
                patientsBrief[i].register_date,
                patientsBrief[i].last_calibration_date,
                patientsBrief[i].lift_max_height + "m",
                patientsBrief[i].grab_open_margin + " (perfect = 0)",
                patientsBrief[i].grab_close_margin + " (perfect = 0)",
                patientsBrief[i].index_pinch_margin + " (perfect = 0)",
                patientsBrief[i].middle_pinch_margin + " (perfect = 0)",
                patientsBrief[i].ring_pinch_margin + " (perfect = 0)",
                patientsBrief[i].pinky_pinch_margin + " (perfect = 0)",
                '<button value="' + patientsBrief[i].id + '" class="btn-danger btn-deletePatient">Delete</button>',
                '<a href="Patient.html?id=' + patientsBrief[i].id + '"><button class="btn-info">Manage</button></a>'
            ]
        ).draw();

    }


}

$("form button[type=submit]").click(function () {
    $("button[type=submit]", $(this).parents("form")).removeAttr("clicked");
    $(this).attr("clicked", "true");
});


$('#patientTable tbody').on( 'click', 'button', function () {
    console.log('deleting patient ' + this.value);

    chosenPatient = this.value;

    $('#ConfirmModal').modal();


});

$('#confirm_form1').on('submit', function (e) {

    e.preventDefault();

    var val = $("#ConfirmModal :button[type=submit][clicked=true]").val();

    if(val=='yes')
    {
        removePatient(parseInt(chosenPatient));
        location.reload();
    }
    else
    {
        $('#ConfirmModal').modal('hide');
    }

});


$("#btn_add_patient").click(function () {

});

$("#addPatientModal").on('submit', function (e) {

    e.preventDefault();
    var newPatient = {};

    var hands = document.getElementById('inputHands').getElementsByClassName('optionsRadios');
    if (hands[0].checked == true) {
        newPatient.left_hand = true;
    }
    else {
        newPatient.left_hand = false;
    }

    var lang = document.getElementById('inputLang').getElementsByClassName('optionsRadios');
    if (lang[0].checked == true) {
        newPatient.language = 0;
    }
    else {
        newPatient.language = 1;
    }

    newPatient.name = $('#inputFname')[0].value;
    newPatient.bi_num = parseInt($('#inputBiNum')[0].value);
    newPatient.date_of_birth = $('#inputBirthday')[0].value;
    newPatient.email = $('#inputEmail')[0].value;
    newPatient.last_name = $('#inputLname')[0].value;

    console.log(newPatient);

    addPatient(newPatient);


    //$('#addPatientModal').modal('hide');
    location.reload();
});

$(document).ready(function () {
    console.log('doc ready');
    patientTable = $('#patientTable').DataTable();
    /*
     patientTable.row.add([
     "abc",
     "abc",
     "abc",
     "abc",
     "abc",
     "abc",
     "abc",
     "abc",
     "abc",
     "abc",
     "abc",
     "abc",
     "abc",
     "abc",
     "abc",
     "abc"
     ]
     ).draw();*/


    $.when(getPatients()).done(function () {
        populateTable();
    });

});