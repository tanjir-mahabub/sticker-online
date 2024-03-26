import React, { useState } from 'react';
import MaterialDropdown from './MaterialDropdown';
import DimensionInput from './DimensionInput';
import AntalDropdown from './AntalDropdown';
import LaminatingDropdown from './LaminatingDropdown';

const Form = () => {


    return (
        <form className="">

            {/* Desktop Design */}
            <div className='hidden lg:flex justify-start items-center gap-5'>
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
            <div className='flex lg:hidden'>
                <DimensionInput />

                <div>
                    <label htmlFor="laminat" className="block text-sm 3xl:text-sm font-bold text-gray-700">
                        Laminat
                    </label>
                    <LaminatingDropdown />
                </div>

                <div>
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

        </form>
    );
};

export default Form;
