import React from "react";

type Props = {
  saveData: () => void;
};
const Save = ({ saveData }: Props) => {
  return (
    <div>
      <button
        className="btn btn-primary"
        style={{ marginLeft: "10px" }}
        onClick={saveData}
      >
        Save
      </button>
      {/* <SubmitAndExportPDF
        disabled={!mainWorkplace || (distance && distance > 10) ? true : false}
        data={data}
        user={user}
        onClickSave={saveWorkdays}
        modalDetails={modalDetails}
      /> */}
    </div>
  );
};

export default Save;
