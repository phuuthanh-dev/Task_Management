"use strict";
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
exports.deleteItem = exports.edit = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.index = void 0;
var task_model_1 = __importDefault(require("../models/task.model"));
var pagination_1 = __importDefault(require("../../../helpers/pagination"));
var search_1 = __importDefault(require("../../../helpers/search"));
var index = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var find, sort, pagination, totalRecords, objectPagination, objectSearch, tasks;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                find = {
                    $or: [
                        { createdBy: res['user'].id },
                        { listUser: res['user'].id }
                    ],
                    deleted: false
                };
                if (req.query.status) {
                    find["status"] = "".concat(req.query.status);
                }
                sort = {};
                if (req.query.sortKey && req.query.sortValue) {
                    sort["".concat(req.query.sortKey)] = "".concat(req.query.sortValue);
                }
                pagination = {
                    limit: 2,
                    page: 1
                };
                return [4, task_model_1.default.countDocuments(find)];
            case 1:
                totalRecords = _a.sent();
                objectPagination = (0, pagination_1.default)(pagination, req.query, totalRecords);
                objectSearch = (0, search_1.default)(req.query);
                if (req.query.keyword) {
                    find.title = objectSearch.regex;
                }
                return [4, task_model_1.default
                        .find(find)
                        .sort(sort)
                        .limit(objectPagination.limit)
                        .skip(objectPagination.skip)];
            case 2:
                tasks = _a.sent();
                res.json(tasks);
                return [2];
        }
    });
}); };
exports.index = index;
var detail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, task;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4, task_model_1.default.findOne({
                        _id: id,
                        deleted: false
                    })];
            case 1:
                task = _a.sent();
                res.json(task);
                return [2];
        }
    });
}); };
exports.detail = detail;
var changeStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, task_model_1.default.updateOne({ _id: req.params.id }, { status: req.body.status })];
            case 1:
                _a.sent();
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công!"
                });
                return [3, 3];
            case 2:
                error_1 = _a.sent();
                res.json({
                    code: 400,
                    message: "Không tồn tại bản ghi!"
                });
                return [3, 3];
            case 3: return [2];
        }
    });
}); };
exports.changeStatus = changeStatus;
var changeMulti = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var TaskStatus, UpdateKey, _a, ids, key, value, _b, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                TaskStatus = void 0;
                (function (TaskStatus) {
                    TaskStatus["Initial"] = "initial";
                    TaskStatus["Doing"] = "doing";
                    TaskStatus["Finish"] = "finish";
                    TaskStatus["Pending"] = "pending";
                    TaskStatus["NotFinish"] = "notFinish";
                })(TaskStatus || (TaskStatus = {}));
                UpdateKey = void 0;
                (function (UpdateKey) {
                    UpdateKey["Status"] = "status";
                    UpdateKey["Delete"] = "delete";
                })(UpdateKey || (UpdateKey = {}));
                _a = req.body, ids = _a.ids, key = _a.key, value = _a.value;
                _b = key;
                switch (_b) {
                    case UpdateKey.Status: return [3, 1];
                    case UpdateKey.Delete: return [3, 3];
                }
                return [3, 5];
            case 1:
                if (!Object.values(TaskStatus).includes(value)) {
                    res.json({ code: 400, message: "Trạng thái không hợp lệ!" });
                    return [2];
                }
                return [4, task_model_1.default.updateMany({ _id: { $in: ids }, deleted: false }, { status: value })];
            case 2:
                _c.sent();
                res.json({ code: 200, message: "Đổi trạng thái thành công!" });
                return [3, 6];
            case 3: return [4, task_model_1.default.updateMany({ _id: { $in: ids }, deleted: false }, {
                    deleted: true, deletedAt: new Date()
                })];
            case 4:
                _c.sent();
                res.json({ code: 200, message: "Xóa công việc thành công!" });
                return [3, 6];
            case 5:
                res.json({ code: 400, message: "Không tồn tại key!" });
                return [3, 6];
            case 6: return [3, 8];
            case 7:
                error_2 = _c.sent();
                res.json({ code: 400, message: "Không tồn tại bản ghi!" });
                return [3, 8];
            case 8: return [2];
        }
    });
}); };
exports.changeMulti = changeMulti;
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var task;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                task = new task_model_1.default(req.body);
                return [4, task.save()];
            case 1:
                _a.sent();
                res.json({
                    code: 200,
                    message: "Tạo công việc thành công!"
                });
                return [2];
        }
    });
}); };
exports.create = create;
var edit = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                data = req.body;
                return [4, task_model_1.default.updateOne({
                        _id: id
                    }, data)];
            case 1:
                _a.sent();
                res.json({
                    code: 200,
                    message: "Cập nhật công việc thành công!"
                });
                return [2];
        }
    });
}); };
exports.edit = edit;
var deleteItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4, task_model_1.default.updateOne({
                        _id: id
                    }, {
                        deleted: true,
                        deletedAt: new Date()
                    })];
            case 1:
                _a.sent();
                res.json({
                    code: 200,
                    message: "Xóa công việc thành công!"
                });
                return [2];
        }
    });
}); };
exports.deleteItem = deleteItem;
