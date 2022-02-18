import { prisma } from '../../../../database/prismaClient';
import { io } from '../../../../shared/infra/http/app';

export class CreateMessageUseCase {
    async execute(message: string, user_id: string) {
        const newMessage = await prisma.message.create({
            data: {
                message,
                user_id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        picture_url: true,
                    },
                }
            },
        });

        const messageEmit = {
            message,
            user_id,
            likes: newMessage.likes,
            updated_at: newMessage.updatedAt,
            author: {
                name: newMessage.user.name,
                picture_url: newMessage.user.picture_url,
            },
        }

        io.emit('new_post', messageEmit);

        return newMessage;
    }
}
