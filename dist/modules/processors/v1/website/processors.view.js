"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessorView = void 0;
const processors_controller_1 = require("./processors.controller");
class ProcessorView {
    constructor() {
        this.controller = processors_controller_1.ProcessorController.getInstance();
        // Bind all methods to preserve 'this' context
        this.create = this.create.bind(this);
        this.getOneById = this.getOneById.bind(this);
        this.getAll = this.getAll.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
    }
    static getInstance() {
        if (!ProcessorView.instance) {
            ProcessorView.instance = new ProcessorView();
        }
        return ProcessorView.instance;
    }
    async create(req, res) {
        const trainer = await this.controller.create(req);
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
    async deleteOne(req, res) {
        const user = await this.controller.delete(req);
        res.send({
            data: user,
            message: req.t("responses.succes"),
        });
    }
}
exports.ProcessorView = ProcessorView;
ProcessorView.instance = null;
