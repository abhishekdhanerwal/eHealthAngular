
(function () {
  'use strict';

  angular
    .module('app.channel')
    .controller('ChannelListCtrl', ChannelListCtrl);

  ChannelListCtrl.$inject = ['channelListFactory' , 'NgTableParams' , '$filter', '$localStorage'];

  function ChannelListCtrl(channelListFactory , NgTableParams , $filter, $localStorage) {
    var vm = this;

    activate();

    function activate() {

      console.log($localStorage)

      channelListFactory.getList().then(function (response) {
        console.log(response);
        vm.channelList = response.data.data;
        listView();
      })

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
            channelName: '' // initial filter
          }
        },
        {
          getData: function (params) {
            if ( vm.channelList != null) {
              console.log( vm.channelList)
              vm.progress = false;
              var random = (new Date()).toString();
              for (var index = 0; index <  vm.channelList.length; index++) {
                 vm.channelList[index].logoUrl =  vm.channelList[index].logoUrl + "?cb=" + random;
              }
              var filteredData = null;
              var orderedData = null;
              if (params != null) {
                if (params.filter()) {
                  filteredData = $filter('filter')( vm.channelList, params.filter())
                  console.log(filteredData)
                }
                else {
                  filteredData =  vm.channelList;
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
                return  vm.channelList;

              }
            }
          }
        }

      )};

    // vm.breadcrumbRoute = breadcrumbRoute;
    // vm.isAdminRole = role.isAdminRole();
    // vm.isSuperAdminRole = role.isSuperAdminRole();
    // vm.isConsumerRole = role.isConsumerRole();
    // vm.isManagementRole = role.isManagementRole();
    // vm.isCreatorRole = role.isCreatorRole();
    // vm.isMeterManagementRole = role.isMeterManagementRole();
    // vm.isVisitorAdminRole = role.isVisitorAdminRole();
    //
    // function breadcrumbRoute() {
    //   if(vm.isMeterManagementRole) {
    //     $state.go('app.complaint')
    //   }
    //   else if(vm.isCreatorRole || vm.isSuperAdminRole){
    //     $state.go('app.society')
    //   }
    //   else if(vm.isVisitorAdminRole){
    //     $state.go('app.visitor')
    //   }
    //   else{
    //     $state.go('app.notice')
    //   }
    // }

  }
}());

