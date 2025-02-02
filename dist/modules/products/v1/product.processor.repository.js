"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const processor_model_1 = __importDefault(require("../../../models/processor.model"));
class ProductProcessorRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(processor_model_1.default);
    }
    static getInstance() {
        if (!ProductProcessorRepository.instance) {
            ProductProcessorRepository.instance = new ProductProcessorRepository();
        }
        return ProductProcessorRepository.instance;
    }
}
ProductProcessorRepository.instance = null;
exports.default = ProductProcessorRepository;
