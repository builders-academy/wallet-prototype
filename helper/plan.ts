// import { ChatOpenAI } from "@langchain/openai";
// import { z } from "zod";
// import { zodToJsonSchema } from "zod-to-json-schema";
// import { JsonOutputToolsParser } from "@langchain/core/output_parsers/openai_tools";
// import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { END, START, StateGraph } from "@langchain/langgraph";
// import { RunnableConfig } from "@langchain/core/runnables";
// import { agentExecutor } from "@/agents/analyst";
// import { planExecuteState } from "@/helper/state";

// interface PlanExecuteState {
//   input: string;
//   plan: string[];
//   pastSteps: [string, string][];
//   response?: string;
// }
// const plan = zodToJsonSchema(
//   z.object({
//     steps: z
//       .array(z.string())
//       .describe("different steps to follow, should be in sorted order"),
//   })
// );
// const planFunction = {
//   name: "plan",
//   description: "This tool is used to plan the steps to follow",
//   parameters: plan,
// };

// const planTool = {
//   type: "function",
//   function: planFunction,
// };

// const plannerPrompt = ChatPromptTemplate.fromTemplate(
//   `For the given objective, come up with a simple step by step plan. \
//   This plan should involve individual tasks, that if executed correctly will yield the correct answer. Do not add any superfluous steps. \
//   The result of the final step should be the final answer. Make sure that each step has all the information needed - do not skip steps.

//   {objective}`
// );

// const model = new ChatOpenAI({
//   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
// }).withStructuredOutput(planFunction);

// const planner = plannerPrompt.pipe(model);

// const response = zodToJsonSchema(
//   z.object({
//     response: z.string().describe("Response to user."),
//   })
// );

// const responseTool = {
//   type: "function",
//   function: {
//     name: "response",
//     description: "Response to user.",
//     parameters: response,
//   },
// };

// const replannerPrompt = ChatPromptTemplate.fromTemplate(
//   `For the given objective, come up with a simple step by step plan.
//   This plan should involve individual tasks, that if executed correctly will yield the correct answer. Do not add any superfluous steps.
//   The result of the third step should be the final answer.
//     Your objective was this:
//     {input}

//     Your original plan was this:
//     {plan}

//     You have currently done the follow steps:
//     {pastSteps}

//     Update your plan accordingly. If no more steps are needed and you can return to the user, then respond with that and use the 'response' function.
//     Otherwise, fill out the plan.
//     Only add steps to the plan that still NEED to be done. Do not return previously done steps as part of the plan.
//   `
// );

// const parser = new JsonOutputToolsParser();
// const replanner = replannerPrompt
//   .pipe(
//     new ChatOpenAI({
//       model: "gpt-4o",
//       apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
//     }).bindTools([planTool, responseTool])
//   )
//   .pipe(parser);

// export async function executeStep(
//   state: PlanExecuteState,
//   config?: RunnableConfig
// ): Promise<Partial<PlanExecuteState>> {
//   const task = state.plan[0];
//   const input = {
//     messages: ["user", task],
//   };

//   const { messages } = await agentExecutor.invoke(input, config);

//   return {
//     pastSteps: [[task, messages[messages.length - 1].content.toString()]],
//     plan: state.plan.slice(1),
//   };
// }

// export async function planStep(
//   state: PlanExecuteState
// ): Promise<Partial<PlanExecuteState>> {
//   const plan = await planner.invoke({ objective: state.input });
//   return { plan: plan.steps };
// }

// export async function replanStep(
//   state: PlanExecuteState
// ): Promise<Partial<PlanExecuteState>> {
//   const output = await replanner.invoke({
//     input: state.input,
//     plan: state.plan.join("\n"),
//     pastSteps: state.pastSteps
//       .map(([step, result]) => `${step}: ${result}`)
//       .join("\n"),
//   });
//   const toolCall = output[0];

//   if (toolCall.type == "response") {
//     return { response: toolCall.args?.response };
//   }

//   return { plan: toolCall.args?.steps };
// }

// export function shouldEnd(state: PlanExecuteState) {
//   return state.response ? "true" : "false";
// }
