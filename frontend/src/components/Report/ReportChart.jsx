import React from 'react';

// ChartData and ReportChartProps interfaces removed for JSX version

const ReportChart = ({ type, data, title, isLoading }) => {
    if (isLoading) {
        return (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
                <p className="text-gray-400">Loading chart...</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-64 overflow-hidden">
            {title && <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>}

            {type === 'pie' || type === 'doughnut' ? (
                <div className="flex items-center justify-center h-full">
                    <div className={`relative w-40 h-40 ${type === 'doughnut' ? 'rounded-full border-8 border-white' : 'rounded-full'}`}>
                        {data.datasets[0].data.map((value, index) => {
                            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = (value / total) * 100;
                            const backgroundColor = Array.isArray(data.datasets[0].backgroundColor)
                                ? data.datasets[0].backgroundColor[index]
                                : data.datasets[0].backgroundColor;

                            return (
                                <div
                                    key={index}
                                    className="absolute inset-0"
                                    style={{
                                        backgroundColor,
                                        clipPath: `polygon(50% 50%, 50% 0, ${50 + 50 * Math.cos(percentage * 3.6 * Math.PI / 180)}% ${50 - 50 * Math.sin(percentage * 3.6 * Math.PI / 180)}%, 100% 0, 100% 100%, 0 100%, 0 0)`
                                    }}
                                />
                            );
                        })}
                    </div>

                    <div className="ml-8">
                        <ul className="space-y-2">
                            {data.labels.map((label, index) => (
                                <li key={index} className="flex items-center">
                                    <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{
                                            backgroundColor: Array.isArray(data.datasets[0].backgroundColor)
                                                ? data.datasets[0].backgroundColor[index]
                                                : data.datasets[0].backgroundColor
                                        }}
                                    />
                                    <span className="text-sm text-gray-700">{label}: {data.datasets[0].data[index]}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : type === 'bar' ? (
                <div className="h-full flex items-end justify-around px-4 pb-4">
                    {data.labels.map((label, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div
                                className="w-12 bg-indigo-600 rounded-t-sm"
                                style={{
                                    height: `${(data.datasets[0].data[index] / Math.max(...data.datasets[0].data)) * 150}px`,
                                    backgroundColor: Array.isArray(data.datasets[0].backgroundColor)
                                        ? data.datasets[0].backgroundColor[index]
                                        : data.datasets[0].backgroundColor
                                }}
                            />
                            <span className="text-xs mt-1 text-gray-600">{label}</span>
                            <span className="text-xs font-medium">{data.datasets[0].data[index]}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-full flex flex-col justify-between">
                    <div className="h-full w-full border-b border-l border-gray-200 relative">
                        {[0, 25, 50, 75, 100].map((tick) => (
                            <div
                                key={tick}
                                className="absolute left-0 right-0 border-t border-gray-100"
                                style={{ bottom: `${tick}%` }}
                            >
                                <span className="text-xs text-gray-400 absolute -left-6">
                                    {Math.round((Math.max(...data.datasets[0].data) * tick) / 100)}
                                </span>
                            </div>
                        ))}

                        <svg className="w-full h-full" preserveAspectRatio="none">
                            <path
                                d={`M0,${200 - (data.datasets[0].data[0] / Math.max(...data.datasets[0].data)) * 200} ${data.datasets[0].data.map((value, i) => {
                                    const x = (i / (data.datasets[0].data.length - 1)) * 100;
                                    const y = 200 - (value / Math.max(...data.datasets[0].data)) * 200;
                                    return `L${x},${y}`;
                                }).join(' ')}`}
                                fill="none"
                                stroke="#4F46E5"
                                strokeWidth="2"
                            />
                            <path
                                d={`M0,${200 - (data.datasets[0].data[0] / Math.max(...data.datasets[0].data)) * 200} ${data.datasets[0].data.map((value, i) => {
                                    const x = (i / (data.datasets[0].data.length - 1)) * 100;
                                    const y = 200 - (value / Math.max(...data.datasets[0].data)) * 200;
                                    return `L${x},${y}`;
                                }).join(' ')} L100,200 L0,200 Z`}
                                fill="rgba(79, 70, 229, 0.1)"
                                stroke="none"
                            />
                        </svg>
                    </div>

                    <div className="flex justify-between px-4 mt-2">
                        {data.labels.map((label, index) => (
                            <span key={index} className="text-xs text-gray-500">
                                {label.length > 10 ? label.substring(0, 10) + '...' : label}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportChart;
