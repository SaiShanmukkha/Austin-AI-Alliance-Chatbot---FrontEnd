import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
  generateText
} from "ai";

import { auth } from "@/app/(auth)/auth";
import { myProvider } from "@/lib/ai/models";
import { systemPrompt } from "@/lib/ai/prompts";
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from "@/lib/db/queries";
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from "@/lib/utils";

import { generateTitleFromUserMessage } from "../../actions";

export const maxDuration = 60;

// export async function POST(request: Request) {
//   const {
//     id,
//     messages,
//     selectedChatModel,
//   }: { id: string; messages: Array<Message>; selectedChatModel: string } =
//     await request.json();

//   const session = await auth();

//   if (!session || !session.user || !session.user.id) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   const userMessage = getMostRecentUserMessage(messages);

//   if (!userMessage) {
//     return new Response("No user message found", { status: 400 });
//   }

//   const chat = await getChatById({ id });

//   if (!chat) {
//     const title = await generateTitleFromUserMessage({ message: userMessage });
//     await saveChat({ id, userId: session.user.id, title });
//   }

//   await saveMessages({
//     messages: [{ ...userMessage, createdAt: new Date(), chatId: id }],
//   });

//   return createDataStreamResponse({
//     execute: (dataStream) => {
//       const result = streamText({
//         model: myProvider.languageModel('aaia-model'),
//         // system: systemPrompt({ selectedChatModel }),
//         messages,
//         maxSteps: 5,
//         experimental_transform: smoothStream({ chunking: "word" }),
//         experimental_generateMessageId: generateUUID,
//         onFinish: async ({ response, reasoning }) => {
//           if (session.user?.id) {
//             try {
//               const sanitizedResponseMessages = sanitizeResponseMessages({
//                 messages: response.messages,
//                 reasoning,
//               });

//               console.log("\n\n######\n\nResponse messages:\n\n", sanitizedResponseMessages);

//               await saveMessages({
//                 messages: sanitizedResponseMessages.map((message) => {
//                   return {
//                     id: message.id,
//                     chatId: id,
//                     role: message.role,
//                     content: message.content,
//                     createdAt: new Date(),
//                   };
//                 }),
//               });
//             } catch (error) {
//               console.error("Failed to save chat");
//             }
//           }
//         },
//         experimental_telemetry: {
//           isEnabled: true,
//           functionId: "stream-text",
//         },
//       });

//       result.mergeIntoDataStream(dataStream, {
//         sendReasoning: true,
//       });
//     },
//     onError: () => {
//       return "Oops, an error occured!";
//     },
//   });
// }

export async function POST(request: Request) {
  const {
    id,
    messages,
    selectedChatModel,
  }: { id: string; messages: Array<Message>; selectedChatModel: string } =
    await request.json();

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userMessage = getMostRecentUserMessage(messages);

  if (!userMessage) {
    return new Response("No user message found", { status: 400 });
  }

  const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await saveChat({ id, userId: session.user.id, title });
  }

  // Save user message immediately
  await saveMessages({
    messages: [{ ...userMessage, createdAt: new Date(), chatId: id }],
  });

  try {
    const prompt = userMessage.content; 
    // Use doGenerate instead of streamText
    const { text } = await generateText({
      model: myProvider.languageModel('aaia-model'),
      prompt: prompt
    });

    console.log("\n\n######\n\nAI Response:\n\n", text);
    const sanitizedResponseMessages = sanitizeResponseMessages({
      messages: [{ role: 'assistant', content: text, id: generateUUID() }], // Assuming the response is a single message; adjust if needed
      reasoning: undefined,  // Assuming reasoning is not included in the response; adjust if needed
    });


    console.log("\n\n######\n\nSanitized Response Messages:\n\n", sanitizedResponseMessages);

    // Check if the response is empty
    if (!sanitizedResponseMessages || sanitizedResponseMessages.length === 0) {
      console.error("No valid response received from AI.");
      return new Response("No response from AI.", { status: 500 });
    }

    // Save the sanitized response messages to the database
    await saveMessages({
      messages: sanitizedResponseMessages.map((message) => {
        return {
          id: message.id,
          chatId: id,
          role: message.role,
          content: message.content,
          createdAt: new Date(),
        };
      }),
    });

    // Return the final response to the client
    return new Response(
      JSON.stringify({
        success: true,
        messages: sanitizedResponseMessages,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error generating response:", error);
    return new Response("An error occurred while generating the response", {
      status: 500,
    });
  }
}




export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
