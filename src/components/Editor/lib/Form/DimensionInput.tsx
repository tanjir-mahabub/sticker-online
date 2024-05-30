import React, { useEffect, useState, useCallback } from 'react';
import BreddInput from './BreddInput';
import HojdInput from './HojdInput';
import { useDispatch } from 'react-redux';
import { setCanvasProperties } from '@/redux/features/canvasSlice';
import { setCalculation } from '@/redux/features/calculationSlice';
import { useAppSelector } from '@/redux/store';
import { cmToPixel } from '@/components/Utils/vectorFunction';
import { debounce } from "lodash";

const DimensionInput = () => {
    const dispatch = useDispatch();
    const dimensionDefault = useAppSelector(state => state.formValues);
    const CanvasProperties = useAppSelector(state => state.canvas);

    const [bredd, setBredd] = useState(CanvasProperties.bredd);
    const [hojd, setHojd] = useState(CanvasProperties.hojd);

    const handleBreddStep = useCallback((step: number) => {
        setBredd(prevValue => prevValue + step);
    }, []);

    const handleHojdStep = useCallback((step: number) => {
        setHojd(prevValue => prevValue + step);
    }, []);

    const debouncedUpdateBredd = useCallback(debounce((newBredd) => {
        const newBreddCost = newBredd * 10;
        dispatch(setCanvasProperties({ frameWidth: cmToPixel(newBredd), bredd: newBredd }));
        dispatch(setCalculation({ breddCost: newBreddCost }));
    }, 300), [dispatch]);

    const debouncedUpdateHojd = useCallback(debounce((newHojd) => {
        const newHojdCost = newHojd * 10;
        dispatch(setCanvasProperties({ frameHeight: cmToPixel(newHojd), hojd: newHojd }));
        dispatch(setCalculation({ HojdCost: newHojdCost }));
    }, 300), [dispatch]);

    useEffect(() => {
        debouncedUpdateBredd(bredd);
    }, [bredd, debouncedUpdateBredd]);

    useEffect(() => {
        debouncedUpdateHojd(hojd);
    }, [hojd, debouncedUpdateHojd]);

    useEffect(() => {
        if(CanvasProperties.bredd || CanvasProperties.hojd) {
            setBredd(CanvasProperties.bredd)
            setHojd(CanvasProperties.hojd)            
        }
    }, [CanvasProperties])

    return (
        <>
            <div>
                <label htmlFor="bredd" className="block text-sm 3xl:text-sm font-bold text-gray-700">
                    Bredd
                </label>
                <BreddInput value={bredd} onChange={setBredd} onStepUp={() => handleBreddStep(0.1)} onStepDown={() => handleBreddStep(-0.1)} />
            </div>

            <div>
                <label htmlFor="hojd" className="block text-sm 3xl:text-sm font-bold text-gray-700">
                    Höjd
                </label>
                <HojdInput value={hojd} onChange={setHojd} onStepUp={() => handleHojdStep(0.1)} onStepDown={() => handleHojdStep(-0.1)} />
            </div>
        </>
    );
}

export default DimensionInput;
