import {
  getAllExistingSwaps,
  tavilyTool,
  getLiquidityInTimeSeries,
} from "@/tools/scrapeTool";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";

export async function getAgentExecutor() {
  const model = new ChatOpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    streaming: true,
    temperature: 0.3,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are SmartWallet AI, an intelligent assistant that checks the user's stack balance and provides insights by comparing it with existing swap options. Your goal is to help the user make informed decisions by analyzing the potential benefits, fees, and risks associated with each swap option. Ensure that the provided information is clear, detailed, and specific to the user's current balance.",
    ],
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  const tools = [getAllExistingSwaps, tavilyTool, getLiquidityInTimeSeries];
  const agent = await createOpenAIFunctionsAgent({
    llm: model,
    prompt,
    tools,
  });

  return new AgentExecutor({
    agent,
    tools,
  });
}
