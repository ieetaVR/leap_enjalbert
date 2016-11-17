/**
 * Created by rofler on 11/17/16.
 */

var testToDo;

function getTestToDo() {

    var url_rest = base_url_rest + 'getTestToDo';

    return $.ajax({
        type: 'GET',
        url: url_rest
    }).then(function (data) {

        testToDo = data;
    });


}

function editTest(editedTest) {

    var url_rest = base_url_rest + 'editTest';

    return $.post(url_rest,editedTest,
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