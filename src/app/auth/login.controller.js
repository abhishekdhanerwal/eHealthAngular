
(function () {
  'use strict';

  angular
    .module('auth')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['principal' , '$state', '$window' , '$auth' , 'authFactory' , '$localStorage', '$http'];

  function LoginCtrl(principal , $state, $window , $auth, authFactory , $localStorage, $http) {
    var vm = this;

    console.log('login');

    vm.submit = function () {
      console.log(vm.user);
      principal.signin(vm.user).then(function (response) {
        console.log(response);
        $state.go('app.addVideo');
      });

      //satellizer login
      // $auth.login({
      //   email: vm.user.email,
      //   password: vm.user.password
      // }).then(function (response) {
      //
      //   $localStorage.loggedInTimeStamp = Date.now();
      //   authFactory.setUserToken(response.data.token , response.data.user)
      //   //_authenticated = true;
      //   $http.defaults.headers.common['Authorization'] = 'Bearer ' + $localStorage.__identity.token;
      //
      //   console.log(response);
      //   $state.go('app.addVideo');
      //
      // }).catch(handleError)
    };

    vm.authenticate = function (provider) {
      $auth.authenticate(provider).then(function (res) {
        console.log(res);
        $state.go('app.addVideo');
      }, handleError);
    };

    function handleError(err) {
        alert('warning', 'Something went wrong :( ', err.message)
    }
  }
}());

