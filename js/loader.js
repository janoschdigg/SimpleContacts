//Verantwortlich für den Content der geladen wird & Klick Events
//Mainscreen
function main_screen() {
    turn_off_clicks();
    $.get("html/header/mainscreen.html", function (data) {
        $("header").html(data);
        $("header").on("click", "span", function () {
            switch ($(this).attr('id')) {
            case "add_user":
                edit_user(null);
                break;
            case "sign_out":
                $("#content").html();
                $("header").html();
                $("footer").html();
                sign_out_firebase();
                break;
            }
        });
    });
    $.get("html/footer/standard.html", function (data) {
        $("footer").html(data);
    });
    $.get("html/pages/mainscreen.html", function (data) {
        $("#content").html(data);
        $("#temp").html($("#contact_list"));
        $("ul").html();
        users.contactlist.forEach(function (contact, contactindex) {
            $("#contact_name").html(contact.surname + ' ' + contact.name);
            var memberof = "";
            users.grouplist.forEach(function (group, groupindex) {
                if (contact.groups.includes(group.groupid)) {
                    memberof += group.name;
                }
            });
            if (contact.img == null) {
                $("#contact_img").attr("src", "img/profile.png");
            }
            else {
                $("#contact_img").attr("src", contact.img);
            }
            $("#contact_group").html(memberof);
            $("#contact_list").attr("value", contact.contactid);
            $("#contact_list").clone(true).appendTo($("ul"));
            $("ul").find($("*")).removeAttr('id');
        });
        $("#temp").html();
        /*
        OnLongClick funktionert bei IOS / Android nicht
        $("li").mousedown(function () {
            tmr = setTimeout(function () {
                console.log($(this).attr('value'));
                alert("TestLongKlick");
                //edit_user($(this).val());
            }, 1000);
        }).mouseup(function () {
            clearTimeout(tmr);
        });
        */
        $("ul").on("click", "li", function () {
            if ($(this).val() == null) {}
            else {
                show_user($(this).val());
            }
        });
    });
}

function edit_user(clickeduserid) {
    turn_off_clicks();
    /*
    Habe ich so gemacht, weil wenn man einen neuen Kontakt erstellt
    und einen Kontakt editiert das gleiche HTML gebraucht wird
    */
    if (clickeduserid == null) {
        $.get("html/header/edituser.html", function (data) {
            $("header").html(data);
            $("#titel").html("Neuer Kontakt");
            $("header").on("click", "span", function () {
                switch ($(this).attr('id')) {
                case "edit_user_cancel":
                    main_screen();
                    break;
                case "edit_user_save":
                    var contact_img = $("#contact_img").attr("src");
                    var contact_surname = $("#contact_surname").val();
                    var contact_name = $("#contact_name").val();
                    var contact_phone = $("#contact_phone").val();
                    var contact_email = $("#contact_email").val();
                    var contact_road = $("#contact_road").val();
                    var contact_place = $("#contact_place").val();
                    users.addContact(new Kontakt(contact_name, contact_surname, contact_phone, contact_email, contact_road, contact_place, contact_img));
                    save_firebase();
                    main_screen();
                    break;
                }
            });
        });
        $.get("html/pages/edituser.html", function (data) {
            $("#content").html(data);
            //IOS Struggle mit Clickable Element
            $("#contact_img").attr("onclick", "void(0)");
            $("#file").attr("onclick", "void(0)");
            $("#content").on("click", "#contact_img", function () {
                var files = document.getElementById('file').files;
                $("#file").click().on("change", function () {
                    getBase64(this.files[0], "user");
                });
            });
        });
    }
    else {
        $.get("html/header/edituser.html", function (data) {
            $("header").html(data);
            $("header").on("click", "span", function () {
                switch ($(this).attr('id')) {
                case "edit_user_cancel":
                    main_screen();
                    break;
                case "edit_user_save":
                    var contact_img = $("#contact_img").attr("src");
                    var contact_surname = $("#contact_surname").val();
                    var contact_name = $("#contact_name").val();
                    var contact_phone = $("#contact_phone").val();
                    var contact_email = $("#contact_email").val();
                    var contact_road = $("#contact_road").val();
                    var contact_place = $("#contact_place").val();
                    users.contactlist.forEach(function (contact, contactindex) {
                        if (contact.contactid == $("#contact_id").attr('value')) {
                            users.contactlist[contactindex].updateContact(contact_name, contact_surname, contact_phone, contact_email, contact_road, contact_place, contact_img);
                        }
                    });
                    save_firebase();
                    show_user($("#contact_id").attr('value'));
                    break;
                case "edit_user_delete":
                    remove_user(clickeduserid);
                    save_firebase();
                    main_screen();
                    break;
                }
            });
        });
        $.get("html/pages/edituser.html", function (data) {
            $("#content").html(data);
            users.contactlist.forEach(function (contact, contactindex) {
                if (clickeduserid == contact.contactid) {
                    if (contact.img == null) {
                        $("#contact_img"),attr("src", "img/profile.png");
                    }
                    else {
                        $("#contact_img").attr("src", contact.img);
                    }
                    $("#contact_id").attr("value", contact.contactid);
                    $("#contact_surname").val(contact.surname);
                    $("#contact_name").val(contact.name);
                    $("#contact_phone").val(contact.phone);
                    $("#contact_email").val(contact.email);
                    $("#contact_road").val(contact.road);
                    $("#contact_place").val(contact.place);
                }
            });
            //IOS Struggle mit Clickable Element
            $("#contact_img").attr("onclick", "void(0)");
            $("#file").attr("onclick", "void(0)");
            $("#content").on("click", "#contact_img", function () {
                var files = document.getElementById('file').files;
                $("#file").click().on("change", function () {
                    getBase64(this.files[0], "user");
                });
            });
        });
    }
}
//Kamera Base64 Umwandler
function getBase64(file, what) {
    var base64;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        base64 = reader.result;
        console.log(reader.result);
        if (what == "group") {
            $("#group_img").attr("src", reader.result);
        }
        else {
            $("#contact_img").attr("src", reader.result);
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

function show_user(clickeduserid) {
    turn_off_clicks();
    $.get("html/header/showuser.html", function (data) {
        $("header").html(data);
        $("#titel").html("Show User");
        $("header").on("click", "span", function () {
            switch ($(this).attr('id')) {
            case "mainscreen":
                main_screen();
                break;
            case "edit_user":
                edit_user(clickeduserid);
                break;
            };
        });
    });
    $.get("html/pages/showuser.html", function (data) {
        $("#content").html(data);
        users.contactlist.forEach(function (contact, contactindex) {
            if (clickeduserid == contact.contactid) {
                if (contact.img == null) {}
                else {
                    $("#contact_img").attr("src", contact.img);
                }
                $("#contact_id").attr("value", contact.contactid);
                $("#contact_surname").html(contact.surname);
                $("#contact_name").html(contact.name);
                $("#contact_phone").html(contact.phone);
                $("#contact_email").html(contact.email);
                $("#contact_road").html(contact.road);
                $("#contact_place").html(contact.place);
            }
        });
    });
}

//Kompakt dank guten Klassenfunktionen
function remove_user(contactid) {
    var temp = new Kontakt();
    temp.setContactID(contactid);
    users.deleteContact(temp);
}

//Kompakt dank guten Klassenfunktionen
function remove_group(groupid) {
    var temp = new Group();
    temp.setGroupID(groupid);
    users.deleteGroup(temp);
}

function show_grouplist() {
    turn_off_clicks();
    $.get("html/header/grouplist.html", function (data) {
        $("header").html(data);
        $("header").on("click", "#add_group", function () {
            edit_group(null);
        });
    });
    $.get("html/pages/grouplist.html", function (data) {
        $("#content").html(data);
        $("#temp").html($("#group_list"));
        $("ul").html();
        users.grouplist.forEach(function (group, groupindex) {
            if (group.img == null) {
                $("#group_img").attr("src", "img/group.png");
            }
            else {
                $("#group_img").attr("src", group.img);
            }
            $("#group_name").html(group.name);
            $("#group_list").attr("value", group.groupid);
            $("#group_list").clone(true).appendTo($("ul"));
            $("ul").find($("*")).removeAttr('id');
        });
        $("#temp").html();
        $("ul").on("click", "li", function () {
            if ($(this).val() == null) {}
            else {
                show_group($(this).val());
            }
        });
    });
}

function edit_group(clickedgroupid) {
    turn_off_clicks();
    if (clickedgroupid == null) {
        $.get("html/header/editgroup.html", function (data) {
            $("header").html(data);
            $("#titel").html("New Group");
            $("header").on("click", "span", function () {
                switch ($(this).attr('id')) {
                case "edit_group_cancel":
                    show_grouplist();
                    break;
                case "edit_group_save":
                    var group_img = $("#group_img").attr("src");
                    var group_name = $("#group_name").val();
                    users.addGroup(new Group(group_name, group_img));
                    save_firebase();
                    show_grouplist();
                    break;
                default:
                    alert("Default");
                    break;
                }
            });
        });
        $.get("html/pages/editgroup.html", function (data) {
            $("#content").html(data);
             //IOS Struggle mit Clickable Element
            $("#group_img").attr("onclick", "void(0)");
            $("#file").attr("onclick", "void(0)");
            $("#content").on("click", "#group_img", function () {
                var files = document.getElementById('file').files;
                $("#file").click().on("change", function () {
                    getBase64(this.files[0], "group");
                });
            });
        });
    }
    else {
        $.get("html/header/editgroup.html", function (data) {
            $("header").html(data);
            $("header").on("click", "span", function () {
                switch ($(this).attr('id')) {
                case "edit_group_cancel":
                    show_grouplist();
                    break;
                case "edit_group_save":
                    var group_img = $("#group_img").attr("src");
                    var group_name = $("#group_name").val();
                    users.getGroup(clickedgroupid).updateGroup(group_name, group_img);
                    save_firebase();
                    show_grouplist();
                    break;
                case "edit_group_delete":
                    alert("Delete");
                    remove_group(clickedgroupid);
                    save_firebase();
                    show_grouplist();
                    break;
                case "edit_group_member_delete":
                    show_members(clickedgroupid);
                    break;
                }
            });
        });
        $.get("html/pages/editgroup.html", function (data) {
            $("#content").html(data);
            $("#secondarytitle").html("Edit Group");
            users.grouplist.forEach(function (group, groupindec) {
                if (clickedgroupid == group.groupid) {
                    if (group.img == null) {
                        $("#group_img").attr("src", "img/group.png");
                    }
                    else {
                        $("#group_img").attr("src", group.img);
                    }
                    $("#group_name").val(group.name);
                }
            });
             //IOS Struggle mit Clickable Element
            $("#group_img").attr("onclick", "void(0)");
            $("#file").attr("onclick", "void(0)");
            $("#content").on("click", "#group_img", function () {
                var files = document.getElementById('file').files;
                $("#file").click().on("change", function () {
                    getBase64(this.files[0], "group");
                });
            });
        });
    }
}

function show_members(clickedgroupid) {
    turn_off_clicks();
    $.get("html/pages/mainscreen.html", function (data) {
        $("#titel").append(" - Mitglied löschen");
        $("#content").html(data);
        $("#temp").html($("#contact_list"));
        $("ul").html();
        users.contactlist.forEach(function (contact, contactindex) {
            if (contact.groups.includes(clickedgroupid)) {
                $("#contact_name").html(contact.surname + ' ' + contact.name);
                if (contact.img == null) {
                    $("#contact_img").attr("src", "img/profile.png");
                }
                else {
                    $("#contact_img").attr("src", contact.img);
                }
                $("#contact_list").attr("value", contact.contactid);
                $("#contact_list").clone(true).appendTo($("ul"));
                $("ul").find($("*")).removeAttr('id');
            }
        });
        $("#temp").html();
        $("ul").on("click", "li", function () {
            if ($(this).val() == null) {}
            else {
                remove_member($(this).val(), clickedgroupid);
                show_group(clickedgroupid);
            }
        });
    });
}

function show_group(clickedgroupid) {
    turn_off_clicks();
    $.get("html/header/showgroup.html", function (data) {
        $("header").html(data);
        users.grouplist.forEach(function (group, groupindex) {
            if (clickedgroupid == group.groupid) {
                $("#titel").html(group.name);
            }
        });
        $("header").on("click", "span", function () {
            switch ($(this).attr('id')) {
            case "add_user":
                add_member(clickedgroupid);
                break;
            case "edit_group":
                edit_group(clickedgroupid);
                break;
            };
        });
    });
    $.get("html/pages/showgroup.html", function (data) {
        $("#content").html(data);
        users.grouplist.forEach(function (group, groupindex) {
            if (clickedgroupid == group.groupid) {
                $("#group_id").attr("value", group.groupid);
                $("#group_name").val(group.name);
            }
        });
        $("#temp").html($("#contact_list"));
        $("ul").html();
        users.contactlist.forEach(function (contact, contactindex) {
            if (contact.groups.includes(clickedgroupid)) {
                $("#contact_name").html(contact.name);
                $("#contact_surname").html(contact.surname);
                users.grouplist.forEach(function (group, groupindex) {
                    if (contact.groups.includes(group.groupid)) {
                        $("#contact_group").append(group.name);
                    }
                });
                if (contact.img == null) {
                    $("#contact_img").attr("src", "img/profile.png");
                }
                else {
                    $("#contact_img").attr("src", contact.img);
                }
                $("#contact_list").attr("value", contact.contactid);
                $("#contact_list").clone(true).appendTo($("ul"));
                $("ul").find($("*")).removeAttr('id');
            }
        });
        $("#temp").html();
        $("#content").on("click", "li", function () {
            show_user($(this).attr('value'));
        });
    });
}

function add_member(clickedgroupid) {
    turn_off_clicks();
    $.get("html/pages/mainscreen.html", function (data) {
        $("#titel").append(" - Neues Mitglied");
        $("#content").html(data);
        $("#temp").html($("#contact_list"));
        $("ul").html();
        users.contactlist.forEach(function (contact, contactindex) {
            if (contact.groups.includes(clickedgroupid)) {}
            else {
                $("#contact_name").html(contact.surname + ' ' + contact.name);
                if (contact.img == null) {
                    $("#contact_img").attr("src", "img/profile.png");
                }
                else {
                    $("#contact_img").attr("src", contact.img);
                }
                $("#contact_list").attr("value", contact.contactid);
                $("#contact_list").clone(true).appendTo($("ul"));
                $("ul").find($("*")).removeAttr('id');
            }
        });
        $("#temp").html();
        $("ul").on("click", "li", function () {
            var contactid = $(this).val();
            if (contactid == null) {}
            else {
                users.grouplist.forEach(function (group, groupindex) {
                    if (group.groupid == clickedgroupid) {
                        group.addMember(users.getContact(contactid));
                    }
                });
                save_firebase();
                show_group(clickedgroupid);
            }
        });
    });
}
//Kompakt dank Klassenfunktionen
function remove_member(clickeduserid, clickedgroupid) {
    users.getGroup(clickedgroupid).deleteMember(users.getContact(clickeduserid));
}

//Entfernt alle Event Listener
function turn_off_clicks() {
    localStorage.clear();
    $("#content").off();
    $("#content").unbind();
    $("header").off();
    $("header").unbind();
    $("footer").unbind();
    $("footer").off();
    $("footer").on("click", "label", function () {
        switch ($(this).attr('id')) {
        case "mainscreen":
            main_screen();
            break;
        case "grouplist":
            show_grouplist();
            break;
        };
    });
}
