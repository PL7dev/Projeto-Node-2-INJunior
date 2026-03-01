import { FastifyInstance } from 'fastify'
import {
  createLike,
  deleteLike,
  getAllLikes,
  getLikesByPost,
  getLikesByComment
} from '../controllers/likes.controller'

export default async function likesRoutes(app: FastifyInstance) {

  app.post('/', { preHandler: (app as any).authenticate }, createLike)

  app.get('/', getAllLikes)
  app.get('/post/:postId', getLikesByPost)
  app.get('/comment/:commentId', getLikesByComment)

  app.delete('/:id', { preHandler: (app as any).authenticate }, deleteLike)
}