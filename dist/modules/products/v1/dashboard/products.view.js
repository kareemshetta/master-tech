"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductView = void 0;
const products_controller_1 = require("./products.controller");
class ProductView {
    constructor() {
        this.controller = products_controller_1.ProductController.getInstance();
        // Bind all methods to preserve 'this' context
        this.create = this.create.bind(this);
        this.getOneById = this.getOneById.bind(this);
        this.getAll = this.getAll.bind(this);
        this.update = this.update.bind(this);
        this.updateAccessory = this.updateAccessory.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.createAccessory = this.createAccessory.bind(this);
    }
    static getInstance() {
        if (!ProductView.instance) {
            ProductView.instance = new ProductView();
        }
        return ProductView.instance;
    }
    async create(req, res) {
        const trainer = await this.controller.create(req);
        res.send({
            data: trainer,
            message: req.t("responses.succes"),
        });
    }
    async createAccessory(req, res) {
        const trainer = await this.controller.createAccessory(req);
        res.send({
            data: trainer,
            message: req.t("responses.succes"),
        });
    }
    async getOneById(req, res) {
        const trainer = await this.controller.get(req);
        res.send({
            data: trainer,
            message: req.t("responses.succes"),
        });
    }
    async getAll(req, res) {
        const users = await this.controller.getAll(req);
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
    async updateAccessory(req, res) {
        const trainer = await this.controller.updateAccessory(req);
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
exports.ProductView = ProductView;
ProductView.instance = null;
