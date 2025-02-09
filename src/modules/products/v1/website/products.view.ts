import { ProductController } from "./products.controller";
import { Request, Response } from "express";

import { AppError } from "../../../../utils/appError";

export class ProductView {
  private controller: ProductController;
  private static instance: ProductView | null = null;
  private constructor() {
    this.controller = ProductController.getInstance();
    // Bind all methods to preserve 'this' context
    this.create = this.create.bind(this);
    this.getOneById = this.getOneById.bind(this);
    this.getAll = this.getAll.bind(this);
    this.update = this.update.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.toggleFavourite = this.toggleFavourite.bind(this);
  }

  public static getInstance(): ProductView {
    if (!ProductView.instance) {
      ProductView.instance = new ProductView();
    }
    return ProductView.instance;
  }
  async create(req: Request, res: Response) {
    const trainer = await this.controller.create(req);
    res.send({
      data: trainer,
      message: req.t("responses.succes"),
    });
  }

  async getOneById(req: Request, res: Response) {
    const trainer = await this.controller.get(req);
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

  async toggleFavourite(req: Request, res: Response) {
    const isFavourite = await this.controller.toggleFavourite(req);
    res.send({
      data: { isFavourite },
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
