
interface MotiveCategoryDropdownProps {
    selectedOption: string;
    onChange: (option: string) => void;
}

const MotiveCategoryDropdown: React.FC<MotiveCategoryDropdownProps> = ({ selectedOption, onChange }) => {
    const materialOptions = ['Populära', 'Feature', 'Option 3']; // Add your material options here

    return (
        <div className="relative w-full">
            <select
                id="material"
                name="material"
                className="mt-1 px-2 lg:px-3.5 py-3 bg-so-gray border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 text-xs lg:text-sm"
                value={selectedOption}
                onChange={(e) => onChange(e.target.value)}
            >
                {materialOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <div className="absolute top-1 right-3 inset-y-0 flex flex-col justify-center items-center pl-2">
                {/* Add any additional elements or styling for the dropdown button */}
            </div>
        </div>
    );
};

export default MotiveCategoryDropdown;
