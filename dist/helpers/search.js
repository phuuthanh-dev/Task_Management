"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var searchHelper = function (query) {
    var objectSearch = {
        keyword: ""
    };
    if (query.keyword) {
        objectSearch.keyword = query.keyword;
        var regex = new RegExp(objectSearch.keyword, "i");
        objectSearch.regex = regex;
    }
    return objectSearch;
};
exports.default = searchHelper;
