
(function () {
    'use strict';

    angular
        .module('app.myProfile')
        .controller('MyProfileCtrl', MyProfileCtrl);

    MyProfileCtrl.$inject = ['$state' , '$localStorage', 'Upload', 'toaster', 'profileFactory', '$timeout' , 'validationHelperFactory'];

    function MyProfileCtrl($state , $localStorage, Upload  , toaster , profileFactory , $timeout , validationHelperFactory) {
        var vm = this;
        vm.product={};

        vm.breadcrumbRoute = breadcrumbRoute;

        function breadcrumbRoute() {
            $state.go('app.notice')
        }

        activate();

        function activate() {
            profileFactory.getUser($localStorage.__identity.user._id).then(function (response) {
                console.log(response)
                if (response.status == 200) {
                    vm.user = response.data.user;
                    if(response.data.user.profilePic)
                        vm.file = __env.dataServerUrl + '/user/'+ response.data.user.profilePic;
                    else
                        vm.file = null;
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
            })
        }

        vm.reset = function(type){
            if(type == 'password'){
                vm.password = null;
                vm.newPassword = null;
                vm.password2 = null;
                vm.passwordForm.$setPristine();
                vm.passwordForm.$setUntouched();
            }
            else
                activate();
        };

        vm.submitPassword = function () {
            if (vm.passwordForm.$invalid) {
                validationHelperFactory.manageValidationFailed(vm.passwordForm);
                vm.errorMessage = 'Validation error';
                return;

            } else {
                var password = {};
                password.password = vm.password;
                password.newPassword = vm.newPassword;

                profileFactory.updatePassword($localStorage.__identity.user._id ,password).then(function (response) {
                    if (response.status == 200) {
                        toaster.info(response.data.message);
                        $timeout(function () {
                            $state.go('logout');
                        },2000);
                    }
                    else if (response.status == -1) {
                        vm.errorMessage = 'Network Error';
                        toaster.error('Network Error', 'error');
                        console.error(response);
                    }
                    else if (response.status == 400) {
                        vm.errorMessage = response.data.message;
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
                })
            }
        };

        vm.submit = function () {
            if (vm.form.$invalid) {
                validationHelperFactory.manageValidationFailed(vm.form);
                vm.errorMessage = 'Validation error';
                return;

            } else {

                profileFactory.updateUser($localStorage.__identity.user._id ,vm.user).then(function (response) {
                    if (response.status == 200) {
                        $localStorage.__identity.user = vm.user;
                        toaster.info(response.data.message);
                        $state.reload();
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
                url: __env.dataServerUrl+'/user/upload', //webAPI exposed to upload the file
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (resp) {
                console.log(resp)
                // console.log(resp)//upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    // $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                    vm.user.profilePic = resp.data.file.filename;
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

