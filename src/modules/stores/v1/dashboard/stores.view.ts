import { Request, Response } from "express";

import StoreController from "./stores.controller";
import { AppError } from "../../../../utils/appError";

export class StoresView {
  private controller: StoreController;
  private static instance: StoresView | null = null;
  private constructor() {
    this.controller = StoreController.getInstance();
    // Bind all methods to preserve 'this' context
    this.createStore = this.createStore.bind(this);
    this.getOneById = this.getOneById.bind(this);
    this.getAll = this.getAll.bind(this);
    this.updateStore = this.updateStore.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  public static getInstance(): StoresView {
    if (!StoresView.instance) {
      StoresView.instance = new StoresView();
    }
    return StoresView.instance;
  }
  async createStore(req: Request, res: Response) {
    const trainer = await this.controller.createStore(req);
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

  async updateStore(req: Request, res: Response) {
    const trainer = await this.controller.updateStore(req);
    res.send({
      data: trainer,
      message: "Success updating the srevice request bill.",
    });
  }

  async deleteOne(req: Request, res: Response) {
    const user = await this.controller.deleteStore(req);
    res.send({
      data: user,
      message: req.t("responses.succes"),
    });
  }

  //
}
