//https://stackoverflow.com/questions/3219758/detect-changes-in-the-dom



// console.log('you should feel good always');




////////////// get storage ///////////

var annoying_Object = {};
let annoying_words = "hd";

chrome.storage.sync.get(['receivedName'], function (result) {
    // console.log('receivedName is ' + result.receivedName);
    window.annoying_words = result.receivedName;
    // console.log('annoying_words is ' + window.annoying_words);

    window.annoying_words = window.annoying_words.toString().split(" ");

    for (var i = 0; i < window.annoying_words.length; i++) {
        window.annoying_Object[window.annoying_words[i]] = 1;
    }
    
});
// console.log(annoying_words);



////////////// end storage ///////////


initScript();





// var temp_local_storage = document.getElementById('greeting');
// if(temp_local_storage){
//     localStorage.setItem('receivedName',temp_local_storage.innerHTML);
// }

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
    // Observe a specific DOM element:
    observeDOM(document.getElementById('mainContainer'), function (e) {
        //let allPagePosts = Array.from(document.getElementsByClassName('_4l_v'));
        let allPagePosts = Array.from(document.getElementsByClassName('userContent'));
        let newPosts = returnNewElementsFromNewArray(oldPosts, allPagePosts)
        for (let post of newPosts) {
            oldPosts.push(post)
        }

        for (let element of newPosts) {
            //// console.log(element.textContent);
            // console.log(element.textContent);
            var english = /^[A-Za-z0-9]*$/;
            if (element.textContent) {

                chrome
                    .runtime
                    .sendMessage({
                        method: 'POST',
                        action: 'xhttp',
                        url: '',
                        data: `text=${element.textContent}`
                    }, (res) => {
                        if (res != null) {


                            /////////////////////////
                            var post_title = element.textContent;


                            // // console.log(chrome.storage.sync.get(['receivedName'],callback){
                            //      callback(result.receivedName);
                            //     });

                            if (annoying_words == null || annoying_words == undefined) return;
                            post_title = post_title.toString().split(" ");

                            // console.log("this is annoying object " + JSON.stringify(annoying_Object));
                            for (var j = 0; j < post_title.length; j++) {
                                if (annoying_Object.hasOwnProperty(post_title[j])) {
                                    // console.log('this is matched ' + post_title[j])
                                    element
                                        .classList
                                        .add("blur");
                                    element
                                        .onclick = function () {
                                            this.classList.toggle("blur")
                                        }
                                }
                            }
                        }


                    });
            }

        }

    });

    function returnNewElementsFromNewArray(oldArr, newArr) {
        return newArr.filter(val => !oldArr.includes(val))
    }

}






