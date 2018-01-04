
(function () {
    'use strict';

    angular
        .module('app.coupon')
        .controller('ListCouponCtrl', ListCouponCtrl);

    ListCouponCtrl.$inject = ['$state' , '$timeout', 'toaster', 'couponFactory' , 'NgTableParams' , '$filter' , 'SweetAlert'];

    function ListCouponCtrl($state , $timeout  , toaster , couponFactory , NgTableParams , $filter , SweetAlert) {
        var vm = this;
        vm.product={};

        vm.breadcrumbRoute = breadcrumbRoute;

        function breadcrumbRoute() {
            $state.go('app.notice')
        }

        activate(true);

        function activate(status) {
            couponFactory.findCouponList(status).then(function (response) {
                console.log(response)
                if (response.status == 200) {
                    if(response.data.data.length>0){
                        toaster.info(response.data.message);
                    }
                    else {
                        toaster.info('Zero record available');
                    }
                        vm.couponList = response.data.data;
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
        };

        vm.getData = function (status) {
            activate(status)
        };

        vm.toggleStatus = function(id){
            console.log(id)
            SweetAlert.swal({
                title: "Are you sure?",
                text: "You want to change the status of this coupon!",
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
                    couponFactory.toggleCoupon(id).then(function (response) {
                        if (response.status == 200) {
                            vm.progress = false;
                            $state.reload();
                            toaster.info('Coupon deactivated Successfully');
                        }
                        else if (response.status == -1) {
                            vm.progress = false;
                            toaster.error('Network Error');
                        }
                        else if (response.status == 404) {
                            vm.progress = false;
                            toaster.error('Dietitian not found');
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
            var tableData = null;
            tableData = vm.couponList;

                vm.tableParams = new NgTableParams(
                    {
                        page: 1, // show first page
                        count: 25, // count per page
                        sorting: {
                            lastModified: 'desc' // initial sorting
                        }, // count per page
                        filter: {
                            couponCode: '' // initial filter
                        }
                    },
                    {
                        getData: function (params) {
                            if (tableData != null) {
                                // console.log(tableData)
                                vm.progress = false;
                                var random = (new Date()).toString();
                                var filteredData = null;
                                var orderedData = null;
                                if (params != null) {
                                    if (params.filter()) {
                                        filteredData = $filter('filter')(tableData, params.filter())
                                        console.log(filteredData)
                                    }
                                    else {
                                        filteredData = tableData;
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
                                    return tableData;

                                }
                            }
                        }
                    }

                )
            };
    }
}());

