
(function () {
    'use strict';

    angular
        .module('app.dietitianUser')
        .controller('DietitianUsersCtrl', DietitianUsersCtrl);

    DietitianUsersCtrl.$inject = ['$state' , '$timeout', 'toaster', 'dietitanUserFactory' , 'NgTableParams' , '$filter' , 'SweetAlert' , '$uibModal' , '$localStorage' , 'recipeFactory'];

    function DietitianUsersCtrl($state , $timeout  , toaster , dietitanUserFactory , NgTableParams , $filter , SweetAlert , $uibModal , $localStorage , recipeFactory) {
        var vm = this;
        vm.product={};

        vm.currentDate = new Date();

        vm.viewType = 'new';

        vm.breadcrumbRoute = breadcrumbRoute;

        function breadcrumbRoute() {
            $state.go('app.notice')
        }

        activate();

        function activate() {
            findRequiredDietitianList()

            recipeFactory.findAllRecipe().then(function (response) {
                console.log(response)
                if (response.status == 200) {
                    if(response.data.data.length>0){
                        vm.ingredientList = response.data.data;
                        // toaster.info(response.data.message);
                    }
                    else {
                        vm.ingredientList = [{'name':'No Recipes Available'}];
                        // toaster.info('Zero record available');
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

            vm.clientData = [
                'Breakfast',
                'Lunch',
                'Dinner'
            ];

            vm.startOpen = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                vm.endOpened = false;
                vm.startOpened = !vm.startOpened;
            };

            vm.startDateOption = {
                showWeeks: false,
                maxDate: vm.end,
                minDate: new Date(1970, 12, 31),
                startingDay: 1
            };
            vm.endDateOption = {
                showWeeks: false,
                maxDate: new Date(2020, 5, 22),
                minDate: vm.start,
                startingDay: 1
            };
        };

        vm.getData = function(status){
            vm.viewType = status;
            vm.dietitianList = null;
            console.log(vm.viewType)
            findRequiredDietitianList()
        };

        function findRequiredDietitianList() {
            dietitanUserFactory.findAll().then(function (response) {
                console.log(response)
                if (response.status == 200) {
                    if(response.data.data.length>0){
                        // toaster.info(response.data.message);
                    }
                    else {
                        // toaster.info('Zero record available');
                    }
                    vm.dietitianList = response.data.data;
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

        vm.items = ['item1', 'item2', 'item3'];

        vm.open = function (dietitian , userDetail) {
            var modalObject = {};
            modalObject.dietitian = dietitian;
            modalObject.viewType = vm.viewType;

            if(vm.viewType == 'new') {
                var modalInstance = $uibModal.open({
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    resolve: {
                        dietitian: function () {
                            return dietitian;
                        }
                    }
                });
            }
            else {
                var modalInstance = $uibModal.open({
                    templateUrl: 'myModalConfirmedContent.html',
                    controller: 'ModalInstanceCtrl',
                    resolve: {
                        dietitian: function () {
                            return dietitian;
                        }
                    }
                });
            }

            modalInstance.result.then(function (selectedItem) {
                if(vm.viewType == 'new') {
                    var send = {};
                    send.dietitianId = dietitian.dietitianId._id;
                    send.active = selectedItem;
                    send.feesSchedule = angular.copy(dietitian.feesSchedule);
                        var temp = {};
                        temp.paymentSuccessOn = new Date();
                        temp.paymentSuccessOn.setHours(0,0,0,0);
                        temp.lastDateOfWork = new Date();
                        temp.lastDateOfWork.setHours(24,0,0,0);
                        temp.lastDateOfWork.setMonth(temp.lastDateOfWork.getMonth()+1);
                    send.feesSchedule.push(temp);

                    console.log(send)
                    console.log(selectedItem)

                    dietitanUserFactory.updateDietitianOfUser(userDetail.userId._id, send).then(function (response) {
                        console.log(response);
                        if (response.status == 200) {
                            vm.progress = false;
                            $state.reload();
                            toaster.info('User updated Successfully');
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
                    })
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

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
                    dietitanUserFactory.toggleDietitian(id).then(function (response) {
                        if (response.status == 200) {
                            vm.progress = false;
                            $state.reload();
                            toaster.info('Dietitian deactivated Successfully');
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

                tableData = vm.dietitianList;

            if(vm.viewType == 'new') {
                _.each(tableData, function (value, key) {
                    var count = 0;
                    _.each(value.hiredDietitians, function (value, key) {
                        if (value.active)
                            count++;
                    });
                    if (count == value.hiredDietitians.length) {
                        _.remove(tableData, value);
                    }
                });
            }
            else if (vm.viewType == 'confirmed') {
                _.each(tableData, function (value, key) {
                    var count = 0;
                    _.each(value.hiredDietitians, function (value, key) {
                        if (value.active && value.feesSchedule[value.feesSchedule.length-1].lastDateOfWork > new Date())
                            count++;
                    });
                    if (count == value.hiredDietitians.length) {
                        _.remove(tableData, value);
                    }
                });
            }
            else {
            _.each(tableData, function (value, key) {
                    var count = 0;
                    _.each(value.hiredDietitians, function (value, key) {
                        if (value.active && value.feesSchedule[value.feesSchedule.length-1].lastDateOfWork < new Date())
                            count++;
                    });
                    if (count == value.hiredDietitians.length) {
                        _.remove(tableData, value);
                    }
                });
            }

            if(tableData.length == 0)
                // toaster.info('No data available');


            vm.tableParams = new NgTableParams(
                {
                    page: 1, // show first page
                    count: 5 // count per page
                },
                {
                    getData: function (params) {
                        if (tableData != null) {
                            // console.log(tableData)
                            vm.progress = false;
                            var random = (new Date()).toString();
                            for (var index = 0; index < tableData.length; index++) {
                                if(tableData[index].profilePic != undefined){
                                    tableData[index].profilePic = __env.dataServerUrl + '/dietitian/' + tableData[index].profilePic;
                                    // tableData[index].profilePic = temp;
                                }
                                else
                                    tableData[index].profilePic = null;

                            }
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