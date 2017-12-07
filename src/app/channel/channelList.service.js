
(function () {
  'use strict';

  angular
    .module('app.channel')
    .factory('channelListFactory', channelListFactory);

  channelListFactory.$inject = ['$http' ];

  function channelListFactory($http ) {

    var service = {};

    service.getList = function () {
      var promise = $http.get( __env.dataServerUrl + '/channelList')
        .then(
          function (data) {
            console.log(data);
            return data;
          },
          function (errors) {
            console.log(errors);
            return errors;
          });
      return promise;
    };

    return service;
  };

}());
