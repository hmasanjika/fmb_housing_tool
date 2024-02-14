import React from "react";
import WorkdayTypeRadioButtons from "./WorkdayTypeRadioButtons";
import LocationDropdown from "./LocationDropdown";
import { Address, WDay } from "../../models/types";
import { TimeOfDay } from "../../models/enums";

type Props = {
  day: WDay;
  time: TimeOfDay;
  defaultWorkplace: Address;
  addresses: Address[];
  updateDay: (editedDay: WDay) => void;
};
const DayItem = ({
  day,
  time,
  defaultWorkplace,
  addresses,
  updateDay,
}: Props) => {
  return (
    <>
      <LocationDropdown
        day={day}
        time={time}
        addresses={addresses}
        updateDay={updateDay}
      />
      <WorkdayTypeRadioButtons
        day={day}
        time={time}
        defaultWorkplace={defaultWorkplace}
        updateDay={updateDay}
      />
    </>
  );
};

export default DayItem;
