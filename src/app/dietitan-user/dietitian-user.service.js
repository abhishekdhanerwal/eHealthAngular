(function () {
    'use strict';

    angular
        .module('app.dietitianUser')
        .factory('dietitanUserFactory', dietitanUserFactory);

    dietitanUserFactory.$inject = ['$http'];

    function dietitanUserFactory($http) {
        var service = {};


        service.findAll = function () {
            var promise = $http.get(__env.dataServerUrl + '/user/dietitianRequestlist')
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
                        return errors;
                    });
            return promise;
        };

        service.updateDietitianOfUser = function (id,dietitian) {
            var promise = $http.put(__env.dataServerUrl + '/user/dietitianPayment/'+id, dietitian)
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
                        return errors;
                    });
            return promise;
        };

        return service;
    };

}());
