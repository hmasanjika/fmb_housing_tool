import React from "react";
import SubmitAndExportPDF from "./SubmitAndExportPDF";
import { Address, WMonth } from "../models/types";

type Props = {
  saveData: () => void;
  pdfDisabled: boolean;
  monthData: WMonth;
  userName: string;
  addresses: Address[];
  mainWorkplace: Address;
  distance: number;
  files: FileList;
};
const Save = ({
  saveData,
  pdfDisabled,
  monthData,
  userName,
  addresses,
  mainWorkplace,
  distance,
  files,
}: Props) => {
  return (
    <div>
      <button
        className="btn btn-primary"
        style={{ marginLeft: "10px" }}
        onClick={saveData}
      >
        Save
      </button>
      <SubmitAndExportPDF
        disabled={pdfDisabled}
        data={monthData}
        userName={userName}
        addresses={addresses}
        mainWorkplace={mainWorkplace}
        distance={distance}
        files={files}
        onClickSave={saveData}
      />
    </div>
  );
};

export default Save;
