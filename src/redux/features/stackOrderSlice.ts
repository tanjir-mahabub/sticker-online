import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = [] as string[];

const stackOrderSlice = createSlice({
    name: 'stackOrder',
    initialState,
    reducers: {
        addStackElement: (state, action: PayloadAction<string>) => {
            const newId = action.payload;
            if (!state.includes(newId)) {
                state.push(newId);
            }
        },
        removeStackElement: (state, action: PayloadAction<string>) => {
            return state.filter(id => id !== action.payload);
        },
        clearStackOrder: () => [],
        sendBackward: (state, action: PayloadAction<string>) => {
            const index = state.indexOf(action.payload);
            if (index > 0) {
                const newState = [...state];
                const temp = newState[index];
                newState[index] = newState[index - 1];
                newState[index - 1] = temp;
                return newState;
            }
            return state;
        },
        sendForward: (state, action: PayloadAction<string>) => {
            const index = state.indexOf(action.payload);
            if (index !== -1 && index < state.length - 1) {
                const newState = [...state];
                const temp = newState[index];
                newState[index] = newState[index + 1];
                newState[index + 1] = temp;
                return newState;
            }
            return state;
        },
        sendFront: (state, action: PayloadAction<string>) => {
            const index = state.indexOf(action.payload);
            if (index !== -1) {
                const newState = [...state];
                newState.splice(index, 1);
                newState.push(action.payload);
                return newState;
            }
            return state;
        },
        sendBack: (state, action: PayloadAction<string>) => {
            const index = state.indexOf(action.payload);
            if (index !== -1) {
                const newState = [...state];
                newState.splice(index, 1);
                newState.unshift(action.payload);
                return newState;
            }
            return state;
        },
    },
});

export const { addStackElement, removeStackElement, clearStackOrder, sendBackward, sendForward, sendBack, sendFront } = stackOrderSlice.actions;

export default stackOrderSlice.reducer;
