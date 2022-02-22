import { Router } from "express";
import "dotenv/config";
import { AuthenticateGoogleUserController } from "../../../../modules/account/useCases/authenticateGoogle/AuthenticateGoogleUserController";

const googleAuthenticate = Router();

const authenticateGoogleUserController = new AuthenticateGoogleUserController();

googleAuthenticate.get("/authenticate/google", (request, response) => {
    response.redirect(
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=http://ec2-3-19-76-255.us-east-2.compute.amazonaws.com/auth/google/callback&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email&access_type=offline&prompt=consent`
    );
});

googleAuthenticate.get("/auth/google/callback", (request, response) => {
    const { code } = request.query;

    response.redirect(`https://chat-drab-one.vercel.app/?code=${code}`);
});

googleAuthenticate.post("/auth/google/url", authenticateGoogleUserController.handle);

export { googleAuthenticate };
