
(function () {
    'use strict';

    angular
        .module('auth')
        .controller('NavCtrl', NavCtrl);

    NavCtrl.$inject = ['role'];

    function NavCtrl(role) {
        var vm = this;

        vm.isAdminRole = role.isAdminRole();
        vm.isDietitianRole = role.isDietitianRole();
        vm.isConsumerRole = role.isConsumerRole();

    }
}());

