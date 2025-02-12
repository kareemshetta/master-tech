"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartView = void 0;
const carts_controller_1 = require("./carts.controller");
class CartView {
    constructor() {
        this.controller = carts_controller_1.CartController.getInstance();
        // Bind all methods to preserve 'this' context
        this.createCartItem = this.createCartItem.bind(this);
        this.getOneById = this.getOneById.bind(this);
        this.getAll = this.getAll.bind(this);
        this.update = this.update.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
    }
    static getInstance() {
        if (!CartView.instance) {
            CartView.instance = new CartView();
        }
        return CartView.instance;
    }
    async createCartItem(req, res) {
        const trainer = await this.controller.create(req);
        res.send({
            data: trainer,
            message: req.t("responses.succes"),
        });
    }
    async getOneById(req, res) {
        const trainer = await this.controller.getOne(req);
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
    async deleteOne(req, res) {
        const user = await this.controller.delete(req);
        res.send({
            data: user,
            message: req.t("responses.succes"),
        });
    }
}
exports.CartView = CartView;
CartView.instance = null;
