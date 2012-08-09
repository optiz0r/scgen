function models_controller($scope, $http) {
    $scope.models = [];
    $scope.selected_model = undefined;

    $http.get('configs/models.json').success(function(data) {
        $scope.models = data;
        $scope.selected_model = $scope.models.length > 0 ? $scope.models[0] : undefined;
    });

    $scope.nothidden = function(input) {
        return input.hidden != true;
    }

}
//models_controller.$inject = ['$scope', '$http'];

