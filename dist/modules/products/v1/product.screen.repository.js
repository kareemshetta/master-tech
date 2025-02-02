"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const screen_model_1 = __importDefault(require("../../../models/screen.model"));
class ProductScreenRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(screen_model_1.default);
    }
    static getInstance() {
        if (!ProductScreenRepository.instance) {
            ProductScreenRepository.instance = new ProductScreenRepository();
        }
        return ProductScreenRepository.instance;
    }
}
ProductScreenRepository.instance = null;
exports.default = ProductScreenRepository;
