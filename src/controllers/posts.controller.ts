import { FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../utils/prisma'

export async function createPost(
  request: any,
  reply: FastifyReply
) {
  try {
    const { titulo, conteudo } = request.body

    const userId = request.user.id

    if (!titulo || !conteudo) {
      return reply.status(400).send({ error: 'Campos obrigatórios faltando' })
    }

    const post = await prisma.post.create({
      data: {
        titulo,
        conteudo,
        usuarioId: userId
      }
    })

    return reply.status(201).send(post)

  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao criar post' })
  }
}

export async function getAllPosts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    })

    return reply.send(posts)

  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao buscar posts' })
  }
}

export async function getPostById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const id = Number(request.params.id)

    if (isNaN(id)) {
      return reply.status(400).send({ error: 'ID inválido' })
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    })

    if (!post) {
      return reply.status(404).send({ error: 'Post não encontrado' })
    }

    return reply.send(post)

  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao buscar post' })
  }
}

export async function updatePost(
  request: any,
  reply: FastifyReply
) {
  try {
    const id = Number(request.params.id)
    const userId = request.user.id

    const post = await prisma.post.findUnique({
      where: { id }
    })

    if (!post) {
      return reply.status(404).send({ error: 'Post não encontrado' })
    }

    if (post.usuarioId !== userId) {
      return reply.status(403).send({ error: 'Você não pode editar esse post' })
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: request.body
    })

    return reply.send(updatedPost)

  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao atualizar post' })
  }
}

export async function deletePost(
  request: any,
  reply: FastifyReply
) {
  try {
    const id = Number(request.params.id)
    const userId = request.user.id

    const post = await prisma.post.findUnique({
      where: { id }
    })

    if (!post) {
      return reply.status(404).send({ error: 'Post não encontrado' })
    }

    if (post.usuarioId !== userId) {
      return reply.status(403).send({ error: 'Você não pode deletar esse post' })
    }

    await prisma.post.delete({
      where: { id }
    })

    return reply.send({ message: 'Post deletado com sucesso' })

  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao deletar post' })
  }
}