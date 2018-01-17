// Alle Klassen welche in der App gebraucht werden
function Kontakt(name, surname, phone, email, road, place, img) {
    this.contactid = 0;
    this.groups = new Array();
    this.name = name;
    this.surname = surname;
    this.phone = phone;
    this.email = email;
    this.road = road;
    this.place = place;
    this.img = img;
    this.setContactID = function (newID) {
        this.contactid = newID;
    };
    this.addGroup = function (groupID) {
        if (this.groups.includes(groupID)) {
            //TODO
        }
        else {
            this.groups.push(groupID);
        }
    };
    this.deleteGroup = function (group) {
        if (this.groups.includes(group.groupid)) {
            this.groups.splice(this.groups.indexOf(group.groupid), 1);
        }
    };
    this.setUpGroup = function (groups) {
        this.groups = groups;
    };
    this.updateContact = function (name, surname, phone, email, road, place, img) {
        this.name = name;
        this.surname = surname;
        this.phone = phone;
        this.email = email;
        this.road = road;
        this.place = place;
        this.img = img;
    };
}

function Group(name, img) {
    this.groupid = 0;
    this.name = name;
    this.img = img;
    this.members = new Array();
    this.setGroupID = function (newID) {
        this.groupid = newID;
    };
    this.addMember = function (contact) {
        if (this.members.includes(contact.contactid)) {
            //TODO
        }
        else {
            contact.addGroup(this.groupid);
            this.members.push(contact.contactid);
        }
    };
    this.updateGroup = function (name, img) {
        this.name = name;
        this.img = img;
    };
    this.deleteMember = function (contact) {
        if (this.members.includes(contact.contactid)) {
            this.members.splice(this.members.indexOf(contact.contactid), 1);
            contact.deleteGroup(this);
        }
    };
    this.setupMembers = function (members) {
        this.members = members;
    };
}

function Users(jsondata) {
    this.jsondata = jsondata;
    this.contactlist = new Array();
    this.grouplist = new Array();
    this.maxuserid = 0;
    this.maxgroupid = 0;
    this.addContact = function (contact) {
        contact.setContactID(this.maxuserid++);
        this.contactlist.push(contact);
    };
    this.addGroup = function (group) {
        group.setGroupID(this.maxgroupid++);
        this.grouplist.push(group);
    };
    this.deleteContact = function (contact) {
        console.log(contact);
        var index = {};
        this.grouplist.forEach(function (mygroup, mygroupindex) {
            mygroup.members.forEach(function (mymembers, mymembersindex) {
                if (mymembers == contact.contactid) {
                    index = mymembersindex;
                }
            });
            mygroup.members.splice(index, 1);
            index = null;
        });
        this.contactlist.forEach(function (mycontact, mycontactindex) {
            if (mycontact.contactid == contact.contactid) {
                index = mycontactindex;
            }
        });
        this.contactlist.splice(index, 1);
    };
    this.deleteGroup = function (group) {
        var index = {};
        console.log(group);
        this.contactlist.forEach(function (mycontact, mycontactindex) {
            mycontact.groups.forEach(function (mygroup, mygroupindex) {
                if (mygroup = group.groupid) {
                    index = mygroupindex;
                }
            });
            mycontact.groups.splice(index, 1);
            index = null;
        });
        this.grouplist.forEach(function (mygroup, mygroupindex) {
            if (mygroup.groupid == group.groupid) {
                index = mygroupindex;
            }
        });
        this.grouplist.splice(index, 1);
    }
    this.getContact = function (contactid) {
        var tempContact = {};
        this.contactlist.forEach(function (contact) {
            if (contact.contactid == contactid) {
                tempContact = contact;
            }
        });
        return tempContact;
    };
    this.getGroup = function (groupid) {
        var tempGroup = {};
        this.grouplist.forEach(function (group) {
            if (group.groupid == groupid) {
                tempGroup = group;
            }
        });
        return tempGroup;
    };
    if (!(this.jsondata == null)) {
        var templist = new Array();
        this.jsondata.contactlist.forEach(function (mycontact) {
            var tempContact = new Kontakt(mycontact.name, mycontact.surname, mycontact.phone, mycontact.email, mycontact.road, mycontact.place, mycontact.img);
            tempContact.setContactID(mycontact.contactid);
            tempContact.setUpGroup(mycontact.groups);
            templist.push(tempContact);
        });
        this.contactlist = templist;
        templist = new Array();
        this.jsondata.grouplist.forEach(function (mygroup) {
            var tempGroup = new Group(mygroup.name, mygroup.img);
            tempGroup.setupMembers(mygroup.members);
            tempGroup.setGroupID(mygroup.groupid);
            templist.push(tempGroup);
        });
        this.grouplist = templist;
        this.maxgroupid = this.jsondata.maxgroupid;
        this.maxuserid = this.jsondata.maxuserid;
    }
}
