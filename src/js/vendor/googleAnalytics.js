(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
 
  ga('create', 'UA-3791078-2', 'auto');
  ga('send', 'pageview');

var eventQueue = [];

var tokens = {
    amount: 20,
    get: function() {
        return this.amount;
    },
    set: function(amount) {
        this.amount = amount;
    },
    take: function() {
        if (this.amount > 0) {
            this.amount--;
        }
    }
};

function updateTokens() {
    // Google grants 20 tracking hits that will be replenished with two new hits every second
    if (tokens.get() < 12) {
        tokens.set(tokens.get() + 8);
    }
}
window.setInterval(updateTokens, 4000);

function sendEvent(queue, trackingScript) {
    if (queue.length === 0) {
        return;
    }
    if (tokens.get() > 0) {
        tokens.take();
        var toTrack = queue.shift();
        console.log("send event to Analytics", toTrack, tokens.get());
        try {
            if (typeof trackingScript === "function") {
                trackingScript("send", toTrack);
            }
        } catch (e) {
            console.error("Error while trying to call Google Analytics.");
        }
    } else {
        window.setTimeout(function () {
            sendEvent(queue, trackingScript);
        }, 5000);
    }
}

function trackEvent(options) {
    if (!options.category || !options.action) {
        throw new Error("trackEvent: name and value are mandatory");
    }

    var trackObj = {
        hitType: "event",
        eventCategory: options.category,
        eventAction: options.action,
        nonInteraction: false
    };
    if (options.label) {
        trackObj.eventLabel = options.label;
    }

    if (options.value) {
        trackObj.eventValue = options.value;
    }

    if (options.nonInteraction) {
        trackObj.nonInteraction = options.nonInteraction;
    }

    if (options.hitCallback) {
        trackObj.hitCallback = options.hitCallback;
    }

    eventQueue.push(trackObj);
    // window._ganalytics is a global variable and only available if Google Analytics has been properly loaded
    //noinspection JSUnresolvedVariable
    sendEvent(eventQueue, window._ganalytics);
}

function getInvalidFieldInfo(invalidFields) {
    var invalidIds = [];
    invalidFields.each(function (i, item) {
        invalidIds.push(item.id + ": " + item.value);
    });

    return invalidIds.toString();
}
// add this function to the global namespace so it can also be called with inline JavaScript in JSPs

export default trackEvent