# [Epic Stack](https://github.com/epicweb-dev/epic-stack) + [OpenAI](https://openai.com/)

https://github.com/kentcdodds/epic-ai/assets/1500684/376ac2f7-5bca-4049-bf84-b109abb23feb

This demonstrates how to use [OpenAI](https://openai.com/) with the
[Epic Stack](https://github.com/epicweb-dev/epic-stack). It includes streaming
from the chat completion API and enhances the note editor with a completion
button for both the title and the content.

To check out the changes, check
[the git commit history](https://github.com/kentcdodds/epic-ai/commit/bf820c1c8e0232012b690558a3a5f2cc8517168b).
The important bits are:

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
