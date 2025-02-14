"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactusView = void 0;
const contact_us_controller_1 = require("./contact-us.controller");
class ContactusView {
    constructor() {
        this.controller = contact_us_controller_1.ContactusController.getInstance();
        // Bind all methods to preserve 'this' context
        this.create = this.create.bind(this);
        this.getOneById = this.getOneById.bind(this);
        this.getAll = this.getAll.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
    }
    static getInstance() {
        if (!ContactusView.instance) {
            ContactusView.instance = new ContactusView();
        }
        return ContactusView.instance;
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
exports.ContactusView = ContactusView;
ContactusView.instance = null;
