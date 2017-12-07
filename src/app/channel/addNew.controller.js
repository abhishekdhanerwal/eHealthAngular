
(function () {
  'use strict';

  angular
    .module('app.channel')
    .controller('NewVideoCtrl', NewVideoCtrl);

  NewVideoCtrl.$inject = ['newVideoFactory'];

  function NewVideoCtrl(newVideoFactory) {
    var vm = this;

    vm.pushData = function () {
      newVideoFactory.addNewChannel(vm.name).then(function (response) {
        console.log(response)
      })
    };

    vm.submit = function(){
      console.log(vm.channel);
      newVideoFactory.addNewChannel(vm.channel).then(function (response) {
        console.log(response)
      })
    };

    // vm.breadcrumbRoute = breadcrumbRoute;
    // vm.isAdminRole = role.isAdminRole();
    // vm.isSuperAdminRole = role.isSuperAdminRole();
    // vm.isConsumerRole = role.isConsumerRole();
    // vm.isManagementRole = role.isManagementRole();
    // vm.isCreatorRole = role.isCreatorRole();
    // vm.isMeterManagementRole = role.isMeterManagementRole();
    // vm.isVisitorAdminRole = role.isVisitorAdminRole();
    //
    // function breadcrumbRoute() {
    //   if(vm.isMeterManagementRole) {
    //     $state.go('app.complaint')
    //   }
    //   else if(vm.isCreatorRole || vm.isSuperAdminRole){
    //     $state.go('app.society')
    //   }
    //   else if(vm.isVisitorAdminRole){
    //     $state.go('app.visitor')
    //   }
    //   else{
    //     $state.go('app.notice')
    //   }
    // }

  }
}());

