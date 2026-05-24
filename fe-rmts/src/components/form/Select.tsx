// components/form/Select.tsx
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '../../icons';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: boolean;
    hint?: string;
    disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    error = false,
    hint,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const selectedOption = options.find(option => option.value === value);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleOptionSelect = (selectedValue: string) => {
        onChange(selectedValue);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="relative" ref={selectRef}>
            <button
                type="button"
                onClick={toggleDropdown}
                disabled={disabled}
                className={`w-full px-3 py-2 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                } ${
                    disabled 
                        ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50' 
                        : 'bg-white dark:bg-gray-700'
                }`}
            >
                <div className="flex items-center justify-between">
                    <span className={selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-500'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDownIcon 
                        className={`w-4 h-4 transition-transform ${
                            isOpen ? 'transform rotate-180' : ''
                        }`} 
                    />
                </div>
            </button>

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg dark:bg-gray-700 dark:border-gray-600">
                    <div className="py-1 max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleOptionSelect(option.value)}
                                className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 ${
                                    value === option.value 
                                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-blue-100' 
                                        : 'text-gray-900 dark:text-white'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {hint && (
                <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
                    {hint}
                </p>
            )}
        </div>
    );
};

export default Select;