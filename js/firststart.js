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

//Signup
function signup()
{
    turn_off_clicks();

    $("#login").on("click",setup_signup);

    $("#email").attr("value","");
    $("#password").attr("value","");

    var bt = document.getElementById('signup');
    bt.classList.add('unvisible');

    var pw2 = document.getElementById('password2');
    pw2.classList.add('visible');

   
}

function setup_signup()
{
    var y = $("#password").val();
    var x = $("#password2").val();

    if(x == y)
    {
        create_firebase($("#email").attr("value"),$("#password").attr("value"));
        create_firstdb();
        start_firebase($("#email").attr("value"),$("#password").attr("value"));
    }
    else{
        alert("Die Passwörter stimmen nicht überein!");
    }
    
}

//Setup Login
function setup_login() {
    turn_off_clicks();
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
        case "singup":
            break;
        }
    });
}

function start_firebase(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            if (!(user.emailVerified)) {
                user.sendEmailVerification();
                alert("Check your Email: " + user.email);
            }
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

function create_firebase(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
    //start_firebase(email, password);
}

function sign_out_firebase() {
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
            setup_login();
        }
    });
}

function create_firstdb() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var useruid = user.uid;
            var JsonData = {
                useruid: users
            }
            firebase.database().ref('users/' + useruid).set(JSON.stringify(JsonData));
        }
    });
}
var users = new Users(null);
$(document).ready(function () {
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
