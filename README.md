# YouTube Video Creator Robots

Six robots that work together to search texts, images, use Artificial Intelligence to create content, manage state, make a video and publish on YouTube! 🤖

Let's meet the robots:

## 💿 **Maria**, the state manager

Her job is to manage application state, such as save and load data and export methods to be used by all the other robots.

[Documentation 📄](./Documentation/StateRobot.md)

## 📰 **Alex**, the text hunter

His job is to search articles, histories and news about some topic using Google's API.
He uses Watson IA from IBM to search keywords for the given texts.

[Documentation 📄](./Documentation/TextRobot.md)

## 📷 **Mia**, the image hunter

Mia search and downloads the best images related to the topic using Google Images API.

[Documentation 📄](./Documentation/ImageRobot.md)

## 📽️ **Tom**, the video maker

Tom grab what Alex and Mia collected and creates a video with it, using After Effects.

[Documentation 📄](./Documentation/VideoRobot.md)

## 📢 **Fred**, the video uploader

To finish and share all the hard work to the human specie, Fred has one job: upload the video to YouTube!

## 👩‍🏭 **Lydia**, the orchestrator

To stop robots from messing up and taking over the world, we count on Lydia, the orchestrator.

She is the best at her job, instructing all robots working together without flaws like a maestro playing music.

[Documentation 📄](./Documentation/OrchestractorRobot.md)

# Areas

- Wikipedia
- Artificial intelligence
- Google
- Youtube

# Technologies

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Node](https://nodejs.org/en/docs/)
- [Wikimedia REST API](https://www.mediawiki.org/wiki/Wikimedia_REST_API)
- [Wikimedia REST API Swagger](https://en.wikipedia.org/api/rest_v1/)
- [IBM Watson](https://www.ibm.com/watson/developer)
- [Google API](https://developers.google.com/apis-explorer/#p/customsearch/v1/search.cse.list)
- [After Effects](https://usermanual.wiki/Pdf/AfterEffectsCS6ScriptingGuide.141598726/view)

# Setup

## Clone repository

Create and go to the directory where you want to place the repository

```bash
  cd my-directory
```

Clone the project

```bash
  git clone https://github.com/pncsoares/youtube-video-creator-robot.git
```

Go to the project directory

```bash
  cd youtube-video-creator-robot
```

# License

MIT