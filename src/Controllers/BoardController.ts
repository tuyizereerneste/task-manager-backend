import { Request, Response } from 'express';
import Board from '../models/Board';

interface CustomRequest extends Request {
    user?: {
        id: string;
    };
}

interface CreateBoardBody {
    name: string;
}

class BoardController {
    static async createBoard(
        req: CustomRequest & { body: CreateBoardBody },
        res: Response
    ): Promise<void> {
        try {
            const user_id = req.user?.id;
            const { name } = req.body;

            // Check for authorization
            if (!user_id) {
                res.status(401).json({ error: "Unauthorized" });
            }

            // Validate `name` field
            if (!name || typeof name !== 'string') {
                res.status(400).json({ error: "Invalid board name" });
            }

            // Create the board
            const board = await Board.create({ name, user_id });

            console.log('Board created successfully');
            res.status(201).json({ board });
        } catch (error) {
            console.error('Error creating board:', error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
    static async getUserBoards(req: CustomRequest, res: Response): Promise<void> {
        try {
            const user_id = req.user?.id;
            if (!user_id) {
                res.status(401).json({ error: "Unauthorized" });
            }
            const boards = await Board.findAll({ where: { user_id } });
            res.status(200).json({ boards });
        } catch (error) {
            console.error('Error fetching boards:', error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async deleteBoard(req: CustomRequest, res: Response): Promise<void> {
        try {
            const user_id = req.user?.id;
            if (!user_id) {
                res.status(401).json({ error: "Unauthorized" });
            }
            const { id } = req.params;
            await Board.destroy({ where: { id, user_id } });
            console.log('Board deleted successfully');
            res.status(200).json({ message: "Board deleted successfully" });
        } catch (error) {
            console.error('Error deleting board:', error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export default BoardController;
