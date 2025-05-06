import React from 'react';
import { FilterX } from 'lucide-react';
import PropTypes from 'prop-types';
import DateRangePicker from '../Report/DateRangePicker.jsx';

function ReportFilters({
                           reportType,
                           filters,
                           dateRange,
                           onFilterChange,
                           onDateRangeChange,
                           onGenerate,
                           isGenerating
                       }) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold">{reportType === 'membership' ? 'Membership' : 'Attendance'} Report</h2>
                    <span className="text-xs bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full">Customizable</span>
                </div>

                <DateRangePicker
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    onChange={onDateRangeChange}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reportType === 'membership' ? (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Membership Status</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={filters.membership.status}
                                onChange={(e) => onFilterChange('membership', 'status', e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                                <option value="pending">Pending</option>
                                <option value="frozen">Frozen</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Membership Plan</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={filters.membership.plan}
                                onChange={(e) => onFilterChange('membership', 'plan', e.target.value)}
                            >
                                <option value="all">All Plans</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="annual">Annual</option>
                                <option value="premium">Premium</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={filters.membership.gender}
                                onChange={(e) => onFilterChange('membership', 'gender', e.target.value)}
                            >
                                <option value="all">All Genders</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time of Day</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={filters.attendance.timeOfDay}
                                onChange={(e) => onFilterChange('attendance', 'timeOfDay', e.target.value)}
                            >
                                <option value="all">All Times</option>
                                <option value="morning">Morning (6AM-12PM)</option>
                                <option value="afternoon">Afternoon (12PM-5PM)</option>
                                <option value="evening">Evening (5PM-10PM)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={filters.attendance.weekday}
                                onChange={(e) => onFilterChange('attendance', 'weekday', e.target.value)}
                            >
                                <option value="all">All Days</option>
                                <option value="weekday">Weekdays</option>
                                <option value="weekend">Weekends</option>
                                <option value="monday">Monday</option>
                                <option value="tuesday">Tuesday</option>
                                <option value="wednesday">Wednesday</option>
                                <option value="thursday">Thursday</option>
                                <option value="friday">Friday</option>
                                <option value="saturday">Saturday</option>
                                <option value="sunday">Sunday</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                className="text-sm px-3 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors flex items-center"
                            >
                                <FilterX className="h-4 w-4 mr-1" />
                                <span>More Filters</span>
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="flex justify-end mt-6">
                <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors mr-3 flex items-center"
                    onClick={() => {
                        // Reset filters logic would go here
                    }}
                >
                    Reset Filters
                </button>

                <button
                    className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center ${
                        isGenerating ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                    onClick={onGenerate}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Generating...</span>
                        </>
                    ) : (
                        <span>Generate Report</span>
                    )}
                </button>
            </div>
        </div>
    );
}

ReportFilters.propTypes = {
    reportType: PropTypes.oneOf(['membership', 'attendance']).isRequired,
    filters: PropTypes.shape({
        membership: PropTypes.shape({
            status: PropTypes.string,
            plan: PropTypes.string,
            gender: PropTypes.string
        }),
        attendance: PropTypes.shape({
            timeOfDay: PropTypes.string,
            weekday: PropTypes.string
        })
    }).isRequired,
    dateRange: PropTypes.shape({
        startDate: PropTypes.instanceOf(Date),
        endDate: PropTypes.instanceOf(Date)
    }).isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onDateRangeChange: PropTypes.func.isRequired,
    onGenerate: PropTypes.func.isRequired,
    isGenerating: PropTypes.bool.isRequired
};

export default ReportFilters;