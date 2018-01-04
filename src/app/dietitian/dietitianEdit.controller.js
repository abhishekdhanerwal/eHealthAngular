
(function () {
    'use strict';

    angular
        .module('app.dietitian')
        .controller('EditDietitianCtrl', EditDietitianCtrl);

    EditDietitianCtrl.$inject = ['$state' , '$stateParams', 'Upload', 'toaster', 'dietitianFactory', '$timeout' , 'validationHelperFactory'];

    function EditDietitianCtrl($state , $stateParams, Upload  , toaster , dietitianFactory , $timeout , validationHelperFactory) {
        var vm = this;
        vm.dietitian={};
        vm.progress = true;

        vm.breadcrumbRoute = breadcrumbRoute;

        function breadcrumbRoute() {
            $state.go('app.notice')
        }

        vm.hideAlertBox = function () {
            vm.errorMessage = false;
        };

        activate();

        function activate() {
            dietitianFactory.getDietitian($stateParams.id).then(function (response) {
                console.log(response)
                vm.dietitian = response.data.data;
                if(response.data.data.profilePic)
                    vm.file = __env.dataServerUrl + '/dietitian/'+ response.data.data.profilePic;

                vm.progress = false;
            })
        }

        vm.reset = function(){
            vm.progress = true;
            activate();
            vm.hideAlertBox();
        };

        vm.submit = function () {
            if (vm.form.$invalid) {
                validationHelperFactory.manageValidationFailed(vm.form);
                vm.errorMessage = 'Validation error';
                return;

            } else {
                if(vm.dietitian.discount == undefined)
                    vm.dietitian.discount=0;
                dietitianFactory.updateDietitian(vm.dietitian).then(function (response) {
                    if (response.status == 200) {
                        toaster.info(response.data.message);
                        $state.go('app.dietitian.list');
                    }
                    else if (response.status == -1) {
                        vm.errorMessage = 'Network Error';
                        toaster.error('Network Error', 'error');
                        console.error(response);
                    }
                    else if (response.status == 400) {
                        vm.errorMessage = response.data.error.join();
                        toaster.error(response.data.message, 'error');
                        console.error(response);
                    }
                    else if (response.status == 401) {
                        vm.errorMessage = response.data.message;
                        toaster.error('Login Again !! You have been logged out');
                        console.error(response);
                        $timeout(function () {
                            $state.go('logout')
                        }, 2000);
                    }
                    else {
                        vm.errorMessage = 'Some problem';
                        toaster.error('Some problem', 'error');
                        console.error(response);
                    }
                });
            }
        };

        vm.submitImage = function(){ //function to call on form submit
            if (vm.form.file.$valid && vm.file) { //check if from is valid
                vm.upload(vm.file); //call upload function
            }
        };

        vm.upload = function (file) {
            Upload.upload({
                url: __env.dataServerUrl+'/dietitian/upload', //webAPI exposed to upload the file
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (resp) {
                console.log(resp)
                // console.log(resp)//upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    // $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                    vm.dietitian.profilePic = resp.data.file.filename;
                } else {
                    toaster.error('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                toaster.error('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progressImage = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };
    }
}());

