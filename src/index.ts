import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
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

const app = express();
const port = 8787;
let transport: SSEServerTransport | null = null;

app.get("/sse", async (_, res) => {
  console.log("Received connection");
  transport = new SSEServerTransport("/message", res);
  await server.connect(transport);
});

app.post("/message", async (req, res) => {
  console.log("Received message");
  transport?.handlePostMessage(req, res);
});

app.listen(port, () => {
  console.log("Remote MCP server listening on port", port);
});