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

        io.emit('new_message_chat', newMessage);

        return newMessage;
    }
}
