import { AreaApiData, OfficeCodes, AreaCodes } from "../interfaces/areaApi.js";

const URL_AREA = "https://www.jma.go.jp/bosai/common/const/area.json";
const URL_WEATHER_FORECAST = "https://www.jma.go.jp/bosai/forecast/data/forecast/{areaCode}.json";

export async function get_officecode_from_prefecture(prefecture: string): Promise<string> {
//  console.error(">>> areaName: ", areaName);
  const json: AreaApiData = await fetchAreaDataFromJmaAreaAPI();
  let officeCode = retrieveOfficeCodeFromPrefecture(json, prefecture);
  return officeCode;
}

export async function get_officecode_from_regionname(regionName: string): Promise<string> {
  const json: AreaApiData = await fetchAreaDataFromJmaAreaAPI();
  let officeName = retrieveOfficeNameFromRegionName(json, regionName);
  let officeCode = retrieveOfficeCodeFromOfficeName(json, officeName);
  return officeCode;
}

export async function get_officecode_from_cityname(cityName: string): Promise<string> {
  const json: AreaApiData = await fetchAreaDataFromJmaAreaAPI();
  let areaCode = retrieveAreaCodeFromCityName(json, cityName);
  let subOfficeCode = retrieveSubOfficeCodeFromAreaCode(json, areaCode);
  let officeCode = retrieveOfficeCodeFromSubOfficeCode(json, subOfficeCode);
  return officeCode;
}

export async function get_weather_forecast_from_officecode(areaCode: string): Promise<string> { 
  const resp = await fetch(URL_WEATHER_FORECAST.replace("{areaCode}", areaCode));
  const body = await resp.text();
  return body;
}

async function fetchAreaDataFromJmaAreaAPI(): Promise<AreaApiData> {
  const resp = await fetch(URL_AREA);
  const body = await resp.text();
  return JSON.parse(body);
}

function retrieveOfficeNameFromRegionName(json: AreaApiData, regionName: string): string {

  regionName = regionName.trim();
  if (regionName === "") {
    return "";
  }
  const officeCodes: OfficeCodes = json.centers;

  for (const code in officeCodes) {
    const target = officeCodes[code].name;
    if (target === regionName) {
      return officeCodes[code].officeName;
    }
  }
  for (const code in officeCodes) {
    const target = officeCodes[code].name;
    if (target.startsWith(regionName)) {
      return officeCodes[code].officeName;;
    }
  }

  return "";
}

function retrieveOfficeCodeFromPrefecture(json: AreaApiData, prefecture: string): string {

  prefecture = prefecture.trim();
  if (prefecture === "") {
    return "";
  }
  const officeCodes: OfficeCodes = json.offices;

  for (const code in officeCodes) {
    const target = officeCodes[code].name;
    if (target === prefecture) {
      return code;
    }
  }
  for (const code in officeCodes) {
    const target = officeCodes[code].name;
    if (target.startsWith(prefecture)) {
      return code;
    }
  }

  return "";
}

function retrieveOfficeCodeFromOfficeName(json: AreaApiData, officeName: string): string {

  officeName = officeName.trim();
  if (officeName === "") {
    return "";
  }
  const officeCodes: OfficeCodes = json.offices;

  for (const code in officeCodes) {
    const target = officeCodes[code].officeName;
    if (target === officeName) {
      return code;
    }
  }
  for (const code in officeCodes) {
    const target = officeCodes[code].officeName;
    if (target.startsWith(officeName)) {
      return code;
    }
  }

  return "";
}

function retrieveAreaCodeFromCityName(json: AreaApiData, cityName: string): string {

  cityName = cityName.trim();
  if (cityName === "") {
    return "";
  }
  const areaCodes: AreaCodes = json.class20s;

  for (const code in areaCodes) {
    const target = areaCodes[code].name;
    if (target === cityName) {
      return areaCodes[code].parent;
    }
  }
  for (const code in areaCodes) {
    const target = areaCodes[code].name;
    if (target.startsWith(cityName)) {
      return areaCodes[code].parent;
    }
  }

  return "";
}

function retrieveSubOfficeCodeFromAreaCode(json: AreaApiData, areaCode: string): string {

  areaCode = areaCode.trim();
  if (areaCode === "") {
    return "";
  }
  const areaCodes: AreaCodes = json.class15s;

  for (const code in areaCodes) {
    if (code === areaCode) {
      return areaCodes[code].parent;
    }
  }

  return "";
}

function retrieveOfficeCodeFromSubOfficeCode(json: AreaApiData, subOfficeCode: string): string {

  subOfficeCode = subOfficeCode.trim();
  if (subOfficeCode === "") {
    return "";
  }
  const officeCodes: OfficeCodes = json.offices;

  for (const code in officeCodes) {
    const target = officeCodes[code].children;
    if (target.includes(subOfficeCode)) {
      return code;
    }
  }

  return "";
}