"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.resetPassword = exports.verifyOtp = exports.forgotPassword = exports.detail = exports.login = exports.register = void 0;
var user_model_1 = __importDefault(require("../models/user.model"));
var md5_1 = __importDefault(require("md5"));
var generate_1 = require("../../../helpers/generate");
var forgot_password_model_1 = __importDefault(require("../models/forgot-password.model"));
var sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var existEmail, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, user_model_1.default.findOne({
                    email: req.body.email,
                    deleted: false
                })];
            case 1:
                existEmail = _a.sent();
                if (existEmail) {
                    res.json({ code: 400, message: "Email đã tồn tại!" });
                    return [2];
                }
                user = new user_model_1.default(__assign(__assign({}, req.body), { token: (0, generate_1.generateRandomString)(20) }));
                return [4, user.save()];
            case 2:
                _a.sent();
                res.json({
                    code: 200,
                    message: "Đăng ký tài khoản thành công!"
                });
                return [2];
        }
    });
}); };
exports.register = register;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, password, existUser, token, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                email = req.body.email;
                password = (0, md5_1.default)(req.body.password);
                return [4, user_model_1.default.findOne({
                        email: email,
                        password: password,
                        deleted: false
                    }).select("token")];
            case 1:
                existUser = _a.sent();
                if (!existUser) {
                    res.json({ code: 400, message: "Email hoặc mật khẩu không đúng!" });
                    return [2];
                }
                token = existUser.token;
                res.json({ code: 200, message: "Đăng nhập thành công!", token: token });
                return [3, 3];
            case 2:
                error_1 = _a.sent();
                res.json({ code: 500, message: "Đã có lỗi xảy ra!" });
                return [3, 3];
            case 3: return [2];
        }
    });
}); };
exports.login = login;
var detail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json({
            code: 200,
            message: "Thành công!",
            user: res["user"]
        });
        return [2];
    });
}); };
exports.detail = detail;
var forgotPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, otp, objectForgotPassword, forgotPassword_1, subject, html, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                email = req.body.email;
                return [4, user_model_1.default.findOne({ email: email, deleted: false })];
            case 1:
                user = _a.sent();
                if (!user) {
                    res.status(400).json({ code: 400, message: 'Email không tồn tại!' });
                    return [2];
                }
                otp = (0, generate_1.generateRandomNumber)(6);
                objectForgotPassword = {
                    email: email,
                    otp: otp,
                    expireAt: Date.now() + 3 * 60 * 1000
                };
                forgotPassword_1 = new forgot_password_model_1.default(objectForgotPassword);
                return [4, forgotPassword_1.save()];
            case 2:
                _a.sent();
                subject = 'Mã OTP xác minh lấy lại mật khẩu';
                html = "\n            M\u00E3 OTP x\u00E1c th\u1EF1c t\u00E0i kho\u1EA3n c\u1EE7a b\u1EA1n l\u00E0: <b>".concat(otp, "</b>. \n            M\u00E3 OTP c\u00F3 hi\u1EC7u l\u1EF1c trong v\u00F2ng 3 ph\u00FAt. Vui l\u00F2ng kh\u00F4ng cung c\u1EA5p m\u00E3 OTP n\u00E0y v\u1EDBi b\u1EA5t k\u1EF3 ai.\n        ");
                (0, sendEmail_1.default)(email, subject, html);
                res.json({ code: 200, message: 'Vui lòng kiểm tra email của bạn!' });
                return [3, 4];
            case 3:
                error_2 = _a.sent();
                res.status(400).json({ code: 400, message: 'Có lỗi xảy ra!' });
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.forgotPassword = forgotPassword;
var verifyOtp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, otp, forgotPassword_2, user, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, otp = _a.otp;
                return [4, forgot_password_model_1.default.findOne({ email: email, otp: otp })];
            case 1:
                forgotPassword_2 = _b.sent();
                if (!forgotPassword_2) {
                    res.status(400).json({ code: 400, message: 'Mã OTP không hợp lệ!' });
                    return [2];
                }
                return [4, user_model_1.default.findOne({ email: email, deleted: false })];
            case 2:
                user = _b.sent();
                res.cookie("token", user.token);
                res.json({ code: 200, message: 'Xác thực thành công!' });
                return [3, 4];
            case 3:
                error_3 = _b.sent();
                res.status(400).json({ code: 400, message: 'Có lỗi xảy ra!' });
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.verifyOtp = verifyOtp;
var resetPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, password, user, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                token = req.cookies.token;
                password = req.body.password;
                return [4, user_model_1.default.findOne({ token: token, deleted: false })];
            case 1:
                user = _a.sent();
                if (!user) {
                    res.status(400).json({ code: 400, message: 'Email không tồn tại!' });
                    return [2];
                }
                if ((0, md5_1.default)(password) === user.password) {
                    res.status(400).json({ code: 400, message: 'Mật khẩu không được trùng với mật khẩu cũ!' });
                    return [2];
                }
                return [4, user_model_1.default.updateOne({ token: token, deleted: false }, { password: (0, md5_1.default)(password) })];
            case 2:
                _a.sent();
                res.json({ code: 200, message: 'Cập nhật mật khẩu thành công!' });
                return [3, 4];
            case 3:
                error_4 = _a.sent();
                res.status(400).json({ code: 400, message: 'Có lỗi xảy ra!' });
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.resetPassword = resetPassword;
var list = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, user_model_1.default.find({ deleted: false })
                    .select("fullName email avatar")];
            case 1:
                users = _a.sent();
                res.json({ code: 200, message: 'Thành công!', data: users });
                return [2];
        }
    });
}); };
exports.list = list;
