import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ProgressHistory({ member, records }) {
    const sortedRecords = [...records].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Progress History for {member.name}</h2>

            <div className="h-[400px] mb-8">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sortedRecords}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) => new Date(date).toLocaleDateString()}
                        />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip
                            labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="weight"
                            stroke="#2563eb"
                            name="Weight (kg)"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="bodyFatPercentage"
                            stroke="#dc2626"
                            name="Body Fat %"
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="muscleMass"
                            stroke="#16a34a"
                            name="Muscle Mass (kg)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-semibold">Detailed Records</h3>
                {sortedRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-sm text-gray-500">
                                {new Date(record.date).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Weight</p>
                                <p className="font-semibold">{record.weight} kg</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Body Fat</p>
                                <p className="font-semibold">{record.bodyFatPercentage}%</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Muscle Mass</p>
                                <p className="font-semibold">{record.muscleMass} kg</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">BMI</p>
                                <p className="font-semibold">{record.bmi}</p>
                            </div>
                        </div>

                        {record.customMeasurements.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">Custom Measurements</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {record.customMeasurements.map((measurement, index) => (
                                        <div key={index}>
                                            <p className="text-sm text-gray-500">{measurement.name}</p>
                                            <p className="font-semibold">
                                                {measurement.value} {measurement.unit}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {record.notes && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600">Notes</p>
                                <p className="text-gray-700">{record.notes}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProgressHistory;
