import React, { useState, useEffect } from "react";
import publicHolidays from "./hr/public_holidays.json";
import useLocalStorage from "./utils/useLocalStorage";
import PersonalData from "./components/PersonalData";
import Save from "./components/Save";
import Attachments from "./components/Attachments";
import AddAddress from "./components/AddAddress";
import { Address, ModalDetails, WDay, WMonth, Workdays } from "./models/types";
import { ModalTypes, StorageTypes } from "./models/enums";
import AlertModal from "./components/AlertModal";
import AddressList from "./components/AddressList";
import Workday from "./components/Workday";
import AddHomeAddress from "./components/AddHomeAddress";
import Header from "./components/Header";

function App() {
  const currentDate: Date = new Date();
  const { getItem, setItem } = useLocalStorage();
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [displayedDate, setDisplayedDate] = useState<Date>(currentDate);
  const [hasUpdatedDate, setHasUpdatedDate] = useState<boolean>(false);
  const [addressToDelete, setAddressToDelete] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalDetails, setModalDetails] = useState<ModalDetails>({
    message: "Unknown alert",
    type: ModalTypes.ERROR,
  });
  const [userName, setUserName] = useState<string>(
    getItem(StorageTypes.NAME) ?? ""
  );
  const [files, setFiles] = useState<FileList | null>(
    getItem(StorageTypes.FILES) ?? null
  );
  const [homeAddress, setHomeAddress] = useState<Address | undefined>(
    getItem(StorageTypes.HOME_ADDRESS) ?? undefined
  );
  const [addresses, setAddresses] = useState<Address[]>(
    getItem(StorageTypes.ADDRESSES) ?? []
  );
  const [workdayData, setWorkdayData] = useState<Workdays | undefined>(
    getItem(StorageTypes.WORKDAYS) ?? []
  );
  const [monthData, setMonthData] = useState<WMonth | undefined>(undefined);

  useEffect(() => {
    if (hasUpdatedDate) {
      handleWorkdayData();
      setHasUpdatedDate(false);
    } else if (monthData === undefined) {
      handleWorkdayData();
    }
  }, [hasUpdatedDate]);

  const saveData = () => {
    setItem(StorageTypes.NAME, userName);
    const updatedWorkdays = updateMonthInWorkdays(monthData);
    saveWorkdays(updatedWorkdays);
  };

  const saveWorkdays = (updatedWorkdays: Workdays) => {
    setItem(StorageTypes.WORKDAYS, updatedWorkdays);
    setWorkdayData(updatedWorkdays);
  };

  const updateWorkdaysByMonth = (updatedMonth: WMonth) => {
    setMonthData(updatedMonth);
    const updatedWorkdays = updateMonthInWorkdays(updatedMonth);
    setWorkdayData(updatedWorkdays);
  };

  const updateMonthInWorkdays = (updatedMonth: WMonth) => {
    return workdayData.map((o) =>
      o.month === updatedMonth.month && o.year === updatedMonth.year
        ? monthData
        : o
    );
  };

  const handleSaveHomeAddress = (address: Address) => {
    setHomeAddress(address);
    let addressList = [address];
    if (addresses.length > 0) {
      const modifiedAddressList = addresses;
      modifiedAddressList[0] = address;
      addressList = modifiedAddressList;
    }
    setAddresses(addressList);
    setItem(StorageTypes.HOME_ADDRESS, address);
    setItem(StorageTypes.ADDRESSES, addressList);
  };

  const handleSaveNewAddress = (address: Address) => {
    const updatedAddressList: Address[] = [...addresses, address];
    setAddresses(updatedAddressList);
    setItem(StorageTypes.ADDRESSES, updatedAddressList);
  };

  const handleSaveFiles = (files) => {
    setItem(StorageTypes.FILES, files);
  };

  const handleWorkdayData = () => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    let month = workdayData?.find(
      (m: WMonth) => m.month === selectedMonth && m.year === selectedYear
    );
    if (!month) {
      month = getMonth();
      workdayData.push(month);
      saveWorkdays(workdayData);
    }
    setMonthData(month);
  };

  const handleDeleteAddress = (address: Address) => {
    setModalDetails({
      message: `Are you sure you want to delete "${address.addressName}"?`,
      type: ModalTypes.CONFIRMATION,
    });
    setAddressToDelete(address.addressName);
    setIsModalOpen(true);
  };

  const openModal = (modalDetails: ModalDetails) => {
    setModalDetails(modalDetails);
    setIsModalOpen(true);
    if (modalDetails.type === ModalTypes.SUCCESS) {
      setTimeout(() => closeModal(), 1000);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDeleteAction = () => {
    const addressesWithDeleted = addresses.filter(
      (add) => add.addressName !== addressToDelete
    );
    setAddresses(addressesWithDeleted);
    setItem(StorageTypes.ADDRESSES, addressesWithDeleted);
    cancelAction();
  };

  const cancelAction = () => {
    setAddressToDelete("");
    closeModal();
  };

  const getMonth = () => {
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    const date = new Date(year, month, 1);
    const days: WDay[] = [];

    while (date.getMonth() === month) {
      date.setDate(date.getDate() + 1);
      const formattedDate = date.toISOString().substring(0, 10);
      const isWeekend: boolean =
        publicHolidays.includes(formattedDate) ||
        [0, 6].indexOf(new Date(formattedDate).getDay()) !== -1;
      days.push({
        workDate: formattedDate,
        workPlaceAddressAm: isWeekend ? null : homeAddress,
        isWorkdayAm: !isWeekend,
        isHolidayAm: false,
        workPlaceAddressPm: isWeekend ? null : homeAddress,
        isWorkdayPm: !isWeekend,
        isHolidayPm: false,
        isWeekend: isWeekend,
      });
    }
    return { month: month, year: year, workdays: days };
  };

  const handleUpdatedDate = (date: Date) => {
    setSelectedDate(date);
    setHasUpdatedDate(true);
  };

  return (
    <div className="App">
      <div>
        <Header />
        <PersonalData userName={userName} setUserName={setUserName} />
        <Attachments
          files={files}
          setFiles={setFiles}
          saveFiles={(files) => handleSaveFiles(files)}
        />
        <AddHomeAddress
          homeAddress={homeAddress}
          saveHomeAddress={(address) => handleSaveHomeAddress(address)}
          openModal={openModal}
        />
        <AddAddress
          addresses={addresses}
          saveAddress={(address) => handleSaveNewAddress(address)}
          openModal={openModal}
        />
        <AddressList
          homeAddress={homeAddress}
          addresses={addresses}
          deleteAddress={(address) => handleDeleteAddress(address)}
        />
        {monthData && (
          <Workday
            data={monthData}
            homeAddress={homeAddress}
            addresses={addresses}
            selectedDate={selectedDate}
            setMonthData={setMonthData}
            updateDate={(date: Date) => handleUpdatedDate(date)}
            updateWorkdaysByMonth={(updatedMonth: WMonth) =>
              updateWorkdaysByMonth(updatedMonth)
            }
          />
        )}
        <Save saveData={saveData} />
      </div>
      <AlertModal
        modalIsOpen={isModalOpen}
        modalDetails={modalDetails}
        closeModal={closeModal}
        confirmAction={confirmDeleteAction}
        cancelAction={cancelAction}
      />
    </div>
  );
}

export default App;
