"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandRepository = void 0;
const baseRepository_1 = require("../../../utils/baseRepository");
const brands_model_1 = __importDefault(require("../../../models/brands.model"));
class BrandRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(brands_model_1.default);
    }
    static getInstance() {
        if (!BrandRepository.instance) {
            BrandRepository.instance = new BrandRepository();
        }
        return BrandRepository.instance;
    }
}
exports.BrandRepository = BrandRepository;
BrandRepository.instance = null;
