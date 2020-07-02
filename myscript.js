//https://stackoverflow.com/questions/3219758/detect-changes-in-the-dom



////////////// get storage ///////////

var annoying_Object = {};
let annoying_words = "hd";

chrome.storage.sync.get(['receivedName'], function (result) {
    window.annoying_words = result.receivedName;

    window.annoying_words = window.annoying_words.toString().split(" ");

    for (var i = 0; i < window.annoying_words.length; i++) {
        window.annoying_Object[window.annoying_words[i]] = 1;
    }

});



////////////// end storage ///////////

///////////////// rabin karb algo////////////

var convertStringToIntArray = function (s) {
    var a = [];
    for (var i = 0; i < s.length; i++)
        a.push(s[i].charCodeAt(0) - "0".charCodeAt(0));
    return a;
}

// Fix sign issues with remainder operation (get "real" modulus operation)
var mod = function (n, modulus) {
    if (n < 0)
        return (modulus + (n % modulus)) % modulus;
    return n % modulus;
};

var rkSearch = function (text, pattern) {
    textA = convertStringToIntArray(text);
    patternA = convertStringToIntArray(pattern);
    var n = textA.length;
    var m = patternA.length;
    var d = 10; // because we're just using 0-9
    var prime = 11;
    var h = Math.pow(d, m - 1);
    var p = 0;
    var t = 0;

    // Pre-processing the pattern (i.e. computing its hash)
    for (i = 0; i < m; i++) {
        p = mod(d * p + patternA[i], prime);
        t = mod(d * t + textA[i], prime);
    }

    var results = {
        text: textA,
        pattern: patternA,
        tValues: [],
        spuriousHits: [],
        matches: []
    };
    // Searching for matches
    for (i = 0; i < n - m; i++) {
        if (t === p) {
            if (text.substring(i, i + m) === pattern) {
                results.matches.push(i);
            } else {
                results.spuriousHits.push(i);
            }
        }

        t = mod(d * (t - (h * textA[i])) + textA[i + m], prime);
        results.tValues.push(t);
    }
    return results;
}

var displayResults = function (results) {
    results = results || {};
    var output = "<ul>";
    $.each(results, function (key, value) {
        output += "<li>" + key + ": " + value + "</li>";
    });
    output += "</ul>";
    $("div#results").show().html(output);
}


  

/////////////// end rabin karb ///////////////////

initScript();



var oldURL = location.href
setInterval(function () {
    var newURL = location.href

    if (newURL != oldURL) {
        setTimeout(() => {
            initScript();
        }, 500)
    }
    oldURL = location.href

}, 100);



function initScript() {
    var observeDOM = (function () {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;

        return function (obj, callback) {
            if (MutationObserver) {
                // define a new observer
                var obs = new MutationObserver(function (mutations, observer) {
                    if (mutations[0].addedNodes.length || mutations[0].removedNodes.length)
                        callback(mutations[0].addedNodes);
                }
                );
                // have the observer observe foo for changes in children
                obs.observe(obj, {
                    childList: true,
                    subtree: true
                });
            }
        };




    })();

    let oldPosts = [];
    
    observeDOM(document.getElementById('mainContainer'), function (e) {
     
        let allPagePosts = Array.from(document.getElementsByClassName('userContent'));
        let newPosts = returnNewElementsFromNewArray(oldPosts, allPagePosts)
        for (let post of newPosts) {
            oldPosts.push(post)
        }

        for (let element of newPosts) {
            
            var english = /^[A-Za-z0-9]*$/;
            if (element.textContent) {

                var post_title = element.textContent;


                if (annoying_words == null || annoying_words == undefined) return;
                
                    for(let pattern in annoying_Object){
                        let results = rkSearch(post_title+"  ", pattern);
                       

                    if (results.matches[0] != undefined) {
                        element
                        .classList
                        .add("blur");
                        element
                        .onclick = function () {
                            this.classList.toggle("blur")
                        }
                        console.log(element.textContent);

                    }
                } //end for loop




            } //end if

        }

    });

    function returnNewElementsFromNewArray(oldArr, newArr) {
        return newArr.filter(val => !oldArr.includes(val))
    }


}






