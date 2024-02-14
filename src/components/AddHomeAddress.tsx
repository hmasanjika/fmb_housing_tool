import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Collapsible from "./Collapsible";
import Maps from "./Maps";
import { ModalTypes } from "../models/enums";
import { APIAddress, Address, ModalDetails } from "../models/types";
import GetCoordinates from "../axios/GetCoordinates";
import location from "../assets/icons/location.png";

type Props = {
  isHomeAddress: boolean;
  saveHomeAddress: (address: Address) => void;
  openModal: (modalDetails: ModalDetails) => void;
};
const AddHomeAddress = ({
  isHomeAddress,
  saveHomeAddress,
  openModal,
}: Props) => {
  const [addressInfos, setAddressInfos] = useState<undefined | APIAddress>(
    undefined
  );
  const inputRef = useRef();

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
        id: uuidv4(),
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
      <div className="FormMapContainer residential-address">
        <div>
          <label className="label">
            <span className="label-text">Address:</span>
          </label>
          <input
            className="input input-bordered w-full max-w-xs formInput"
            placeholder="Street, number, city"
            type="text"
            ref={inputRef}
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
        {addressInfos ? (
          <div className="flex flex-col">
            <div className="comLocation">
              <img className="h-20" src={location} alt="location pin" />
              <p className="comAddress text-center">
                {addressInfos.formatted_address}
              </p>
            </div>

            <button
              className="btn w-[250px]"
              onClick={() => setAddressInfos(undefined)}
            >
              Incorrect address? Modify search
            </button>
          </div>
        ) : (
          <p>No address found</p>
        )}
        <button
          className="btn btn-primary save-residential-address"
          disabled={!addressInfos}
          onClick={saveAddress}
        >
          Save address
        </button>
        {addressInfos && (
          <div className="comLocation residential-address-details">
            <img className="h-20" src={location} alt="location pin" />
            <p className="comAddress text-center">
              {addressInfos.formatted_address}
            </p>
          </div>
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
