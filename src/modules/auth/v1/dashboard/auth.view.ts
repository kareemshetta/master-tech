import { Request, Response } from "express";

import AuthController from "./auth.controller";

export class AuthView {
  private controller: AuthController;
  private static instance: AuthView | null = null;
  private constructor() {
    this.controller = AuthController.getInstance();
    // Bind all methods to preserve 'this' context
    this.loginUser = this.loginUser.bind(this);
    this.getOneById = this.getOneById.bind(this);
    this.signUp = this.signUp.bind(this);
    this.updateProfile = this.updateProfile.bind(this);

    // this.updateBill = this.updateBill.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  public static getInstance(): AuthView {
    if (!AuthView.instance) {
      AuthView.instance = new AuthView();
    }
    return AuthView.instance;
  }
  async loginUser(req: Request, res: Response) {
    const trainer = await this.controller.login(req);
    res.send({
      data: trainer,
      message: req.t("responses.succes"),
    });
  }

  async updateProfile(req: Request, res: Response) {
    const trainer = await this.controller.update(req);
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

  async signUp(req: Request, res: Response) {
    const trainer = await this.controller.signUp(req);
    res.send({
      data: trainer,
      message: req.t("responses.succes"),
    });
  }

  async deleteOne(req: Request, res: Response) {
    const user = await this.controller.deleteOne(req);
    res.send({
      data: user,
      message: req.t("responses.succes"),
    });
  }
}
