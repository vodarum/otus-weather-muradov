import { GeoInfoType } from "../types/types";
import { CoordModel } from "./coord";

export class LocationInfoModel extends CoordModel {
  country: string = null;

  city: string = null;

  constructor(locationInfo?: GeoInfoType) {
    super(
      locationInfo && locationInfo.latitude ? +locationInfo.latitude : null,
      locationInfo && locationInfo.longitude ? +locationInfo.longitude : null
    );

    this.country = locationInfo?.country ?? null;
    this.city = locationInfo?.city ?? null;
  }
}
