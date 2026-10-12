// Counts "backbutton" events per physical Back press.
// Events closer than PRESS_GAP_MS are treated as one press.
var PRESS_GAP_MS = 500;

var presses = [];
var eventCount = 0;

function $(id) {
    return document.getElementById(id);
}

function render() {
    $("presses").textContent = String(presses.length);
    $("events").textContent = String(eventCount);

    var log = $("log");
    log.innerHTML = "";
    presses.forEach(function (press, index) {
        var li = document.createElement("li");
        var gaps = press.times.slice(1).map(function (t, i) {
            return "+" + (t - press.times[i]).toFixed(1) + " ms";
        });
        li.textContent = "press " + (index + 1) + ": " + press.times.length + " event(s)" +
            (gaps.length ? " (" + gaps.join(", ") + ")" : "");
        if (press.times.length > 1) {
            li.className = "double";
        }
        log.appendChild(li);
    });
}

function onBackButton() {
    var now = performance.now();
    eventCount += 1;
    console.log("[repro] backbutton at " + now.toFixed(1));

    var last = presses[presses.length - 1];
    if (last && now - last.times[last.times.length - 1] < PRESS_GAP_MS) {
        last.times.push(now);
    } else {
        presses.push({times: [now]});
    }
    render();
}

function onDeviceReady() {
    $("env").textContent = "cordova " + cordova.version + " / platform " + cordova.platformVersion +
        " / " + navigator.userAgent;

    document.addEventListener("backbutton", onBackButton, false);

    $("clear").addEventListener("click", function () {
        presses = [];
        eventCount = 0;
        render();
    });
    $("exit").addEventListener("click", function () {
        navigator.app.exitApp();
    });
}

document.addEventListener("deviceready", onDeviceReady, false);
