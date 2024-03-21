import React, { useState } from 'react';
import LaminatDropdown from './LaminatDropdown';
import MaterialDropdown from './MaterialDropdown';
import DimensionInput from './DimensionInput';
import AntalDropdown from './AntalDropdown';

const Form = () => {
    const [selectedLaminat, setSelectedLaminat] = useState('Glansig');
    const [selectedMaterial, setSelectedMaterial] = useState('Vinyl');
    const [selectedAntal, setSelectedAntal] = useState({
        st: "10 st",
        amount: "240kr",
        rate: "24,5kr / st"
    });

    return (
        <form className="">

            {/* Desktop Design */}
            <div className='hidden lg:flex justify-start items-center gap-5'>
                <DimensionInput />

                <div className=''>
                    <label htmlFor="laminat" className="block text-sm 3xl:text-sm font-bold text-gray-700">
                        Laminat
                    </label>
                    <LaminatDropdown selectedOption={selectedLaminat} onChange={setSelectedLaminat} />
                </div>

                <div className='w-40'>
                    <label htmlFor="material" className="block text-sm 3xl:text-sm font-bold text-gray-700">
                        Material
                    </label>
                    <MaterialDropdown selectedOption={selectedMaterial} onChange={setSelectedMaterial} />
                </div>

                <div>
                    <label htmlFor="antal" className="block text-sm 3xl:text-sm font-bold text-gray-700">
                        Antal
                    </label>
                    <AntalDropdown selectedOption={selectedAntal} onChange={setSelectedAntal} />

                </div>
            </div>


            {/* Mobile Design */}
            <div className='flex lg:hidden'>
                <DimensionInput />

                <div>
                    <label htmlFor="laminat" className="block text-sm 3xl:text-sm font-bold text-gray-700">
                        Laminat
                    </label>
                    <LaminatDropdown selectedOption={selectedLaminat} onChange={setSelectedLaminat} />
                </div>

                <div>
                    <label htmlFor="material" className="block text-sm 3xl:text-sm font-bold text-gray-700">
                        Material
                    </label>
                    <MaterialDropdown selectedOption={selectedMaterial} onChange={setSelectedMaterial} />
                </div>

                <div>
                    <label htmlFor="antal" className="block text-sm 3xl:text-sm font-bold text-gray-700">
                        Antal
                    </label>
                    <AntalDropdown selectedOption={selectedAntal} onChange={setSelectedAntal} />

                </div>
            </div>

        </form>
    );
};

export default Form;
