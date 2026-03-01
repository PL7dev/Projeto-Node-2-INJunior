import { FastifyInstance } from 'fastify'
import { login } from '../controllers/auth.controller'

export default async function authRoutes(app: FastifyInstance) {
  app.post('/login', login)
}