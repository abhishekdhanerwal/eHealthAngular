(function () {
  'use strict';

  angular
    .module('auth')
    .controller('LogoutCtrl', LogoutCtrl);

  LogoutCtrl.$inject = ['principal', '$state', '$localStorage', '$auth'];

  function LogoutCtrl(principal, $state, $localStorage, $auth) {

      var vm = this;

      if(principal.signout()){
        console.log($localStorage);

        //satellizer token remove logout from social media
        $auth.logout();

        // $state.go('login.signin');
        $state.go('login.signin');
      };

  }
}());

