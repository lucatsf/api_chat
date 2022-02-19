import { prisma } from '../../../../database/prismaClient';

export class ProfileUseCase {
    async execute(user_id: string) {
        const user = await prisma.user.findFirst({
            where: {
                id: user_id,
            }
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                picture_url: user.picture_url,
                email: user.email
            }
        }
    }
}