import React, { Dispatch, SetStateAction, useState } from "react";
import { Address, WDay, WMonth } from "../models/types";
import WorkdayList from "./WorkdayCalendar/WorkdayList";
import { getDistance } from "../utils/GetDistance";
import MonthPicker from "./MonthPicker";
import SplitDayToggle from "./WorkdayCalendar/SplitDayToggle";

type WorkdayProps = {
  data: WMonth;
  homeAddress: Address;
  addresses: Address[];
  setMainWorkplace: Dispatch<SetStateAction<Address | null>>;
  setDistance: Dispatch<SetStateAction<number | null>>;
  selectedDate: Date;
  setMonthData: Dispatch<SetStateAction<WMonth>>;
  updateDate: (date: Date) => void;
  updateWorkdaysByMonth: (updatedMonth: WMonth) => void;
};
const Workday = ({
  data,
  homeAddress,
  addresses,
  setMainWorkplace,
  setDistance,
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

  const saveWorkdays = () => {
    // const postData = data.workdays.map((day) => {
    //   return {
    //     ...day,
    //     employeeNumber: user.employeeNumber,
    //     workPlaceAddressIdAm: day.workPlaceAddressAm?.id,
    //     workPlaceAddressIdPm: day.workPlaceAddressPm?.id,
    //   };
    // });
    // const promise = new Promise((resolve) => {
    //   PostWorkdayBatch(postData).then((res) => {
    //     if (res.status === 201) {
    //       modalDetails({ message: "SAVED", type: ModalTypes.SUCCESS });
    //       resolve(true);
    //     } else {
    //       modalDetails({
    //         message: "Failed to save changes",
    //         type: ModalTypes.ERROR,
    //       });
    //       resolve(false);
    //     }
    //   });
    // });
    // return Boolean(await promise);
  };

  // const addWorkPlaceAddress = (
  //   group: {},
  //   product: WDay,
  //   workPlaceAddress: Address | null
  // ) => {
  //   if (workPlaceAddress) {
  //     group[workPlaceAddress.addressName] =
  //       group[workPlaceAddress.addressName] ?? [];
  //     group[workPlaceAddress.addressName].push(product);
  //   }
  //   return group;
  // };

  // const groupByLocation = data.workdays.reduce((group: {}, product: WDay) => {
  //   const { workPlaceAddressAm, workPlaceAddressPm } = product;
  //   group = addWorkPlaceAddress(group, product, workPlaceAddressAm);
  //   group = addWorkPlaceAddress(group, product, workPlaceAddressPm);
  //   return group;
  // }, {});
  // if (Object.values(groupByLocation).length > 0) {
  //   const mainWorkplaceId: string = Object.keys(groupByLocation).reduce(
  //     (a: string, b: string) =>
  //       groupByLocation[a] > groupByLocation[b] ? a : b
  //   );
  //   const newMainWorkplace =
  //     addresses.find((add: Address) => add.addressName === mainWorkplaceId) ??
  //     null;
  //   // setMainWorkplace(newMainWorkplace);
  //   if (newMainWorkplace) {
  //     const newDistance = Number(
  //       getDistance(
  //         newMainWorkplace.addressCoordinates,
  //         homeAddress.addressCoordinates
  //       )
  //     );
  //     // setDistance(newDistance);
  //   } else {
  //     const newDistance = null;
  //     // setDistance(newDistance);
  //   }
  // } else {
  //   // setMainWorkplace(null);
  //   // setDistance(null);
  // }

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
