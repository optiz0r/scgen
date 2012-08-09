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
        ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
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
        },

        command: function(host, address) {
            return host + ' ' + address;
        }
    }

    $scope.routes = {
        remove: function($event, group, index) {
            group.values.splice(index, 1);
        },

        add: function($event, group, subnet, mask, gateway) {
            group.values.push({subnet: subnet, mask: mask, gateway: gateway});
        },

        command: function(subnet, mask, gateway) {
            return subnet + ' ' + mask + ' ' + gateway;
        }
    }

}
//models_controller.$inject = ['$scope', '$http'];

