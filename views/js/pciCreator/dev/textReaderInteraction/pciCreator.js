/*global define*/
define([
    './creator/widget/Widget',
    'taoQtiItem/qtiCreator/editor/customInteractionRegistry',
    'tpl!./runtime/tpl/markup',
    'css!textReaderInteraction/runtime/css/textReaderInteraction'
], function (Widget, registry, markupTpl) {
    'use strict';
    var _typeIdentifier = 'textReaderInteraction';

    return {
        /**
         * (required) Get the typeIdentifier of the custom interaction
         * 
         * @returns {String}
         */
        getTypeIdentifier : function () {
            return _typeIdentifier;
        },
        /**
         * (required) Get the widget prototype
         * Used in the renderer
         * 
         * @returns {Object} Widget
         */
        getWidget : function () {
            return Widget;
        },
        /**
         * (optional) Get the default properties values of the pci.
         * Used on new pci instance creation
         * 
         * @returns {Object}
         */
        getDefaultProperties : function (pci) {
            return {
                pageHeight: 200,
                tabsPosition: 'top',
                navigation: 'both',
                pages: [
                    {label : 'Page 1', content : ['page 1 column 1'], id : 0}, 
                    {label : 'Page 2', content : ['page 2 column 1', 'page 2 column 2'], id : 1},
                    {label : 'Page 3', content : ['page 3 column 1', 'page 3 column 2', 'page 3 column 3'], id : 2}
                ],
                buttonLabels : {
                    prev : 'Previous',
                    next : 'Next'
                },
                onePageNavigation : true
            };
        },
        /**
         * (optional) Callback to execute on the 
         * Used on new pci instance creation
         * 
         * @returns {Object}
         */
        afterCreate : function (pci) {
            
        },
        /**
         * (required) Gives the qti pci xml template 
         * 
         * @returns {function} handlebar template
         */
        getMarkupTemplate : function () {
            return markupTpl;
        },
        /**
         * (optional) Allows passing additional data to xml template
         * 
         * @returns {function} handlebar template
         */
        getMarkupData : function (pci, defaultData) {
            return defaultData;
        }
    };
});