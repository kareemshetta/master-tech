"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const categories_model_1 = __importDefault(require("../../../models/categories.model"));
class CategoryRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(categories_model_1.default);
    }
    static getInstance() {
        if (!CategoryRepository.instance) {
            CategoryRepository.instance = new CategoryRepository();
        }
        return CategoryRepository.instance;
    }
}
CategoryRepository.instance = null;
exports.default = CategoryRepository;
