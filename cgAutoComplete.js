var app = angular.module('cgAutoComplete', []);

app.factory("AutoCompleteService", ["$http", function ($http) { 
    return {
        search: function (term, route, params) {
            var parParams = params || null;
            data = '{searchModel: { term:"' + term + '", parentParams:' + parParams + '}}';
            return $http.post(route, data).then(function (response) { 
                return response.data;
            });
        }
    };
}]);


app.directive("cgAutocomplete", ["AutoCompleteService", function (AutoCompleteService) {
    return {
        //restrict: "A",  
        link: function (scope, elem, attr, ctrl) {
            elem.autocomplete({
                source: function (searchTerm, response) {
                    AutoCompleteService.search(searchTerm.term, scope.autoCompleteRoute, angular.toJson(scope.parentParams)).then(function (autocompleteResults) {
                        response(autocompleteResults) 
                    });
                },
                minLength: 2,
                focus: function (event, ui) {   
                    event.preventDefault();
                    $(this).val(ui.item.label);
                },
                select: function (event, selectedItem) {
                    scopeval = $(this);
                    scope[scopeval] = selectedItem.item.label;   
                    scope.$apply();
                    event.preventDefault();
                }
            });
        }
    };
}]);
