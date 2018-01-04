(function () {
    'use strict';

    angular
        .module('app.ingredient')
        .controller('EditIngredientCtrl', EditIngredientCtrl);

    EditIngredientCtrl.$inject = ['$state', '$stateParams', '$timeout', 'toaster', 'ingredientFactory' , 'validationHelperFactory'];

    function EditIngredientCtrl($state ,$stateParams , $timeout , toaster , ingredientFactory , validationHelperFactory) {
        var vm = this;

        activate();

        function activate() {
            ingredientFactory.getIngredient($stateParams.id).then(function (response) {
                vm.ingredient = response.data.data;
            })
        }

        vm.reset = function () {
            activate();
        }

        vm.submit = function () {
            if (vm.form.$invalid) {
                validationHelperFactory.manageValidationFailed(vm.form);
                vm.errorMessage = 'Validation error';
                return;

            } else {
                ingredientFactory.addNew(vm.ingredient).then(function (response) {
                    if (response.status == 200) {
                        toaster.info(response.data.message);
                        $state.go('app.ingredient.list');
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
        }

    }
}());

