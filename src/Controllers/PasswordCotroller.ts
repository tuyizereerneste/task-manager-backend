import bcrypt from "bcrypt";
import { Request, Response } from "express";
import  User from "../models/User";

interface CustomRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}

interface ChangePasswordBody {
    oldPassword: string;
    newPassword: string;
}

class PasswordController {

    /**
     * @description Change password
     * @route POST /user/change-password
     * @req {CustomRequest} req - The request object
     * @res {Response} res - The response object
     * @payload {string} oldPassword - The old password
     * @payload {string} newPassword - The new password
     */
    static async changePassword(
        req: CustomRequest & { body: Pick<ChangePasswordBody, "oldPassword" | "newPassword"> },
        res: Response): Promise<void> {
        try {
            const { oldPassword, newPassword } = req.body;
            const user = await User.findOne({ where: { id: req.user?.id } });
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ error: "Invalid credentials" });
                return;
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            user.password = hashedPassword;
            await user.save();
            res.status(200).json({ message: "Password changed successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export default PasswordController;