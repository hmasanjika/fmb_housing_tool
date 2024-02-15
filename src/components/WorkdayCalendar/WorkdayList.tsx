import React from "react";
import { Address, Addresses, WDay } from "../../models/types";
import { TimeOfDay } from "../../models/enums";
import DayItem from "./DayItem";
import publicHolidays from "../../hr/public_holidays.json";

type ListProps = {
  month: WDay[];
  addresses: Addresses;
  homeAddress: Address;
  updateDay: (editedDay: WDay) => void;
  updateMonth: (editedMonth: WDay[]) => void;
  isSplitDay: boolean;
};
type ItemProps = {
  day: WDay;
  index: number;
};
type WeekData = {
  dayNumber: number;
  workPlaceAddressAm: Address | null;
  workPlaceAddressPm: Address | null;
  isWorkdayAm: boolean;
  isWorkdayPm: boolean;
  isHolidayAm: boolean;
  isHolidayPm: boolean;
};
const WorkdayList = ({
  month,
  addresses,
  homeAddress,
  updateDay,
  updateMonth,
  isSplitDay,
}: ListProps) => {
  const isFirstFullWeekFriday = (index: number, day: WDay) => {
    const hasBeenOneFullWeek: boolean = index > 3 && index < 11;
    const isFriday: boolean = new Date(day.workDate).getDay() === 5;
    return hasBeenOneFullWeek && isFriday;
  };

  const autofillWeeks = (index: number) => {
    const weekData: WeekData[] = month
      .slice(index - 4, index + 1)
      .map((day: WDay) => {
        return {
          dayNumber: new Date(day.workDate).getDay(),
          workPlaceAddressAm: day.workPlaceAddressAm,
          workPlaceAddressPm: day.workPlaceAddressPm,
          isWorkdayAm: day.isWorkdayAm,
          isWorkdayPm: day.isWorkdayPm,
          isHolidayAm: day.isHolidayAm,
          isHolidayPm: day.isHolidayPm,
        };
      });

    month = month.map((day: WDay, i: number) => {
      const dayOfWeek = weekData.find(
        (weekday: WeekData) =>
          new Date(day.workDate).getDay() === weekday.dayNumber
      );
      if (dayOfWeek && i > index && !publicHolidays.includes(day.workDate)) {
        day.workPlaceAddressAm = dayOfWeek.workPlaceAddressAm;
        day.workPlaceAddressPm = dayOfWeek.workPlaceAddressPm;
        day.isWorkdayAm = dayOfWeek.isWorkdayAm;
        day.isWorkdayPm = dayOfWeek.isWorkdayPm;
        day.isHolidayAm = dayOfWeek.isHolidayAm;
        day.isHolidayPm = dayOfWeek.isHolidayPm;
      }
      return day;
    });

    updateMonth(month);
  };

  const Item = ({ day, index }: ItemProps) => {
    const date: Date = new Date(day.workDate);
    const weekday: string = date.toLocaleDateString("en-gb", {
      weekday: "short",
    });
    const formattedDate: string = date.toLocaleDateString("en-gb", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    return (
      <>
        <tr className="even:bg-base-100 odd:bg-accent odd:bg-opacity-20">
          <td className="flex !flex-row justify-between cellItem first:bg-accent first:bg-opacity-30">
            <div>{weekday}</div>
            <div>{formattedDate}</div>
          </td>
          {isSplitDay ? (
            <>
              <DayItem
                day={day}
                time={TimeOfDay.AM}
                defaultWorkplace={homeAddress}
                addresses={addresses}
                updateDay={updateDay}
              />
              <DayItem
                day={day}
                time={TimeOfDay.PM}
                defaultWorkplace={homeAddress}
                addresses={addresses}
                updateDay={updateDay}
              />
            </>
          ) : (
            <DayItem
              day={day}
              time={TimeOfDay.FULL}
              defaultWorkplace={homeAddress}
              addresses={addresses}
              updateDay={updateDay}
            />
          )}
        </tr>
        {isFirstFullWeekFriday(index, day) && (
          <tr className="full-width">
            <td className="p-0 border-none">
              <button
                className="btn btn-primary w-full"
                onClick={() => autofillWeeks(index)}
              >
                Click to fill the following weeks with the same arrangement as
                above <span className="ml-3 mb-0.5 text-lg">{"\u21E9"}</span>
              </button>
            </td>
          </tr>
        )}
      </>
    );
  };

  const SplitDayHeaders = () => {
    return (
      <thead>
        <tr className="table-header-grid">
          <th className="sticky bg-primary text-white row-span-2 header-date">Date</th>
          <th className="sticky bg-primary text-white col-start-2 col-span-3">
            Morning
          </th>
          <th className="bg-primary text-white col-start-5 col-span-3">
            Afternoon
          </th>
          <th className="bg-primary text-white bg-opacity-70">Location</th>
          <th className="bg-primary text-white bg-opacity-70">Workday</th>
          <th className="bg-primary text-white bg-opacity-70">Holiday</th>
          <th className="bg-primary text-white bg-opacity-80">Location</th>
          <th className="bg-primary text-white bg-opacity-80">Workday</th>
          <th className="bg-primary text-white bg-opacity-80">Holiday</th>
        </tr>
      </thead>
    );
  };

  const NonSplitDayHeaders = () => {
    return (
      <thead>
        <tr className="table-header-grid">
          <th className="sticky top-0 bg-primary text-white header-date">Date</th>
          <th className="sticky top-0 bg-primary text-white">Location</th>
          <th className="sticky top-0 bg-primary text-white">Workday</th>
          <th className="sticky top-0 bg-primary text-white">Holiday</th>
        </tr>
      </thead>
    );
  };

  return (
    <div className="formContainer">
      <div>
        <table
          className={
            isSplitDay
              ? "relative w-full wTable split-days"
              : "relative w-full wTable non-split-days"
          }
        >
          {isSplitDay ? <SplitDayHeaders /> : <NonSplitDayHeaders />}
          <tbody className="itemContainer">
            {month.map((day, index) => (
              <Item key={index} day={day} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkdayList;
