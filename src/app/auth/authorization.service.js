
(function () {
  'use strict';

  angular
    .module('auth')
    .factory('authFactory', authFactory);

  authFactory.$inject = ['$localStorage'];

  function authFactory($localStorage) {
    var service = {};

    service.setUserToken = function (token , user) {
      // console.log($localStorage)
      $localStorage.__identity = {};
      $localStorage.__identity.user = user;
      $localStorage.__identity.token = token;
    }

    service.getUserToken = function () {
      if($localStorage.__identity != undefined)
        return $localStorage.__identity.token;
    }

    service.isAuthenticated = function () {
      return !!this.getUserToken();
    }

    return service;
  };

}());
