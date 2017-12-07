
(function () {
  'use strict';

  angular
    .module('auth')
    .controller('SignupCtrl', SignupCtrl);

  SignupCtrl.$inject = ['principal' , '$state', '$auth' , '$localStorage', 'authFactory', '$http'];

  function SignupCtrl(principal , $state, $auth, $localStorage, authFactory, $http) {
    var vm = this;

    console.log('signup')

    vm.submit = function () {
      vm.user.password = vm.newPassword;
      console.log(vm.user);
      principal.signup(vm.user).then(function (response) {
        console.log(response);
        $state.go('app.addVideo');

      });

      //satellizer signup

      // $auth.signup({
      //   name: vm.user.name,
      //   email:vm.user.email,
      //   mobile:vm.user.mobile,
      //   password:  vm.user.password
      // }).then(function (response) {
      //
      //   $localStorage.loggedInTimeStamp = Date.now();
      //   authFactory.setUserToken(response.data.token , response.data.user)
      //   //_authenticated = true;
      //   $http.defaults.headers.common['Authorization'] = 'Bearer ' + $localStorage.__identity.token;
      //
      //   console.log(response);
      //   $state.go('app.addVideo');
      // }).catch(handleError)

    };

    // function handleError(err) {
    //   alert('warning', 'Something went wrong :( ', err.message)
    // }


  }
}());

