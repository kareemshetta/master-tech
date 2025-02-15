"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const aboutus_model_1 = __importDefault(require("../../../models/aboutus.model"));
class AboutusRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(aboutus_model_1.default);
    }
    static getInstance() {
        if (!AboutusRepository.instance) {
            AboutusRepository.instance = new AboutusRepository();
        }
        return AboutusRepository.instance;
    }
}
AboutusRepository.instance = null;
exports.default = AboutusRepository;
