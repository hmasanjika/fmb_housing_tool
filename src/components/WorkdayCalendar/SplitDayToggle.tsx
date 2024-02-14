import React, { Dispatch, SetStateAction } from "react";
import { WDay } from "../../models/types";

type Props = {
  isSplitDay: boolean;
  setIsSplitDay: Dispatch<SetStateAction<boolean>>;
  month: WDay[];
  updateMonth: (editedMonth: WDay[]) => void;
};
const SplitDayToggle = ({
  isSplitDay,
  setIsSplitDay,
  month,
  updateMonth,
}: Props) => {
  const onToggle = () => {
    if (isSplitDay) {
      const editedMonth: WDay[] = month.map((day: WDay) => {
        return {
          ...day,
          isWorkdayPm: day.isWorkdayAm,
          isHolidayPm: day.isHolidayAm,
          workPlaceAddressPm: day.workPlaceAddressAm,
        };
      });
      updateMonth(editedMonth);
    }
    setIsSplitDay(!isSplitDay);
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        value="split-days"
        defaultChecked={isSplitDay}
        className="sr-only peer"
        onClick={onToggle}
      />
      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        Split days
      </span>
    </label>
  );
};

export default SplitDayToggle;
