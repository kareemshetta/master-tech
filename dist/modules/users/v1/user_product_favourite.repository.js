"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const user_products_favourite_model_1 = __importDefault(require("../../../models/user_products_favourite.model"));
class UserProductFavouriteRepo extends baseRepository_1.BaseRepository {
    constructor() {
        super(user_products_favourite_model_1.default);
    }
    static getInstance() {
        if (!UserProductFavouriteRepo.instance) {
            UserProductFavouriteRepo.instance = new UserProductFavouriteRepo();
        }
        return UserProductFavouriteRepo.instance;
    }
}
UserProductFavouriteRepo.instance = null;
exports.default = UserProductFavouriteRepo;
