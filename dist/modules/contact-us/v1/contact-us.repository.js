"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const contact_model_1 = __importDefault(require("../../../models/contact.model"));
class ContactusRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(contact_model_1.default);
    }
    static getInstance() {
        if (!ContactusRepository.instance) {
            ContactusRepository.instance = new ContactusRepository();
        }
        return ContactusRepository.instance;
    }
}
ContactusRepository.instance = null;
exports.default = ContactusRepository;
