import React from "react";

type CollapsibleProps = {
  title: string;
  child: React.ReactNode;
  isCollapsed?: boolean;
};
const Collapsible = ({
  title,
  child,
  isCollapsed = true,
}: CollapsibleProps) => {
  const [collapsed, setCollapsed] = React.useState(isCollapsed);

  return (
    <div className="collapse">
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="cursor-pointer flex justify-between items-center"
      >
        <h3 className="boxTitle">{title}</h3>
        {collapsed ? (
          <div className="collapsible-arrow down" />
        ) : (
          <div className="collapsible-arrow up" />
        )}
      </div>
      {!collapsed && <div className="formContainer">{child}</div>}
    </div>
  );
};
export default Collapsible;
