/**
 * model utils module.
 * @module utils/model-utils
 */
"use strict";
var inflection = require('inflection');
/**
 * class to handle utility function for Mongoose models
 */
var ModelUtils = (function () {
    /**
     * @param  {Model} Mongoose model
     * @return {Void}
     */
    function ModelUtils(Model) {
        this.Model = Model;
        this.Model = Model;
    }
    Object.defineProperty(ModelUtils.prototype, "dashSingularName", {
        /**
         * convert the model name to the singular dasherized name
         * @return {string} the singular dasherized model name
         */
        get: function () {
            var dashSingularName = inflection.transform(this.Model.modelName, ['underscore', 'dasherize', 'singularize']).toLowerCase();
            return dashSingularName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelUtils.prototype, "dashPluralName", {
        /**
         * convert the model name to the plural dasherized name
         * @return {string} the plural dasherized model name
         */
        get: function () {
            var dashSingularName = inflection.transform(this.Model.modelName, ['underscore', 'dasherize', 'pluralize']).toLowerCase();
            return dashSingularName;
        },
        enumerable: true,
        configurable: true
    });
    return ModelUtils;
}());
exports.ModelUtils = ModelUtils;
//# sourceMappingURL=model-utils.js.map