import { prisma } from '../../../../database/prismaClient';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import AppError from '../../../../shared/errors/AppError';
import auth from '../../../../config/auth';
import { DayjsDateProvider } from '../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    id: string;
    email: string;
    name: string;
  },
  token: string;
  refreshToken: string;
}

export class AuthenticateUserUseCase {
  async execute({ email, password }: IRequest): Promise<IResponse> {
    const dateProvider = new DayjsDateProvider();
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      throw new AppError('Email or password incorrect', 423);
    }

    const id = user.id;

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Email or password incorrect', 423);
    }

    const token = sign({ id }, auth.secret_token, {
      subject: user.id,
      expiresIn: auth.expires_in_token,
    });

    const refreshToken = sign({ id }, auth.secret_refresh_token, {
      subject: user.id,
      expiresIn: auth.expires_in_refresh_token,
    });

    const refreshTokenExpiresDate = dateProvider.addDays(auth.expires_refresh_token_days);

    await prisma.userToken.create({
      data: {
        expiresDate: refreshTokenExpiresDate,
        refreshToken,
        user_id: user.id
      }
    });

    const tokenReturn: IResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
      refreshToken
    };

    return tokenReturn;
  }
}
