(function () {
    'use strict';

    angular
        .module('app.myProfile')
        .factory('profileFactory', profileFactory);

    profileFactory.$inject = ['$http'];

    function profileFactory($http) {
        var service = {};

        service.addProduct = function (obj) {
            var promise = $http.post(__env.dataServerUrl + '/product/save', obj)
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

        service.findAll = function () {
            var promise = $http.get(__env.dataServerUrl + '/product/list')
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
                        return errors;
                    });
            return promise;
        };

        service.getProduct = function (id) {
            var promise = $http.get(__env.dataServerUrl + '/product/'+id)
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
                        return errors;
                    });
            return promise;
        };

        service.updateProduct = function (obj) {
            var promise = $http.put(__env.dataServerUrl + '/product/'+obj._id , obj)
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
                        return errors;
                    });
            return promise;
        };

        service.deleteProduct = function (id) {
            var promise = $http.delete(__env.dataServerUrl + '/product/'+id)
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
