import { CoordModel } from "./coord";

export class LocationInfoModel extends CoordModel {
  country = null;

  city = null;

  constructor(locationInfo) {
    super(locationInfo?.latitude ?? null, locationInfo?.longitude ?? null);

    this.country = locationInfo?.country ?? null;
    this.city = locationInfo?.city ?? null;
  }
}
