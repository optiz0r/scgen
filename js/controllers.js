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

    $scope.validation = {
        none: /.*/,
        mtu: /^1(4[6-9]\d|[5-9]\d{2})|[2-8]\d{3}|9([0-1]\d{2}|20\d|21[0-8])$/,
    };
    $scope.validate = function(name) {
        return $scope.validation[name];
    }

    $scope.hosts = {
        remove: function($event, group, host) {
            delete group.values[host];
        },

        add: function($event, group, host, address) {
            group.values[host] = address;
        }
    }

}
//models_controller.$inject = ['$scope', '$http'];

