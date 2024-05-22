"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrdersService = exports.newOrder = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const orderModel_1 = __importDefault(require("../models/orderModel"));
const db_1 = __importDefault(require("../utils/db"));
exports.newOrder = (0, catchAsyncErrors_1.CatchAsyncError)(
// async (data: any, next: NextFunction) => {
async (data, res) => {
    // соединение с бд
    await (0, db_1.default)();
    const order = await orderModel_1.default.create(data);
    //next(order)
    res.status(201).json({ success: true, order, });
});
// get all orders
const getAllOrdersService = async (res) => {
    // соединение с бд
    await (0, db_1.default)();
    const orders = await orderModel_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({ success: true, orders, });
};
exports.getAllOrdersService = getAllOrdersService;
