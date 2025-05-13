import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { get_officecode_from_prefecture, get_officecode_from_regionname, get_officecode_from_cityname, get_weather_forecast_from_officecode } from "./services/areaWeatherForecast.js";

const server = new McpServer({
  name: "mcp-sios-apisl-demo",
  version: "1.0.0",
});

server.tool(
  "get_officecode_from_prefecture",
  "Get an office code from a prefecture before getting a weather forecast.",
  {prefecture: z.string().describe("Prefecture")},
  async ({prefecture}) => {
    const areaCode = await get_officecode_from_prefecture(prefecture);
    return {content: [{type: "text", text: areaCode}]};
  }
);

server.tool(
  "get_officecode_from_regionname",
  "Get an office code from a region name before getting a weather forecast.",
  {regionName: z.string().describe("Region name")},
  async ({regionName}) => {
    const areaCode = await get_officecode_from_regionname(regionName);
    return {content: [{type: "text", text: areaCode}]};
  }
);

server.tool(
  "get_officecode_from_cityname",
  "Get an office code from a city name before getting a weather forecast.",
  {cityName: z.string().describe("City name")},
  async ({cityName}) => {
    const areaCode = await get_officecode_from_cityname(cityName);
    return {content: [{type: "text", text: areaCode}]};
  }
);

server.tool(
  "get_weather_forecast_from_officecode",
  "Get a weather forecast from an office code.",
  {officeCode: z.string().describe("Office code")},
  async ({officeCode}) => {
    const body = await get_weather_forecast_from_officecode(officeCode);
    return {content: [{type: "text", text: body}]};
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});