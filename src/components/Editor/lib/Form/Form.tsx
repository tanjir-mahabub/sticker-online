import React, { useState } from 'react';
import BreddInput from './BreddInput';
import HojdInput from './HojdInput';
import LaminatDropdown from './LaminatDropdown';
import MaterialDropdown from './MaterialDropdown';
import AntalDropdown from './AntalDropdown';

const Form = () => {
    const [bredd, setBredd] = useState(6.5);
    const [hojd, setHojd] = useState(5);
    const [selectedLaminat, setSelectedLaminat] = useState('Glansig');
    const [selectedMaterial, setSelectedMaterial] = useState('Vinyl');
    const [selectedAntal, setSelectedAntal] = useState('100 st');

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

    return (
        <form className="flex justify-start items-center gap-5">
            <div>
                <label htmlFor="bredd" className="block text-sm font-bold text-gray-700">
                    Bredd
                </label>
                <BreddInput value={bredd} onChange={setBredd} onStepUp={handleBreddStepUp} onStepDown={handleBreddStepDown} />
            </div>

            <div>
                <label htmlFor="hojd" className="block text-sm font-bold text-gray-700">
                    Höjd
                </label>
                <HojdInput value={hojd} onChange={setHojd} onStepUp={handleHojdStepUp} onStepDown={handleHojdStepDown} />
            </div>

            <div>
                <label htmlFor="laminat" className="block text-sm font-bold text-gray-700">
                    Laminat
                </label>
                <LaminatDropdown selectedOption={selectedLaminat} onChange={setSelectedLaminat} />
            </div>

            <div>
                <label htmlFor="material" className="block text-sm font-bold text-gray-700">
                    Material
                </label>
                <MaterialDropdown selectedOption={selectedMaterial} onChange={setSelectedMaterial} />
            </div>

            <div>
                <label htmlFor="antal" className="block text-sm font-bold text-gray-700">
                    Antal
                </label>
                <AntalDropdown selectedOption={selectedAntal} onChange={setSelectedAntal} />

            </div>

        </form>
    );
};

export default Form;
