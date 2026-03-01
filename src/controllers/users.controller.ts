import { FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../utils/prisma'
import bcrypt from 'bcryptjs'

type CreateUserBody = {
  nome: string
  email: string
  senha: string
  foto?: string
}

export async function createUser(
  request: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply
) {
  try {
    const { nome, email, senha, foto } = request.body

    if (!nome || !email || !senha) {
      return reply.status(400).send({ error: 'Campos obrigatórios faltando' })
    }

    const userExists = await prisma.usuario.findUnique({
      where: { email }
    })

    if (userExists) {
      return reply.status(400).send({ error: 'Email já cadastrado' })
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const user = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        foto
      }
    })

    const { senha: _, ...userWithoutPassword } = user

    return reply.status(201).send(userWithoutPassword)

  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao criar usuário' })
  }
}

export async function getAllUsers(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const users = await prisma.usuario.findMany()

    const usersWithoutPassword = users.map(({ senha, ...user }) => user)

    return reply.send(usersWithoutPassword)
  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao buscar usuários' })
  }
}

export async function getUserById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const id = Number(request.params.id)

    if (isNaN(id)) {
      return reply.status(400).send({ error: 'ID inválido' })
    }

    const user = await prisma.usuario.findUnique({
      where: { id },
      include: { posts: true }
    })

    if (!user) {
      return reply.status(404).send({ error: 'Usuário não encontrado' })
    }

    const { senha, ...userWithoutPassword } = user

    return reply.send(userWithoutPassword)

  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao buscar usuário' })
  }
}

export async function updateUser(
  request: FastifyRequest<{
    Params: { id: string }
    Body: { nome?: string; email?: string; senha?: string; foto?: string }
  }>,
  reply: FastifyReply
) {
  try {
    const id = Number(request.params.id)

    if (isNaN(id)) {
      return reply.status(400).send({ error: 'ID inválido' })
    }

    const userExists = await prisma.usuario.findUnique({
      where: { id }
    })

    if (!userExists) {
      return reply.status(404).send({ error: 'Usuário não encontrado' })
    }

    const data: any = { ...request.body }

    if (data.senha) {
      const bcrypt = await import('bcryptjs')
      data.senha = await bcrypt.default.hash(data.senha, 10)
    }

    const updatedUser = await prisma.usuario.update({
      where: { id },
      data
    })

    const { senha, ...userWithoutPassword } = updatedUser

    return reply.send(userWithoutPassword)

  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao atualizar usuário' })
  }
}

export async function deleteUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const id = Number(request.params.id)

    if (isNaN(id)) {
      return reply.status(400).send({ error: 'ID inválido' })
    }

    const userExists = await prisma.usuario.findUnique({
      where: { id }
    })

    if (!userExists) {
      return reply.status(404).send({ error: 'Usuário não encontrado' })
    }

    await prisma.usuario.delete({
      where: { id }
    })

    return reply.send({ message: 'Usuário deletado com sucesso' })

  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao deletar usuário' })
  }
}