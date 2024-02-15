import React, { Dispatch, SetStateAction, useState } from "react";
import { Address, WDay, WMonth } from "../models/types";
import WorkdayList from "./WorkdayCalendar/WorkdayList";
import MonthPicker from "./MonthPicker";
import SplitDayToggle from "./WorkdayCalendar/SplitDayToggle";

type WorkdayProps = {
  data: WMonth;
  homeAddress: Address;
  addresses: Address[];
  selectedDate: Date;
  setMonthData: Dispatch<SetStateAction<WMonth>>;
  updateDate: (date: Date) => void;
  updateWorkdaysByMonth: (updatedMonth: WMonth) => void;
};
const Workday = ({
  data,
  homeAddress,
  addresses,
  selectedDate,
  setMonthData,
  updateDate,
  updateWorkdaysByMonth,
}: WorkdayProps) => {
  const [isSplitDay, setIsSplitDay] = useState<boolean>(
    data.workdays.some(
      (day: WDay) =>
        day.workPlaceAddressAm?.addressName !==
        day.workPlaceAddressPm?.addressName
    )
  );

  const updateDay = (editedDay: WDay) => {
    let day = data.workdays.find(
      (day: WDay) => day.workDate === editedDay.workDate
    );
    day = editedDay;
    updateWorkdaysByMonth(data);
  };

  const updateMonth = (editedMonth: WDay[]) => {
    data.workdays = editedMonth;
    updateWorkdaysByMonth(data);
  };

  return (
    <div>
      <h2 className="sectionTitle">Workdays</h2>
      <div className="toggle-month-picker">
        <SplitDayToggle
          isSplitDay={isSplitDay}
          setIsSplitDay={setIsSplitDay}
          month={data.workdays}
          updateMonth={updateMonth}
        />
        {/* <MonthPicker updateDate={updateDate} selectedDate={selectedDate} /> */}
      </div>
      <WorkdayList
        month={data.workdays}
        addresses={addresses}
        homeAddress={homeAddress}
        updateDay={updateDay}
        updateMonth={updateMonth}
        isSplitDay={isSplitDay}
      />
    </div>
  );
};
export default Workday;
