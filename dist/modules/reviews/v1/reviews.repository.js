"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const review_model_1 = __importDefault(require("../../../models/review.model"));
class ReviewRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(review_model_1.default);
    }
    static getInstance() {
        if (!ReviewRepository.instance) {
            ReviewRepository.instance = new ReviewRepository();
        }
        return ReviewRepository.instance;
    }
}
ReviewRepository.instance = null;
exports.default = ReviewRepository;
