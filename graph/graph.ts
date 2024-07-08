// // Import necessary modules
// "use server";
// import { planExecuteState } from "@/helper/state";
// import { END, START, StateGraph } from "@langchain/langgraph";
// import { planStep, executeStep, replanStep, shouldEnd } from "@/helper/plan";

// // Define the PlanExecuteState interface
// interface PlanExecuteState {
//   input: string;
//   plan: string[];
//   pastSteps: [string, string][];
//   response?: string;
// }

// // Define the function that encapsulates your workflow
// async function executeWorkflow(input: string): Promise<void> {
//   const workflow = new StateGraph<PlanExecuteState>({
//     channels: planExecuteState,
//   })
//     .addNode("planner", planStep)
//     .addNode("agent", executeStep)
//     .addNode("replan", replanStep)
//     .addEdge(START, "planner")
//     .addEdge("planner", "agent")
//     .addEdge("agent", "replan")
//     .addConditionalEdges("replan", shouldEnd, {
//       true: END,
//       false: "agent",
//     });

//   const app = workflow.compile();

//   // Configuration for the LangChain stream
//   const config = { recursionLimit: 50 };
//   const inputs = { input };

//   try {
//     // Execute the workflow and stream events
//     for await (const event of await app.stream(inputs, config)) {
//       console.log(event);
//     }
//   } catch (error) {
//     console.error("Error executing workflow:", error);
//   }
// }

// // Export the function to be used in other parts of your Next.js backend
// export default executeWorkflow;
