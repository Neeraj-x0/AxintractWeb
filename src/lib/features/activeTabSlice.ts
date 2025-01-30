import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
  activeItem: string;
}

const initialState: SidebarState = {
  activeItem: "Dashboard",
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setActiveItem: (state, action: PayloadAction<string>) => {
      state.activeItem = action.payload;
    },
  },
});

export const { setActiveItem } = sidebarSlice.actions;
export default sidebarSlice.reducer;
