# Google Analytics for Apple TV's TVJS JavaScript Runtime
google_analytics.js provides Google Analytics support for Apple TV's
TVJS JavaScript runtime. It uses the Google Analytics
(Measurement Protocol)[https://developers.google.com/analytics/devguides/collection/protocol/v1/]
to provide a mobile SDK like API to track analytics events and screen views.

Your Google Analytics project should be setup as a mobile application, not a web site. However,
contributions to this library to support the pageview hits are welcome.

# Example

First, initialize the library.

```javascript
GoogleAnalytics.init("YOUR_TRACKING_ID", "YOUR_APP_NAME");
```

Then, in your TVML documents `onload` handler:

```xml
<document onload="GoogleAnalytics.screenview("YOUR_SCREEN_NAME");">
```

And, in your event handlers:

```javascript
function mySelectHandler(event) {
    GoogleAnalytics.event("YOUR_CATEGORY", "YOUR_ACTION"); 
}
```

# Contributions
Contributions to support pageview and other hit types are welcome. If you plan do make such
a contribution, please open an issue and say what you are planning to do, to avoid duplication
of effort.
