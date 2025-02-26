"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminView = void 0;
const admins_controller_1 = __importDefault(require("./admins.controller"));
class AdminView {
    constructor() {
        this.controller = admins_controller_1.default.getInstance();
        // Bind all methods to preserve 'this' context
        this.createAdmin = this.createAdmin.bind(this);
        this.getOneById = this.getOneById.bind(this);
        this.getAll = this.getAll.bind(this);
        this.update = this.update.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
    }
    static getInstance() {
        if (!AdminView.instance) {
            AdminView.instance = new AdminView();
        }
        return AdminView.instance;
    }
    async createAdmin(req, res) {
        const admin = await this.controller.create(req);
        res.send({
            data: admin,
            message: req.t("responses.succes"),
        });
    }
    async getOneById(req, res) {
        const admin = await this.controller.getOne(req);
        res.send({
            data: admin,
            message: req.t("responses.succes"),
        });
    }
    async getAll(req, res) {
        const Admins = await this.controller.getAll(req);
        res.send({
            data: Admins,
            message: req.t("responses.succes"),
        });
    }
    async update(req, res) {
        const admin = await this.controller.update(req);
        res.send({
            data: admin,
            message: req.t("responses.succes"),
        });
    }
    async deleteOne(req, res) {
        const Admin = await this.controller.deleteOne(req);
        res.send({
            data: Admin,
            message: req.t("responses.succes"),
        });
    }
}
exports.AdminView = AdminView;
AdminView.instance = null;
