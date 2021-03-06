
(function () {
    'use strict';

    angular
        .module('app.recipe')
        .controller('EditRecipeCtrl', EditRecipeCtrl);

    EditRecipeCtrl.$inject = ['$state' , '$stateParams', 'Upload', 'toaster', 'recipeFactory', '$timeout' , 'validationHelperFactory' , '$uibModal'];

    function EditRecipeCtrl($state , $stateParams, Upload  , toaster , recipeFactory , $timeout , validationHelperFactory , $uibModal) {
        var vm = this;
        vm.product={};

        vm.progressLoader = true;

        vm.breadcrumbRoute = breadcrumbRoute;

        function breadcrumbRoute() {
            $state.go('app.notice')
        }

        vm.hideAlertBox = function () {
            vm.errorMessage = false;
        };

        activate();

        function activate() {
            recipeFactory.getRecipe($stateParams.id).then(function (response) {
                if (response.status == 200) {
                    console.log(response)
                    vm.recipe = response.data.data;

                    if(response.data.data.image)
                        vm.file = __env.dataServerUrl + '/recipe/'+ response.data.data.image;

                    vm.progressLoader = false;
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

        vm.open = function (item) {
            vm.errorMessage = false;

            if(item == 'category'){
                var modalInstance = $uibModal.open({
                    templateUrl: 'addProductCategory.html',
                    controller: 'ProductCategoryCtrl'
                });
            }
            else {
                var modalInstance = $uibModal.open({
                    templateUrl: 'addProductSubCategory.html',
                    controller: 'SubProductCategoryCtrl',
                    resolve: {
                        categoryList: function () {
                            return vm.category;
                        }
                    }
                });
            }

            modalInstance.result.then(function (selectedItem) {
                console.log(selectedItem)
                if(item == 'category') {
                    productFactory.addCategory(selectedItem).then(function (response) {
                        if (response.status == 200) {
                            activate();
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
                else {
                    productFactory.addSubCategory(vm.category , selectedItem).then(function (response) {
                        if (response.status == 200) {
                            generateSubCategoryList();
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
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        vm.reset = function(){
            vm.progressLoader = true;
            activate();
            vm.hideAlertBox();
        };

        vm.submit = function () {
            if (vm.form.$invalid) {
                validationHelperFactory.manageValidationFailed(vm.form);
                vm.errorMessage = 'Validation error';
                return;

            } else {
                vm.product.subCategory = vm.subCategory._id;
                productFactory.updateProduct(vm.product).then(function (response) {
                    if (response.status == 200) {
                        toaster.info(response.data.message);
                        $state.go('app.product.list');
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
                url: __env.dataServerUrl+'/upload', //webAPI exposed to upload the file
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (resp) {
                console.log(resp)
                // console.log(resp)//upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    // $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                    vm.product.image = resp.data.file.filename;
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

