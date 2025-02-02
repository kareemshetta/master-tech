"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const stores_model_1 = __importDefault(require("../../../models/stores.model"));
class StoresRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(stores_model_1.default);
    }
    static getInstance() {
        if (!StoresRepository.instance) {
            StoresRepository.instance = new StoresRepository();
        }
        return StoresRepository.instance;
    }
}
StoresRepository.instance = null;
exports.default = StoresRepository;
