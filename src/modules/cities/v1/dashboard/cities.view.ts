import { Request, Response } from "express";

import { AppError } from "../../../../utils/appError";
import { CityController } from "./cities.controller";

export class CityView {
  private controller: CityController;
  private static instance: CityView | null = null;
  private constructor() {
    this.controller = CityController.getInstance();
    // Bind all methods to preserve 'this' context
    this.create = this.create.bind(this);
    this.getOneById = this.getOneById.bind(this);
    this.getAll = this.getAll.bind(this);
    this.update = this.update.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  public static getInstance(): CityView {
    if (!CityView.instance) {
      CityView.instance = new CityView();
    }
    return CityView.instance;
  }
  async create(req: Request, res: Response) {
    const trainer = await this.controller.create(req);
    res.send({
      data: trainer,
      message: req.t("responses.succes"),
    });
  }

  async getOneById(req: Request, res: Response) {
    const trainer = await this.controller.getStore(req);
    res.send({
      data: trainer,
      message: req.t("responses.succes"),
    });
  }

  async getAll(req: Request, res: Response) {
    const users = await this.controller.getAllStores(req);
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
