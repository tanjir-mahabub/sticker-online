import React from 'react';
import MaterialDropdown from './MaterialDropdown';
import DimensionInput from './DimensionInput';
import AntalDropdown from './AntalDropdown';
import LaminatingDropdown from './LaminatingDropdown';
import RangeSlider from '../../Customize/child/Input/RangeSlider';
import { Tooltip } from '@/components/Utils/ToolTips';
import { useAppSelector } from '@/redux/store';
import { useDieCutEffect } from '@/hooks/useDieCutEffect';

const Form = () => {

    const CanvasProperties = useAppSelector(state => state.canvas);
    const { grow } = CanvasProperties;

    const { handleDownloadSVG, handleDieCut } = useDieCutEffect();

    const DieCutHandler = (value: number) => {
        console.log('DieCutHandler', value);
        handleDieCut(value);
      }


    return (
        <form className="w-full">

            {/* Desktop Design */}
            <div className='hidden lg:flex w-full justify-start items-center gap-2 lg:gap-5'>
                <DimensionInput />

                <div className=''>
                    <label htmlFor="laminat" className="block text-sm 3xl:text-sm font-bold text-gray-700">
                        Laminat
                    </label>
                    <LaminatingDropdown />
                </div>

                <div className='w-40'>
                    <label htmlFor="material" className="block text-sm 3xl:text-sm font-bold text-gray-700">
                        Material
                    </label>
                    <MaterialDropdown />
                </div>

                <div>
                    <label htmlFor="antal" className="block text-sm 3xl:text-sm font-bold text-gray-700">
                        Antal
                    </label>
                    <AntalDropdown />

                </div>
            </div>


            {/* Mobile Design */}
            <div className='flex lg:hidden w-full flex-col gap-5 py-3'>

                <div className='flex w-full gap-2 px-3'>
                    <div className='w-1/2'>
                        <label htmlFor="laminat" className="block text-xs lg:text-sm font-bold text-gray-700">
                            Laminat
                        </label>
                        <LaminatingDropdown />
                    </div>

                    <div className='w-1/2'>
                        <label htmlFor="material" className="block text-xs lg:text-sm font-bold text-gray-700">
                            Material
                        </label>
                        <MaterialDropdown />
                    </div>
                </div>

                <div className='flex gap-2 w-full px-3'>
                    <div className='flex gap-2 w-full'>
                        <DimensionInput />
                    </div>
                </div>

                <div>
                    <div className='w-full px-3'>
                        <label htmlFor="antal" className="block text-xs lg:text-sm font-bold text-gray-700">
                            Antal
                        </label>
                        <AntalDropdown />
                    </div>
                </div>
                
                <div>
                <div className="flex gap-2 pb-3 w-full px-3">
                            <RangeSlider minValue={20} maxValue={120} step={1} defaultValue={grow} label="Kantlinje" handleDieCut={DieCutHandler} />
                            {/* <Tooltip message='Die Cut Effect'>
                                <button onClick={handleDieCut} className='text-sm font-semibold bg-white hover:bg-so-deep-gray cursor-pointer border border-black/20 hover:border-black/50 shadow-sm hover:shadow-lg rounded-full px-2 pt-1 pb-1.5'>Apply</button>
                            </Tooltip>

                            <button onClick={handleDownloadSVG} className='text-sm font-semibold bg-white hover:bg-so-deep-gray cursor-pointer border border-black/20 hover:border-black/50 shadow-sm hover:shadow-lg rounded-full px-2 pt-1 pb-1.5'>Download</button> */}

                        </div>
                </div>
            </div>

        </form>
    );
};

export default Form;
// 