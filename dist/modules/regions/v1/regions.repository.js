"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const regions_model_1 = __importDefault(require("../../../models/regions.model"));
class RegionRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(regions_model_1.default);
    }
    static getInstance() {
        if (!RegionRepository.instance) {
            RegionRepository.instance = new RegionRepository();
        }
        return RegionRepository.instance;
    }
}
RegionRepository.instance = null;
exports.default = RegionRepository;
