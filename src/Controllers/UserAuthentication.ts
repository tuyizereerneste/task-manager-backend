import User, { Role } from "../models/User";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
    user?: {
        id: string;
        role: Role;
    };
}

interface CreateUserBody {
    name: string;
    email: string;
    password: string;
    role?: Role;
}

class UserAuthentication {
    /**
     * @description Register a new user
     * @route POST /user/register
     * @req {CustomRequest} req - The request object
     * @res {Response} res - The response object
     */
    static async register(
        req: CustomRequest & { body: CreateUserBody }, 
        res: Response): Promise<void> {
        try {
            const { name, email, password, role = Role.USER } = req.body;

            // Check if the user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                res.status(400).json({ error: "User already exists" });
                return;
            }

            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create the new user
            const newUser = await User.create({ name, email, password: hashedPassword, role });

            // Generate JWT token
            const payload = { id: newUser.id, role: newUser.role };
            const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1h" });

            // Send response
            console.log("User registered successfully");
            res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: newUser.id,
                    token,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
            });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    /**
     * @description Login a user
     * @route POST /user/login
     * @req {CustomRequest} req - The request object
     * @res {Response} res - The response object
     * @payload {string} email - jwt token associated with the user
     */
    static async login(
        req: CustomRequest & { body: Pick<CreateUserBody, "email" | "password"> }, 
        res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                res.status(401).json({ error: "Invalid credentials" });
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ error: "Invalid credentials" });
                return;
            }

            const payload = { id: user.id, role: user.role };
            const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "23h" });

            console.log("User logged in successfully");
            res.status(200).json({
                message: "User logged in successfully",
                user: {
                    id: user.id,
                    token,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (error) {
            console.error("Error logging in user:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getAllUsers(req: CustomRequest, res: Response): Promise<void> {
        try {
            const users = await User.findAll();
            res.status(200).json({ users });
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async getUserById(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const user = await User.findOne({ where: { id} });
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            res.status(200).json({ user });
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async updateUser(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name, email, role } = req.body;
            const user = await User.findOne({ where: { id } });
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            user.name = name || user.name;
            user.email = email || user.email;
            await user.save();
            res.status(200).json({ message: "User updated successfully" });
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async deleteUser(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const user = await User.findOne({ where: { id } });
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            await user.destroy();
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }


}

export default UserAuthentication;