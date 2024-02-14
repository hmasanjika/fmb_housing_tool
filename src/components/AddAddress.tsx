import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Collapsible from "./Collapsible";
import Maps from "./Maps";
import { ModalTypes } from "../models/enums";
import { APIAddress, Address, ModalDetails } from "../models/types";
import GetCoordinates from "../axios/GetCoordinates";
import location from "../assets/icons/location.png";

type Props = {
  addresses: Address[];
  saveAddress: (address: Address) => void;
  openModal: (modalDetails: ModalDetails) => void;
};
type AddressFormData = {
  name: string;
  address: string;
};
const AddAddress = ({ addresses, saveAddress, openModal }: Props) => {
  const { register, getValues, handleSubmit } = useForm<AddressFormData>({
    defaultValues: {
      name: "",
      address: "",
    },
  });
  const [addressInfos, setAddressInfos] = useState<undefined | APIAddress>(
    undefined
  );
  const [nameError, setNameError] = useState<boolean>(false);

  /**
   * Verifies whether or not the address is valid
   * @param address - The unformatted address to be added
   */
  const handleFindAddress = (address: string) => {
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
  const handleSubmitData = async (data: AddressFormData) => {
    if (!validateName(data.name)) {
      setNameError(true);
    } else if (addressInfos) {
      const newAddress: Address = {
        addressName: data.name,
        address: addressInfos.formatted_address,
        addressCoordinates: addressInfos.geometry.location,
      };
      saveAddress(newAddress);

      openModal({
        message: `Successfully added '${data.name}'`,
        type: ModalTypes.SUCCESS,
      });
    } else {
      openModal({
        message:
          "Must validate address before adding a new residential location",
        type: ModalTypes.ERROR,
      });
    }
  };

  /**
   * Validates the value in an input field
   * @param value - The input field string value to be validated
   */
  const validateName = (value: string) => {
    if (addresses.some((add) => add.addressName === value)) {
      return false;
    }
    return true;
  };

  const AddAddressForm = () => {
    return (
      <div className="content-container map-form-container add-address">
        <form onSubmit={handleSubmit(handleSubmitData)}>
          <label className="label">
            <span className="label-text">Address name:</span>
          </label>
          <input
            placeholder="Enter name"
            className="input input-bordered w-full max-w-xs formInput"
            {...register("name", {
              onChange: () => {
                setNameError(false);
              },
            })}
            required
            autoComplete="off"
          />
          {nameError && (
            <p className="error-message">
              This name has already been used. Please choose a unique one.
            </p>
          )}

          <div className={nameError ? "flex items-end address-row" : "flex items-end address-row pt-[20px]"}>
            <div>
              <label className="label">
                <span className="label-text">Address:</span>
              </label>
              <input
                className="input input-bordered w-full max-w-xs formInput"
                placeholder="Street, number, city"
                {...register("address")}
                required
              />
            </div>
            <button
              type="button"
              className="btn btn-primary btn-outline"
              onClick={() => {
                const input = getValues("address");
                handleFindAddress(input);
              }}
            >
              Find
            </button>
          </div>
          <button
            className="btn btn-primary save-new-address"
            disabled={!addressInfos}
          >
            Save
          </button>
        </form>
        {addressInfos && (
          <div className="comLocation add-address-details">
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
      <Collapsible title="Add workplace address" child={<AddAddressForm />} />
    </div>
  );
};
export default AddAddress;
