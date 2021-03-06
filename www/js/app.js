// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngResource', "forceng"])

.run(function($window, $location, $ionicPlatform, $rootScope, AuthenticationService, force) {
  $rootScope.user = {
    name: $window.sessionStorage.name,
    is_admin: $window.sessionStorage.is_admin
  };

  if ($rootScope.user.is_admin) {
    AuthenticationService.isAdmin = true;
  }

  $rootScope.$on("$stateChangeStart", function(event, toState) {
    //redirect only if both isAuthenticated is false and no token is set

    if (['home', 'login', 'logout', 'register'].indexOf(toState.name) === -1) {
      if (!AuthenticationService.isAuthenticated && !$window.localStorage.token) {
        event.preventDefault();
        $location.path("/home");
      }
    }

  });

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


  });
})


.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  openFB.init({appId: '719547304805756'});
  
  $stateProvider.state('home', {
    url: "/home",
    templateUrl: "templates/home.html",
    controller: 'HomeCtrl'
  })

  .state('start', {
    url: '/start',
        templateUrl: 'templates/start.html',
        controller: 'StartCtrl'
  })

   .state('step1', {
    url: '/step1',
        templateUrl: 'templates/step1.html',
        controller: 'Step1Ctrl'
  })

 .state('step2', {
    url: '/step2',
        templateUrl: 'templates/step2.html',
        controller: 'Step2Ctrl'
  })

  .state('step3', {
    url: '/step3',
        templateUrl: 'templates/step3.html',
        controller: 'Step3Ctrl'
  })

 .state('step4', {
    url: '/step4',
        templateUrl: 'templates/step4.html',
        controller: 'Step4Ctrl'
  })

 .state('step5', {
    url: '/step5',
        templateUrl: 'templates/step5.html',
        controller: 'Step5Ctrl'
  })

  .state('register', {
    url: "/register",
    templateUrl: "templates/register.html",
    controller: 'RegisterCtrl'
  })

  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs-container.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.quiz', {
    url: '/quiz',
    views: {
      'tab-quiz': {
        templateUrl: 'templates/tab-quiz.html',
        controller: 'QuizCtrl'
      }
    }
  })

  .state('tab.leaders', {
    url: '/leaders',
    views: {
      'tab-leaders': {
        templateUrl: 'templates/tab-leaders.html',
        controller: 'LeadersCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/quiz');

  // Register middleware to ensure our auth token is passed to the server
  $httpProvider.interceptors.push('TokenInterceptor');

});
