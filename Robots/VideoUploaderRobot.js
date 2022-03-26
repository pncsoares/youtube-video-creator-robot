
import express from 'express';
import google from 'googleapis/google';
import fs from 'fs';
import { loadState } from './StateRobot.js';

const oAuth2 = google.auth.OAuth2;
const youtube = google.youtube({ version: 'v3' });

export default async function videoUploaderRobot() {
    const content = loadState();

    await authenticate();
    const videoInformation = await uploadVideo(content);
    await uploadThumbnail(videoInformation);
}

async function authenticate() {
    const webServer = await startWebServer();
    const oAuthClient = await createOAuthClient();
    requestUserConsent(oAuthClient);
    const authToken = await waitForGoogleCallback(webServer);
    await requestGoogleForAccessTokens(oAuthClient, authToken);
    await setGlobalGoogleAuthentication(oAuthClient);
    await stopWebServer(webServer);

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
}

async function uploadVideo(content) {
    const videoFilePath = './Videos/output.mov';
    const videoFileSize = fs.statSync(videoFilePath).size;
    const videoTitle = `${content.prefix} ${content.searchTerm}`;
    const videoTags = [content.searchTerm, ...content.sentences[0].keywords];
    const videoDescription = content.sentences.map(sentence => {
        return sentence.text;
    }).join('\n\n');

    const requestParameters = {
        part: 'snippet, status',
        requestBody: {
            snippet: {
                title: videoTitle,
                description: videoDescription,
                tags: videoTags
            },
            status: {
                privacyStatus: 'unlisted'
            }
        },
        media: {
            body: fs.createReadStream(videoFilePath)
        }
    };

    const youtubeResponse = await youtube.videos.insert(requestParameters, {
        onUploadProgress: onUploadProgress
    });

    console.log(`> Video available at: https://youtu.be/${youtubeResponse.data.id}`);

    return youtube.data;

    function onUploadProgress(event) {
        const progress = Math.round((event.bytesRead / videoFileSize) * 100);
        console.log(`> ${progress}% completed`);
    }
}

async function uploadThumbnail(videoInformation) {
    const videoId = videoInformation.id;
    const videoThumbnailFilePath = './Images/youtube-thumbnail.jpg';

    const requestParameters = {
        videoId: videoId,
        media: {
            mimeType: 'image/jpeg',
            body: fs.createReadStream(videoThumbnailFilePath)
        }
    };

    const youtubeResponse = await youtube.thumbnails.set(requestParameters);
    console.log('> Thumbnail uploaded!');
}