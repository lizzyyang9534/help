// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
function initPushwoosh()
{
    var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");

    //set push notifications handler
    document.addEventListener('push-notification', function(event) {
        var title = event.notification.title;
        var userData = event.notification.userdata;

        if(typeof(userData) != "undefined") {
            console.warn('user data: ' + JSON.stringify(userData));
        }

        alert(title);
    });

    //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_NUMBER", pw_appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
    pushNotification.onDeviceReady({ projectid: "731989352867", pw_appid : "A7528-D95F2" });

    //register for pushes
    pushNotification.registerDevice(
        function(status) {
            var pushToken = status;
            console.warn('push token: ' + pushToken);
        },
        function(status) {
            console.warn(JSON.stringify(['failed to register ', status]));
        }
    );
}


angular.module('starter', ['ionic', 'ionic.service.core', 'ngCordova', 'starter.controllers', 'ionic.service.push', 'ionic-material', 'starter.services_user'])

.run(function($ionicPlatform) {
  console.log(ionic.Platform.isAndroid());
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(false);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    initPushwoosh();

    Ionic.io();
    var push = new Ionic.Push({
      "debug": true,
      "onNotification": function(notification) {
        var payload = notification.payload;
        console.log(notification, payload);
        //alert('Received Notification!');
      },
      "onRegister": function(data) {
        console.log(data.token);
      },
      "pluginConfig": {
        "android": {
          "iconColor": "#0000FF"
        }
      }
    });

    var user = Ionic.User.current();
    console.log(user);
    if (!user.id) {
      user.id = Ionic.User.anonymousId();
    }

    user.set('name', 'dapi');
    user.set('bio', 'this is my lt bio');
    user.save();
    user.isDirty();

    var callback = function(pushToken) {
      console.log(pushToken.token);
      push.addTokenToUser(user);
      user.save();
    };

    push.register(callback);

    /*var push = new Ionic.Push({
      "debug": true
    });

    push.register(function(token) {
      console.log("Device token:", token.token);
    });*/
  });

  /*window.onNotification = function(e) {

    switch (e.event) {
      case 'registered':
        if (e.regid.length > 0) {

          var device_token = e.regid;
          RequestsService.register(device_token).then(function(response) {
            alert('registered!');
          });
        }
        break;

      case 'message':
        alert('msg received: ' + e.message);
        /*
        {
          "message": "Hello this is a push notification",
          "payload": {
            "message": "Hello this is a push notification",
            "sound": "notification",
            "title": "New Message",
            "from": "813xxxxxxx",
            "collapse_key": "do_not_collapse",
            "foreground": true,
            "event": "message"
          }
        }
        */
  /*break;

      case 'error':
        alert('error occured');
        break;

    }
  };
  window.errorHandler = function(error) {
    alert('an error occured');
  };
  pushNotification = window.plugins.pushNotification;
  pushNotification.register(
    onNotification,
    errorHandler, {
      'badge': 'true',
      'sound': 'true',
      'alert': 'true',
      'ecb': 'onNotification',
      'senderID': 'help-2aa04',
    }
  );*/
})

.constant('API', {
  local: "http://localhost:8100",
  client: "http://140.123.175.102:8080"
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html'
      }
    }
  })

  .state('app.notificate', {
    url: '/notificate',
    views: {
      'menuContent': {
        templateUrl: 'templates/notificate.html'
      }
    },
    controller: 'NotificateCtrl'
  })

  .state('app.register', {
    url: '/register',
    views: {
      'menuContent': {
        templateUrl: 'templates/register.html'
      }
    }
  })

  .state('app.forget', {
    url: '/forget',
    views: {
      'menuContent': {
        templateUrl: 'templates/forgetPassword.html'
      }
    }
  })

  .state('app.addincident', {
    url: '/addincident',
    views: {
      'menuContent': {
        templateUrl: 'templates/addincident.html'
      }
    }
  })

  .state('app.member', {
    url: '/member',
    views: {
      'menuContent': {
        templateUrl: 'templates/member.html'
      }
    }
  })

  .state('app.editmember', {
    url: '/editmember',
    views: {
      'menuContent': {
        templateUrl: 'templates/editmember.html'
      }
    }
  })

  .state('app.helpHistory', {
    url: '/helpHistory',
    views: {
      'menuContent': {
        templateUrl: 'templates/helpHistory.html'
      }
    }
  })

  .state('app.incidentHistory', {
    url: '/incidentHistory',
    views: {
      'menuContent': {
        templateUrl: 'templates/incidentHistory.html'
      }
    }
  })

  .state('app.logout', {
    url: '/logout',
    views: {
      'menuContent': {
        templateUrl: 'api/logout.php'
      }
    }
  })


  .state('app.map', {
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html'
      }
    }
  })

  .state('app.shop', {
    url: '/shop',
    views: {
      'menuContent': {
        templateUrl: 'templates/shop.html'
      }
    }
  })

  .state('app.myCoupon', {
    url: '/myCoupon',
    views: {
      'menuContent': {
        templateUrl: 'templates/myCoupon.html'
      }
    }
  })

  .state('app.contactChoose', {
    url: '/contactChoose',
    views: {
      'menuContent': {
        templateUrl: 'templates/contactChoose.html'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html'
      }
    },
    controller: 'AppCtrl'
  })

  .state('app.login_furu', {
    url: '/login_furu',
    views: {
      'menuContent': {
        templateUrl: 'templates/login_furu.html'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
})

.config(['$ionicAppProvider', function($ionicAppProvider) {
  $ionicAppProvider.identify({
    app_id: 'afdfc0f2',
    api_key: '8ed06391a0776c36b51c52857f06df0e7b241e7f689439db',
    dev_push: true
  });
}]);
