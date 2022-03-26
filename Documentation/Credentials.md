# Credentials

⚠️ You must create a file with the name `.env` in the project's root.

If you're using Visual Studio Code, install the following extension to make it easier to work with .env files

👉 [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)

Then, add the following content into the file:

```docker
# Wikipedia
WIKIPEDIA_API_URL="https://en.wikipedia.org/api/rest_v1"
# IBM Watson
WATSON_URL="https://gateway.watsonplatform.net/natural-language-understanding/api/"
WATSON_API_VERSION="2018-04-05"
WATSON_USERNAME=""
WATSON_PASSWORD=""
# Google
GOOGLE_API_KEY=""
GOOGLE_SEARCH_ENGINE_ID=""
# Google YouTube API
YOUTUBE_CLIENT_ID=""
YOUTUBE_CLIENT_SECRET=""
YOUTUBE_REDIRECT_URL="http://localhost:5000/oauth2callback"
```

*Adapt with your credentials*