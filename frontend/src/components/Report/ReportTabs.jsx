import React from 'react';
import { Users, CalendarDays } from 'lucide-react';
import PropTypes from 'prop-types';

function ReportTabs({ activeReport, setActiveReport }) {
    return (
        <div className="flex border-b border-gray-200">
            <button
                className={`flex items-center space-x-2 px-6 py-4 text-sm transition-colors ${
                    activeReport === 'membership' ? 'tab-active' : 'tab-inactive'
                }`}
                onClick={() => setActiveReport('membership')}
            >
                <Users className="h-4 w-4" />
                <span>Membership Reports</span>
            </button>

            <button
                className={`flex items-center space-x-2 px-6 py-4 text-sm transition-colors ${
                    activeReport === 'attendance' ? 'tab-active' : 'tab-inactive'
                }`}
                onClick={() => setActiveReport('attendance')}
            >
                <CalendarDays className="h-4 w-4" />
                <span>Attendance Reports</span>
            </button>
        </div>
    );
}

ReportTabs.propTypes = {
    activeReport: PropTypes.oneOf(['membership', 'attendance']).isRequired,
    setActiveReport: PropTypes.func.isRequired
};

export default ReportTabs;