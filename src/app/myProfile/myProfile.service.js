(function () {
    'use strict';

    angular
        .module('app.myProfile')
        .factory('profileFactory', profileFactory);

    profileFactory.$inject = ['$http' , 'role'];

    function profileFactory($http , role) {
        var service = {};

        service.getUser = function (id) {

            if(role.isAdminRole()){
                var promise = $http.get(__env.dataServerUrl + '/user/details/'+id)
                    .then(
                        function (data) {
                            return data;
                        },
                        function (errors) {
                            return errors;
                        });
            }
            else {
                var promise = $http.get(__env.dataServerUrl + '/dietitian/'+id)
                    .then(
                        function (data) {
                            return data;
                        },
                        function (errors) {
                            return errors;
                        });
            }

            return promise;
        };

        service.updateUser = function (id, user) {
            if(role.isAdminRole()) {
                var promise = $http.put(__env.dataServerUrl + '/user/updateDetails/' + id, user)
                    .then(
                        function (data) {
                            return data;
                        },
                        function (errors) {
                            return errors;
                        });
            }
            else {
                var promise = $http.put(__env.dataServerUrl + '/dietitian/'+id , user)
                    .then(
                        function (data) {
                            return data;
                        },
                        function (errors) {
                            return errors;
                        });
            }
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
