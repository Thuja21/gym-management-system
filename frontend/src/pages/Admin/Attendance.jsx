import React, { useEffect, useState } from 'react';
import { Search } from "lucide-react";
import AdminSideBar from "./AdminSideBar.jsx";
import axios from "axios";

function Attendance() {
    const [members, setMembers] = useState([]); // State to store all members data
    const [searchTerm, setSearchTerm] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedMember, setSelectedMember] = useState({
        id: '', name: '', membershipId: '', checkIn: '', checkOut: '', date: new Date().toISOString().split('T')[0],
    });
    const [filteredMembers, setFilteredMembers] = useState([]); // State to store filtered members (search results)

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/api/members/all`);
                setMembers(response.data); // Store all members data in the state
                setFilteredMembers(response.data); // Initialize filtered members with all members
            } catch (error) {
                console.error("Failed to fetch members", error);
            }
        };
        fetchMembers();
    }, []);


    // Fetch attendance by selected date
    useEffect(() => {
        const fetchAttendanceRecords = async () => {
            if (!selectedDate) {
                setError("Please select a date");
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8800/api/attendance/all?date=${selectedDate}`);
                setAttendanceRecords(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching attendance:", err);
                setError("Failed to retrieve attendance records");
            }
        };
        fetchAttendanceRecords();
    }, [selectedDate]); // Fetch attendance every time the selectedDate changes



    // Handle the search logic
    const handleSearch = (e) => {
        e.preventDefault();

        const foundMember = members.find((member) =>
            member.member_id.toString().includes(searchTerm) ||
            member.full_name.toLowerCase().includes(searchTerm.toLowerCase())
            // (member.check_in_time && member.checkin.toLowerCase().includes(searchTerm.toLowerCase())) ||
            // (member.check_out_time && member.checkout.toLowerCase().includes(searchTerm.toLowerCase())) ||
            // (member.date && member.date.toString().includes(searchTerm))
        );

        if (foundMember) {
            setSelectedMember({
                id: foundMember.member_id,
                name: foundMember.full_name,
                checkIn: selectedMember.check_in_time || "Not Check-in ",
                checkOut: selectedMember.check_out_time || "Not Checked Out",
                date: new Date().toISOString().split('T')[0],
            });
        } else {
            setSelectedMember({
                id: '',
                name: '',
                checkIn: '',
                checkOut: '',
                date: new Date().toISOString().split('T')[0],
            });
        }
        console.log("Selected Member:", selectedMember);  // Debugging
    };


    const handleCheckIn = async () => {
        if (selectedMember.id) {
            const checkInData = {
                member_id: selectedMember.id,
                checkIn:  new Date().toLocaleTimeString('en-GB', { hour12: false }),
                checkOut: null,  // Initially null since the member hasn't checked out yet
                date: new Date().toISOString().split('T')[0], // Store date in YYYY-MM-DD format
                attended: true, // Mark as attended
            };

            try {
                const response = await axios.post("http://localhost:8800/api/attendance/checkin", checkInData);

                alert(response.data.message); // Show success message
                setAttendanceRecords(prev => [...prev, { ...checkInData, date: new Date().toISOString().split('T')[0] }]);
                setSelectedMember(prev => ({ ...prev, checkIn: checkInData.checkIn }));

            } catch (error) {
                console.error("Check-in failed", error);
                alert(error.response?.data?.message || "Check-in failed. Please try again.");
            }
        } else {
            alert("Please select a valid member before checking in.");
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

    // Check if selected date is today
    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    // Filter attendance records by selected date
    const filteredRecords = attendanceRecords.filter(record => record.date === selectedDate);

    return (
        <div style={{ display: "flex", height: "100vh", width: "103vw", marginTop: "40px", marginLeft: "-43px" }}>

            <AdminSideBar style={{ flexShrink: 0, width: 250 }} />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh", overflowY: "auto" }}>

                <div className="card mt-4">
                    <div className="card-body p-4">
                        <div className="mb-4 flex items-center space-x-2" style={{ paddingBottom: "20px" }}>
                            <div>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                />
                            </div>
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
                        {isToday && (
                            <div className="row g-3">

                                <div className="col-md-4 d-flex align-items-center">
                                    <label htmlFor="memberId" className="form-label me-2" style={{ whiteSpace: "nowrap" }}>
                                        Member ID:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ width: "250px", backgroundColor: "#efefef" }}
                                        id="memberId"
                                        value={selectedMember.id}
                                        onChange={(e) => setSelectedMember({ ...selectedMember, member_id: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-4 d-flex align-items-center">
                                    <label className="form-label me-2 mb-0" style={{ whiteSpace: "nowrap" }}>
                                        Check-in Time:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={selectedMember.checkIn }
                                        style={{ marginLeft: "10px"}}
                                        disabled
                                    />
                                </div>
                                <div className="col-md-4 d-flex align-items-center">
                                    <label htmlFor="date" className="form-label me-2" style={{ marginLeft: "37px" }}>
                                        Date:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="date"
                                        value={selectedDate}
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-4 d-flex align-items-center">
                                    <label className="form-label me-2">
                                        Name:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        value={selectedMember.name}
                                        onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                                        style={{ marginLeft: "37px", width: "250px", backgroundColor: "#efefef" }}
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

                                <div className="col-md-4 d-flex justify-content-end align-items-center" >
                                    <button onClick={handleCheckIn} className="btn btn-success me-2" style={{ width: "140px", marginBottom:"-10px"}}>
                                        Check In
                                    </button>
                                    <button onClick={handleCheckOut} className="btn btn-danger" style={{ width: "140px", marginBottom:"-10px" }}>
                                        Check Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="overflow-x-auto mt-6" style={{ overflow: "hidden" }}>
                    <table className="min-w-full divide-y">
                        <thead className="bg-red-200 text-black">
                        <tr>
                            <th className="px-6 py-3">Member ID</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Check-in Time</th>
                            <th className="px-6 py-3">Check-out Time</th>
                            <th className="px-6 py-3">Date</th>
                        </tr>
                        </thead>
                        <tbody className="bg-gray-100 divide-y divide-gray-200">
                        {attendanceRecords.map((record) => (
                            <tr key={record.attendance_id}>
                                <td className="px-6 py-4">{record.member_id}</td>
                                <td className="px-6 py-4">{record.full_name}</td>
                                <td className="px-6 py-4">{record.checkIn || record.check_in_time}</td>
                                <td className="px-6 py-4">{record.check_out_time || 'Not Checked Out'}</td>
                                <td className="px-6 py-4">{record.attendance_date}</td>
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