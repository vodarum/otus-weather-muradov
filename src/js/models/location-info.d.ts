import { GeoInfoType } from "../types/types";
import { CoordModel } from "./coord";

export declare class LocationInfoModel extends CoordModel {
  country: string;
  city: string;
  constructor(locationInfo: GeoInfoType);
}
