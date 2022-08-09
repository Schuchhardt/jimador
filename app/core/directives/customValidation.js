export default () => {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (inputValue) {
        var transformedInput = inputValue;
        if (angular.isDefined(inputValue) && inputValue !== "0") {
          transformedInput = _.isNaN( parseInt( _.last(inputValue.split("")) ) ) ?  inputValue.slice(0, -1) + "" : inputValue.substring(0, parseInt(attrs.ngMaxlength));
          transformedInput = parseInt(transformedInput) > parseInt(attrs.maxv) ? attrs.maxv : parseInt(transformedInput) < parseInt(attrs.minv) ? attrs.minv : transformedInput;
          if (transformedInput !== inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }
        }

        return transformedInput;
      });
    }
  };
};
