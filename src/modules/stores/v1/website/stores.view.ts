import { Request, Response } from "express";

import StoreController from "./stores.controller";
import { AppError } from "../../../../utils/appError";

export class StoresView {
  private controller: StoreController;
  private static instance: StoresView | null = null;
  private constructor() {
    this.controller = StoreController.getInstance();
    // Bind all methods to preserve 'this' context

    this.getOneById = this.getOneById.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  public static getInstance(): StoresView {
    if (!StoresView.instance) {
      StoresView.instance = new StoresView();
    }
    return StoresView.instance;
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

  //
}
