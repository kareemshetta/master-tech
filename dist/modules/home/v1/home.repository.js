"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const home_model_1 = __importDefault(require("../../../models/home.model"));
class HomeRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(home_model_1.default);
    }
    static getInstance() {
        if (!HomeRepository.instance) {
            HomeRepository.instance = new HomeRepository();
        }
        return HomeRepository.instance;
    }
}
HomeRepository.instance = null;
exports.default = HomeRepository;
