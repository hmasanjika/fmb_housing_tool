import React from "react";
import { Address } from "../models/types";

type Props = {
  mainWorkplace: Address | null;
  distance: number | null;
};
const EligibilityMessage = ({ mainWorkplace, distance }: Props) => {
  return (
    <div id="eligibilityMessage">
      {mainWorkplace ? (
        <p>
          Your main work location this month is{" "}
          <b>{mainWorkplace.addressName}</b>
          {mainWorkplace.addressName !== "Home" ? (
            <span>
              , which is <b>{distance} km</b> away from your place of residence.
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
  );
};

export default EligibilityMessage;
