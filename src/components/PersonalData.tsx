import React, { Dispatch, SetStateAction } from "react";

type Props = {
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
};
const PersonalData = ({ userName, setUserName }: Props) => {
  return (
    <div className="personalData text-sm">
      <h2 className="sectionTitle">Personal details</h2>
      <label>Full name</label>
      <input
        placeholder="Enter name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="input input-bordered w-full max-w-xs formInput"
        required
        autoComplete="off"
      />
    </div>
  );
};

export default PersonalData;
