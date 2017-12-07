
(function () {
  'use strict';

  angular
    .module('app.channel')
    .factory('newVideoFactory', newVideoFactory);

  newVideoFactory.$inject = ['$http'];

  function newVideoFactory($http) {
    var service = {};

    service.addNewChannel = function (obj) {

      obj.channelImage = "asnbas";

      var promise = $http.post('http://localhost:8008/channel', obj)
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
