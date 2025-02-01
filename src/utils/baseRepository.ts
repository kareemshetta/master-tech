import {
  Model,
  FindOptions,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
  FindAndCountOptions,
  ModelStatic,
  BulkCreateOptions,
  CountOptions,
  FindOrCreateOptions,
} from "sequelize";
import { AppError } from "./appError";
export class BaseRepository<T extends Model<any, any>> {
  private model: ModelStatic<T>;
  private errorMessage;

  constructor(model: ModelStatic<T>, errorMessage?: string) {
    this.model = model;
    this.errorMessage = errorMessage || "entityNotFount";
  }

  async findAll(options?: FindOptions<any>): Promise<T[]> {
    return this.model.findAll(options);
  }
  async findAndCountAll(options: FindAndCountOptions<T>) {
    return this.model.findAndCountAll(options);
  }

  async findOne(options: FindOptions<any>): Promise<T | null> {
    return this.model.findOne(options);
  }
  async findOneById(id: string, options: FindOptions = {}) {
    return this.model.findByPk(id, options);
  }
  async findOneByIdOrThrowError(id: string, options: FindOptions = {}) {
    const one = await this.findOneById(id, options);
    if (!one) {
      throw new AppError(this.errorMessage, 404, this.model.tableName);
    }
    return one;
  }
  async updateOneByIdOrThrowError(id: string, data: object) {
    const one = await this.findOneByIdOrThrowError(id);
    return await one.update(data);
  }

  async create(data: any, options?: CreateOptions): Promise<T> {
    return this.model.create(data, options);
  }
  async bulkCreate(data: any[], options?: BulkCreateOptions): Promise<T[]> {
    return this.model.bulkCreate(data, options);
  }

  async update(
    data: any,
    options: UpdateOptions
  ): Promise<[affectedCount: number, updated?: T[]]> {
    const updated = await this.model.update(data, options);
    return updated;
  }

  async delete(options: DestroyOptions): Promise<number> {
    return this.model.destroy(options);
  }

  async count(options: CountOptions): Promise<any> {
    return this.model.count(options);
  }
  async findOneOrCreate(
    options: FindOrCreateOptions<any>,
    data: any
  ): Promise<[T, boolean]> {
    return this.model.findOrCreate(options);
  }
}
