"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv").config(); //подключаем .env
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//--------вывод ошибок
const error_1 = require("./middleware/error");
const user_route_1 = __importDefault(require("./routes/user.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const analytics_route_1 = __importDefault(require("./routes/analytics.route"));
const layout_route_1 = __importDefault(require("./routes/layout.route"));
const express_rate_limit_1 = require("express-rate-limit"); //ограничение против спама
//const allowedOrigins = process.env.ORIGIN 
//const allowedOrigins = ['http://localhost:3000' ];
// app.use(cors({
//   origin: function(origin, callback){
//     // разрешаем запросы без происхождения
//      // (например, мобильные приложения или запросы на curl)
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin)  === -1){
//       var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true,
// }));
//origin - настраивает заголовок Access-Control-Allow-Origin. 
//'http://localhost:3000', 
exports.app.use((0, cors_1.default)({ origin: ['https://nlmserver.vercel.app/',
        'https://nlmsclient.vercel.app', 'https://testclient-iota.vercel.app'],
    credentials: true, //это передает куки и др.
    methods: ['GET', 'POST', 'PUT', 'DELETE'] //сам добавил https://github.com/vercel/next.js/discussions/36487
}));
// body parser
exports.app.use(express_1.default.json({ limit: "50mb" }));
//cookie parser
exports.app.use((0, cookie_parser_1.default)());
// api requests limit ограничение 15минут каждый IP максимум 100 
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
//router
exports.app.use("/api/v1", user_route_1.default, course_route_1.default, order_route_1.default, notification_route_1.default, //уведомления
analytics_route_1.default, //аналитика
layout_route_1.default);
//testing api - это тест API
exports.app.get("/test", (req, res, next) => {
    const acc = req.cookies.access_token;
    //const acc = JSON.parse(req.cookies.get('access_token')?.value || 'no')
    res.status(200).json({
        success: true,
        message: "API is working-22may- 14:00 acctoken=" + acc,
    });
});
//бывает что не правильно набрали адрес пути, отобразим ошибку
//unknown route
exports.app.all("*", (req, res, next) => {
    try {
        const err = new Error(`Route ${req.originalUrl} not found`);
        err.statusCode = 404;
        next(err);
    }
    catch (error) {
        return (error.message, 409);
    }
});
// middleware calls
exports.app.use(limiter); // защита от спама
exports.app.use(error_1.ErrorMiddleware); //--------вывод ошибок вывод 
