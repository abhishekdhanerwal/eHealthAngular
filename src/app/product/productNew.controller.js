
(function () {
    'use strict';

    angular
        .module('app.product')
        .controller('NewProductCtrl', NewProductCtrl);

    NewProductCtrl.$inject = ['$state' , 'Upload', 'toaster', 'productFactory', '$timeout' , 'validationHelperFactory' , '$uibModal'];

    function NewProductCtrl($state , Upload  , toaster , productFactory , $timeout , validationHelperFactory , $uibModal) {
        var vm = this;
        vm.product={};

        vm.progress = null;

        vm.breadcrumbRoute = breadcrumbRoute;

        function breadcrumbRoute() {
            $state.go('app.notice')
        }

        vm.hideAlertBox = function () {
            vm.errorMessage = false;
        };

        activate();

        function activate() {
            productFactory.getCategoryList().then(function (response) {
                if (response.status == 200) {
                    vm.categoryList = response.data.data;
                }
                else if (response.status == -1) {
                    vm.errorMessage = 'Network Error';
                    toaster.error('Network Error', 'error');
                    console.error(response);
                }
                else if (response.status == 400) {
                    vm.errorMessage = response.message.error;
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

        vm.populateSubCategory = function () {
            productFactory.getSubCategoryList(vm.category._id).then(function (response) {
                if (response.status == 200) {
                    vm.subCategoryList = response.data.data;
                }
                else if (response.status == -1) {
                    vm.errorMessage = 'Network Error';
                    toaster.error('Network Error', 'error');
                    console.error(response);
                }
                else if (response.status == 400) {
                    vm.errorMessage = response.message.error;
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
                            vm.populateSubCategory();
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

        vm.submit = function () {
            if (vm.form.$invalid) {
                validationHelperFactory.manageValidationFailed(vm.form);
                vm.errorMessage = 'Validation error';
                return;

            }
            else if(!vm.product.pieceInPacket && !vm.product.quantity) {
                console.log(!vm.product.pieceInPacket)
                console.log(vm.product.pieceInPacket)
                console.log(!vm.product.quantity)
                console.log(vm.product.quantity)
                toaster.error('Quantity or pieces per packet is required')
            }
            else {

                if(vm.product.inStock == 'yes')
                    vm.product.inStock = true;
                else
                    vm.product.inStock = false;

                productFactory.addProduct(vm.subCategory._id , vm.product).then(function (response) {
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
                });
             }
        };

        vm.reset = function () {
            vm.form.$setPristine();
            vm.form.$setUntouched();
            vm.product = {};
            vm.file = null;
            vm.progress = null;
            vm.hideAlertBox();
        }

        vm.submitImage = function(){ //function to call on form submit
            if (vm.form.file.$valid && vm.file) { //check if from is valid
                vm.upload(vm.file); //call upload function
            }
        };

        vm.upload = function (file) {
            Upload.upload({
                url: __env.dataServerUrl+'/product/upload', //webAPI exposed to upload the file
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


(function () {
    'use strict';

    angular
        .module('app.product')
        .controller('ProductCategoryCtrl', ["$scope", "$uibModalInstance" , "validationHelperFactory" , function ($scope, $uibModalInstance , validationHelperFactory ) {

            $scope.ok = function () {
                if ($scope.categoryForm.$invalid) {
                    validationHelperFactory.manageValidationFailed($scope.categoryForm);
                    return;

                }
                else
                    $uibModalInstance.close($scope.category);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
}());


(function () {
    'use strict';

    angular
        .module('app.product')
        .controller('SubProductCategoryCtrl', ["$scope", "$uibModalInstance" , "validationHelperFactory" , "categoryList" , function ($scope, $uibModalInstance , validationHelperFactory , categoryList) {

            $scope.category = categoryList.name;

            $scope.ok = function () {
                if ($scope.subCategoryForm.$invalid) {
                    validationHelperFactory.manageValidationFailed($scope.subCategoryForm);
                    return;

                }
                else
                    $uibModalInstance.close($scope.subCategory);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
}());
