import React, {useState, useMemo, useEffect} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from "../../components/Member/Navbar.jsx";
import axios from "axios";

function MemberProgressHistory({ records = [], userProfile }) {
    const [selectedTimeframe, setSelectedTimeframe] = useState('all');
    const [activeTab, setActiveTab] = useState('overview');
    const [progressData, setProgressData] = useState([]);
    const [progressLoading, setProgressLoading] = useState(false);

    const fetchProgressData = async () => {
        setProgressLoading(true);
        try {
            const response = await axios.get('http://localhost:8800/api/progress/progress', {
                withCredentials: true
            });
            console.log(response.data);
            setProgressData(response.data);
            setProgressLoading(false);
        } catch (error) {
            console.error('Error fetching progress data', error);
            setProgressData([]);
            setProgressLoading(false);
        }
    };

    useEffect(() => {
        fetchProgressData();
    }, []);

    // Use progressData from state instead of passed records
    const sortedRecords = useMemo(() => {
        if (!progressData || progressData.length === 0) return [];

        return [...progressData].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }, [progressData]);

    // Filter records based on selected timeframe
    const filteredRecords = useMemo(() => {
        if (selectedTimeframe === 'all') return sortedRecords;

        const now = new Date();
        const cutoffDate = new Date();

        if (selectedTimeframe === 'month') {
            cutoffDate.setMonth(now.getMonth() - 1);
        } else if (selectedTimeframe === '3months') {
            cutoffDate.setMonth(now.getMonth() - 3);
        } else if (selectedTimeframe === '6months') {
            cutoffDate.setMonth(now.getMonth() - 6);
        } else if (selectedTimeframe === 'year') {
            cutoffDate.setFullYear(now.getFullYear() - 1);
        }

        return sortedRecords.filter(record => new Date(record.date) >= cutoffDate);
    }, [sortedRecords, selectedTimeframe]);

    // Calculate progress metrics
    const calculateProgress = () => {
        if (filteredRecords.length < 2) return null;

        const oldest = filteredRecords[0];
        const newest = filteredRecords[filteredRecords.length - 1];

        return {
            weight: (newest.weight - oldest.weight).toFixed(1),
            height: (newest.height - oldest.height).toFixed(1),
            chestSize: (newest.chestSize - oldest.chestSize).toFixed(1),
            waistSize: (newest.waistSize - oldest.waistSize).toFixed(1),
            armSize: (newest.armSize - oldest.armSize).toFixed(1),
            legSize: (newest.legSize - oldest.legSize).toFixed(1)
        };
    };

    const progress = calculateProgress();

    return (
        <div className="min-h-screen bg-gray-100" style={{ width: '100vw' }}>
            <Navbar />
            <div className="max-w-[1370px] mx-auto px-4 py-8">
                <div className="mb-4 mt-[60px] text-left">
                    <h1 className="text-3xl font-bold" style={{ fontFamily: "Segoe UI" }}>My Progress History</h1>
                </div>

                {/* Filter and Tabs */}
                <div className="bg-white rounded-xl border-1 overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex space-x-4">
                                <button
                                    className={`px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    onClick={() => setActiveTab('overview')}
                                >
                                    Overview
                                </button>
                                <button
                                    className={`px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'details' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    onClick={() => setActiveTab('details')}
                                >
                                    Detailed Records
                                </button>
                            </div>
                            <div className="w-full sm:w-auto">
                                <select
                                    className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={selectedTimeframe}
                                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                                >
                                    <option value="all">All Time</option>
                                    <option value="month">Last Month</option>
                                    <option value="3months">Last 3 Months</option>
                                    <option value="6months">Last 6 Months</option>
                                    <option value="year">Last Year</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {progressLoading ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4">
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="text-gray-500">Loading your progress data...</p>
                        </div>
                    ) : filteredRecords.length > 0 ? (
                        <div className="p-6">
                            {activeTab === 'overview' ? (
                                <>
                                    {/* Progress Summary Cards */}
                                    {progress && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all hover:shadow-md">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Weight Change</p>
                                                        <p className={`text-2xl font-bold mt-1 ${Number(progress.weight) < 0 ? 'text-green-600' : Number(progress.weight) > 0 ? 'text-red-600' : 'text-gray-700'}`}>
                                                            {Number(progress.weight) > 0 ? '+' : ''}{progress.weight} kg
                                                        </p>
                                                    </div>
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${Number(progress.weight) < 0 ? 'bg-green-100 text-green-600' : Number(progress.weight) > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all hover:shadow-md">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Height Change</p>
                                                        <p className={`text-2xl font-bold mt-1 ${Number(progress.height) < 0 ? 'text-green-600' : Number(progress.height) > 0 ? 'text-red-600' : 'text-gray-700'}`}>
                                                            {Number(progress.height) > 0 ? '+' : ''}{progress.height}
                                                        </p>
                                                    </div>
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${Number(progress.height) < 0 ? 'bg-green-100 text-green-600' : Number(progress.height) > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                                                            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                                                            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all hover:shadow-md">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Chest Size Change</p>
                                                        <p className={`text-2xl font-bold mt-1 ${Number(progress.chestSize) > 0 ? 'text-green-600' : Number(progress.chestSize) < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                                                            {Number(progress.chestSize) > 0 ? '+' : ''}{progress.chestSize} cm
                                                        </p>
                                                    </div>
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${Number(progress.chestSize) > 0 ? 'bg-green-100 text-green-600' : Number(progress.chestSize) < 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all hover:shadow-md">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Waist Size Change</p>
                                                        <p className={`text-2xl font-bold mt-1 ${Number(progress.waistSize) < 0 ? 'text-green-600' : Number(progress.waistSize) > 0 ? 'text-red-600' : 'text-gray-700'}`}>
                                                            {Number(progress.waistSize) > 0 ? '+' : ''}{progress.waistSize} cm
                                                        </p>
                                                    </div>
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${Number(progress.waistSize) < 0 ? 'bg-green-100 text-green-600' : Number(progress.waistSize) > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Chart */}
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                                        <h3 className="text-lg font-semibold mb-4">Progress Trends</h3>
                                        <div className="h-[400px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={filteredRecords} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis
                                                        dataKey="date"
                                                        tickFormatter={(date) => {
                                                            const d = new Date(date);
                                                            return `${d.getDate()}/${d.getMonth()+1}`;
                                                        }}
                                                        stroke="#9CA3AF"
                                                    />
                                                    <YAxis yAxisId="left" stroke="#9CA3AF" />
                                                    <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                                                    <Tooltip
                                                        labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                        contentStyle={{
                                                            backgroundColor: 'white',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                                            border: 'none'
                                                        }}
                                                    />
                                                    <Legend />
                                                    <Line
                                                        yAxisId="left"
                                                        type="monotone"
                                                        dataKey="weight"
                                                        stroke="#2563EB"
                                                        strokeWidth={2}
                                                        name="Weight (kg)"
                                                        dot={{ r: 4, strokeWidth: 2 }}
                                                        activeDot={{ r: 6, strokeWidth: 2 }}
                                                    />
                                                    <Line
                                                        yAxisId="right"
                                                        type="monotone"
                                                        dataKey="height"
                                                        stroke="#DC2626"
                                                        strokeWidth={2}
                                                        name="Height cm"
                                                        dot={{ r: 4, strokeWidth: 2 }}
                                                        activeDot={{ r: 6, strokeWidth: 2 }}
                                                    />
                                                    <Line
                                                        yAxisId="left"
                                                        type="monotone"
                                                        dataKey="chestSize"
                                                        stroke="#16A34A"
                                                        strokeWidth={2}
                                                        name="Chest Size (cm)"
                                                        dot={{ r: 4, strokeWidth: 2 }}
                                                        activeDot={{ r: 6, strokeWidth: 2 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Latest Measurement */}
                                    {filteredRecords.length > 0 && (
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <h3 className="text-lg font-semibold mb-4">Latest Measurement</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Weight</p>
                                                    <p className="text-xl font-bold mt-1">{filteredRecords[filteredRecords.length-1].weight} kg</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Height</p>
                                                    <p className="text-xl font-bold mt-1">{filteredRecords[filteredRecords.length-1].height} cm</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Chest Size</p>
                                                    <p className="text-xl font-bold mt-1">{filteredRecords[filteredRecords.length-1].chestSize} cm</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Waist Size</p>
                                                    <p className="text-xl font-bold mt-1">{filteredRecords[filteredRecords.length-1].waistSize} cm</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Arm Size</p>
                                                    <p className="text-xl font-bold mt-1">{filteredRecords[filteredRecords.length-1].armSize} cm</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Leg Size</p>
                                                    <p className="text-xl font-bold mt-1">{filteredRecords[filteredRecords.length-1].legSize} cm</p>
                                                </div>
                                            </div>

                                            {filteredRecords[filteredRecords.length-1].notes && (
                                                <div className="mt-6 pt-6 border-t border-gray-200">
                                                    <p className="text-sm font-medium text-gray-500 mb-2">Notes from Trainer</p>
                                                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                                        {filteredRecords[filteredRecords.length-1].notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-6">
                                    {filteredRecords.map((record) => (
                                        <div key={record.id || `record-${record.date}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                                <h4 className="text-lg font-semibold text-blue-600">
                                                    {new Date(record.date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </h4>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Weight</p>
                                                    <p className="text-xl font-bold mt-1">{record.weight} kg</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Height</p>
                                                    <p className="text-xl font-bold mt-1">{record.height} cm</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Chest Size</p>
                                                    <p className="text-xl font-bold mt-1">{record.chestSize} cm</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Waist Size</p>
                                                    <p className="text-xl font-bold mt-1">{record.waistSize} cm</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Arm Size</p>
                                                    <p className="text-xl font-bold mt-1">{record.armSize} cm</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Leg Size</p>
                                                    <p className="text-xl font-bold mt-1">{record.legSize} cm</p>
                                                </div>
                                            </div>

                                            {record.notes && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 mb-2">Notes from Trainer</p>
                                                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                                        {record.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No progress records found</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                There are no progress records available for the selected timeframe. Please select a different timeframe or check back later.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MemberProgressHistory;
