(function () {
    'use strict';

    angular
        .module('app.myProfile')
        .factory('profileFactory', profileFactory);

    profileFactory.$inject = ['$http'];

    function profileFactory($http) {
        var service = {};

        service.getUser = function (id) {
            var promise = $http.get(__env.dataServerUrl + '/user/details/'+id)
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
                        return errors;
                    });
            return promise;
        };

        service.updateUser = function (id, user) {
            var promise = $http.put(__env.dataServerUrl + '/user/updateDetails/'+id , user)
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
                        return errors;
                    });
            return promise;
        };

        service.updatePassword = function (id, pass) {
            var promise = $http.put(__env.dataServerUrl + '/user/updatePassword/'+id , pass)
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
