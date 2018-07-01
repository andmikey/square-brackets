browser.tabs.query({currentWindow: true, active: true}).then(addTitle, onError);

function onError(err){
    console.error(err);
}

function addTitle(url) {
    var fullUrl = url[0]["url"];
    var matches = fullUrl.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var domain = matches && matches[1]; 
    document.getElementById("title").innerHTML = "GDPR report for " + domain;
}



