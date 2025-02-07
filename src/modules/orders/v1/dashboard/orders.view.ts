import { OrderController } from "./orders.controller";
import { Request, Response } from "express";

import { AppError } from "../../../../utils/appError";

export class OrderView {
  private controller: OrderController;
  private static instance: OrderView | null = null;
  private constructor() {
    this.controller = OrderController.getInstance();
    // Bind all methods to preserve 'this' context
    // this.create = this.create.bind(this);
    this.getOneById = this.getOneById.bind(this);
    this.getAll = this.getAll.bind(this);
    this.update = this.update.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  public static getInstance(): OrderView {
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

  async getOneById(req: Request, res: Response) {
    const trainer = await this.controller.getOne(req);
    res.send({
      data: trainer,
      message: req.t("responses.succes"),
    });
  }

  async getAll(req: Request, res: Response) {
    const users = await this.controller.getAll(req);
    res.send({
      data: users,
      message: req.t("responses.succes"),
    });
  }

  async update(req: Request, res: Response) {
    const trainer = await this.controller.update(req);
    res.send({
      data: trainer,
      message: req.t("responses.succes"),
    });
  }

  async deleteOne(req: Request, res: Response) {
    const trainer = await this.controller.delete(req);
    res.send({
      data: trainer,
      message: req.t("responses.succes"),
    });
  }
  //
}
