import React, { useEffect, useState } from 'react';
import BreddInput from './BreddInput';
import HojdInput from './HojdInput';
import { useDispatch } from 'react-redux';
import { setCanvasProperties } from '@/redux/features/canvasSlice';
import { setCalculation } from '@/redux/features/calculationSlice';
import { setBreddDefaultValue, setHojdDefaultValue } from '@/redux/features/formSlice';
import { useAppSelector } from '@/redux/store';
import { cmToPixel } from '@/components/Utils/vectorFunction';

const DimensionInput = () => {
    const dispatch = useDispatch();

    const dimensionDefault = useAppSelector(state => state.formValues);

    const [bredd, setBredd] = useState(dimensionDefault.breddDefaultValue);
    const [hojd, setHojd] = useState(dimensionDefault.hojdDefaultValue);

    const handleBreddStepUp = () => {
        setBredd((prevValue) => prevValue + 0.1);
    };

    const handleBreddStepDown = () => {
        setBredd((prevValue) => prevValue - 0.1);
    };

    const handleHojdStepUp = () => {
        setHojd((prevValue) => prevValue + 0.1);
    };

    const handleHojdStepDown = () => {
        setHojd((prevValue) => prevValue - 0.1);
    };



    useEffect(() => {

        dispatch(setBreddDefaultValue(bredd)); // Set default value for bredd input
        dispatch(setHojdDefaultValue(hojd)); // Set default value for hojd input
    }, [dispatch, bredd, hojd]);


    useEffect(() => {
        const newBreddCost = bredd * 10;
        dispatch(setCalculation({ breddCost: newBreddCost }));
    }, [bredd, dispatch]);

    useEffect(() => {
        const newHojdCost = hojd * 10;
        dispatch(setCalculation({ HojdCost: newHojdCost }));
    }, [hojd, dispatch]);


    useEffect(() => {
        dispatch(setCanvasProperties({ frameWidth: cmToPixel(bredd), frameHeight: cmToPixel(hojd), bredd: bredd, hojd: hojd }));
        // console.log(bredd, hojd, cmToPixel(bredd), 'aspect ratio', cmToPixel(bredd) / cmToPixel(hojd));
        // console.log('frameHeight', cmToPixel(hojd));
    }, [bredd, hojd, dispatch]);

    return (
        <>
            <div>
                <label htmlFor="bredd" className="block text-sm 3xl:text-sm font-bold text-gray-700">
                    Bredd
                </label>
                <BreddInput value={bredd} onChange={setBredd} onStepUp={handleBreddStepUp} onStepDown={handleBreddStepDown} />
            </div>

            <div>
                <label htmlFor="hojd" className="block text-sm 3xl:text-sm font-bold text-gray-700">
                    Höjd
                </label>
                <HojdInput value={hojd} onChange={setHojd} onStepUp={handleHojdStepUp} onStepDown={handleHojdStepDown} />
            </div>
        </>
    )
}

export default DimensionInput