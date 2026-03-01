import { FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../utils/prisma'

export async function createComment(request: any, reply: FastifyReply) {
  try {
    const { conteudo, postId } = request.body
    const userId = request.user.id

    if (!conteudo || !postId) {
      return reply.status(400).send({ error: 'Campos obrigatórios faltando' })
    }

    const post = await prisma.post.findUnique({
      where: { id: Number(postId) }
    })

    if (!post) {
      return reply.status(404).send({ error: 'Post não encontrado' })
    }

    const comment = await prisma.comment.create({
      data: {
        conteudo,
        usuarioId: userId,
        postId: Number(postId)
      }
    })

    return reply.status(201).send(comment)
  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao criar comentário' })
  }
}

export async function getAllComments(request: FastifyRequest, reply: FastifyReply) {
  const comments = await prisma.comment.findMany({
    include: {
      usuario: true,
      post: true
    }
  })

  return reply.send(comments)
}

export async function getCommentById(request: any, reply: FastifyReply) {
  const { id } = request.params

  const comment = await prisma.comment.findUnique({
    where: { id: Number(id) },
    include: {
      usuario: true,
      post: true
    }
  })

  if (!comment) {
    return reply.status(404).send({ error: 'Comentário não encontrado' })
  }

  return reply.send(comment)
}

export async function updateComment(request: any, reply: FastifyReply) {
  const { id } = request.params
  const { conteudo } = request.body
  const userId = request.user.id

  const comment = await prisma.comment.findUnique({
    where: { id: Number(id) }
  })

  if (!comment) {
    return reply.status(404).send({ error: 'Comentário não encontrado' })
  }

  if (comment.usuarioId !== userId) {
    return reply.status(403).send({ error: 'Você não pode editar esse comentário' })
  }

  const updated = await prisma.comment.update({
    where: { id: Number(id) },
    data: { conteudo }
  })

  return reply.send(updated)
}

export async function deleteComment(request: any, reply: FastifyReply) {
  const { id } = request.params
  const userId = request.user.id

  const comment = await prisma.comment.findUnique({
    where: { id: Number(id) }
  })

  if (!comment) {
    return reply.status(404).send({ error: 'Comentário não encontrado' })
  }

  if (comment.usuarioId !== userId) {
    return reply.status(403).send({ error: 'Você não pode deletar esse comentário' })
  }

  await prisma.comment.delete({
    where: { id: Number(id) }
  })

  return reply.send({ message: 'Comentário deletado com sucesso' })
}

export async function getCommentsByUser(request: any, reply: FastifyReply) {
  const { userId } = request.params

  const comments = await prisma.comment.findMany({
    where: { usuarioId: Number(userId) }
  })

  return reply.send(comments)
}

export async function getCommentsByPost(request: any, reply: FastifyReply) {
  const { postId } = request.params

  const comments = await prisma.comment.findMany({
    where: { postId: Number(postId) }
  })

  return reply.send(comments)
}