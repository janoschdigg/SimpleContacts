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
            $("#login").attr("id", "create");
            break;
        case "create":
            check_passwords();
            break;
        }
    });
}

function check_passwords() {
    var y = $("#password").val();
    var x = $("#password2").val();
    if (x == y) {
        create_account_firebase($("#email").val(), $("#password").val());
    }
    else {
        alert("Die Passwörter stimmen nicht überein!");
    }
}

function sign_in_firebase(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
}

function start_firebase(email, password) {
    sign_in_firebase(email, password);
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log(user);
            // User is signed in.
            var useruid = firebase.auth().currentUser.uid;
            var promise = firebase.database().ref('users/' + useruid).once('value').then(function (snapshot) {
                //console.log(JSON.parse(snapshot._e.T));
                var temp = JSON.parse(snapshot._e.T);
                users = new Users(temp.useruid);
                console.log(users);
                main_screen();
                // ...
            });
        }
        else {
            // User is signed out.
            setup_login();
        }
    });
}

function create_account_firebase(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
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

function sign_out_firebase() {
    turn_off_clicks();
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
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
        else {
            // User is signed out.
        }
    });
}
var users = new Users(null);
$(document).ready(function () {
    turn_off_clicks();
    setup_login();
});
/*
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(user);
        //user.sendEmailVerification();
        // User is signed in.
        var useruid = user.uid;
        var JsonData = {
            useruid: users
        };
        var userid = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + userid).set(JSON.stringify(JsonData));
        halloo = firebase.database().ref('users/' + userid).once('value').then(function (snapshot) {
            //console.log(JSON.parse(snapshot._e.T));
            var test12 = JSON.parse(snapshot._e.T);
            //console.log(test12.useruid);
            var grosserTest = new Users(test12.useruid);
            console.log(grosserTest);
        });
        // ...
    }
    else {
        // User is signed out.
        // ...
    }
});
*/
//Firebase
//Test json datenrückgabe
//Createing Object falls new User
