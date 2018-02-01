(function () {
    'use strict';
    angular
        .module('app')
        .factory('role', role);

    role.$inject = ['$localStorage'];
    function role($localStorage) {
        var service = {
            isAdminRole: isAdminRole,
            isDietitianRole: isDietitianRole,
            isConsumerRole: isConsumerRole
        };
        return service;

        function isAdminRole() {
            if($localStorage.__identity.user.role == 'admin') {
                return true;
            }
            else
                return false;
        }

        function isDietitianRole() {
            if($localStorage.__identity.user.role == 'dietitian') {
                return true;
            }
            else
                return false;
        }

        function isConsumerRole() {
            if($localStorage.__identity.user.role == 'consumer') {
                return true;
            }
            else
                return false;
        }

    };
})();
