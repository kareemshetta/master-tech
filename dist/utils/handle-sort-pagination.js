"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSort = exports.handlePaginationSort = void 0;
const handlePaginationSort = (query) => {
    let pageNumber = Number(query.pageNumber);
    let limit = Number(query.limit);
    let order = query.order;
    let orderBy = query.orderBy;
    if (!pageNumber || pageNumber < 1) {
        pageNumber = 1;
    }
    if (!limit || limit < 1) {
        limit = 10;
    }
    const offset = (pageNumber - 1) * limit;
    if (order == "ASC" || order == "asc") {
        order = "ASC";
    }
    else {
        order = "DESC";
    }
    orderBy == null ? (orderBy = "createdAt") : (orderBy = orderBy);
    return { order, offset, orderBy, limit, skip: offset };
};
exports.handlePaginationSort = handlePaginationSort;
const handleSort = (query) => {
    const { order } = query;
    if (order == null)
        return [["createdAt", "desc"]];
    const orders = [];
    order.split(",").forEach((ord) => {
        const sign = ord[0];
        let orderBy = "";
        if (sign !== "-") {
            orderBy = ord;
        }
        else {
            orderBy = ord.substring(1, ord.length);
        }
        if (sign === "-")
            orders.push([orderBy, "desc"]);
        else
            orders.push([orderBy, "asc"]);
    });
    return orders;
};
exports.handleSort = handleSort;
