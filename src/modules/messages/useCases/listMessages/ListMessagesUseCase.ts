import { prisma } from '../../../../database/prismaClient';
import { io } from '../../../../shared/infra/http/app';

interface PaginatedMessages {
    page: number;
    totalPage: number;
}

export class ListMessagesUseCase {
    async execute({ page, totalPage }: PaginatedMessages) {

        if (page == null || totalPage == null) {
            page = 1;
            totalPage = 10;
        }

        let count = (page*totalPage)-totalPage;

        totalPage = totalPage*1;

        const messages = await prisma.message.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        picture_url: true,
                    },
                }
            },
            orderBy: {
                updatedAt: 'desc',
            },
            skip: count,
            take: totalPage,

        })

        return messages;
    }
}
