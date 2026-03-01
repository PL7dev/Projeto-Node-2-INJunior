import { FastifyInstance } from 'fastify'
import {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
  getCommentsByUser,
  getCommentsByPost
} from '../controllers/comments.controller'

export default async function commentsRoutes(app: FastifyInstance) {

  app.post('/', { preHandler: (app as any).authenticate }, createComment)

  app.get('/', getAllComments)
  app.get('/:id', getCommentById)

  app.put('/:id', { preHandler: (app as any).authenticate }, updateComment)
  app.delete('/:id', { preHandler: (app as any).authenticate }, deleteComment)

  app.get('/user/:userId', getCommentsByUser)
  app.get('/post/:postId', getCommentsByPost)
}