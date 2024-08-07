import React, { FC } from "react";
import { Modal, Box } from "@mui/material";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: any;
  component: any;
  setRoute?: (route: string) => void;
  refetch?:any;
};


const CustomModal: FC<Props> = ({
  open, setOpen, setRoute, activeItem, component: Component, refetch}) => {
  return (
    <Modal   //окно
      open={open}
      onClose={() => setOpen(false)}
     aria-hidden="true" //// ???
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {/* <Box className="absolute top-[50%] left-[50%] 
      -translate-x-1/2 -translate-y-1/2 w-[450px]
  bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none"> */}
 <Box className=" min-h-screen mx-auto flex justify-center py-12
         
  bg-white dark:bg-slate-900   shadow p-4 outline-none ">
      
        <Component setOpen={setOpen} setRoute={setRoute}   
         activeItem={activeItem}  refetch={refetch}  />
      
      </Box>
    </Modal>
  );
};
export default CustomModal;
