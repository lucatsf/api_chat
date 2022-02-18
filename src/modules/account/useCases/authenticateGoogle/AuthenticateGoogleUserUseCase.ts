import axios from 'axios';
import { prisma } from '../../../../database/prismaClient';
import { sign } from 'jsonwebtoken';
import querystring from "querystring";
import AppError from '../../../../shared/errors/AppError';
import auth from '../../../../config/auth';
import { DayjsDateProvider } from '../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider';

interface IAccessTokenResponse {
  access_token: string;
}

interface IUserResponse {
  picture: string,
  id: number,
  name: string,
  given_name: string,
}

class AuthenticateGoogleUserUseCase  {
  async execute(code: string) {
    const url = "https://oauth2.googleapis.com/token";
    const redirectURI = 'auth/google/callback'
    const values = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.SERVER_ROOT_URI}/${redirectURI}`,
      grant_type: "authorization_code",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ]
    };
    
    const {
      access_token,
      id_token,
    } = await axios.post(
      url,
      querystring.stringify(values),
      {
        headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        throw new AppError('Failed to fetch auth tokens', 500);
      }
    );

    const {
      id,
      email,
      picture
    } = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      throw new AppError('Failed to search user', 500);
    });

    let user = await prisma.user.findFirst({
      where: {
        google_id: id
      }
    });

    if (!user) {
      const dateProvider = new DayjsDateProvider();
      const index = email.indexOf('@');
  
      const name = email.substring(0, index);

      user = await prisma.user.create({
        data: {
          google_id: id,
          name,
          email,
          picture_url: picture,
        }
      })
      
      const refreshToken = sign({ id: user.id }, auth.secret_refresh_token, {
        subject: user.id,
        expiresIn: auth.expires_in_refresh_token,
      });
  
      const expiresDate = dateProvider.addDays(auth.expires_refresh_token_days);
  
      await prisma.userToken.create({
        data: {
          expiresDate,
          refreshToken,
          user_id: user.id
        }
      });

      return {
        token: refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture_url: user.picture_url
        }
      };
    }

    const userToken = await prisma.userToken.findFirst({
      where: {
        user_id: user.id,
      }
    });

    if (userToken) {
      await prisma.userToken.delete({
        where: {
          id: userToken.id
        }
      });
    }
    
    const userId = user.id;

    const token = sign({ id: userId }, auth.secret_refresh_token, {
      subject: user.id,
      expiresIn: auth.expires_in_refresh_token,
    });

    return {
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture_url: user.picture_url
      }
    };
  }
}

export { AuthenticateGoogleUserUseCase  };