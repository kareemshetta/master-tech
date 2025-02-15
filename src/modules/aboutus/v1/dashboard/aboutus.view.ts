import { Request, Response } from "express";

import { AppError } from "../../../../utils/appError";

import AboutusController from "./aboutus.controller";

export class AboutusView {
  private controller: AboutusController;
  private static instance: AboutusView | null = null;
  private constructor() {
    this.controller = AboutusController.getInstance();
    // Bind all methods to preserve 'this' context
    this.create = this.create.bind(this);
    this.getOneById = this.getOneById.bind(this);
    this.getAll = this.getAll.bind(this);
    this.update = this.update.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.getOneForDashboard = this.getOneForDashboard.bind(this);
  }

  public static getInstance(): AboutusView {
    if (!AboutusView.instance) {
      AboutusView.instance = new AboutusView();
    }
    return AboutusView.instance;
  }
  async create(req: Request, res: Response) {
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
  async getOneForDashboard(req: Request, res: Response) {
    const trainer = await this.controller.getOneForDashboard(req);
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
