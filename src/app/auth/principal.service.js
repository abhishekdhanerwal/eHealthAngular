(function () {
  'use strict';

  angular
    .module('auth')
    .factory('principal', principal);

  principal.$inject = ['$q', '$http', 'toaster', '$localStorage', 'authFactory' ];

  /* @ngInject */
  function principal($q, $http, toaster,  $localStorage, authFactory ) {

    var service = {
      signup:signup,
      signin: signin,
      signout: signout
    };
    return service;


    function isIdentityInLocalStorage() {
      return angular.isDefined($localStorage.__identity);
    }

    function clearLocalStorage() {
      if (isIdentityInLocalStorage()) {
        $localStorage.$reset();
        // delete $localStorage._identity;
        // delete $localStorage.loggedInTimeStamp;
      }
    }

    function signup(user) {
      var deferred = $q.defer();

      $http.post(__env.dataServerUrl+'/register', user)
      .then(
        function (response) {
          if (response.status == 200) {
            // $localStorage.__identity.user = response.data.user;
            // $localStorage.__identity.access_token = response.data.token;
            $localStorage.loggedInTimeStamp = Date.now();
            authFactory.setUserToken(response.data.token , response.data.user)
            //_authenticated = true;
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + $localStorage.__identity.token;

            console.log($localStorage.__identity)
            deferred.resolve($localStorage.__identity);
          }
          else {
            clearLocalStorage();
            //_authenticated = false;
              toaster.error("Invalid Login credentials");
            deferred.reject("Invalid Login credentials");
          }
        },
        function (errors) {
          console.log(errors);
          clearLocalStorage();
          //_authenticated = false;
            toaster.error(errors.data.message);
          deferred.reject("Error connecting server " + errors);
        });
      return deferred.promise;

    }

    function signin(user) {
      var deferred = $q.defer();

      $http.post(__env.dataServerUrl+'/login', user)
        .then(
          function (response) {
            if (response.status == 200) {
              // $localStorage.__identity.user = response.data.user;
              // $localStorage.__identity.access_token = response.data.token;
              $localStorage.loggedInTimeStamp = Date.now();
              authFactory.setUserToken(response.data.token , response.data.user)
              //_authenticated = true;
               $http.defaults.headers.common['Authorization'] = 'Bearer ' + $localStorage.__identity.token;

              console.log($localStorage.__identity)
              deferred.resolve($localStorage.__identity);
            }
            else {
              clearLocalStorage();
              //_authenticated = false;
                toaster.error("Invalid Login credentials");
              deferred.reject("Invalid Login credentials");
            }
          },
          function (errors) {
            console.log(errors);
            clearLocalStorage();
            //_authenticated = false;
            deferred.reject(errors);
          });
      return deferred.promise;
    }

    function signout() {
      clearLocalStorage();
      $http.defaults.headers.common['Authorization'] = '';
      //_authenticated = false;
      return true;
    }
  }

})();


