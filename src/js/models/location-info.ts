import { GeoInfoType, LocationInfoType } from "../types/types";
import { CoordModel } from "./coord";

export class LocationInfoModel extends CoordModel implements LocationInfoType {
  country?: string;

  city?: string;

  constructor();

  constructor(locationInfo: GeoInfoType);

  constructor(locationInfo?: GeoInfoType) {
    if (locationInfo) {
      super(+locationInfo.latitude, +locationInfo.longitude);
    } else {
      super();
    }

    this.country = locationInfo?.country;
    this.city = locationInfo?.city;
  }
}
