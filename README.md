# Epic Stack + OpenAI

https://github.com/epicweb-dev/epic-stack/assets/1500684/5a3f69f2-80f6-4e62-8e9d-5285018520a2

This demonstrates how to use OpenAI with the Epic Stack. It includes streaming
from the chat completion API and enhances the note editor with a completion
button for both the title and the content.

To check out the changes, check the git commit history. The important bits are:

1. Get an API key from OpenAI (you probably will need to setup billing because
   their free tier does not seem to work very well)
2. Add the API key to the `.env` file for local testing and add a fake one to
   `.env.example` for the repo
3. Add the `openai` package to the `package.json` file
4. Add a mock handler for the chat completion API (for now, we just use
   passthrough, but if you want to mock it so this works offline, then go for
   it).
5. Add a resource route that will be used to stream the chat completion API
6. Add a generate button to the note editor for both the title and content.
   (Those will need to change to controlled inputs so that the completion can be
   added to the input value).
7. When the generate button is clicked, start a new `EventStream` and point it
   to our resource route.

[Watch me build this live on YouTube](https://www.youtube.com/watch?v=Qzpx-j-NxLY).
