"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const admins_model_1 = __importDefault(require("../../../models/admins.model"));
class AdminRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(admins_model_1.default);
    }
    static getInstance() {
        if (!AdminRepository.instance) {
            AdminRepository.instance = new AdminRepository();
        }
        return AdminRepository.instance;
    }
}
AdminRepository.instance = null;
exports.default = AdminRepository;
