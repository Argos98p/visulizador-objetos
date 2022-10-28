import Switch from "react-switch";

import React from "react";
const ToogleButton=({isEditMode,handleActivateEditMode})=>{

    return (
            <div className="toogle-edit-mode">
                <label htmlFor="material-switch">
                    <Switch
                        checked={isEditMode}
                        onChange={handleActivateEditMode}
                        onColor="#86d3ff"
                        onHandleColor="#2693e6"
                        handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={20}
                        width={48}
                        className="react-switch"
                        id="material-switch"
                    />
                </label>
            </div>
        );

}

export default ToogleButton;