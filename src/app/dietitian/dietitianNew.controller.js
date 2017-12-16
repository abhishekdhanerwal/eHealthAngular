
(function () {
    'use strict';

    angular
        .module('app.dietitian')
        .controller('NewDietitianCtrl', NewDietitianCtrl);

    NewDietitianCtrl.$inject = ['$state' , 'Upload', 'toaster', 'dietitianFactory', '$timeout' , 'validationHelperFactory' , 'USER_ROLE'];

    function NewDietitianCtrl($state , Upload  , toaster , dietitianFactory , $timeout , validationHelperFactory , USER_ROLE) {
        var vm = this;
        vm.dietitian={};
        vm.dietitian.discount = 0;

        vm.breadcrumbRoute = breadcrumbRoute;

        function breadcrumbRoute() {
            $state.go('app.notice')
        }

        vm.computeDiscountedPrice = function () {
            if(vm.dietitian.discount == undefined)
                vm.dietitian.discountPrice = vm.dietitian.price;
            else
            vm.dietitian.discountPrice = vm.dietitian.price - (vm.dietitian.discount*vm.dietitian.price/100);
        };

        vm.submit = function () {
            if (vm.form.name.$invalid) {
                validationHelperFactory.manageValidationFailed(vm.form);
                vm.errorMessage = 'Validation error';
                return;

            } else {
                if(vm.dietitian.discount == undefined)
                    vm.dietitian.discount = 0;

                vm.dietitian.role = USER_ROLE.ROLE_DIETITIAN;

                console.log(vm.dietitian)
                dietitianFactory.addDietitian(vm.dietitian).then(function (response) {
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

        vm.reset = function () {
            vm.form.$setPristine();
            vm.form.$setUntouched();
            vm.dietitian = {};
            vm.file = null;
            vm.progress = null;
            vm.dietitian.discount = 0;
            vm.errorMessage = null;
        }

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
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };
    }
}());

