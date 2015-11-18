// Google Analytics for Apple TV TVJS
// Copyright 2015 Doug Richardson 
// Released under MIT license.
// https://developers.google.com/analytics/devguides/collection/protocol/v1/
(function(root) {
    "use strict"

    // Public API
    root.GoogleAnalytics = {
        init: init,
        screenview: screenview,
        event: event,
    }

    // Initialize library with a tracking ID provided by Google Analytics and
    // an application name. The Google Analytics project should be setup as a mobile
    // application (not a web site).
    // This function must be called before any other functions in this library.
    function init(trackingId, applicationName) {
        var clientIdKey = "GoogleAnalyticsClientID"
        var clientId = localStorage.getItem(clientIdKey)
        if (!clientId) {
            clientId = uuidv4()
            localStorage.setItem(clientIdKey, clientId)
        }

        commonParameters = [

            // General
            // https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#general
            ["v",1], // protocol version. must be 1
            ["tid", trackingId],
            ["ds", "app"], // data source. mobile app SDKs use "app"

            // User
            // https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#user
            ["cid", clientId],

            // System Info
            // https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#system
            ["ul", Settings.language],

            // App Tracking
            // https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#apptracking
            ["an", applicationName],
            ["aid", Device.appIdentifier],
            ["av", Device.appVersion],
        ]
    }

    // screenview is used to track when a user goes to a particular screen in your application.
    // If you've setup your Google Analytics project as a mobile app, use screenview to track
    // the user moving from page to page.
    // screenname is required.
    function screenview(screenname) {
        var params = [
            ["t", "screenview"],
            ["cd", screenname],
        ]

        postParams(params)
    }

    // event is used to track application defined events.
    // category and action are required.
    // label and value are optional.
    function event(category, action, label, value) {
        var params = [
            ["t", "event"],
            ["ec", category],
            ["ea", action],
        ]
       
        if (label) {
            params.push(["el", label])
        }
       
       if (value) {
           params.push(["ev", value])
       }

       postParams(params)
    }

    var hasCreatedSession = false
    var commonParameters

    // Set debug=true to use the hit validation endpoint
    // Alternatively, you can print out the payloads and enter them in the Hit Builder site
    // to see if they are valid:
    // https://ga-dev-tools.appspot.com/hit-builder/
    var debug=false
    
    function post(payload) {
        var xhr = new XMLHttpRequest()
        
        // post is fire and forget, but we do log the response so the developer knows
        // if things are working.
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    if (debug) {
                        console.log("ANALYTICS DEBUG RESPONSE", xhr, JSON.parse(xhr.responseText))
                    }
                } else {
                    console.warn("Google Analytics error response.", xhr.status, xhr)
                }
            }
        }

        if (debug) {
            console.log("ANALYTICS DEBUG REQUEST payload", payload)
            xhr.open("POST", "https://ssl.google-analytics.com/debug/collect")
        } else {
            xhr.open("POST", "https://ssl.google-analytics.com/collect")
        }
        xhr.send(payload)
    }

    function postParams(params) {
        if (!hasCreatedSession) {
            console.log("starting new session")
            hasCreatedSession=true
            params.push(["sc", "start"])
        }

        var payload = commonParameters.concat(params).map(function(pair) {
            return pair[0] + "=" + encodeURIComponent(pair[1])
        }).join("&")

        post(payload)
    }

    // UUIDv4 implementation using Math.random, since crypto isn't available on tvOS.
    var uuidv4 = (function() {
        function randomNumberGenerator() {
            var rnds = new Array(16);
            for (var i = 0, r; i < 16; i++) {
                if ((i & 0x03) === 0) r = Math.random() * 0x100000000
                rnds[i] = r >>> ((i & 0x03) << 3) & 0xff
            }
            return rnds
        }

        // hex encoding
        var byteToHex = []
        var hexToByte = {}
        for (var i = 0; i < 256; i++) {
            byteToHex[i] = (i + 0x100).toString(16).substr(1)
            hexToByte[byteToHex[i]] = i
        }

        function canonicalString(b) {
            var h = byteToHex
            return  h[b[0]] + h[b[1]] + h[b[2]] + h[b[3]] + '-' +
                h[b[4]] + h[b[5]] + '-' +
                h[b[6]] + h[b[7]] + '-' +
                h[b[8]] + h[b[9]] + '-' +
                h[b[10]] + h[b[11]] + h[b[12]] + h[b[13]] + h[b[14]] + h[b[15]]
        }

        // RFC 4122 v4 UUID.
        function v4() {
            var r = randomNumberGenerator()
            r[6] = (r[6] & 0x0f) | 0x40
            r[8] = (r[8] & 0x3f) | 0x80
            return canonicalString(r)
        }

        return v4
    })()

})(this);
