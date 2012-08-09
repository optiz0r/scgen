angular.module('scgenFilters', []).filter('ioscommand', function() {
    return function(command, context, parameters, negate, indent) {
        return scgen.command(indent, context, command, parameters, negate);
    };
});
