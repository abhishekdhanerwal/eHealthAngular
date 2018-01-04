(function () {
    'use strict';

    angular
        .module('app.ingredient')
        .factory('ingredientFactory', ingredientFactory);

    ingredientFactory.$inject = ['$http'];

    function ingredientFactory($http) {
        var service = {};

        service.addNew = function (obj) {
            var promise = $http.post(__env.dataServerUrl + '/ingredient/save', obj)
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

        service.findList = function () {
            var promise = $http.get(__env.dataServerUrl + '/ingredient/list')
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
                        console.log(errors);
                        return errors;
                    });
            return promise;
        }

        service.getIngredient = function (id) {
            var promise = $http.get(__env.dataServerUrl + '/ingredient/'+ id)
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
                        return errors;y
                    });
            return promise;
        };

        return service;
    };

}());
