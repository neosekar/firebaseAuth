angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.posts', {
    url: '/posts',
    views: {
      'tab1': {
        templateUrl: 'templates/posts.html',
        controller: 'postsCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('tabsController.android', {
    url: '/detail/:id',
    views: {
      'tab1': {
        templateUrl: 'templates/android.html',
        controller: 'androidCtrl'
      }
    }
  })

  .state('tabsController.postForm', {
    url: '/create',
    views: {
      'tab1': {
        templateUrl: 'templates/postForm.html',
        controller: 'postFormCtrl'
      }
    }
  });

$urlRouterProvider.otherwise('/login');
   // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDyI3QDjoyEU2WDLeCxUlr0oPzQQlcsQjE",
    authDomain: "fir-auth-e5e20.firebaseapp.com",
    databaseURL: "https://fir-auth-e5e20.firebaseio.com",
    storageBucket: "fir-auth-e5e20.appspot.com",
  };
  firebase.initializeApp(config);
  

});