"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const users_model_1 = __importDefault(require("../../../models/users.model"));
class UserRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(users_model_1.default);
    }
    static getInstance() {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }
}
UserRepository.instance = null;
exports.default = UserRepository;
