// ==UserScript==
// @name         FGO Material Simulator Multi-Account
// @namespace    https://github.com/Hoithmach/fgo_material_simulator_multi_account
// @version      0.1.1
// @description  Adds rudimentary account switching to fgosimulator.webcrow.jp
// @author       Hoithmach
// @match        http://fgosimulator.webcrow.jp/Material/
// @match        https://fgosim.github.io/Material/
// @icon         https://webcrow.jp/images/common/favicon.ico
// @require      https://userscripts-mirror.org/scripts/source/107941.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// ==/UserScript==

function importAccount(id) {

    var valueName = "__webcrowfgoms" + String(id);

    if (GM_SuperValue.get(valueName) == undefined) {

        GM_SuperValue.set(valueName, JSON.stringify({

            "inventory" : [],
            "servant"   : []
        }));
    };

    var jsonData = GM_SuperValue.get(valueName);

    var accountData = JSON.parse(jsonData);

    localStorage["inventory"] = accountData["inventory"];
    localStorage["servant"] = accountData["servant"];

    currentAccount = id

    GM_SuperValue.set("__webcrowAccounts", JSON.stringify(accountList));
    GM_SuperValue.set("__webcrowCurrentAccount", currentAccount);

    location.reload()

};


function exportAccount(id) {

    var accountData = {

        "inventory" : localStorage["inventory"],
        "servant"   : localStorage["servant"]

    };

    var valueName = "__webcrowfgoms" + String(id);

    GM_SuperValue.set(valueName, JSON.stringify(accountData));

};


function addNewAccount() {

    exportAccount(currentAccount);

    var newAccount = prompt("Account name:");

    if (newAccount == null) {

        return;

    };

    localStorage["inventory"] = "{}";
    localStorage["servant"] = "[]";

    accountList.push(newAccount);

    removeDropdownBox()
    addDropdownBox()

    currentAccount = newAccount;

    GM_SuperValue.set("__webcrowAccounts", JSON.stringify(accountList));
    GM_SuperValue.set("__webcrowCurrentAccount", currentAccount);

    location.reload();

};

function removeAccount(id) {

    var valueName = "__webcrowfgoms" + String(id);

    GM_deleteValue(valueName);

};

function renameAccount() {

    var newName = prompt("New account name:");

    if (newName == null) {

        return;

    };

    exportAccount(newName);

    accountList.splice(accountList.indexOf(currentAccount));
    accountList.push(newName);

    removeAccount(currentAccount);

    currentAccount = newName;

    removeDropdownBox();
    addDropdownBox();

    GM_SuperValue.set("__webcrowAccounts", JSON.stringify(accountList));
    GM_SuperValue.set("__webcrowCurrentAccount", currentAccount);

};

function addDropdownBox() {

    var pageHeader = document.getElementById("header")

    var accountDropdownMenu = document.createElement("select")

    accountDropdownMenu.id = "accountDropdownMenu";
    accountDropdownMenu.style.position = "fixed";
    accountDropdownMenu.style.top = 15;
    accountDropdownMenu.style.right = 150;
    accountDropdownMenu.style.width = 200;
    accountDropdownMenu.style.maxWidth = 200;

    accountDropdownMenu.onchange = function () {

        var value = this.value;

        exportAccount(currentAccount);
        importAccount(value);

    };

    for (var i = 0; i < accountList.length; i++) {

        var newOption = document.createElement("option");

        newOption.text = accountList[i];

        accountDropdownMenu.options.add(newOption);

    };

    accountDropdownMenu.selectedIndex = accountList.indexOf(currentAccount);

    pageHeader.appendChild(accountDropdownMenu);
};


function removeDropdownBox() {

    var dropdownBox = document.getElementById("accountDropdownMenu");

    if (!dropdownBox) {

        return;

    } else {

        dropdownBox.remove();
    };
};

function addAddAccountBox() {

    var pageHeader = document.getElementById("header");

    var addAccountBox = document.createElement("BUTTON");

    addAccountBox.id = "addAccountBox";
    addAccountBox.style.position = "fixed";
    addAccountBox.style.top = 3;
    addAccountBox.style.right = 360;
    addAccountBox.style.fontSize = 12;
    addAccountBox.style.width = 110;
    addAccountBox.innerHTML = "Add Account";


    addAccountBox.onclick = addNewAccount

    pageHeader.appendChild(addAccountBox);
};

function addRenameAccountBox() {

    var pageHeader = document.getElementById("header");

    var renameAccountBox = document.createElement("BUTTON");

    renameAccountBox.id = "renameAccountBox";
    renameAccountBox.style.position = "fixed";
    renameAccountBox.style.top = 32;
    renameAccountBox.style.right = 360;
    renameAccountBox.style.fontSize = 12;
    renameAccountBox.style.width = 110;
    renameAccountBox.innerHTML = "Rename Account";

    renameAccountBox.onclick = renameAccount;

    pageHeader.appendChild(renameAccountBox);

};



(function() {

    var accountListString = GM_SuperValue.get("__webcrowAccounts", "[]");
    currentAccount = GM_SuperValue.get("__webcrowCurrentAccount", "default");

    accountList = JSON.parse(accountListString);

    if (accountList.length == 0) {

        accountList.push(currentAccount);

    };

    addDropdownBox()

    addAddAccountBox();

    addRenameAccountBox()

    GM_registerMenuCommand("Delete account", function() {

        var delAccount = prompt("Account name:");

        if (accountList.includes(delAccount)) {

            removeAccount(delAccount);

            accountList.splice(accountList.indexOf(delAccount));

            currentAccount = accountList[0];

            importAccount(currentAccount);

            GM_SuperValue.set("__webcrowAccounts", JSON.stringify(accountList));
            GM_SuperValue.set("__webcrowCurrentAccount", currentAccount);

            location.reload();

        } else if (GM_listValues().includes("__webcrowfgoms" + String(delAccount))) {

            removeAccount(delAccount);

            alert(GM_listValues());

        };

    });




})();
