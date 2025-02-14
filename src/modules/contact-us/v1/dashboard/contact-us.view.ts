import { Request, Response } from "express";

import { AppError } from "../../../../utils/appError";

import { ContactusController } from "./contact-us.controller";

export class ContactusView {
  private controller: ContactusController;
  private static instance: ContactusView | null = null;
  private constructor() {
    this.controller = ContactusController.getInstance();
    // Bind all methods to preserve 'this' context
    this.create = this.create.bind(this);
    this.getOneById = this.getOneById.bind(this);
    this.getAll = this.getAll.bind(this);

    this.deleteOne = this.deleteOne.bind(this);
  }

  public static getInstance(): ContactusView {
    if (!ContactusView.instance) {
      ContactusView.instance = new ContactusView();
    }
    return ContactusView.instance;
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

  async deleteOne(req: Request, res: Response) {
    const user = await this.controller.delete(req);
    res.send({
      data: user,
      message: req.t("responses.succes"),
    });
  }

  //
}
