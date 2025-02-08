import { Request, Response } from "express";

import UserController from "./users.controller";

export class UserView {
  private controller: UserController;
  private static instance: UserView | null = null;
  private constructor() {
    this.controller = UserController.getInstance();
    // Bind all methods to preserve 'this' context
    this.createUser = this.createUser.bind(this);
    this.getOneById = this.getOneById.bind(this);
    this.getAll = this.getAll.bind(this);
    this.update = this.update.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  public static getInstance(): UserView {
    if (!UserView.instance) {
      UserView.instance = new UserView();
    }
    return UserView.instance;
  }
  async createUser(req: Request, res: Response) {
    const user = await this.controller.create(req);
    res.send({
      data: user,
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
    const user = await this.controller.update(req);
    res.send({
      data: user,
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

  //   async export(req: Request, res: Response) {
  //     try {
  //       //   const bills = await controller.expor(req);
  //       //   const tableColumns = ["name"];
  //       //   const sheetColumns = ["user name"];
  //       //   const sheet = generateExcelBuffer(
  //       //     tableColumns,
  //       //     sheetColumns,
  //       //     bills.rows
  //       //   );
  //       //   res.setHeader("Content-Type", "application/vnd.ms-excel");
  //       //   res.setHeader(
  //       //     "Content-Disposition",
  //       //     "attachment; filename=serviceRequestbills_data.xlsx"
  //       //   );
  //       //   res.send(sheet);
  //     } catch (error: any) {
  //       throw new AppError(error);
  //     }
  //   }
}
