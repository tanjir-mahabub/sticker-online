import { HistoryAction, HistoryState } from "./historyTypes";

export const initialHistoryState: HistoryState = {
    objectHistories: [],
};

export const historyReducer = (state: HistoryState, action: HistoryAction): HistoryState => {
    switch (action.type) {
        case 'addedToHistory': {
            const { id, category, position } = action.payload;
            const objectHistoryIndex = state.objectHistories.findIndex((obj) => obj.id === id);
            if (objectHistoryIndex !== -1) {
                const objectHistory = state.objectHistories[objectHistoryIndex];
                const updatedObjectHistory = {
                    ...objectHistory,
                    history: objectHistory.history.slice(0, objectHistory.historyStep + 1).concat([position]),
                    historyStep: objectHistory.historyStep + 1,
                };
                const updatedObjectHistories = [...state.objectHistories];
                updatedObjectHistories[objectHistoryIndex] = updatedObjectHistory;
                return { ...state, objectHistories: updatedObjectHistories };
            } else {
                return {
                    ...state,
                    objectHistories: [...state.objectHistories, { id, category, history: [position], historyStep: 0 }],
                };
            }
        }
        case 'undo': {
            const id = action.payload;
            const objectHistoryIndex = state.objectHistories.findIndex((obj) => obj.id === id);
            if (objectHistoryIndex !== -1 && state.objectHistories[objectHistoryIndex].historyStep > 0) {
                const updatedObjectHistories = [...state.objectHistories];
                updatedObjectHistories[objectHistoryIndex] = {
                    ...updatedObjectHistories[objectHistoryIndex],
                    historyStep: updatedObjectHistories[objectHistoryIndex].historyStep - 1,
                };
                return { ...state, objectHistories: updatedObjectHistories };
            }
            return state;
        }
        case 'redo': {
            const id = action.payload;
            const objectHistoryIndex = state.objectHistories.findIndex((obj) => obj.id === id);
            const objectHistory = state.objectHistories[objectHistoryIndex];
            if (objectHistoryIndex !== -1 && objectHistory.historyStep < objectHistory.history.length - 1) {
                const updatedObjectHistories = [...state.objectHistories];
                updatedObjectHistories[objectHistoryIndex] = {
                    ...updatedObjectHistories[objectHistoryIndex],
                    historyStep: updatedObjectHistories[objectHistoryIndex].historyStep + 1,
                };
                return { ...state, objectHistories: updatedObjectHistories };
            }
            return state;
        }
        case 'deleteHistoryById': {
            const idToDelete = action.payload;
            return {
                ...state,
                objectHistories: state.objectHistories.filter(obj => obj.id !== idToDelete),
            };
        }
        case 'deleteAllHistoriesByCategory': {
            const categoryToDelete = action.payload;
            return {
                ...state,
                objectHistories: state.objectHistories.filter(obj => obj.category !== categoryToDelete),
            };
        }
        case 'clearAllHistories': {
            return {
                ...state,
                objectHistories: [],
            };
        }
        default:
            return state;
    }
};
