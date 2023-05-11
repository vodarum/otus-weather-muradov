import { CoordType } from "../types/types";

export class CoordModel implements CoordType {
  constructor();

  constructor(latitude: number, longitude: number);

  constructor(public latitude?: number, public longitude?: number) {}
}
