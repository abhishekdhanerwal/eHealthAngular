
(function () {
  'use strict';

  angular
    .module('auth')
    .factory('authInterceptor', authInterceptor);

  authInterceptor.$inject = ['authFactory'];

  function authInterceptor(authFactory) {

    return {
      request: function (config) {
        var token = authFactory.getUserToken();

        if(token)
          config.headers.Authorization = 'Bearer ' + token;

        return config;
      },
      response: function (response) {
        return response;
      }

    }

  };

}());
