"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactType = exports.ProductAttributesEnum = exports.UserStatus = void 0;
var UserStatus;
(function (UserStatus) {
    UserStatus["Active"] = "ACTIVE";
    UserStatus["Suspended"] = "SUSPENDED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var ProductAttributesEnum;
(function (ProductAttributesEnum) {
    ProductAttributesEnum["Storage"] = "storage";
    ProductAttributesEnum["Color"] = "color";
})(ProductAttributesEnum || (exports.ProductAttributesEnum = ProductAttributesEnum = {}));
var ContactType;
(function (ContactType) {
    ContactType["Partner"] = "Partner";
    ContactType["Complaint"] = "Complaint";
})(ContactType || (exports.ContactType = ContactType = {}));
