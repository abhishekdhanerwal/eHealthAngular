'use strict';

/**
 * Config for the router
 */
app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRES', '$authProvider',
function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires, $authProvider) {

    app.controller = $controllerProvider.register;
    app.directive = $compileProvider.directive;
    app.filter = $filterProvider.register;
    app.factory = $provide.factory;
    app.service = $provide.service;
    app.constant = $provide.constant;
    app.value = $provide.value;

  //satellizer configuration
    $authProvider.facebook({
      clientId: '386608235114648'
    });

    // Optional: For client-side use (Implicit Grant), set responseType to 'token' (default: 'code')
    $authProvider.facebook({
      clientId: '386608235114648',
      responseType: 'token'
    });

    $authProvider.google({
      clientId: '61775858897-i58himti5a5bpg9rihoh09r3o2qe708c.apps.googleusercontent.com',
      url: 'http://localhost:8080/auth/google'
    });

    $authProvider.loginUrl = 'http://localhost:8080/login';
    $authProvider.signupUrl = 'http://localhost:8080/register';

    // LAZY MODULES

    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: jsRequires.modules
    });

    // APPLICATION ROUTES
    // -----------------------------------
    // For any unmatched url, redirect to /app/dashboard
    $urlRouterProvider.otherwise("/login/signin");
    //
    // Set up the states
    $stateProvider.state('app', {
        url: "/app",
        templateUrl: "app/layout/app.html",
        resolve: loadSequence(),
        abstract: true
    }).state('app.product', {
        url: "/products",
        template: '<div ui-view class="fade-in-up"></div>',
        title: 'Products',
        ncyBreadcrumb: {
            label: 'Products'
        }
    }).state('app.product.add', {
        url: "/add",
        templateUrl: "app/product/addProduct.html",
        controller: 'NewProductCtrl',
        controllerAs: 'vm',
        title: 'New',
        ncyBreadcrumb: {
            label: 'New'
        }
    }).state('app.product.list', {
        url: "/list",
        templateUrl: "app/product/listProduct.html",
        controller: 'ListProductCtrl',
        controllerAs: 'vm',
        title: 'List',
        ncyBreadcrumb: {
            label: 'List'
        }
    }).state('app.product.edit', {
        url: "/edit/:id",
        templateUrl: "app/product/editProduct.html",
        controller: 'EditProductCtrl',
        controllerAs: 'vm',
        title: 'Edit',
        ncyBreadcrumb: {
            label: 'Edit'
        }
    }).state('app.addVideo', {
        url: "/new",
        templateUrl: "app/channel/addNew.html",
        controller: 'NewVideoCtrl',
        controllerAs: 'vm',
        title: 'New',
        ncyBreadcrumb: {
            label: 'New'
        }
    }).state('app.channelList', {
      url: "/list",
      templateUrl: "app/channel/channelList.html",
      controller: 'ChannelListCtrl',
      controllerAs: 'vm',
      title: 'New',
      ncyBreadcrumb: {
        label: 'New'
      }
    }).state('error', {
        url: '/error',
        template: '<div ui-view class="fade-in-up"></div>'
    }).state('error.404', {
        url: '/404',
        templateUrl: "views/utility_404.html",
    }).state('error.500', {
        url: '/500',
        templateUrl: "views/utility_500.html",
    })

	// Login routes

	.state('login', {
	    url: '/login',
	    template: '<div ui-view class="fade-in-left-big smooth"></div>',
	    abstract: true
	})
    //     .state('login.signup', {
    //   url: '/singup',
    //   templateUrl: "app/auth/signUp.html",
    //   controller:"SignupCtrl",
    //   controllerAs: "vm"
    // })
        .state('login.signin', {
	    url: '/signin',
	    templateUrl: "app/auth/login_login.html",
      controller:"LoginCtrl",
      controllerAs: "vm"
	}).state('login.forgot', {
	    url: '/forgot',
	    templateUrl: "views/login_forgot.html"
	}).state('login.registration', {
	    url: '/registration',
	    templateUrl: "views/login_registration.html"
	}).state('login.lockscreen', {
	    url: '/lock',
	    templateUrl: "views/login_lock_screen.html"
	})

      .state('logout', {
        url:'/signout',
        controller:'LogoutCtrl'

      })

	// Landing Page route
	.state('landing', {
	    url: '/landing-page',
	    template: '<div ui-view class="fade-in-right-big smooth"></div>',
	    abstract: true,
	    resolve: loadSequence('jquery-appear-plugin', 'ngAppear', 'countTo')
	}).state('landing.welcome', {
	    url: '/welcome',
	    templateUrl: "views/landing_page.html"
	});
    // Generates a resolve object previously configured in constant.JS_REQUIRES (config.constant.js)
    function loadSequence() {
        var _args = arguments;
        return {
            deps: ['$ocLazyLoad', '$q',
			function ($ocLL, $q) {
			    var promise = $q.when(1);
			    for (var i = 0, len = _args.length; i < len; i++) {
			        promise = promiseThen(_args[i]);
			    }
			    return promise;

			    function promiseThen(_arg) {
			        if (typeof _arg == 'function')
			            return promise.then(_arg);
			        else
			            return promise.then(function () {
			                var nowLoad = requiredData(_arg);
			                if (!nowLoad)
			                    return $.error('Route resolve: Bad resource name [' + _arg + ']');
			                return $ocLL.load(nowLoad);
			            });
			    }

			    function requiredData(name) {
			        if (jsRequires.modules)
			            for (var m in jsRequires.modules)
			                if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
			                    return jsRequires.modules[m];
			        return jsRequires.scripts && jsRequires.scripts[name];
			    }
			}]
        };
    }
}]);

// app.run(['$window' ,function ($window) {
//   var params = $window.location.search.substring(1);
//
//   console.log(params)
// }])
