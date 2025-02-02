"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const appError_1 = require("./appError");
class BaseRepository {
    constructor(model, errorMessage) {
        this.model = model;
        this.errorMessage = errorMessage || "entityNotFount";
    }
    async findAll(options) {
        return this.model.findAll(options);
    }
    async findAndCountAll(options) {
        return this.model.findAndCountAll(options);
    }
    async findOne(options) {
        return this.model.findOne(options);
    }
    async findOneById(id, options = {}) {
        return this.model.findByPk(id, options);
    }
    async findOneByIdOrThrowError(id, options = {}) {
        const one = await this.findOneById(id, options);
        if (!one) {
            throw new appError_1.AppError(this.errorMessage, 404, this.model.tableName);
        }
        return one;
    }
    async updateOneByIdOrThrowError(id, data) {
        const one = await this.findOneByIdOrThrowError(id);
        return await one.update(data);
    }
    async create(data, options) {
        return this.model.create(data, options);
    }
    async bulkCreate(data, options) {
        return this.model.bulkCreate(data, options);
    }
    async update(data, options) {
        const updated = await this.model.update(data, options);
        return updated;
    }
    async delete(options) {
        return this.model.destroy(options);
    }
    async count(options) {
        return this.model.count(options);
    }
    async findOneOrCreate(options, data) {
        return this.model.findOrCreate(options);
    }
}
exports.BaseRepository = BaseRepository;
