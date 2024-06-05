import React, { useState, useEffect, useRef } from 'react';
import Form from './lib/Form/Form';
import PriceCartBtn from './Child/PriceCartBtn';
import SidebarNav from './Nav/SidebarNav';
import { useAppSelector } from '@/redux/store';
import { SideNavState } from '@/types/types';
import Customize from './Customize/Customize';

const Footer = () => {
    const SideNavSelected = useAppSelector(state => state.sideNav);
    
    const [selected, setSelected] = useState<SideNavState>(SideNavSelected);

    const [showForm, setShowForm] = useState(true); // State to manage the visibility of the Form section
    const [formHeight, setFormHeight] = useState('auto'); // State to manage the height of the Form section
    const formRef = useRef<HTMLDivElement>(null);



    useEffect(() => {

        setSelected(SideNavSelected)

    }, [SideNavSelected]);

    // Function to toggle the visibility of the Form section
    const toggleFormVisibility = () => {
        setShowForm(prevState => !prevState);
    };

    useEffect(() => {
        if (formRef.current) {
            setFormHeight(`${formRef.current.scrollHeight}px`);
        }
    }, [showForm]);

    return (
        <>
            {/* Desktop version */}
            <footer className="hidden lg:flex h-fit items-center border-t px-3 xl:px-7">
                <div className="flex-auto pr-3 py-2.5 lg:py-2 3xl:py-6 border-r border-so-black/20 text-sm">
                    <Form />
                </div>
                <div className="w-fit 4xl:w-[20%] flex h-full gap-1.5 xl:gap-6 justify-end items-center lg:py-7">
                    <PriceCartBtn />
                </div>
            </footer>

            {/* Mobile version */}
            <footer className="fixed bottom-0 left-0 z-[100] bg-white flex lg:hidden flex-col lg:flex-auto w-full h-fit justify-center items-center px-0 xl:px-7 border-t border-so-black/10 shadow">
                <button className="py-2" onClick={toggleFormVisibility}>
                    <div className="w-12 h-[5px] rounded shadow bg-so-deep-gray border border-so-black/10"></div>
                </button>
                <div 
                    ref={formRef}
                    className={`relative w-full transition-all duration-300 ${showForm ? 'slide-down' : 'slide-up'}`}
                    style={{ height: showForm ? formHeight : '0', overflow: 'hidden' }}
                >
                    <div className="flex flex-auto w-full lg:py-7 text-xs">
                       {(selected.id === 0) ? <Form /> : <Customize />}
                    </div>
                </div>
                <div className="w-full 4xl:w-[20%] flex h-fit gap-1.5 xl:gap-6 justify-end items-center lg:py-5 text-xs border-t">
                    <SidebarNav />
                </div>
            </footer>
        </>
    );
};

export default Footer;
