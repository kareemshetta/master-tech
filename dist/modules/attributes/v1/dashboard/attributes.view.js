"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeView = void 0;
const attributes_controller_1 = require("./attributes.controller");
class AttributeView {
    constructor() {
        this.controller = attributes_controller_1.AttributeController.getInstance();
        // Bind all methods to preserve 'this' context
        this.create = this.create.bind(this);
        this.getOneById = this.getOneById.bind(this);
        this.getAll = this.getAll.bind(this);
        this.update = this.update.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
    }
    static getInstance() {
        if (!AttributeView.instance) {
            AttributeView.instance = new AttributeView();
        }
        return AttributeView.instance;
    }
    async create(req, res) {
        const trainer = await this.controller.create(req);
        res.send({
            data: trainer,
            message: req.t("responses.succes"),
        });
    }
    async getOneById(req, res) {
        const trainer = await this.controller.getAttribute(req);
        res.send({
            data: trainer,
            message: req.t("responses.succes"),
        });
    }
    async getAll(req, res) {
        console.log("url", req.originalUrl);
        const users = await this.controller.getAllAttributes(req);
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
exports.AttributeView = AttributeView;
AttributeView.instance = null;
