import { createSlice } from "@reduxjs/toolkit";
// import { error } from "./MessagesSlice";
// import { t } from "@lingui/macro";
// import { ethers } from "ethers";

const initialState = {
  isUpdate: false,
};

const updateInfo = createSlice({
  name: "messages",
  initialState,
  reducers: {
    updateStatus(state) {
      state.isUpdate = !state.isUpdate;
    },
  },
});

export const { updateStatus } = updateInfo.actions;

export default updateInfo.reducer;
