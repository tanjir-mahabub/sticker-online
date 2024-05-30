import React from 'react';
import MaterialDropdown from './MaterialDropdown';
import DimensionInput from './DimensionInput';
import AntalDropdown from './AntalDropdown';
import LaminatingDropdown from './LaminatingDropdown';

const Form = () => {


    return (
        <form className="">

            {/* Desktop Design */}
            <div className='hidden lg:flex justify-start items-center gap-2 lg:gap-5'>
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
            <div className='flex lg:hidden w-full flex-col gap-3'>                            

                <div className='flex w-full gap-2'>
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

                <div className='flex gap-2'>
                    <div className='flex gap-2 w-1/2'>
                        <DimensionInput />
                    </div>                    
                </div>

                <div>
                <div className='w-full'>
                        <label htmlFor="antal" className="block text-xs lg:text-sm font-bold text-gray-700">
                            Antal
                        </label>
                        <AntalDropdown />
                    </div>
                </div>
            </div>

        </form>
    );
};

export default Form;
