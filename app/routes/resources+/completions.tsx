import { invariant } from '@epic-web/invariant'
import { type LoaderFunctionArgs } from '@remix-run/node'
import OpenAI from 'openai'
import { type ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { eventStream } from 'remix-utils/sse/server'
import { authenticator, requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { name: true, username: true },
	})
	if (!user) {
		await authenticator.logout(request, { redirectTo: '/' })
		return new Response(null, { status: 401 })
	}

	const url = new URL(request.url)
	const title = url.searchParams.get('title')
	const content = url.searchParams.get('content')

	const name = user.name ?? user.username

	const messages: Array<ChatCompletionMessageParam> | null = title
		? [
				{
					role: 'system',
					content: `You are a helpful assistant. The user will provide a title of a note and you will reply without pleasantries and only text that could be the contents of that note.`,
				},
				{
					role: 'user',
					content: title,
					name,
				},
			]
		: content
			? [
					{
						role: 'system',
						content: `You are a helpful assistant. The user will provide the contents of a note and you will reply without pleasantries and only text that could be the short title (or summary) of that note. Try to keep it terse. Do not use quotation marks. Here are some examples:\n\nShopping list\nTips and tricks for breathing\nBlending in as a robot\nHow to survive a zombie apocalyps`,
					},
					{
						role: 'user',
						content: `I have written the following note, what would be a good title for this? Please provide a single suggestion without quotation marks.\n\n${content}`,
						name,
					},
				]
			: null

	invariant(messages, 'Must provide title or content')

	const stream = await openai.chat.completions.create({
		model: 'gpt-4',
		messages,
		temperature: 0.7,
		max_tokens: 1024,
		stream: true,
	})
	const controller = new AbortController()
	request.signal.addEventListener('abort', () => {
		controller.abort()
	})

	return eventStream(controller.signal, function setup(send) {
		async function handleStream() {
			for await (const part of stream) {
				const delta = part.choices[0].delta?.content?.replace(/\n/g, '␣')
				if (delta) send({ data: delta })
			}
		}
		handleStream().then(
			() => controller.abort(),
			() => controller.abort(),
		)
		return function clear() {}
	})
}
