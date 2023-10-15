import { MessageRole } from '@prisma/client';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { revalidatePath } from 'next/cache';
import OpenAI from 'openai';

import prisma from 'lib/prisma';
import { checkRateLimit } from 'lib/ratelimit';
import { getSpotifyClient } from 'lib/spotify';

interface OpenAIFunction {
  name: string;
  parameters: Record<string, unknown>;
  description?: string;
}

const topProperties = {
  limit: {
    type: 'string',
    description:
      'The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.',
  },
  offset: {
    type: 'number',
    description:
      'The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.',
  },
  time_range: {
    type: 'string',
    description:
      'Over what time frame the affinities are computed. Valid values: long_term (calculated from several years of data and including all new data as it becomes available), medium_term (approximately last 6 months), short_term (approximately last 4 weeks)',
  },
};

const functions: OpenAIFunction[] = [
  {
    name: 'get_top_artists',
    description: 'Get the users top artists',
    parameters: {
      type: 'object',
      properties: topProperties,
      required: ['limit', 'offset'],
    },
  },
  {
    name: 'get_top_tracks',
    description: 'Get the users top tracks',
    parameters: {
      type: 'object',
      properties: topProperties,
      required: ['limit', 'offset'],
    },
  },
];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const rateLimitResult = await checkRateLimit(req, 10, '1h');

  if (rateLimitResult.response) {
    return rateLimitResult.response;
  }

  const { messages, userId } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    stream: true,
    messages,
    functions,
  });

  const stream = OpenAIStream(response, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages,
    ) => {
      const result = await runFunction(name, args);

      const newMessages = createFunctionCallMessages(result);
      return openai.chat.completions.create({
        messages: [...messages, ...newMessages],
        stream: true,
        model: 'gpt-3.5-turbo-0613',
        functions,
      });
    },
    onStart: async () => {
      await prisma.message.create({
        data: {
          content: messages[messages.length - 1].content,
          role: 'user',
          userId,
        },
      });

      revalidatePath('/', 'page');
    },
    onCompletion: async (completion) => {
      let role: MessageRole = 'assistant';

      try {
        const parsedCompletion = JSON.parse(completion);

        if (parsedCompletion.function_call) {
          role = 'function';
        }
      } catch (err) {}

      await prisma.message.create({
        data: {
          content: completion,
          role,
          userId,
        },
      });

      revalidatePath('/', 'page');
    },
  });

  return new StreamingTextResponse(stream);
}

const runFunction = async (name: string, args: Record<string, unknown>) => {
  const spotify = await getSpotifyClient();

  switch (name) {
    case 'get_top_artists':
      return await spotify?.getTopArtists({
        ...args,
      });
    case 'get_top_tracks':
      return await spotify?.getTopTracks({
        ...args,
      });
    default:
      throw new Error(`Function ${name} does not exist`);
  }
};
