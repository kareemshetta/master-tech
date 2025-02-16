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
    this.verfiyOtp = this.verfiyOtp.bind(this);
    this.getOtp = this.getOtp.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.update = this.update.bind(this);
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

  async getOtp(req: Request, res: Response) {
    const trainer = await this.controller.getOtp(req);
    res.send({
      data: trainer,
      message: req.t("responses.succes"),
    });
  }

  async verfiyOtp(req: Request, res: Response) {
    const trainer = await this.controller.verifyOtp(req);
    res.send({
      data: null,
      message: req.t("responses.yourOtpHavePassedSuccess"),
    });
  }

  async getOneById(req: Request, res: Response) {
    const trainer = await this.controller.getOne(req);
    res.send({
      data: trainer,
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

  async updatePassword(req: Request, res: Response) {
    const trainer = await this.controller.updatePassword(req);
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
