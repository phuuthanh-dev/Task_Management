import { Request, Response } from "express";
import User from "../models/user.model";
import md5 from "md5";
import { generateRandomNumber, generateRandomString } from "../../../helpers/generate";
import ForgotPassword from "../models/forgot-password.model";
import sendEmail from "../../../helpers/sendEmail";

// [POST] /api/v1/users/register
export const register = async (req: Request, res: Response): Promise<void> => {
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if (existEmail) {
        res.json({ code: 400, message: "Email đã tồn tại!" });
        return;
    }

    const user = new User({ ...req.body, token: generateRandomString(20) });
    await user.save();

    res.json({
        code: 200,
        message: "Đăng ký tài khoản thành công!"
    });
};

// [POST] /api/v1/users/login
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const email: string = req.body.email;
        const password: string = md5(req.body.password);

        const existUser = await User.findOne({
            email: email,
            password: password,
            deleted: false
        }).select("token");

        if (!existUser) {
            res.json({ code: 400, message: "Email hoặc mật khẩu không đúng!" });
            return;
        }

        const token: string = existUser.token;

        res.json({ code: 200, message: "Đăng nhập thành công!", token: token });
    } catch (error) {
        res.json({ code: 500, message: "Đã có lỗi xảy ra!" });
    }
};

// [GET] /api/v1/users/detail
export const detail = async (req: Request, res: Response): Promise<void> => {
    res.json({
        code: 200,
        message: "Thành công!",
        user: res["user"]
    });
}

// [POST] /api/v1/users/forgot-password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email, deleted: false });
        if (!user) {
            res.status(400).json({ code: 400, message: 'Email không tồn tại!' });
            return
        }
        const otp = generateRandomNumber(6);
        const objectForgotPassword = {
            email,
            otp,
            expireAt: Date.now() + 3 * 60 * 1000
        }
        const forgotPassword = new ForgotPassword(objectForgotPassword);
        await forgotPassword.save();

        const subject = 'Mã OTP xác minh lấy lại mật khẩu';
        const html = `
            Mã OTP xác thực tài khoản của bạn là: <b>${otp}</b>. 
            Mã OTP có hiệu lực trong vòng 3 phút. Vui lòng không cung cấp mã OTP này với bất kỳ ai.
        `;
        sendEmail(email, subject, html);

        res.json({ code: 200, message: 'Vui lòng kiểm tra email của bạn!' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Có lỗi xảy ra!' });
    }
}

// [POST] /api/v1/users/verify-otp
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;
        const forgotPassword = await ForgotPassword.findOne({ email, otp });
        if (!forgotPassword) {
            res.status(400).json({ code: 400, message: 'Mã OTP không hợp lệ!' });
            return
        }
        const user = await User.findOne({ email: email, deleted: false });
        res.cookie("token", user.token)

        res.json({ code: 200, message: 'Xác thực thành công!' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Có lỗi xảy ra!' });
    }
}

// [POST] /api/v1/users/reset-password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies.token;
        const { password } = req.body;
        const user = await User.findOne({ token, deleted: false });
        
        if (!user) {
            res.status(400).json({ code: 400, message: 'Email không tồn tại!' });
            return
        }
        if (md5(password) === user.password) {
            res.status(400).json({ code: 400, message: 'Mật khẩu không được trùng với mật khẩu cũ!' });
            return
        }
        await User.updateOne({ token, deleted: false }, { password: md5(password) });
        res.json({ code: 200, message: 'Cập nhật mật khẩu thành công!' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Có lỗi xảy ra!' });
    }
}

// [GET] /api/v1/users/list
export const list = async (req: Request, res: Response): Promise<void>=> {
    const users = await User.find({ deleted: false })
        .select("fullName email avatar");

    res.json({ code: 200, message: 'Thành công!', data: users });
}