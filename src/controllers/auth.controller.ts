import { FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../utils/prisma'
import bcrypt from 'bcryptjs'

export async function login(
  request: FastifyRequest<{
    Body: { email: string; senha: string }
  }>,
  reply: FastifyReply
) {
  try {
    const { email, senha } = request.body

    const user = await prisma.usuario.findUnique({
      where: { email }
    })

    if (!user) {
      return reply.status(400).send({ error: 'Usuário não encontrado' })
    }

    const senhaValida = await bcrypt.compare(senha, user.senha)

    if (!senhaValida) {
      return reply.status(400).send({ error: 'Senha inválida' })
    }

    const token = await reply.jwtSign({
      id: user.id,
      email: user.email
    })

    return reply.send({ token })

  } catch (error) {
    return reply.status(500).send({ error: 'Erro no login' })
  }
}