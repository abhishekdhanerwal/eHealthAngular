
(function () {
  'use strict';

  angular
    .module('app.channel')
    .controller('NewVideoCtrl', NewVideoCtrl);

  NewVideoCtrl.$inject = ['newVideoFactory' , 'Upload', '$window'];

  function NewVideoCtrl(newVideoFactory , Upload , $window) {
    var vm = this;

    vm.pushData = function () {
      newVideoFactory.addNewChannel(vm.name).then(function (response) {
        console.log(response)
      })
    };

    vm.submit = function(){ //function to call on form submit
      if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
        vm.upload(vm.file); //call upload function
      }
    }
    vm.upload = function (file) {
      Upload.upload({
        url: 'http://localhost:8080/upload', //webAPI exposed to upload the file
        data:{file:file} //pass file as data, should be user ng-model
      }).then(function (resp) { //upload function returns a promise
        if(resp.data.error_code === 0){ //validate success
          $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
        } else {
          $window.alert('an error occured');
        }
      }, function (resp) { //catch error
        console.log('Error status: ' + resp.status);
        $window.alert('Error status: ' + resp.status);
      }, function (evt) {
        console.log(evt);
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
      });
    };

    // vm.submit = function(){
    //   console.log(vm.channel);
    //   newVideoFactory.addNewChannel(vm.channel).then(function (response) {
    //     console.log(response)
    //   })
    // };



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

