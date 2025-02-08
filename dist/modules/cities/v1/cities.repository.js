"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const cities_model_1 = __importDefault(require("../../../models/cities.model"));
class CityRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(cities_model_1.default);
    }
    static getInstance() {
        if (!CityRepository.instance) {
            CityRepository.instance = new CityRepository();
        }
        return CityRepository.instance;
    }
}
CityRepository.instance = null;
exports.default = CityRepository;
