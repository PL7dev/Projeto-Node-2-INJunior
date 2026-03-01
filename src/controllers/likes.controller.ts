import { FastifyReply } from 'fastify'
import prisma from '../utils/prisma'

export async function createLike(request: any, reply: FastifyReply) {
  try {
    const { postId, commentId } = request.body
    const userId = request.user.id

    if ((!postId && !commentId) || (postId && commentId)) {
      return reply.status(400).send({
        error: 'Você deve informar apenas postId OU commentId'
      })
    }

    if (postId) {
      const post = await prisma.post.findUnique({
        where: { id: Number(postId) }
      })

      if (!post) {
        return reply.status(404).send({ error: 'Post não encontrado' })
      }

      const alreadyLiked = await prisma.like.findFirst({
        where: {
          usuarioId: userId,
          postId: Number(postId)
        }
      })

      if (alreadyLiked) {
        return reply.status(400).send({ error: 'Você já deu like nesse post' })
      }

      const like = await prisma.like.create({
        data: {
          usuarioId: userId,
          postId: Number(postId)
        }
      })

      return reply.status(201).send(like)
    }

    if (commentId) {
      const comment = await prisma.comment.findUnique({
        where: { id: Number(commentId) }
      })

      if (!comment) {
        return reply.status(404).send({ error: 'Comentário não encontrado' })
      }

      const alreadyLiked = await prisma.like.findFirst({
        where: {
          usuarioId: userId,
          commentId: Number(commentId)
        }
      })

      if (alreadyLiked) {
        return reply.status(400).send({ error: 'Você já deu like nesse comentário' })
      }

      const like = await prisma.like.create({
        data: {
          usuarioId: userId,
          commentId: Number(commentId)
        }
      })

      return reply.status(201).send(like)
    }

  } catch (error) {
    console.error(error)
    return reply.status(500).send({ error: 'Erro ao criar like' })
  }
}

export async function deleteLike(request: any, reply: FastifyReply) {
  const { id } = request.params
  const userId = request.user.id

  const like = await prisma.like.findUnique({
    where: { id: Number(id) }
  })

  if (!like) {
    return reply.status(404).send({ error: 'Like não encontrado' })
  }

  if (like.usuarioId !== userId) {
    return reply.status(403).send({ error: 'Você não pode remover esse like' })
  }

  await prisma.like.delete({
    where: { id: Number(id) }
  })

  return reply.send({ message: 'Like removido com sucesso' })
}

export async function getAllLikes(request: any, reply: FastifyReply) {
  const likes = await prisma.like.findMany({
    include: {
      usuario: true,
      post: true,
      comment: true
    }
  })

  return reply.send(likes)
}

export async function getLikesByPost(request: any, reply: FastifyReply) {
  const { postId } = request.params

  const likes = await prisma.like.findMany({
    where: { postId: Number(postId) }
  })

  return reply.send(likes)
}

export async function getLikesByComment(request: any, reply: FastifyReply) {
  const { commentId } = request.params

  const likes = await prisma.like.findMany({
    where: { commentId: Number(commentId) }
  })

  return reply.send(likes)
}