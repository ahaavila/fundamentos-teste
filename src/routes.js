import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database()
export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            if(!title) return res.writeHead(400).end(JSON.stringify({ message: 'title is required' }))

            if(!description) return res.writeHead(400).end(JSON.stringify({ message: 'description is required' }))

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }

            database.insert('tasks', task)

            return res.writeHead(201).end(JSON.stringify({ message: 'task created' }))
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const task = database.select('tasks')

            return res.end(JSON.stringify(task))
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            if(!title) res.writeHead(400).end(JSON.stringify({ message: 'title is required' }))

            if(!description) res.writeHead(400).end(JSON.stringify({ message: 'description is required' }))

            try {
                database.update('tasks', id, {
                    title,
                    description,
                    updated_at: new Date()
                })

                return res.writeHead(204).end(JSON.stringify({ message: 'task updated' }))
            } catch {
                return res.writeHead(400).end(JSON.stringify({ message: 'task not found' }))
            }
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            try {
                database.delete('tasks', id)

                return res.writeHead(204).end(JSON.stringify({ message: 'task deleted' }))
            } catch {
                return res.writeHead(400).end(JSON.stringify({ message: 'task not found' }))
            }            
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            try {
                database.update('tasks', id, {
                    completed_at: new Date(),
                    updated_at: new Date()
                })

                return res.writeHead(204).end(JSON.stringify({ message: 'task completed' }))
            } catch {
                return res.writeHead(400).end(JSON.stringify({ message: 'task not found' }))
            }
        }
    }
]