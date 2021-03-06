
(function () {
    'use strict';

    angular
        .module('app.dietitian')
        .controller('ListDietitianCtrl', ListDietitianCtrl);

    ListDietitianCtrl.$inject = ['$state' , '$timeout', 'toaster', 'dietitianFactory' , 'NgTableParams' , '$filter' , 'SweetAlert'];

    function ListDietitianCtrl($state , $timeout  , toaster , dietitianFactory , NgTableParams , $filter , SweetAlert) {
        var vm = this;
        vm.product={};
        vm.progress = true;

        vm.breadcrumbRoute = breadcrumbRoute;

        function breadcrumbRoute() {
            $state.go('app.notice')
        }

        activate();

        function activate() {
            findRequiredDietitianList(true)
        };

        vm.getData = function(toggle){
            vm.progress=  true;
            vm.dietitianList = null;
            vm.dietitianListInactive = null;
            findRequiredDietitianList(toggle)
        };

        function findRequiredDietitianList(status) {
            dietitianFactory.findAll(status).then(function (response) {
                console.log(response)
                if (response.status == 200) {
                    if(response.data.data.length>0){
                        toaster.info(response.data.message);
                    }
                    else {
                        toaster.info('Zero record available');
                    }
                    if(status){
                        vm.dietitianList = response.data.data;

                        for (var index = 0; index <  vm.dietitianList.length; index++) {
                            if( vm.dietitianList[index].profilePic != undefined){
                                vm.dietitianList[index].profilePic = __env.dataServerUrl + '/dietitian/' +  vm.dietitianList[index].profilePic;
                                // tableData[index].profilePic = temp;
                            }
                            else
                                vm.dietitianList[index].profilePic = null;
                        }
                    }
                    else{
                        vm.dietitianListInactive = response.data.data;
                        for (var index = 0; index <  vm.dietitianListInactive.length; index++) {
                            if( vm.dietitianListInactive[index].profilePic != undefined){
                                vm.dietitianListInactive[index].profilePic = __env.dataServerUrl + '/dietitian/' +  vm.dietitianListInactive[index].profilePic;
                                // tableData[index].profilePic = temp;
                            }
                            else
                                vm.dietitianListInactive[index].profilePic = null;
                        }
                    }
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
        
        vm.toggleDietitian = function(id){
            console.log(id)
            SweetAlert.swal({
                title: "Are you sure?",
                text: "You want to deactivate this dietitian!",
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
                    dietitianFactory.toggleDietitian(id).then(function (response) {
                        if (response.status == 200) {
                            vm.progress = false;
                            toaster.info('Dietitian deactivated Successfully');
                            $state.reload();
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
            if(vm.dietitianList != undefined)
                tableData = vm.dietitianList;
            else
                tableData = vm.dietitianListInactive;

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
            vm.progress=  false;
            };
    }
}());

