import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CalculationState {
    antalCost: number;
    materialCost: number;
    laminatingCost: number;
    breddCost: number;
    HojdCost: number;
    totalCost: number; // Adding a field for total cost
}

const initialState: CalculationState = {
    antalCost: 0,
    materialCost: 0,
    laminatingCost: 0,
    breddCost: 0,
    HojdCost: 0,
    totalCost: 0 // Initializing total cost to 0
};

const calculationSlice = createSlice({
    name: 'calculation',
    initialState,
    reducers: {
        setCalculation(state, action: PayloadAction<Partial<CalculationState>>) {
            // Merge the payload into the state and recalculate totalCost
            return {
                ...state,
                ...action.payload,
                totalCost: calculateTotalCost({ ...state, ...action.payload })
            };
        },
    },
});

export const { setCalculation } = calculationSlice.actions;

export default calculationSlice.reducer;

// Function to calculate total cost
const calculateTotalCost = (state: CalculationState): number => {
    const { antalCost, materialCost, laminatingCost, breddCost, HojdCost } = state;
    // Calculate total cost by summing all individual costs
    return antalCost + materialCost + laminatingCost + breddCost + HojdCost;
};
