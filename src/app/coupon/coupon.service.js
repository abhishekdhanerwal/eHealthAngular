(function () {
    'use strict';

    angular
        .module('app.coupon')
        .factory('couponFactory', couponFactory);

    couponFactory.$inject = ['$http'];

    function couponFactory($http) {
        var service = {};

        service.generateCode = function () {
            var promise = $http.get(__env.dataServerUrl + '/coupon/generate')
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

        service.findCouponList = function (status) {
            var promise = $http.get(__env.dataServerUrl + '/coupon/list?status='+ status)
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

        service.findAll = function (type, status) {
            if(type == 'dietitian'){
                var promise = $http.get(__env.dataServerUrl + '/dietitian/list?status='+ status)
                    .then(
                        function (data) {
                            return data;
                        },
                        function (errors) {
                            return errors;
                        });
                return promise;
            }
            else {
                var promise = $http.get(__env.dataServerUrl + '/product/list')
                    .then(
                        function (data) {
                            return data;
                        },
                        function (errors) {
                            return errors;
                        });
                return promise;
            }

        };
        service.updateCoupon = function (type , obj) {
            var promise = $http.put(__env.dataServerUrl + '/coupon/create?type='+ type, obj)
                .then(
                    function (data) {
                        return data;
                    },
                    function (errors) {
                        return errors;y
                    });
            return promise;
        };
        service.toggleCoupon = function (id) {
            var promise = $http.put(__env.dataServerUrl + '/coupon/status/'+ id)
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
