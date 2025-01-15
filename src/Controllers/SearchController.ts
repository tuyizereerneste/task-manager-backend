import { Request, Response } from "express";
import Task from "../models/Tasks";
import Board from "../models/Board";
import { Op } from "sequelize";
import { models } from "../models/index";

class SearchController {
    static async search(query: string) {
        try {
            // Find boards matching the query, including their tasks
            const boards = await models.Board.findAll({
                where: {
                    name: { [Op.iLike]: `%${query}%` },
                },
                include: [
                    {
                        model: Task,
                        as: 'tasks', // Matches the alias defined in Board.hasMany
                    },
                ],
            });
    
            // Find tasks matching the query, including their parent board
            const tasks = await models.Task.findAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.iLike]: `%${query}%` } },
                        { description: { [Op.iLike]: `%${query}%` } },
                    ],
                },
                include: [
                    {
                        model: Board,
                        as: 'board', // Matches the alias defined in Task.belongsTo
                    },
                ],
            });
    
            return { boards, tasks };
        } catch (error) {
            console.error('Error during search:', error);
            throw error;
        }
    }

    static async searchQuery(req: Request, res: Response) {
            const { query } = req.query;
            if (!query || typeof query !== 'string') {
                res.status(400).json({ error: 'Query parameter is required and must be a string' });
                return;
            }
            try {
                const results = await SearchController.search(query);
                res.status(200).json(results);
            } catch (error) {
                console.error('Error searching:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }

        }

        static async filterTasks(query: string, status?: string, priority?: string) {
            try {
              // Find tasks matching the query, including their parent board
              const tasks = await models.Task.findAll({
                where: {
                  [Op.or]: [
                    { title: { [Op.iLike]: `%${query}%` } },
                    { description: { [Op.iLike]: `%${query}%` } },
                  ],
                  // Apply filters if provided
                  ...(status && { status: status }),
                  ...(priority && { priority: priority }),
                },
                include: [
                  {
                    model: models.Board,
                    as: 'board', // Matches the alias defined in Task.belongsTo
                  },
                ],
              });
        
              return { tasks };
            } catch (error) {
              console.error('Error during search:', error);
              throw error;
            }
          }
        
          // Controller method to handle the API request
          static async filterQuery(req: Request, res: Response) {
            const { query, status, priority } = req.query;
        
            if (!query || typeof query !== 'string') {
              res.status(400).json({ error: 'Query parameter is required and must be a string' });
              return;
            }
        
            try {
              // Pass status and priority from the query parameters to the filter method
              const results = await SearchController.filterTasks(query as string, status as string, priority as string);
              res.status(200).json(results);
            } catch (error) {
              console.error('Error searching:', error);
              res.status(500).json({ error: 'Internal Server Error' });
            }
          }
}

export default SearchController;