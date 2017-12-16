(function () {
    'use strict';

    angular
        .module('app.dietitian')
        .factory('dietitianFactory', dietitianFactory);

    dietitianFactory.$inject = ['$http'];

    function dietitianFactory($http) {
        var service = {};

        service.addDietitian = function (obj) {
            var promise = $http.post(__env.dataServerUrl + '/dietitian/save', obj)
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
                        console.log(errors);
                        return errors;
                    });
            return promise;
        };

        service.findAll = function (status) {
            var promise = $http.get(__env.dataServerUrl + '/dietitian/list?status='+ status)
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
                        return errors;
                    });
            return promise;
        };

        service.getDietitian = function (id) {
            var promise = $http.get(__env.dataServerUrl + '/dietitian/'+id)
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
                        return errors;
                    });
            return promise;
        };

        service.updateDietitian = function (obj) {
            var promise = $http.put(__env.dataServerUrl + '/dietitian/'+obj._id , obj)
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
                        return errors;
                    });
            return promise;
        };

        service.toggleDietitian = function (id) {
            var promise = $http.put(__env.dataServerUrl + '/dietitian/status/'+id)
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
