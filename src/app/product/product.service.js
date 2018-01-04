(function () {
    'use strict';

    angular
        .module('app.product')
        .factory('productFactory', productFactory);

    productFactory.$inject = ['$http'];

    function productFactory($http) {
        var service = {};

        service.addCategory = function (category) {
            var promise = $http.post(__env.dataServerUrl + '/product/addCategory', category)
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

        service.getCategoryList = function () {
            var promise = $http.get(__env.dataServerUrl + '/product/categoryList')
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

        service.addSubCategory = function (category, subcategory) {
            var promise = $http.post(__env.dataServerUrl + '/product/addSubCategory/' + category._id, subcategory)
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

        service.getSubCategoryList = function (id) {
            var promise = $http.get(__env.dataServerUrl + '/product/subCategoryList/'+id)
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

        service.addProduct = function (id , obj) {
            var promise = $http.post(__env.dataServerUrl + '/product/save/' + id, obj)
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
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
