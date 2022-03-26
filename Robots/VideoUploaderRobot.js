
import express from 'express';
import google from 'googleapis/google';
import { loadState, saveState } from './StateRobot.js';

const oAuth2 = google.auth.OAuth2;

export default async function videoUploaderRobot() {
    const content = loadState();

    await authenticate();

    saveState(content);
}

async function authenticate() {
    const webServer = await startWebServer();
    const oAuthClient = await createOAuthClient();
    requestUserConsent(oAuthClient);
    const authToken = await waitForGoogleCallback(webServer);
    await requestGoogleForAccessTokens(oAuthClient, authToken);
    await setGlobalGoogleAuthentication(oAuthClient);
    await stopWebServer(webServer);
}

async function startWebServer() {
    return new Promise((resolve, reject) => {
        const port = 5000;
        const app = express();

        const server = app.listen(port, () => {
            console.log(`> Listening on http://localhost:${port}`);

            resolve({
                app,
                server
            });
        });
    });
}

async function createOAuthClient() {
    const oAuthClient = new oAuth2(
        process.env.YOUTUBE_CLIENT_ID,
        process.env.YOUTUBE_CLIENT_SECRET,
        process.env.YOUTUBE_REDIRECT_URL
    );

    return oAuthClient;
}

function requestUserConsent(oAuthClient) {
    const consentUrl = oAuthClient.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/youtube']
    });

    console.log(`> Please give your consent: ${consentUrl}`);
}

async function waitForGoogleCallback(webServer) {
    return new Promise((resolve, reject) => {
        console.log('> Waiting for user consent...');

        webServer.app.get('/oauth2callback', (req, res) => {
            const authCode = req.query.code;

            const message = '<h1>Thank you!</h1><p>Now close this tab.</p>';
            res.sent(message);

            resolve(authCode);
        });
    });
}

async function requestGoogleForAccessTokens(oAuthClient, authToken) {
    return new Promise((resolve, reject) => {
        oAuthClient.getToken(authToken, (error, tokens) => {
            if (error) {
                return reject(error);
            }

            oAuthClient.setCredentials(tokens);

            resolve();
        });
    });
}

async function setGlobalGoogleAuthentication(oAuthClient) {
    google.options({
        auth: oAuthClient
    });
}

async function stopWebServer(webServer) {
    return new Promise((resolve, reject) => {
        webServer.server.close(() => {
            resolve();
        })
    });
}