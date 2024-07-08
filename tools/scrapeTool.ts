import axios from "axios";

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const tavilyTool = new TavilySearchResults({
  apiKey: process.env.NEXT_PUBLIC_TAVILY_API_KEY,
});

// tool to get all existing swaps
export const getAllExistingSwaps = new DynamicStructuredTool({
  name: "all_swaps",
  description: "Get all the swaps of a alex.",
  schema: z.object({}),
  func: async ({}) => {
    const loader = await axios.get("https://api.alexgo.io/v1/allswaps");
    const response = loader.data;
    return JSON.stringify(response);
  },
});

// tool to get liquidity in time series
export const getLiquidityInTimeSeries = new DynamicStructuredTool({
  name: "pool_token_stats",
  description: "Get the pool token stats..",
  schema: z.object({}),
  func: async ({}) => {
    const loader = await axios.get("https://api.alexgo.io/v1/pool_token_stats");
    const response = loader.data;
    return JSON.stringify(response);
  },
});
