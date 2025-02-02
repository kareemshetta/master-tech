"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserView = void 0;
const users_controller_1 = __importDefault(require("./users.controller"));
class UserView {
    constructor() {
        this.controller = users_controller_1.default.getInstance();
        // Bind all methods to preserve 'this' context
        this.createUser = this.createUser.bind(this);
        this.getOneById = this.getOneById.bind(this);
        this.getAll = this.getAll.bind(this);
        // this.updateBill = this.updateBill.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
    }
    static getInstance() {
        if (!UserView.instance) {
            UserView.instance = new UserView();
        }
        return UserView.instance;
    }
    async createUser(req, res) {
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
    //   async updateBill(req: Request, res: Response) {
    //     try {
    //       const trainer = await this.controller.update(req);
    //       res.send({
    //         data: trainer,
    //         message: "Success updating the srevice request bill.",
    //       });
    //     } catch (error: any) {
    //       throw new AppError(error);
    //     }
    //   }
    async deleteOne(req, res) {
        const user = await this.controller.deleteOne(req);
        res.send({
            data: user,
            message: req.t("responses.succes"),
        });
    }
}
exports.UserView = UserView;
UserView.instance = null;
