// import { firestore } from 'firebase/app';
import { GeoPoint as GeoPointOrig } from "firebase/firestore";
import { IGeoPoint } from "../types";

/**
 * Wrapper for firestore geopoint class, mainly used to keep
 * imports clean when using the library.
 */
export default class GeoPoint implements IGeoPoint {
  private _native: GeoPointOrig;

  public constructor(latitude: number, longitude: number) {
    this._native = new GeoPointOrig(latitude, longitude);
  }

  public get native(): GeoPointOrig {
    return this._native;
  }

  public get latitude(): number {
    return this._native.latitude;
  }

  public set latitude(value: number) {
    this._native = new GeoPointOrig(value, this.longitude);
  }

  public get longitude(): number {
    return this._native.longitude;
  }

  public set longitude(value: number) {
    this._native = new GeoPointOrig(this.latitude, value);
  }

  public isEqual(other: IGeoPoint): boolean {
    return this._native.isEqual(other.native);
  }
}
