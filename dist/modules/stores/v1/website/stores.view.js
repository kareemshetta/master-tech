"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoresView = void 0;
const stores_controller_1 = __importDefault(require("./stores.controller"));
class StoresView {
    constructor() {
        this.controller = stores_controller_1.default.getInstance();
        // Bind all methods to preserve 'this' context
        this.getOneById = this.getOneById.bind(this);
        this.getAll = this.getAll.bind(this);
    }
    static getInstance() {
        if (!StoresView.instance) {
            StoresView.instance = new StoresView();
        }
        return StoresView.instance;
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
}
exports.StoresView = StoresView;
StoresView.instance = null;
