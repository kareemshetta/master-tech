"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryView = void 0;
const categories_controller_1 = require("./categories.controller");
class CategoryView {
    constructor() {
        this.controller = categories_controller_1.CategoryController.getInstance();
        // Bind all methods to preserve 'this' context
        this.createCat = this.createCat.bind(this);
        this.getOneById = this.getOneById.bind(this);
        this.getAll = this.getAll.bind(this);
        this.update = this.update.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
    }
    static getInstance() {
        if (!CategoryView.instance) {
            CategoryView.instance = new CategoryView();
        }
        return CategoryView.instance;
    }
    async createCat(req, res) {
        const trainer = await this.controller.create(req);
        res.send({
            data: trainer,
            message: req.t("responses.succes"),
        });
    }
    async getOneById(req, res) {
        const trainer = await this.controller.getStore(req);
        res.send({
            data: trainer,
            message: req.t("responses.succes"),
        });
    }
    async getAll(req, res) {
        const users = await this.controller.getAllStores(req);
        res.send({
            data: users,
            message: req.t("responses.succes"),
        });
    }
    async update(req, res) {
        const trainer = await this.controller.update(req);
        res.send({
            data: trainer,
            message: req.t("responses.succes"),
        });
    }
    async deleteOne(req, res) {
        const user = await this.controller.delete(req);
        res.send({
            data: user,
            message: req.t("responses.succes"),
        });
    }
}
exports.CategoryView = CategoryView;
CategoryView.instance = null;
