//Firststart setup
var config = {
    apiKey: "AIzaSyATXylAdTsziUW-tJk5oFQRwp7zzjdK78Q"
    , authDomain: "simplecontacts-cb7ac.firebaseapp.com"
    , databaseURL: "https://simplecontacts-cb7ac.firebaseio.com"
    , projectId: "simplecontacts-cb7ac"
    , storageBucket: "simplecontacts-cb7ac.appspot.com"
    , messagingSenderId: "304869102374"
};
firebase.initializeApp(config);
//Setup Login
function setup_login() {
    turn_off_clicks();
    $("header").html();
    $("footer").html();
    $("#content").html();
    $.get("html/pages/login.html", function (data) {
        $("#content").html(data);
    });
    $("#content").on("click", "button", function (event) {
        switch (this.getAttribute("id")) {
        case "login":
            var email = $("#email").val();
            var password = $("#password").val();
            start_firebase(email, password);
            email = null;
            password = null;
            break;
        case "signup":
            $("#password2").css("display", "block");
            $("#btl").css("display", "block");
            $("#signup").css("display", "none");
            $("#login").css("width", "91%");
            $("#btl").css("width", "91%");
            $("#login").attr("id", "create");
            break;
        case "create":
            check_passwords();
            break;
        case "btl":
            $("#password2").css("display", "none");
            $("#signup").css("display", "block");
            $("#create").css("width", "91%");
            $("#signup").css("width", "91%");
            $("#signup").css("right", "-5%");
            $("#btl").css("display", "none");
            $("#create").attr("id", "login");
            break;
        }
    });
}

function check_passwords() {
    var y = $("#password").val();
    var x = $("#password2").val();
    if (x.length > 7) {
        if (x == y) {
            create_account_firebase($("#email").val(), $("#password").val());
        }
        else {
            alert("Die Passwörter stimmen nicht überein!");
        }
    }
    else {
        alert("Passwort muss 8 oder mehr Zeichen enthalten");
    }
}

function create_account_firebase(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + " " + errorMessage);
    });
    create_firstdb(email, password);
}

function create_firstdb(email, password) {
    sign_in_firebase(email, password);
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            if (!(user.emailVerified)) {
                user.sendEmailVerification();
                alert("Check your Email: " + user.email);
            }
            var useruid = user.uid;
            var JsonData = {
                useruid: users
            }
            firebase.database().ref('users/' + useruid).set(JSON.stringify(JsonData));
        }
    });
}

function sign_in_firebase(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + " " + errorMessage);
    });
}

function start_firebase(email, password) {
    sign_in_firebase(email, password);
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var useruid = firebase.auth().currentUser.uid;
            var promise = firebase.database().ref('users/' + useruid).once('value').then(function (snapshot) {
                var temp = JSON.parse(snapshot._e.T);
                users = new Users(temp.useruid);
                main_screen();
            });
        }
    });
}

function sign_out_firebase() {
    turn_off_clicks();
    firebase.auth().signOut().then(function () {}).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + " " + errorMessage);
    });
    $("#content").html("");
    $("header").html("");
    $("footer").html("");
    setup_login();

}

function save_firebase() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var useruid = firebase.auth().currentUser.uid;
            var JsonData = {
                useruid: users
            };
            firebase.database().ref('users/' + useruid).set(JSON.stringify(JsonData));
        }
    });
}
//Leere Kontatkliste erstellen
var users = new Users(null);
$(document).ready(function () {
    turn_off_clicks();
    setup_login();
});
