import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import PropTypes from 'prop-types';

function DateRangePicker({ startDate, endDate, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleQuickSelect = (days) => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);

        onChange({ startDate: start, endDate: end });
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                className="px-4 py-2 border border-gray-300 rounded-md flex items-center space-x-2 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
          {formatDate(startDate)} - {formatDate(endDate)}
        </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 p-4">
                    <div className="space-y-2">
                        <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 rounded-md transition-colors"
                            onClick={() => handleQuickSelect(7)}
                        >
                            Last 7 days
                        </button>
                        <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 rounded-md transition-colors"
                            onClick={() => handleQuickSelect(30)}
                        >
                            Last 30 days
                        </button>
                        <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 rounded-md transition-colors"
                            onClick={() => handleQuickSelect(90)}
                        >
                            Last 3 months
                        </button>
                        <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 rounded-md transition-colors"
                            onClick={() => handleQuickSelect(365)}
                        >
                            Last year
                        </button>
                        <hr className="my-2" />
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                                    value={startDate.toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        const newStartDate = new Date(e.target.value);
                                        onChange({ startDate: newStartDate, endDate });
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                                    value={endDate.toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        const newEndDate = new Date(e.target.value);
                                        onChange({ startDate, endDate: newEndDate });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mt-2 flex justify-end">
                            <button
                                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

DateRangePicker.propTypes = {
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired
};

export default DateRangePicker;