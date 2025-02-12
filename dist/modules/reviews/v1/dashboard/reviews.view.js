"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewView = void 0;
const reviews_controller_1 = require("./reviews.controller");
class ReviewView {
    constructor() {
        this.controller = reviews_controller_1.ReviewController.getInstance();
        // Bind all methods to preserve 'this' context
        this.create = this.create.bind(this);
        this.getOneById = this.getOneById.bind(this);
        this.getAll = this.getAll.bind(this);
        this.update = this.update.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
    }
    static getInstance() {
        if (!ReviewView.instance) {
            ReviewView.instance = new ReviewView();
        }
        return ReviewView.instance;
    }
    async create(req, res) {
        const review = await this.controller.create(req);
        res.send({
            data: review,
            message: req.t("responses.succes"),
        });
    }
    async getOneById(req, res) {
        const review = await this.controller.get(req);
        res.send({
            data: review,
            message: req.t("responses.succes"),
        });
    }
    async getAll(req, res) {
        const reviews = await this.controller.getAll(req);
        res.send({
            data: reviews,
            message: req.t("responses.succes"),
        });
    }
    async update(req, res) {
        const review = await this.controller.update(req);
        res.send({
            data: review,
            message: req.t("responses.succes"),
        });
    }
    async deleteOne(req, res) {
        const review = await this.controller.delete(req);
        res.send({
            data: review,
            message: req.t("responses.succes"),
        });
    }
}
exports.ReviewView = ReviewView;
ReviewView.instance = null;
