import React from "react";
import downArrow from "../../assets/icons/downArrow_purple.png";
import { Address, WDay } from "../../models/types";
import { TimeOfDay } from "../../models/enums";

type Props = {
  day: WDay;
  time: TimeOfDay;
  addresses: Address[];
  updateDay: (editedDay: WDay) => void;
};
const LocationDropdown = ({ day, time, addresses, updateDay }: Props) => {
  /**
   * Updates the day when the user has selected a new address in the dropdown
   * @param newLocation - The address of the newly selected location
   */
  const changeLocation = (newLocation: Address) => {
    // If in the non-split calendar view
    if (time === TimeOfDay.FULL) {
      day.workPlaceAddressAm = newLocation;
      day.workPlaceAddressPm = newLocation;
    }
    // If in the split calendar view
    else {
      day[`workPlaceAddress${time}`] = newLocation;
    }
    updateDay(day);
  };

  /**
   * Retrieves the name of the selected location at the specified time (when the user has worked) on this particular day.
   * Defaults to the home location when the previously selected location is deleted.
   * @param time - The time of day (AM or PM)
   * @returns The name of the address selected by the user at the specified time and day
   */
  const selectedAddress = (time: TimeOfDay) => {
    return day[`workPlaceAddress${time}`]?.addressName &&
      addresses.find(
        (add: Address) =>
          add.addressName === day[`workPlaceAddress${time}`]?.addressName
      )
      ? day[`workPlaceAddress${time}`].addressName
      : addresses[0]?.addressName ?? null;
  };

  // If user has worked during a non-split day or at the specified time on a split day
  if ((time === TimeOfDay.FULL && day.isWorkdayAm) || day[`isWorkday${time}`]) {
    return (
      <td
        className={
          time === TimeOfDay.PM
            ? "cellItem even:bg-accent even:bg-opacity-30 odd:bg-accent odd:bg-opacity-30"
            : "cellItem"
        }
      >
        <div className="dropdown dropdown-bottom w-full flex justify-center text-center">
          <div tabIndex={0} className="mouseHover selectLocation">
            {selectedAddress(time === TimeOfDay.FULL ? TimeOfDay.AM : time)}
            <img src={downArrow} alt="arrow" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content px-5 shadow bg-base-100 w-fit z-10"
          >
            {addresses.map((address, index) => {
              return (
                <li
                  className="p-2 mouseHover"
                  key={index}
                  onClick={() => changeLocation(address)}
                >
                  {address.addressName}
                </li>
              );
            })}
          </ul>
        </div>
      </td>
    );
  } else {
    return (
      <td
        className={
          time === TimeOfDay.PM
            ? "cellItem even:bg-accent even:bg-opacity-30 odd:bg-accent odd:bg-opacity-30"
            : "cellItem"
        }
      >
        <div>N/A</div>
      </td>
    );
  }
};

export default LocationDropdown;
