
(function () {
    'use strict';

    angular
        .module('app.coupon')
        .controller('NewCouponCtrl', NewCouponCtrl);

    NewCouponCtrl.$inject = ['$state' , 'Upload', 'toaster', 'couponFactory', '$timeout' , 'validationHelperFactory' , 'USER_ROLE' , 'productFactory'];

    function NewCouponCtrl($state , Upload  , toaster , couponFactory , $timeout , validationHelperFactory , USER_ROLE , productFactory) {
        var vm = this;
        vm.couponView={};
        vm.couponView.coupon = {};

        vm.viewForm = false;

        vm.breadcrumbRoute = breadcrumbRoute;

        function breadcrumbRoute() {
            $state.go('app.notice')
        }

        activate ();

        function activate() {
            productFactory.getCategoryList().then(function (response) {
                if (response.status == 200) {
                    vm.categoryDropDownList = response.data.data;
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
            console.log(vm.type)
            if(vm.type == 'productSubCategory')
            vm.viewForm = false;
            else
                vm.viewForm = true;
            productFactory.getSubCategoryList(vm.couponView.productCategory._id).then(function (response) {
                if (response.status == 200) {
                    vm.subCategoryDropDownList = response.data.data;
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

        vm.generateCouponCode = function () {
            couponFactory.generateCode().then(function (response) {
                if (response.status == 200) {
                    vm.couponView.coupon.couponCode = response.data.code;
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

        vm.hideForm = function () {
            vm.viewForm = false;
            console.log(vm.type == 'productSubCategory')
            console.log(vm.couponView.productSubCategory)
            console.log(vm.type)
            if(vm.type == 'productSubCategory' && vm.couponView.productSubCategory)
                vm.viewForm = true;
        }

        vm.generateDropDownData = function () {
            vm.viewForm = false;
            getDropDownList(vm.type);

        };

        vm.dietitianPic = function () {
            console.log(vm.couponView.dietitian)
            if(vm.couponView.dietitian.profilePic && vm.couponView.dietitian.profilePic.split('dietitian').length<2)
                vm.couponView.dietitian.profilePic = __env.dataServerUrl+ '/dietitian/' + vm.couponView.dietitian.profilePic;
            vm.viewForm = true;

        };

        function getDropDownList(type) {
            couponFactory.findAll(type, true).then(function (response) {
                if (response.status == 200) {
                    vm.dropDownList = [];
                    for(var index=0; index<response.data.data.length;index++){
                        if(!response.data.data[index].couponId)
                            vm.dropDownList.push(response.data.data[index]);
                    }
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

        vm.computeDiscountedPrice = function () {
            if(vm.type == 'dietitian'){
                if(vm.discount.discountPercentage)
                    vm.discount.discountPrice = vm.couponView.dietitian.price - (vm.discount.discountPercentage*vm.couponView.dietitian.price/100);
                else
                    vm.discount.discountPrice = vm.couponView.dietitian.price - vm.discount.discountFixed;
            }
        };

        vm.submit = function () {
            if (vm.form.$invalid) {
                validationHelperFactory.manageValidationFailed(vm.form);
                vm.errorMessage = 'Validation error';
                return;

            } else {

                if(vm.type == 'dietitian'){
                    if(vm.couponView.dietitian.profilePic != null && vm.couponView.dietitian.profilePic.split('dietitian').length>1)
                        vm.couponView.dietitian.profilePic = vm.couponView.dietitian.profilePic.split('/')[vm.couponView.dietitian.profilePic.split('/').length-1];
                }
                if(vm.type == 'dietitian') {
                    vm.couponView.dietitian.discount.push(vm.discount);
                }
                else
                    vm.couponView.discount = vm.discount;
                console.log(vm.type)
                console.log(vm.couponView)

                couponFactory.updateCoupon(vm.type, vm.couponView).then(function (response) {
                    if (response.status == 200) {
                        toaster.info(response.data.message);
                        $state.go('app.coupon.list');
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
            if(vm.couponView.dietitian != null)
            vm.couponView.dietitian.discountPrice = null;
            vm.couponView.dietitian = {};
            vm.couponView = {};
            vm.file = null;
            vm.progress = null;
            vm.errorMessage = null;
            vm.type = null;
            $state.reload();
        }
    }
}());

