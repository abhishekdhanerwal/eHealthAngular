
(function () {
    'use strict';

    angular
        .module('app.recipe')
        .controller('NewRecipeCtrl', NewRecipeCtrl);

    NewRecipeCtrl.$inject = ['$state', '$timeout', 'toaster', 'recipeFactory' , 'validationHelperFactory'];

    function NewRecipeCtrl($state , $timeout , toaster , recipeFactory , validationHelperFactory) {
        var vm = this;
        vm.recipeIngredientList = [];
        vm.totalEnergy = 0;
        vm.totalFat = 0;
        vm.totalCarbohydrate = 0;
        vm.totalProtein = 0;

        activate();

        function activate() {

            vm.measurementType = ['Spoon', 'Bowl', 'Glass'];
            recipeFactory.getAllIngredients().then(function (response) {
                if (response.status == 200) {
                    vm.ingredientList = response.data.data;
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

        vm.newIngredientList = function (val) {
            var tempArray = [];
            _.each(vm.ingredientList , function (value , key) {
                if(_.includes(value.name, val)){
                    tempArray.push(value)
                }
            })

            if(tempArray.length > 0)
                return tempArray;

        }

        vm.onSelect = function($item, $model, $label) {
            vm.recipeIngredientList.push($item);
                if(!$item.energy)
                    $item.energy = 0;
                if(!$item.fat)
                    $item.fat = 0;
                if(!$item.carbohydrate)
                    $item.carbohydrate = 0;
                if(!$item.protein)
                    $item.protein = 0;

                vm.totalEnergy = vm.totalEnergy + $item.energy;
                vm.totalFat = vm.totalFat + $item.fat;
                vm.totalCarbohydrate = vm.totalCarbohydrate + $item.carbohydrate;
                vm.totalProtein = vm.totalProtein + $item.protein;

        };

        vm.removeRow = function (row) {
            _.remove(vm.recipeIngredientList, function(currentObject) {
                if(currentObject._id === row._id){
                    if(!currentObject.energy)
                        currentObject.energy = 0;
                    if(!currentObject.fat)
                        currentObject.fat = 0;
                    if(!currentObject.carbohydrate)
                        currentObject.carbohydrate = 0;
                    if(!currentObject.protein)
                        currentObject.protein = 0;
                    vm.totalEnergy = vm.totalEnergy - currentObject.energy;
                    vm.totalFat = vm.totalFat - currentObject.fat;
                    vm.totalCarbohydrate = vm.totalCarbohydrate - currentObject.carbohydrate;
                    vm.totalProtein = vm.totalProtein - currentObject.protein;

                    return true;
                }
            });
        }
        vm.hideAlertBox = function () {
            vm.errorMessage = false;
        };

        vm.reset = function () {
            vm.recipeIngredientList = [];
            vm.totalEnergy = 0;
            vm.totalFat = 0;
            vm.totalCarbohydrate = 0;
            vm.totalProtein = 0;
            vm.form.$setPristine();
            vm.form.$setUntouched();
            vm.recipe = {};
            vm.file = null;
            vm.newIngredient = null;
            vm.progress = null;
            vm.hideAlertBox();

        }

        vm.submit = function () {
            if(vm.form.$invalid){
                validationHelperFactory.manageValidationFailed(vm.form);
                vm.errorMessage = 'Validation error';
                return;
            }
            else if(vm.recipeIngredientList.length == 0){
                toaster.error('Ingredients are not present');
                vm.errorMessage = 'Ingredients are not present';
            }
            else {
                console.log(vm.recipe)
                console.log(vm.recipeIngredientList)
                    vm.recipe.energy = vm.totalEnergy;
                    vm.recipe.fat = vm.totalFat;
                    vm.recipe.carbohydrate = vm.totalCarbohydrate;
                    vm.recipe.protein = vm.totalProtein;

                vm.recipe.ingredientList = [];
                _.each(vm.recipeIngredientList , function (value ,key) {
                    var obj = {};
                    if(!value.units || !value.measurement) {
                        toaster.error('Units & Measurement is required');
                        vm.errorMessage = 'Units & Measurement is required';
                    }
                    else {
                        obj.units = value.units;
                        obj.measurement = value.measurement;
                        delete value.units;
                        delete value.measurement;
                        obj.usedIngredients = value;

                        vm.recipe.ingredientList.push(obj);
                    }
                })
                console.log(vm.recipe)
                if(vm.errorMessage != 'Units & Measurement is required'){
                    recipeFactory.createRecipe(vm.recipe).then(function (response) {
                        if (response.status == 200) {
                            toaster.info(response.data.message);
                            $state.go('app.recipe.list');
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

    }
}());

