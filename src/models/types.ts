import { ModalTypes } from "./enums";

export type Address = {
  addressName: string;
  address: string;
  addressCoordinates: AddressCoordinates;
  distanceFromHome: number;
  inputValueAddress?: string;
};

export type APIAddress = {
  formatted_address: string;
  geometry: APIAddressGeometry;
  inputValueAddress?: string;
};

type APIAddressGeometry = {
  location: AddressCoordinates;
};

export type AddressCoordinates = {
  lat: number;
  lng: number;
};

export type Addresses = Address[];

export type WDay = {
  workDate: string;
  workPlaceAddressAm: Address | null;
  workPlaceAddressPm: Address | null;
  isWorkdayAm: boolean;
  isWorkdayPm: boolean;
  isHolidayAm: boolean;
  isHolidayPm: boolean;
  isWeekend: boolean;
};

export type WMonth = {
  month: number;
  year: number;
  workdays: WDay[];
};

export type Workdays = WMonth[];

export type Option = {
  key: number;
  value: string;
  disabled?: boolean;
};

export type ModalDetails = {
  message: string;
  type: ModalTypes;
  addressInfos?: undefined | APIAddress;
  url?: string;
};

export type StoredFile = {
  name: string;
  base64: string;
}
