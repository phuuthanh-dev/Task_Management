interface ObjectPagination {
    limit: number,
    page: number,
    skip?: number,
    totalPages?: number
}

const paginationHelper = (objectPagination: ObjectPagination, query: Record<string, any>, countDocuments: number): ObjectPagination => {
    if (query.page) {
        objectPagination.page = parseInt(query.page);
    }

    if (query.limit) {
        objectPagination.limit = parseInt(query.limit);
    }

    objectPagination.skip = (objectPagination.page - 1) * objectPagination.limit;

    objectPagination.totalPages = Math.ceil(countDocuments / objectPagination.limit);
    
    return objectPagination;
}

export default paginationHelper;