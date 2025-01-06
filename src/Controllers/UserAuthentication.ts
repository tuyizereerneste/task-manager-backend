import User from "../models/User";
import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


interface CustomRequest extends Request {
    user?: {
        id: string;
    };
}

interface CreateUserBody {
    name: string;
    email: string;
    password: string
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
            const { name, email, password } = req.body;
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
            const newUser = await User.create({ name, email, password: hashedPassword });

            // Generate JWT token
            const payload = { id: newUser.id };
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
                },
            });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    static async login(
        req: CustomRequest & { body: CreateUserBody}, 
        res: Response): Promise<void> {

        try {
            const { email, password } = req.body;
            // Find the user by email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                res.status(401).json({ error: "Invalid credentials" });
                return;
            }

            // Compare the provided password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ error: "Invalid credentials" });
                return;
            }

            // Generate JWT token    
            const payload = { id: user.id };
            const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "23h" });

            // Send response
            console.log("User logged in successfully");
            res.status(200).json({
                message: "User logged in successfully",
                user: {
                    id: user.id,
                    token,
                    name: user.name,
                    email: user.email,
                },
            });
        } catch (error) {
            console.error("Error logging in user:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };
}

export default UserAuthentication;