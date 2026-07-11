import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../reducers/UserSlice.js";
import floorPlanSlice from "../reducers/FloorPlanSlice.js";                               

export const store = configureStore({
  reducer: {
    user: userSlice,
    floorPlan: floorPlanSlice,
  },
});
export default store;

