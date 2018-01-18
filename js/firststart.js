//Firststart setup
/*
Dieses Konfigurationen wurden von der Google Firebase Konsole zur Verfügung gestellt
*/
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
    //Methode um Alle Klick's zurücksetzten
    turn_off_clicks();
    //Ganzen Inhalt von Header, Footer und #content löschen
    $("header").html();
    $("footer").html();
    $("#content").html();
    //Login Formular laden
    $.get("html/pages/login.html", function (data) {
        $("#content").html(data);
    });
    //Klick events
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
//Einfache Datenvalidierung
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
/*
Methode wird nur 1x aufgerufen.
User wird zur Authentification von Firebase hinzugefügt
*/
function create_account_firebase(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + " " + errorMessage);
    });
    //Methode um erste "DB" zu erstellen
    create_firstdb(email, password);
}
/*
Erste Datenstrucktur erstellen & Mail wird versendet um "verified" zu sein
*/
function create_firstdb(email, password) {
    sign_in_firebase(email, password);
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            if (!(user.emailVerified)) {
                user.sendEmailVerification();
                alert("Check your Email: " + user.email);
            }
            //users wird weiter unten instanziert
            var useruid = user.uid;
            var JsonData = {
                useruid: users
            }
            firebase.database().ref('users/' + useruid).set(JSON.stringify(JsonData));
        }
    });
}
//Firebase einlog Methode
function sign_in_firebase(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + " " + errorMessage);
    });
}
//Funktion um Daten aus der Firebase zu bekommen
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
//Ausloggen aus der Firebase 
function sign_out_firebase() {
    turn_off_clicks();
    firebase.auth().signOut().then(function () {
        $("#content").html("");
        $("header").html("");
        $("footer").html("");
        users = new Users(null);
        setup_login();
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + " " + errorMessage);
    });
}
//Daten speichern
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
/*
Erst wenn das index.html alle externen Datein geladen hat
werden die Methoden für den Login erstellt
*/
$(document).ready(function () {
    turn_off_clicks();
    setup_login();
});
