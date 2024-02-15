import React from "react";
import { Tooltip } from "react-tooltip";
import trash from "../assets/icons/trash.png";
import trashPurple from "../assets/icons/trash_purple.png";
import { Address } from "../models/types";
import { getDistance } from "../utils/GetDistance";

type ListProps = {
  homeAddress: Address | undefined;
  addresses: Address[];
  deleteAddress: (address: Address) => void;
  type?: string;
};
type ItemProps = {
  address: Address;
  isHome: boolean;
};
const AddressList = ({ homeAddress, addresses, deleteAddress }: ListProps) => {
  console.log(addresses);
  const Item = ({ address, isHome }: ItemProps): JSX.Element | null => {
    const [isDeleteHovered, setIsDeleteHovered] = React.useState(false);
    const distance =
      homeAddress && address
        ? getDistance(
            address.addressCoordinates,
            homeAddress.addressCoordinates
          )
        : "error";

    if (address)
      return (
        <tr>
          <td>{address.addressName}</td>
          <td>{address.address}</td>
          <td className="text-center">
            {isHome ? (
              <div className="badge badge-primary badge-outline">Home</div>
            ) : (
              `${distance} km`
            )}
          </td>
          <td>
            <div
              className="client-list-actions cursor-pointer"
              style={{ width: "65px" }}
            >
              {!isHome && (
                <>
                  <button
                    className="iconBtn"
                    onMouseEnter={() => setIsDeleteHovered(true)}
                    onMouseLeave={() => setIsDeleteHovered(false)}
                    onClick={() => deleteAddress(address)}
                    data-tooltip-id="tooltip-delete"
                    data-tooltip-content="Delete"
                  >
                    {!isDeleteHovered ? (
                      <img src={trash} alt="Delete" width={20} />
                    ) : (
                      <img src={trashPurple} alt="Delete" width={20} />
                    )}
                  </button>
                  <Tooltip id="tooltip-delete" />
                </>
              )}
            </div>
          </td>
        </tr>
      );
    else
      return (
        <div className="formContainer">
          <p>Sorry, we are facing issues loading the addresses</p>
        </div>
      );
  };
  return (
    <div className="formContainer">
      <div className="overflow-x-auto radiusTable">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="bg-accent w-auto">Address Name</th>
              <th className="bg-accent">Address</th>
              <th className="bg-accent text-center">Distance from home</th>
              <th className="bg-accent"></th>
            </tr>
          </thead>
          {addresses.length > 0 ? (
            <tbody>
              {addresses.map((address, index) => (
                <Item key={index} address={address} isHome={index === 0} />
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td>You must add a residential address</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};
export default AddressList;
