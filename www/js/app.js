// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'ionic.service.core', 'ngCordova', 'starter.controllers', 'ionic.service.push', 'ionic-material'])

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

      /*
      Ionic.io();
      var push = new Ionic.Push({
      	"onNotification": function(notification){
      		alert('Received Notification!');
      	},
      	"pluginConfig": {
      		"android": {
      			"iconColor": "#0000FF"
      		}
      	}
      });

      var user = Ionic.User.current();

      if(!user.id) {
      	user.id = Ionic.User.anonymousId();
      }

      user.set('name','dapi');
      user.set('bio','this is my lt bio');
      user.save();
      user.isDirty();

      var callback = function() {
      	push.addTokenToUser(user);
      	user.save();
      };

      push.register(callback);*/

    var push = new Ionic.Push({
      "debug": true
    });

    push.register(function(token) {
      console.log("Device token:", token.token);
    });
  });
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
