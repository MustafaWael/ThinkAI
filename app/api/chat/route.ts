import OpenAI from "openai";
import { StreamingTextResponse } from "ai";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { ChatOpenAI } from "@langchain/openai";
import { Calculator } from "langchain/tools/calculator";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import {
  convertVercelMessageToLangChainMessage,
  current_date_time_tool,
  extractAndConvertPreviousMessages,
  filterMessagesByRole,
} from "@/lib/utils";
import { AGENT_SYSTEM_TEMPLATE } from "@/constants";

export const runtime = "edge";

export async function POST(req: Request) {
  const body = await req.json();
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const messages = filterMessagesByRole(body.messages);
    const returnIntermediateSteps = body.show_intermediate_steps;
    const previousMessages = extractAndConvertPreviousMessages(
      messages,
      convertVercelMessageToLangChainMessage
    );
    const currentMessageContent = messages[messages.length - 1].content;

    const tools = [
      new Calculator(),
      new TavilySearchResults(),
      current_date_time_tool,
    ];

    const chat = new ChatOpenAI({
      modelName: "gpt-3.5-turbo-0125",
      temperature: 0,
      streaming: true,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", AGENT_SYSTEM_TEMPLATE],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);

    const agent = await createOpenAIFunctionsAgent({
      llm: chat,
      tools,
      prompt,
    });
    

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      returnIntermediateSteps,
    });

    if (!returnIntermediateSteps) {
      const logStream = agentExecutor.streamLog({
        input: currentMessageContent,
        chat_history: previousMessages,
      });

      const textEncoder = new TextEncoder();
      const transformStream = new ReadableStream({
        async start(controller) {
          for await (const chunk of logStream) {
            if (chunk.ops?.length > 0 && chunk.ops[0].op === "add") {
              const addOp = chunk.ops[0];
              if (
                addOp.path.startsWith("/logs/ChatOpenAI") &&
                typeof addOp.value === "string" &&
                addOp.value.length
              ) {
                controller.enqueue(textEncoder.encode(addOp.value));
              }
            }
          }
          controller.close();
        },
      });

      return new StreamingTextResponse(transformStream);
    } else {
      const result = await agentExecutor.invoke({
        input: currentMessageContent,
        chat_history: previousMessages,
      });
      return NextResponse.json(
        { output: result.output, intermediate_steps: result.intermediateSteps },
        { status: 200 }
      );
    }
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      throw error;
    }
  }
}
