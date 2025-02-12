"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityView = void 0;
const cities_controller_1 = require("./cities.controller");
class CityView {
    constructor() {
        this.controller = cities_controller_1.CityController.getInstance();
        // Bind all methods to preserve 'this' context
        this.create = this.create.bind(this);
        this.getOneById = this.getOneById.bind(this);
        this.getAll = this.getAll.bind(this);
        this.update = this.update.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
    }
    static getInstance() {
        if (!CityView.instance) {
            CityView.instance = new CityView();
        }
        return CityView.instance;
    }
    async create(req, res) {
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
exports.CityView = CityView;
CityView.instance = null;
