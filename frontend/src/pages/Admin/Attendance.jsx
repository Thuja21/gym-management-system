import React, { useState } from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Search } from "lucide-react";
import AdminSideBar from "./AdminSideBar.jsx";

const MOCK_MEMBERS = [
    { id: 1, name: 'John Doe', membershipId: 'GM001' },
    { id: 2, name: 'Jane Smith', membershipId: 'GM002' },
    { id: 3, name: 'Mike Johnson', membershipId: 'GM003' },
    { id: 4, name: 'Sarah Williams', membershipId: 'GM004' },
    { id: 5, name: 'Robert Brown', membershipId: 'GM005' },
];

function Attendance() {
    const [searchTerm, setSearchTerm] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [selectedMember, setSelectedMember] = useState({
        id: '', name: '', membershipId: '', checkIn: '', checkOut: '', date: new Date().toISOString().split('T')[0], // Sets today's date
    });




    const handleSearch = () => {
        const member = MOCK_MEMBERS.find(m =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.membershipId.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (member) {
            const existingRecord = attendanceRecords.find(r => r.id === member.id);
            setSelectedMember({
                ...member,
                checkIn: existingRecord?.checkIn || '',
                checkOut: existingRecord?.checkOut || '',
                date: existingRecord?.date || new Date().toLocaleDateString()
            });
        } else {
            // Allow manual entry if no member is found
            setSelectedMember({ id: '', name: '', membershipId: '', checkIn: '', checkOut: '', date: '' });
        }
    };

    const handleCheckIn = () => {
        if (selectedMember.name && selectedMember.membershipId) {
            const currentTime = new Date().toLocaleTimeString();
            setAttendanceRecords(prev => {
                const existingRecord = prev.find(r => r.id === selectedMember.id);
                if (existingRecord) {
                    return prev.map(r =>
                        r.id === selectedMember.id ? { ...r, checkIn: currentTime, date: new Date().toLocaleDateString() } : r
                    );
                } else {
                    return [...prev, { ...selectedMember, checkIn: currentTime, date: new Date().toLocaleDateString() }];
                }
            });
            setSelectedMember(prev => ({ ...prev, checkIn: currentTime, date: new Date().toLocaleDateString() }));
        }
    };

    const handleCheckOut = () => {
        if (selectedMember.name && selectedMember.membershipId) {
            const currentTime = new Date().toLocaleTimeString();
            setAttendanceRecords(prev =>
                prev.map(r => r.id === selectedMember.id ? { ...r, checkOut: currentTime } : r)
            );
            setSelectedMember(prev => ({ ...prev, checkOut: currentTime }));
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", width:"103vw", marginTop: "40px" , marginLeft: "-43px"}}>

            <AdminSideBar style={{ flexShrink: 0, width: 250 }} />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh", overflowY: "auto" ,scrollbarWidth: "none", // Hide scrollbar for Firefox
                "&::-webkit-scrollbar": {
                    display: "none", // Hide scrollbar for Webkit-based browsers (Chrome, Edge, etc.)
                },}}>

                {/*/!* Summary *!/*/}
                {/*<div className="mt-6 bg-gray-400 rounded-md p-4">*/}
                {/*    <h2 className="text-lg font-semibold text-gray-700 mb-2">Today's Summary</h2>*/}
                {/*    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">*/}
                {/*        <div className="bg-white p-4 rounded-lg shadow">*/}
                {/*            <p className="text-sm text-gray-500">Total Members</p>*/}
                {/*            <p className="text-2xl font-bold text-gray-800">{MOCK_MEMBERS.length}</p>*/}
                {/*        </div>*/}
                {/*        <div className="bg-white p-4 rounded-lg shadow">*/}
                {/*            <p className="text-sm text-gray-500">Checked In</p>*/}
                {/*            <p className="text-2xl font-bold text-green-600">{attendanceRecords.filter(r => r.checkIn).length}</p>*/}
                {/*        </div>*/}
                {/*        <div className="bg-white p-4 rounded-lg shadow">*/}
                {/*            <p className="text-sm text-gray-500">Checked Out</p>*/}
                {/*            <p className="text-2xl font-bold text-red-600">{attendanceRecords.filter(r => r.checkOut).length}</p>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="card mt-4">
                    <div className="card-body p-4">
                        <div className="mb-4 flex items-center space-x-2" style={{paddingBottom: "20px"}}>
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Search member by ID or name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    aria-label="Search members"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                            >
                                Search
                            </button>
                        </div>

                        {/* Member Details */}
                        <div className="row g-3" >
                            <div className="col-md-4 d-flex align-items-center" > {/* Aligned label and input */}
                                <label htmlFor="memberId" className="form-label me-2" style={{ whiteSpace: "nowrap" }}> {/* Added margin to label */}
                                    Member ID:
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    style={{width:"250px"}}
                                    id="memberId"
                                    value={selectedMember.membershipId}
                                    onChange={(e) => setSelectedMember({ ...selectedMember, membershipId: e.target.value })}
                                />
                            </div>
                            <div className="col-md-4 d-flex align-items-center">
                                <label className="form-label me-2 mb-0" style={{ whiteSpace: "nowrap" }}>
                                    Check-in Time:
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedMember.checkIn || 'Not Checked In'}
                                    disabled
                                    style={{ marginLeft: "10px" }}
                                />
                            </div>


                            <div className="col-md-4 d-flex align-items-center"> {/* Aligned label and input */}
                                <label htmlFor="date" className="form-label me-2" style={{ marginLeft: "37px" }}>
                                    Date:
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date"
                                    value={selectedMember.date}
                                    onChange={(e) => setSelectedMember({ ...selectedMember, date: e.target.value })}
                                />
                            </div>

                            <div className="col-md-4 d-flex align-items-center">
                                <label htmlFor="name" className="form-label me-2" >
                                    Name:
                                </label>
                                <input
                                    type="text"
                                    className="form-control" // Makes the input smaller
                                    id="name"
                                    value={selectedMember.name}
                                    onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                                    style={{ marginLeft: "37px", width: "250px" }}
                                />
                            </div>

                            <div className="col-md-4 d-flex align-items-center">
                                <label className="form-label me-2 mb-0" style={{ whiteSpace: "nowrap" }}>
                                    Check-out Time:
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedMember.checkOut || 'Not Checked Out'}
                                    disabled
                                />
                            </div>

                            <div className="col-md-4 d-flex justify-content-end align-items-center ">
                                <button onClick={handleCheckIn} className="btn btn-success me-2" style={{width: "155px"}} >
                                    Check In
                                </button>
                                <button onClick={handleCheckOut} className="btn btn-danger"  style={{width: "155px"}}>
                                    Check Out
                                </button>
                            </div>

                        </div>
                    </div>
                </div>





                {/* Attendance Table */}
                <div className="overflow-x-auto mt-6" style={{overflow: "hidden"}}>
                    <table className="min-w-full divide-y">
                        <thead className="bg-red-200 text-black">
                        <tr>
                            <th className="px-6 py-3 ">Member ID</th>
                            <th className="px-6 py-3 ">Name</th>
                            <th className="px-6 py-3 ">Check-in Time</th>
                            <th className="px-6 py-3 ">Check-out Time</th>
                            <th className="px-6 py-3 ">Date</th>
                        </tr>
                        </thead>
                        <tbody className="bg-gray-100 divide-y divide-gray-200">
                        {attendanceRecords.map((record) => (
                            <tr key={record.id}>
                                <td className="px-6 py-4">{record.membershipId}</td>
                                <td className="px-6 py-4">{record.name}</td>
                                <td className="px-6 py-4">{record.checkIn || 'Not Checked In'}</td>
                                <td className="px-6 py-4">{record.checkOut || 'Not Checked Out'}</td>
                                <td className="px-6 py-4">{record.date}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Attendance;
