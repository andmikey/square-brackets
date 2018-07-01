var sampleData = `{
    "url": "guardian.com",
    "ssl": {},
    "contact_emails": [],
    "privacy_policy_url": "",
    "trackers": []
}`;
var realData = `{"url": "theguardian.com", "ssl": {"algorithm": "sha256WithRSAEncryption", "not_after": "20190608220149Z", "not_before": "20180607220149Z", "issuer": {"C": "BE", "O": "GlobalSign nv-sa", "CN": "GlobalSign CloudSSL CA - SHA256 - G3"}}, "privacy_policy_url": "http://theguardian.com/help/privacy-policy", "contact_emails": ["dataprotection@theguardian.com"]}`;
/*var sampleData = `{
    "url": "foo.com",
    "ssl": {
        "algorithm": "sha256WithRSAEncryption",
        "not_before": "20180607220149Z",
        "not_after": "20190608220149Z",
        "issuer": {
            "C": "BE",
            "O": "GlobalSign nv-sa",
            "CN": "GlobalSign CloudSSL CA - SHA256 - G3"
        }
    },
    "dpo_contact": "dpo@foo.com",
    "privacy_policy_url": "foo.com/privacy",
    "unchecked_by_default": true,
    "equal_emphasis": true,
    "change_later": true,
    "data_update_url": "foo.com/data_update",
    "data_portability_url": "foo.com/data_portability",
    "data_deletion_url": "foo.com/data_deletion",
    "subject_access_request_url": "foo.com/sar",
    "trackers": ["foo.com/tracker1", "foo.com/tracker2"]
}`;*/

var modifyWebsiteInputSize = function (e) {
    var a = this.value.length;
    if (a < 11) a = 11;
    else a++;
    this.style.width = a + "ch";
}

var submitForm = function (e) {
    e.preventDefault();
    if (document.body.classList.contains("mode--pending")) return;

    setPending();

    var site = websiteInput.value;
    setTimeout(function () {
        setComplete();
        var data = JSON.parse(sampleData)
        populateHTML(data, document.getElementsByClassName("complete__html")[0]);
        populateJSON(data, document.getElementsByClassName("complete__json")[0]);
    }, 100);
    /*
    var req = new XMLHttpRequest();
    req.open("GET", "localhost/api/v0/is?site=" + encodeURIComponent(site));
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            populateHTML(JSON.parse(req.response));
        }
    }
    req.send();
    */
}

var setPending = function () {
    document.body.classList.remove("mode--complete");
    document.body.classList.add("mode--pending");
}

var setComplete = function () {
    document.body.classList.remove("mode--pending");
    document.body.classList.add("mode--complete");
}

var populateJSON = function (data, el) {
    var s = JSON.stringify(data);
    el.getElementsByClassName("complete__json__text")[0].innerHTML = s;
}

var populateHTML = function (data, el) {
    var prefix = "complete__html__";
    var getComponent = function (className) { return el.getElementsByClassName(prefix + className); }
    var url = getComponent("url")[0];
    url.innerHTML = data.url;

    var status = getComponent("status")[0]
    var issueCount = 0;
    console.log(data);
    issueCount += data.privacy_policy_url === "" ? 1 : 0;
    issueCount += data.contact_emails.length === 0 ? 1 : 0;
    issueCount += data.trackers.length !== 0 ? 1 : 0;
    status.classList.add(prefix + "status--" + data.issueCount);
    status.innerHTML = issueCount + " issues found."

    var trackerCount = getComponent("tracker-count")[0];
    trackerCount.innerHTML = data.trackers.length;
    var trackers = getComponent("trackers")[0];
    trackers.innerHTML = "";
    if (data.trackers.length === 0) {
        trackers.innerHTML = "Site does not use any tracking programs.";
    } else {
        for (var trackerUrl of data.trackers) {
            var trackerContainer = document.createElement("div");
            trackerContainer.classList.add(prefix + "tracker-container")
            var trackerEl = document.createElement("a");
            trackerEl.href = trackerUrl;
            trackerEl.innerHTML = trackerUrl;
            trackerContainer.appendChild(trackerEl);
            trackers.appendChild(trackerContainer);
        }
    }

}

var websiteInput = document.getElementsByName("website")[0]
websiteInput.addEventListener("input", modifyWebsiteInputSize);

document.getElementById("checker").addEventListener("submit", submitForm);
document.getElementsByClassName("complete__tabs__html")[0].addEventListener("click", function () {
    document.body.classList.remove("mode--json");
    document.body.classList.add("mode--html");
});
document.getElementsByClassName("complete__tabs__json")[0].addEventListener("click", function () {
    document.body.classList.remove("mode--html");
    document.body.classList.add("mode--json");
});
