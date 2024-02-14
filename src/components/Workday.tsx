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
      (day: WDay) => day.workPlaceAddressAm !== day.workPlaceAddressPm
    )
  );
  let mainWorkplace: Address | null;
  let distance: number | null;

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

  const addWorkPlaceAddress = (
    group: {},
    product: WDay,
    workPlaceAddress: Address | null
  ) => {
    if (workPlaceAddress) {
      group[workPlaceAddress.addressName] =
        group[workPlaceAddress.addressName] ?? [];
      group[workPlaceAddress.addressName].push(product);
    }
    return group;
  };

  const groupByLocation = data.workdays.reduce((group: {}, product: WDay) => {
    const { workPlaceAddressAm, workPlaceAddressPm } = product;
    group = addWorkPlaceAddress(group, product, workPlaceAddressAm);
    group = addWorkPlaceAddress(group, product, workPlaceAddressPm);
    return group;
  }, {});
  if (Object.values(groupByLocation).length > 0) {
    const mainWorkplaceId: string = Object.keys(groupByLocation).reduce(
      (a: string, b: string) =>
        groupByLocation[a] > groupByLocation[b] ? a : b
    );
    mainWorkplace =
      addresses.find((add: Address) => add.addressName === mainWorkplaceId) ?? null;
    if (mainWorkplace) {
      distance = Number(
        getDistance(
          mainWorkplace.addressCoordinates,
          homeAddress.addressCoordinates
        )
      );
    } else {
      distance = null;
    }
  } else {
    mainWorkplace = null;
    distance = null;
  }

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
        mainWorkplace={mainWorkplace}
        homeAddress={homeAddress}
        updateDay={updateDay}
        updateMonth={updateMonth}
        isSplitDay={isSplitDay}
      />
      <div id="eligibilityMessage">
        {mainWorkplace ? (
          <p>
            Your main work location this month is{" "}
            <b>{mainWorkplace.addressName}</b>
            {mainWorkplace.address !== homeAddress.address ? (
              <span>
                , which is <b>{distance} km</b> away from your place of
                residence.
              </span>
            ) : (
              <span>.</span>
            )}
          </p>
        ) : (
          <p>You have not worked this month.</p>
        )}
        {distance === 0 || (distance && distance < 10) ? (
          <p>
            You are <b className="text-green-500">eligible</b> to receive
            reimbursement for housing costs.
          </p>
        ) : (
          <p>
            You are <b className="text-red-500">not eligible</b> to receive
            reimbursement for housing costs.
          </p>
        )}
      </div>
    </div>
  );
};
export default Workday;
