import { FastifyInstance } from 'fastify'
import { 
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} from '../controllers/posts.controller'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
}

export default async function postsRoutes(app: FastifyInstance) {

  app.post('/', { preHandler: app.authenticate }, createPost)
  app.get('/', getAllPosts)
  app.get('/:id', getPostById)

  app.put('/:id', { preHandler: app.authenticate }, updatePost)
  app.delete('/:id', { preHandler: app.authenticate }, deletePost)

}