import MenuLeft from "@/common/MenuLeft";
import NavbarApp from "@/common/navbar";
import React from "react";


const Edit = () => {
    return (
        <div className="m-0 p-0 ">
            <NavbarApp/>
            <MenuLeft/>
            <div className="flex-col w-[1190px] bg-black absolute top-20 right-0">
            
                <h1>Edit</h1>
            </div>
        </div>
    )
}


export default Edit;