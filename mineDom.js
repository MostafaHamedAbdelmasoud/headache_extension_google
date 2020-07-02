



window.onload = function () {
    // console.log("it's Dom Part");

    // begin Dom Part
    let annoying_words;


    chrome.storage.sync.get(['receivedName'], function (result) {
        annoying_words = result.receivedName;
        // console.log('Value hello currently is ' + result.receivedName);
        if (result.receivedName == undefined || result.receivedName == null) {
            //   localStorage.setItem('receivedName','حرام');
            chrome.storage.sync.set({ receivedName: 'حرام' }, function () {
                // console.log('annying is undifined and Value is set to ' + 'حرام');
            });
            annoying_words = "حرام";
            getGreeting();
        }
    });




    // var window.annoying_word = localStorage.getItem('receivedName');



    // console.log('this is my local storage: ' + window.annoying_words);

    function changeName() {
        var name_input = document.getElementById("name-input");
        if (name_input) {
            window.annoying_words = name_input.value;
            name_input.value = "";
        }
        saveName();
    }

    function saveName() {
        //   localStorage.setItem('receivedName', annoying_words);

        chrome.storage.sync.set({ receivedName: window.annoying_words }, function () {
            // console.log('Value is set to ' + window.annoying_words);
        });
        getGreeting();
        alert('you must now reload the page :)');
    }

    var ele2 = document.getElementById("name-form");

    if (ele2) {
        ele2.addEventListener('submit', function (e) {
            e.preventDefault();
            changeName();
        });
    }


    function getGreeting() {
        var greeting = document.getElementById("greeting");
        if (greeting) {
            chrome.storage.sync.get(['receivedName'], function (result) {
                greeting.innerHTML = result.receivedName;
                // console.log('greeting ' + greeting.innerHTML);
            });
        }
    }


    getGreeting();


    // End Dom Part
}