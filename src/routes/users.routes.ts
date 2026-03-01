import { FastifyInstance } from 'fastify'
import { 
    createUser, 
    getAllUsers, 
    getUserById, 
    updateUser,
    deleteUser 
} from '../controllers/users.controller'
    
export default async function usersRoutes(app: FastifyInstance) {

  app.post('/', createUser)
  app.get('/', getAllUsers)
  app.get('/:id', getUserById)
  app.put('/:id', { preHandler: (app as any).authenticate }, updateUser)
  app.delete('/:id', { preHandler: (app as any).authenticate }, deleteUser)

}