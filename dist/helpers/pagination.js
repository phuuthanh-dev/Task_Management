"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var paginationHelper = function (objectPagination, query, countDocuments) {
    if (query.page) {
        objectPagination.page = parseInt(query.page);
    }
    if (query.limit) {
        objectPagination.limit = parseInt(query.limit);
    }
    objectPagination.skip = (objectPagination.page - 1) * objectPagination.limit;
    objectPagination.totalPages = Math.ceil(countDocuments / objectPagination.limit);
    return objectPagination;
};
exports.default = paginationHelper;
