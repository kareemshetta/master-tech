import { Request, Response } from "express";

import AdminController from "./admins.controller";

export class AdminView {
  private controller: AdminController;
  private static instance: AdminView | null = null;
  private constructor() {
    this.controller = AdminController.getInstance();
    // Bind all methods to preserve 'this' context
    this.createAdmin = this.createAdmin.bind(this);
    this.getOneById = this.getOneById.bind(this);
    this.getAll = this.getAll.bind(this);
    this.update = this.update.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  public static getInstance(): AdminView {
    if (!AdminView.instance) {
      AdminView.instance = new AdminView();
    }
    return AdminView.instance;
  }
  async createAdmin(req: Request, res: Response) {
    const admin = await this.controller.create(req);
    res.send({
      data: admin,
      message: req.t("responses.succes"),
    });
  }

  async getOneById(req: Request, res: Response) {
    const admin = await this.controller.getOne(req);
    res.send({
      data: admin,
      message: req.t("responses.succes"),
    });
  }

  async getAll(req: Request, res: Response) {
    const Admins = await this.controller.getAll(req);
    res.send({
      data: Admins,
      message: req.t("responses.succes"),
    });
  }

  async update(req: Request, res: Response) {
    const admin = await this.controller.update(req);
    res.send({
      data: admin,
      message: "Success updating the srevice request bill.",
    });
  }

  async deleteOne(req: Request, res: Response) {
    const Admin = await this.controller.deleteOne(req);
    res.send({
      data: Admin,
      message: req.t("responses.succes"),
    });
  }
}
