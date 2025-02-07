"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderView = void 0;
const orders_controller_1 = require("./orders.controller");
class OrderView {
    constructor() {
        this.controller = orders_controller_1.OrderController.getInstance();
        // Bind all methods to preserve 'this' context
        // this.create = this.create.bind(this);
        this.getOneById = this.getOneById.bind(this);
        this.getAll = this.getAll.bind(this);
        this.update = this.update.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
    }
    static getInstance() {
        if (!OrderView.instance) {
            OrderView.instance = new OrderView();
        }
        return OrderView.instance;
    }
    //   async create(req: Request, res: Response) {
    //     const trainer = await this.controller.create(req);
    //     res.send({
    //       data: trainer,
    //       message: req.t("responses.succes"),
    //     });
    //   }
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
        const trainer = await this.controller.delete(req);
        res.send({
            data: trainer,
            message: req.t("responses.succes"),
        });
    }
}
exports.OrderView = OrderView;
OrderView.instance = null;
