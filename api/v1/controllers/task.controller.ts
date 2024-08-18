import { Request, Response } from "express";
import Task from "../models/task.model";
import paginationHelper from "../../../helpers/pagination";
import searchHelper from "../../../helpers/search";

// [GET] /api/v1/tasks
export const index = async (req: Request, res: Response): Promise<void> => {
  interface Find {
    deleted: boolean,
    status?: string,
    title?: RegExp,
    [key: string]: any;
  }

  const find: Find = {
    $or: [
      { createdBy: res['user'].id },
      { listUser: res['user'].id }
    ],
    deleted: false
  }

  if (req.query.status) {
    find["status"] = `${req.query.status}`;
  }

  // Sắp xếp
  const sort: any = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[`${req.query.sortKey}`] = `${req.query.sortValue}`;
  }
  // Hết Sắp xếp

  // Phân trang
  const pagination = {
    limit: 2,
    page: 1
  };

  const totalRecords = await Task.countDocuments(find);
  const objectPagination = paginationHelper(pagination, req.query, totalRecords);
  // Hết Phân trang

  // Tìm kiếm
  const objectSearch = searchHelper(req.query);
  if (req.query.keyword) {
    find.title = objectSearch.regex;
  }
  // Hết Tìm kiếm

  const tasks = await Task
    .find(find)
    .sort(sort)
    .limit(objectPagination.limit)
    .skip(objectPagination.skip);

  res.json(tasks);
}

// [GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
  const id: string = req.params.id;

  const task = await Task.findOne({
    _id: id,
    deleted: false
  });

  res.json(task);
}

// [PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    await Task.updateOne({ _id: req.params.id }, { status: req.body.status });

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!"
    });
  } catch (error) {
    // console.log(error);
    res.json({
      code: 400,
      message: "Không tồn tại bản ghi!"
    });
  }
};

// [PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response): Promise<void> => {
  try {
    enum TaskStatus {
      Initial = "initial",
      Doing = "doing",
      Finish = "finish",
      Pending = "pending",
      NotFinish = "notFinish"
    }

    enum UpdateKey {
      Status = "status",
      Delete = "delete"
    }

    const { ids, key, value }: {
      ids: string[],
      key: UpdateKey,
      value: TaskStatus
    } = req.body;

    switch (key) {
      case UpdateKey.Status:
        if (!Object.values(TaskStatus).includes(value)) {
          res.json({ code: 400, message: "Trạng thái không hợp lệ!" });
          return;
        }
        await Task.updateMany({ _id: { $in: ids }, deleted: false }, { status: value });

        res.json({ code: 200, message: "Đổi trạng thái thành công!" });
        break;
      case UpdateKey.Delete:
        await Task.updateMany({ _id: { $in: ids }, deleted: false }, {
          deleted: true, deletedAt: new Date()
        });
        res.json({ code: 200, message: "Xóa công việc thành công!" });
        break;
      default:
        res.json({ code: 400, message: "Không tồn tại key!" });
        break;
    }
  } catch (error) {
    res.json({ code: 400, message: "Không tồn tại bản ghi!" });
  }
};

// [POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response): Promise<void> => {
  // req.body.createdBy = res.locals.user.id;
  const task = new Task(req.body);
  await task.save();

  res.json({
    code: 200,
    message: "Tạo công việc thành công!"
  });
};

// [PATCH] /api/v1/tasks/edit/:id
export const edit = async (req: Request, res: Response): Promise<void> => {
  const id: string = req.params.id;
  const data = req.body;

  await Task.updateOne({
    _id: id
  }, data);

  res.json({
    code: 200,
    message: "Cập nhật công việc thành công!"
  });
};

// [PATCH] /api/v1/tasks/delete/:id
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  const id: string = req.params.id;

  await Task.updateOne({
    _id: id
  }, {
    deleted: true,
    deletedAt: new Date()
  });

  res.json({
    code: 200,
    message: "Xóa công việc thành công!"
  });
};