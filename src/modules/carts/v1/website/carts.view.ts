import { CartController } from "./carts.controller";
import { Request, Response } from "express";

import { AppError } from "../../../../utils/appError";

export class CartView {
  private controller: CartController;
  private static instance: CartView | null = null;
  private constructor() {
    this.controller = CartController.getInstance();
    // Bind all methods to preserve 'this' context
    this.createCartItem = this.createCartItem.bind(this);
    this.getOneById = this.getOneById.bind(this);
    this.getAll = this.getAll.bind(this);
    this.update = this.update.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  public static getInstance(): CartView {
    if (!CartView.instance) {
      CartView.instance = new CartView();
    }
    return CartView.instance;
  }
  async createCartItem(req: Request, res: Response) {
    const trainer = await this.controller.create(req);
    res.send({
      data: trainer,
      message: req.t("responses.succes"),
    });
  }

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
    const user = await this.controller.delete(req);
    res.send({
      data: user,
      message: req.t("responses.succes"),
    });
  }

  //
}
