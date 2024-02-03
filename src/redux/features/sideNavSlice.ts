
import { SideNavStore } from "@/store/sideNav";
import { SideNavState } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

const initialSideNav = SideNavStore[0]

const initialState: SideNavState = {
  id: initialSideNav.id
};

export const SideNavReducer = createSlice({
    name: 'sideNav',
    initialState,
    reducers: {
        selectedSideNav: (state, action) => {          
            return state = action.payload
        }
    }
})

export const { selectedSideNav } = SideNavReducer.actions;
export default SideNavReducer.reducer;