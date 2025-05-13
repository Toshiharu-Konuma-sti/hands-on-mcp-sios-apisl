export interface OfficeInfo {
  name: string;
  officeName: string;
  children: string[];
}

export interface OfficeCodes {
  [key: string]: OfficeInfo;
}

export interface AreaInfo {
  name: string;
  parent: string;
}

export interface AreaCodes {
  [key: string]: AreaInfo;
}

export interface AreaApiData {
  centers: OfficeCodes;
  offices: OfficeCodes;
  class10s: AreaCodes;
  class15s: AreaCodes;
  class20s: AreaCodes;
}