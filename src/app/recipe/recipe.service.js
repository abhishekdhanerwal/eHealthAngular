(function () {
    'use strict';

    angular
        .module('app.recipe')
        .factory('recipeFactory', recipeFactory);

    recipeFactory.$inject = ['$http'];

    function recipeFactory($http) {
        var service = {};

        service.getAllIngredients = function () {
            var promise = $http.get(__env.dataServerUrl + '/ingredient/list')
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
                        return errors;y
                    });
            return promise;
        };

        service.findAllRecipe = function () {
            var promise = $http.get(__env.dataServerUrl + '/recipe/list')
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
                        return errors;y
                    });
            return promise;
        };

        service.changeRecipeStatus = function (id) {
            var promise = $http.put(__env.dataServerUrl + '/recipe/toggleStatus/'+id)
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
                        return errors;y
                    });
            return promise;
        };

        service.createRecipe = function (obj) {
            var promise = $http.post(__env.dataServerUrl + '/recipe/create', obj)
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
