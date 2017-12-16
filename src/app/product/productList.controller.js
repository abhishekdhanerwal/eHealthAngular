
(function () {
    'use strict';

    angular
        .module('app.product')
        .controller('ListProductCtrl', ListProductCtrl);

    ListProductCtrl.$inject = ['$state' , '$timeout', 'toaster', 'productFactory' , 'NgTableParams' , '$filter' , 'SweetAlert'];

    function ListProductCtrl($state , $timeout  , toaster , productFactory , NgTableParams , $filter , SweetAlert) {
        var vm = this;
        vm.product={};

        vm.breadcrumbRoute = breadcrumbRoute;

        function breadcrumbRoute() {
            $state.go('app.notice')
        }

        activate();

        function activate() {
            productFactory.findAll().then(function (response) {
                console.log(response)
                if (response.status == 200) {
                    if(response.data.data.length>0){
                        toaster.info(response.data.message);
                    }
                    else {
                        toaster.info('Zero record available');
                    }
                    vm.productList = response.data.data;
                    listView();
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
        
        vm.deleteProduct = function(id){
            SweetAlert.swal({
                title: "Are you sure?",
                text: "You want to delete this product!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#4CAF50",
                confirmButtonText: "Yes",
                cancelButton: "#008CBA",
                cancelButtonText: "No",
                closeOnConfirm: true,
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm) {
                    vm.progress = true;
                    productFactory.deleteProduct(id).then(function (response) {
                        if (response.status == 200) {
                            vm.progress = false;
                            $state.reload();
                            toaster.info('Product Deleted Successfully');
                        }
                        else if (response.status == -1) {
                            vm.progress = false;
                            toaster.error('Network Error');
                        }
                        else if (response.status == 404) {
                            vm.progress = false;
                            toaster.error('Client not found');
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
                            vm.progress = false;
                            toaster.error('Backend error');
                        }


                    });

                } else {

                }
            });
        }

        function listView(){
            vm.tableParams = new NgTableParams(
                {
                    page: 1, // show first page
                    count: 5, // count per page
                    sorting: {
                        lastModified: 'desc' // initial sorting
                    }, // count per page
                    filter: {
                        name: '' // initial filter
                    }
                },
                {
                    getData: function (params) {
                        if (vm.productList != null) {
                            // console.log(vm.productList)
                            vm.progress = false;
                            var random = (new Date()).toString();
                            for (var index = 0; index < vm.productList.length; index++) {
                                if(vm.productList[index].image != undefined){
                                    var temp = __env.dataServerUrl + '/product/' + vm.productList[index].image;
                                    vm.productList[index].image = temp;
                                }
                                else
                                    vm.productList[index].image = null;

                            }
                            var filteredData = null;
                            var orderedData = null;
                            if (params != null) {
                                if (params.filter()) {
                                    filteredData = $filter('filter')(vm.productList, params.filter())
                                    console.log(filteredData)
                                }
                                else {
                                    filteredData = vm.productList;
                                }
                                if (params.sorting()) {
                                    orderedData = $filter('orderBy')(filteredData, params.orderBy());
                                }
                                else {
                                    orderedData = filteredData;
                                }

                                params.total(orderedData.length);
                                var returnData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())
                                return returnData;
                            }
                            else {
                                return vm.productList;

                            }
                        }
                    }
                }

            )};
    }
}());

