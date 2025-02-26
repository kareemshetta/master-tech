"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthView = void 0;
const auth_controller_1 = __importDefault(require("./auth.controller"));
class AuthView {
    constructor() {
        this.controller = auth_controller_1.default.getInstance();
        // Bind all methods to preserve 'this' context
        this.loginUser = this.loginUser.bind(this);
        this.getOneById = this.getOneById.bind(this);
        this.signUp = this.signUp.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        // this.updateBill = this.updateBill.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
    }
    static getInstance() {
        if (!AuthView.instance) {
            AuthView.instance = new AuthView();
        }
        return AuthView.instance;
    }
    async loginUser(req, res) {
        const trainer = await this.controller.login(req);
        res.send({
            data: trainer,
            message: req.t("responses.succes"),
        });
    }
    async updateProfile(req, res) {
        const trainer = await this.controller.update(req);
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
    async signUp(req, res) {
        const trainer = await this.controller.signUp(req);
        res.send({
            data: trainer,
            message: req.t("responses.succes"),
        });
    }
    async deleteOne(req, res) {
        const user = await this.controller.deleteOne(req);
        res.send({
            data: user,
            message: req.t("responses.succes"),
        });
    }
}
exports.AuthView = AuthView;
AuthView.instance = null;
