
window.onload = function () {

    // begin Dom Part
    let annoying_words;


    chrome.storage.sync.get(['receivedName'], function (result) {
        annoying_words = result.receivedName;
        if (result.receivedName == undefined || result.receivedName == null) {
            chrome.storage.sync.set({ receivedName: 'violence' });
            annoying_words = "violence";
            getGreeting();
        }
    });




    function changeName() {
        var name_input = document.getElementById("name-input");
        if (name_input) {
            window.annoying_words = name_input.value;
            name_input.value = "";
        }
        saveName();
    }

    function resetName() {
        
        var name_input = document.getElementById("name-input");
        if (name_input) {
            if(name_input.value == null || name_input.value==undefined){
                alert('you must enter words');
                return;
            }
            window.annoying_words = name_input.value;
            chrome.storage.sync.set({ receivedName: window.annoying_words }, function () {
                console.log('Value is set to ' + result.receivedName);
            });
            getGreeting();
            alert('you must now reload the page :)');
        }
    }


    function saveName() {
        var greeting = document.getElementById("greeting");
        if (greeting) {
            chrome.storage.sync.set({ receivedName: window.annoying_words + " " + greeting.innerHTML });
            getGreeting();
            alert('you must now reload the page :)');
        }
    }

    var ele2 = document.getElementById("name-form");

    if (ele2) {
        ele2.addEventListener('submit', function (e) {
            e.preventDefault();
            changeName();
        });
    }

    var ele3 = document.getElementById("reset");

    if (ele3) {
        ele3.addEventListener('click',function (e) {
            e.preventDefault();
            resetName();
        });
    }


    function getGreeting() {
        var greeting = document.getElementById("greeting");
        if (greeting) {
            chrome.storage.sync.get(['receivedName'], function (result) {
                greeting.innerHTML = result.receivedName;
            });
        }
    }


    getGreeting();


    // End Dom Part
}