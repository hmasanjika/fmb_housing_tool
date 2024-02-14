import React, { useRef, useState } from "react";
import Collapsible from "./Collapsible";
import Maps from "./Maps";
import { ModalTypes } from "../models/enums";
import { APIAddress, Address, ModalDetails } from "../models/types";
import GetCoordinates from "../axios/GetCoordinates";
import location from "../assets/icons/location.png";

type Props = {
  homeAddress: Address;
  saveHomeAddress: (address: Address) => void;
  openModal: (modalDetails: ModalDetails) => void;
};
const AddHomeAddress = ({ homeAddress, saveHomeAddress, openModal }: Props) => {
  const [addressInfos, setAddressInfos] = useState<undefined | APIAddress>(
    homeAddress
      ? {
          formatted_address: homeAddress.address,
          geometry: { location: homeAddress.addressCoordinates },
          inputValueAddress: homeAddress.address,
        }
      : undefined
  );
  const isHomeAddress = homeAddress !== undefined;
  const inputRef = useRef<HTMLInputElement>();
  // inputRef.current.value = homeAddress.address ?? "";

  /**
   * Verifies whether or not the address is valid
   * @param address - The unformatted address to be added
   */
  const handleFindAddress = (address: string | undefined) => {
    if (!address) {
      openModal({
        message: "Unable to find address. Please modify search.",
        type: ModalTypes.ERROR,
      });
    } else {
      GetCoordinates(address).then((res) => {
        if (!res?.formatted_address) {
          setAddressInfos(undefined);
          openModal({
            message: "Unable to find address. Please modify search.",
            type: ModalTypes.ERROR,
          });
        } else {
          setAddressInfos({ ...res, inputValueAddress: address });
        }
      });
    }
  };

  // /**
  //  * Adds a new residential address to an employee
  //  * @param address - The address to be added
  //  * @returns - True if the address was successfully added to the database, else false
  //  */
  // const addResidentialAddress = async (address: Address) => {
  //   const promise = new Promise((resolve) => {
  //     PostNewAddress(address).then((response) => {
  //       if (response.status === 201) {
  //         AddAddressToEmployee(employeeNumber, response.data.id).then(
  //           (response) => {
  //             if (response.status === 200) {
  //               setForceUserUpdate(true);
  //               resolve(true);
  //             } else {
  //               openModal({
  //                 message: response.data.error,
  //                 type: ModalTypes.ERROR,
  //               });
  //               resolve(false);
  //             }
  //           }
  //         );
  //       }
  //     });
  //   });
  //   return Boolean(await promise);
  // };

  /**
   * Handles the information entered when submitting a new address
   * and adds the address to the database if the information is valid.
   * @param data - The data (name, type and address) of the new address to be added
   */
  const saveAddress = () => {
    if (addressInfos) {
      saveHomeAddress({
        addressName: "Home",
        address: addressInfos.formatted_address,
        addressCoordinates: addressInfos.geometry.location,
      });
      openModal({
        message: "Successfully added primary residential address",
        type: ModalTypes.SUCCESS,
      });
    } else {
      openModal({
        message: "Must validate address before saving",
        type: ModalTypes.ERROR,
      });
    }
  };

  // /**
  //  * Validates the value in an input field
  //  * @param value - The input field string value to be validated
  //  */
  // const validateField = (value: string) => {
  //   if (value === "") {
  //     setIsValidForm(false);
  //   } else {
  //     setIsValidForm(true);
  //   }
  // };

  const AddAddressForm = () => {
    return (
      <div className="content-container map-form-container add-address">
        <div>
          <div className="flex items-end address-row">
            <div>
              <label className="label">
                <span className="label-text">Address:</span>
              </label>
              <input
                className="input input-bordered w-full max-w-xs formInput"
                placeholder="Street, number, city"
                type="text"
                ref={inputRef}
                defaultValue={addressInfos?.inputValueAddress ?? ""}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary btn-outline"
              onClick={() => {
                if (inputRef.current) {
                  handleFindAddress(inputRef.current["value"]);
                }
              }}
            >
              Find
            </button>
          </div>
          <button
            className="btn btn-primary save-new-address"
            disabled={
              !addressInfos ||
              (addressInfos &&
                homeAddress &&
                addressInfos.formatted_address === homeAddress.address)
            }
            onClick={saveAddress}
          >
            Save
          </button>
        </div>
        {addressInfos ? (
          <div className="comLocation add-address-details">
            <img className="h-20" src={location} alt="location pin" />
            <p className="comAddress text-center">
              {addressInfos.formatted_address}
            </p>
          </div>
        ) : (
          <p className="add-address-details">
            Please add a residential address
          </p>
        )}
        <div className="clientMapContainer">
          {addressInfos && (
            <Maps
              lat={addressInfos?.geometry?.location.lat}
              lng={addressInfos?.geometry?.location.lng}
            />
          )}
        </div>
      </div>
    );
  };
  return (
    <div className="container">
      <Collapsible
        title="Update residential address"
        child={<AddAddressForm />}
        isCollapsed={isHomeAddress}
      />
    </div>
  );
};
export default AddHomeAddress;
