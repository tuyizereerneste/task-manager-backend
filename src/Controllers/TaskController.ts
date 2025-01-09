import { Request, Response } from 'express';
import Task from '../models/Tasks';
import Board from '../models/Board';
import { isUUID } from 'validator';

interface CustomRequest extends Request {
        user?: {
            id: string;
        };
    }

interface CreateTaskBody {
        title: string;
        description: string;
        priority: 'LOW' | 'MEDIUM' | 'HIGH';
        status: 'To Do' | 'In Progress' | 'Completed';
        due_date?: Date;
        creator_id: string;
        assignee_id: string;
        board_id: string;
    }

class TaskController {
        static async createTask(req: CustomRequest & { body: CreateTaskBody }, res: Response): Promise<void> {
            try {
                const creator_id = req.user?.id;
    
                if (!creator_id) {
                    console.error("Unauthorized");
                    res.status(401).json({ error: "Unauthorized" });
                    return;
                }
    
                const { title, description, priority, status, due_date, assignee_id, board_id } = req.body;
    
                if (!board_id) {
                    console.error("Board ID not provided");
                    res.status(400).json({ error: "Board ID not provided" });
                    return;
                }
    
                // Validate UUID format
                if (!isUUID(board_id)) {
                    console.error("Invalid board ID format");
                    res.status(400).json({ error: "Invalid board ID format" });
                    return;
                }
    
                // Validate that the board exists
                let board;
                try {
                    board = await Board.findByPk(board_id);
                } catch (error) {
                    console.error("Database error while validating board ID:", error);
                    res.status(500).json({ error: "Internal Server Error" });
                    return;
                }
    
                if (!board) {
                    console.error("Invalid board ID");
                    res.status(404).json({ error: "Invalid board ID" });
                    return;
                }
    
                const task = await Task.create({
                    title,
                    description,
                    priority,
                    status,
                    due_date,
                    creator_id,
                    assignee_id: assignee_id || creator_id,
                    board_id,
                });
    
                // console.log("Task created successfully:", task);
                res.status(201).json({ task });
            } catch (error) {
                console.error("Error creating task:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        }

        static async getTasks(req: CustomRequest, res: Response): Promise<void> {
            try {
                const creator_id = req.user?.id;
                const { board_id } = req.body;
    
                if (!creator_id) {
                    console.error("Unauthorized");
                    res.status(401).json({ error: "Unauthorized" });
                    return;
                }
    
                const tasks = await Task.findAll({ where: { creator_id, board_id } });
    
                console.log("Tasks fetched successfully:");
                res.status(200).json({ tasks });
            } catch (error) {
                console.error("Error fetching tasks:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        }

        static async deleteTask(req: CustomRequest, res: Response): Promise<void> {
            try {
                const creator_id = req.user?.id;
                const { board_id } = req.body;
                const { task_id } = req.params;
    
                if (!creator_id) {
                    console.error("Unauthorized");
                    res.status(401).json({ error: "Unauthorized" });
                    return;
                }
                if (!isUUID(task_id)) {
                    console.error("Invalid task ID format");
                    res.status(400).json({ error: "Invalid task ID format" });
                    return;
                }
                if (!task_id) {
                    console.error("Task ID not provided");
                    res.status(400).json({ error: "Task ID not provided" });
                    return;
                }
    
                await Task.destroy({ where: { id: task_id, creator_id, board_id } });
    
                console.log("Task deleted successfully");
                res.status(200).json({ message: "Task deleted successfully" });
            } catch (error) {
                console.error("Error deleting task:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        }

        static async updateTask(req: CustomRequest, res: Response): Promise<void> {
            try {
                const creator_id = req.user?.id;
                const { task_id } = req.params;  // Task ID from URL parameters
                const { board_id } = req.body;  // Board ID from request body
                const { title, description, priority, status, due_date, assignee_id } = req.body;
        
                if (!creator_id) {
                    console.error("Unauthorized");
                    res.status(401).json({ error: "Unauthorized" });
                    return;
                }
        
                // Check if task exists and belongs to the creator
                const task = await Task.findOne({ where: { id: task_id, creator_id, board_id } });
        
                if (!task) {
                    console.error("Task not found or unauthorized");
                    res.status(404).json({ error: "Task not found or unauthorized" });
                    return;
                }
        
                // Update the task with the provided fields
                task.title = title || task.title;
                task.description = description || task.description;
                task.priority = priority || task.priority;
                task.status = status || task.status;
                task.due_date = due_date || task.due_date;
                task.assignee_id = assignee_id || task.assignee_id;
        
                // Save the updated task
                await task.save();
        
                console.log("Task updated successfully");
                res.status(200).json({ message: "Task updated successfully", task });
            } catch (error) {
                console.error("Error updating task:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        }        
}
    
export default TaskController;
