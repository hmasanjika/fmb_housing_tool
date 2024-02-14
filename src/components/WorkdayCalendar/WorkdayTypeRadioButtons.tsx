import React from "react";
import { Address, WDay } from "../../models/types";
import { TimeOfDay } from "../../models/enums";

type Props = {
  day: WDay;
  time: TimeOfDay;
  defaultWorkplace: Address;
  updateDay: (editedDay: WDay) => void;
};
const WorkdayTypeRadioButtons = ({
  day,
  time,
  defaultWorkplace,
  updateDay,
}: Props) => {
  const setWorkdayType = (type: string) => {
    if (day[`isWorkday${time}`] && day.isWeekend) {
      day[`isWorkday${time}`] = false;
    } else {
      day[`isWorkday${time}`] = type === "workday";
      day[`isHoliday${time}`] = type === "holiday";
    }
    if (day[`isWorkday${time}`]) {
      day[`workPlaceAddress${time}`] = defaultWorkplace;
    } else {
      day[`workPlaceAddress${time}`] = null;
    }
    updateDay(day);
  };

  const setWorkdayTypeFullDay = (type: string) => {
    if (day.isWorkdayAm && day.isWeekend) {
      day.isWorkdayAm = false;
      day.isWorkdayPm = false;
    } else {
      day.isWorkdayAm = type === "workday";
      day.isWorkdayPm = type === "workday";
      day.isHolidayAm = type === "holiday";
      day.isHolidayPm = type === "holiday";
    }
    if (day.isWorkdayAm) {
      day.workPlaceAddressAm = defaultWorkplace;
      day.workPlaceAddressPm = defaultWorkplace;
    } else {
      day.workPlaceAddressAm = null;
      day.workPlaceAddressPm = null;
    }
    updateDay(day);
  };

  if (time === TimeOfDay.FULL) {
    return (
      <>
        <td className="cellItem centered justify-center">
          <input
            type="radio"
            name={day.workDate}
            value="workday"
            defaultChecked={day.isWorkdayAm ?? false}
            required={!day.isWeekend}
            className="checkbox checkbox-primary checkbox-xs"
            onClick={() => setWorkdayTypeFullDay("workday")}
          />
        </td>
        <td className="cellItem centered justify-center">
          {!day.isWeekend && (
            <input
              type="radio"
              name={day.workDate}
              value="holiday"
              defaultChecked={day.isHolidayAm ?? false}
              required={!day.isWeekend}
              className="checkbox checkbox-primary checkbox-xs"
              onClick={() => setWorkdayTypeFullDay("holiday")}
            />
          )}
        </td>
      </>
    );
  } else {
    return (
      <>
        <td
          className={
            time === TimeOfDay.PM
              ? "cellItem centered justify-center even:bg-accent even:bg-opacity-30 odd:bg-accent odd:bg-opacity-30"
              : "cellItem centered justify-center"
          }
        >
          <input
            type="radio"
            name={`${day.workDate}-${time}`}
            value="workday"
            defaultChecked={day[`isWorkday${time}`] ?? false}
            required={!day.isWeekend}
            className="checkbox checkbox-primary checkbox-xs"
            onClick={() => setWorkdayType("workday")}
          />
        </td>
        <td
          className={
            time === TimeOfDay.PM
              ? "cellItem centered justify-center even:bg-accent even:bg-opacity-30 odd:bg-accent odd:bg-opacity-30"
              : "cellItem centered justify-center"
          }
        >
          {!day.isWeekend && (
            <input
              type="radio"
              name={`${day.workDate}-${time}`}
              value="holiday"
              defaultChecked={day[`isHoliday${time}`] ?? false}
              required={!day.isWeekend}
              className="checkbox checkbox-primary checkbox-xs"
              onClick={() => setWorkdayType("holiday")}
            />
          )}
        </td>
      </>
    );
  }
};

export default WorkdayTypeRadioButtons;
