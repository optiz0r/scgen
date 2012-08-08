function model_list_controller($scope) {
    $scope.models = [];

    for (var model in models) {
        $scope.models.push({
            name: model,
            description: models[model].description
        });
    }

}

function model_config_controller($scope) {

}
