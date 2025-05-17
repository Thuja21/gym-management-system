import React, { useState } from 'react';
import { Save, Plus, Minus } from 'lucide-react';

export function ProgressForm({ member, onSave }) {
    const [customMeasurements, setCustomMeasurements] = useState([
        { name: 'Waist', value: 0, unit: 'cm' },
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        onSave({
            memberId: member.id,
            date: new Date().toISOString(),
            weight: Number(formData.get('weight')),
            height: Number(formData.get('height')),
            muscleMass: Number(formData.get('muscleMass')),
            bmi: Number(formData.get('bmi')),
            customMeasurements,
            notes: formData.get('notes')?.toString(),
        });
    };

    const addCustomMeasurement = () => {
        setCustomMeasurements([...customMeasurements, { name: '', value: 0, unit: 'cm' }]);
    };

    const removeCustomMeasurement = (index) => {
        setCustomMeasurements(customMeasurements.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Record Progress for {member.name}</h2>

            <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            step="0.1"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                        <input
                            type="number"
                            name="height"
                            step="0.1"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Muscle Mass (kg)</label>
                        <input
                            type="number"
                            name="muscleMass"
                            step="0.1"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">BMI</label>
                        <input
                            type="number"
                            name="bmi"
                            step="0.1"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Custom Measurements</h3>
                        <button
                            type="button"
                            onClick={addCustomMeasurement}
                            className="flex items-center text-blue-600 hover:text-blue-700"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Measurement
                        </button>
                    </div>

                    {customMeasurements.map((measurement, index) => (
                        <div key={index} className="flex gap-4 mb-4">
                            <input
                                type="text"
                                value={measurement.name}
                                onChange={(e) => {
                                    const newMeasurements = [...customMeasurements];
                                    newMeasurements[index].name = e.target.value;
                                    setCustomMeasurements(newMeasurements);
                                }}
                                placeholder="Measurement name"
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                value={measurement.value}
                                onChange={(e) => {
                                    const newMeasurements = [...customMeasurements];
                                    newMeasurements[index].value = Number(e.target.value);
                                    setCustomMeasurements(newMeasurements);
                                }}
                                step="0.1"
                                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                value={measurement.unit}
                                onChange={(e) => {
                                    const newMeasurements = [...customMeasurements];
                                    newMeasurements[index].unit = e.target.value;
                                    setCustomMeasurements(newMeasurements);
                                }}
                                placeholder="Unit"
                                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => removeCustomMeasurement(index)}
                                className="text-red-600 hover:text-red-700"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                        name="notes"
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Add any observations or feedback..."
                    />
                </div>

                <button
                    type="submit"
                    className="flex items-center justify-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Progress
                </button>
            </div>
        </form>
    );
}
