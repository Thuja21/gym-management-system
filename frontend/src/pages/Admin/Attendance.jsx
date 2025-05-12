import React, { useEffect, useState } from 'react';
import { Search } from "lucide-react";
import AdminSideBar from "./AdminSideBar.jsx";
import axios from "axios";
import { Paper, Grid, TextField, Button, Typography, Box, InputAdornment } from "@mui/material";

function Attendance() {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedMember, setSelectedMember] = useState({
        id: '', name: '', membershipId: '', checkIn: '', checkOut: '', date: new Date().toISOString().split('T')[0],
    });

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/api/members/all`);
                setMembers(response.data);
            } catch (error) {
                console.error("Failed to fetch members", error);
            }
        };
        fetchMembers();
    }, []);

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
    }, [selectedDate]);

    const handleSearch = (e) => {
        e.preventDefault();

        const foundMember = members.find((member) =>
            member.member_id.toString().includes(searchTerm) ||
            member.full_name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (foundMember) {
            const filteredRecord = attendanceRecords.filter(record =>
                foundMember.member_id === record.member_id)[0];

            setSelectedMember({
                id: foundMember.member_id,
                name: foundMember.full_name,
                checkIn: filteredRecord?.check_in_time || "Not Check-in ",
                checkOut: filteredRecord?.check_out_time || "Not Checked Out",
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
        console.log("Selected Member:", selectedMember);
    };

    // Function to update member attendance info when a member is selected
    const updateMemberAttendanceInfo = (memberId) => {
        const member = members.find(m => m.member_id.toString() === memberId);

        if (member) {
            // Find attendance record for this member on the selected date
            const attendanceRecord = attendanceRecords.find(record =>
                record.member_id === member.member_id &&
                new Date(record.attendance_date).toLocaleDateString() === new Date(selectedDate).toLocaleDateString()
            );

            setSelectedMember({
                id: member.member_id,
                name: member.full_name,
                checkIn: attendanceRecord?.check_in_time || "Not Check-in",
                checkOut: attendanceRecord?.check_out_time || "Not Checked Out",
                date: selectedDate,
            });
        } else {
            // Reset if no member found
            setSelectedMember({
                id: '',
                name: '',
                checkIn: '',
                checkOut: '',
                date: selectedDate,
            });
        }
    };

    const handleCheckIn = async () => {
        if (selectedMember.id) {
            const checkInData = {
                member_id: selectedMember.id,
                attendance_date: new Date().toISOString().split('T')[0],
                check_in_time:  new Date().toLocaleTimeString('en-GB', { hour12: false }),
                check_out_time: null,
                attended: true,
            };
            console.log(selectedMember);
            try {
                const response = await axios.post("http://localhost:8800/api/attendance/checkin", checkInData);

                alert(response.data.message);
                setAttendanceRecords(prev => [...prev, { ...checkInData, attendance_id: response.data.attendance_id, full_name: selectedMember.name }]);
                setSelectedMember(prev => ({ ...prev, checkIn: checkInData.check_in_time}));

            } catch (error) {
                console.error("Check-in failed", error);
                alert(error.response?.data?.message || "Check-in failed. Please try again.");
            }
        } else {
            alert("Please select a valid member before checking in.");
        }
    };

    const handleCheckOut = async () => {
        if (selectedMember.id) {
            const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
            console.log(selectedMember);

            const filteredRecord = attendanceRecords.filter(record =>
                new Date(record.attendance_date).toLocaleDateString() === new Date(selectedDate).toLocaleDateString() &&
                record.member_id === selectedMember.id)[0];

            console.log(filteredRecord);

            try {
                const response = await axios.post(`http://localhost:8800/api/attendance/checkout/${selectedMember.id}`, filteredRecord);
                alert(response.data.message);
                setAttendanceRecords((prevRecords) => {
                    return prevRecords.map((record) =>
                        record.member_id === selectedMember.id && new Date(record.attendance_date).toLocaleDateString() === new Date(selectedDate).toLocaleDateString()
                            ? { ...record, check_out_time: currentTime }
                            : record
                    );
                });

                setSelectedMember((prev) => ({ ...prev, checkOut: currentTime }));

            } catch (error) {
                console.error("Check-out failed", error);
                alert(error.response?.data?.message || "Check-out failed. Please try again.");
            }
        } else {
            alert("Please select a valid member before checking out.");
        }
    };

    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    return (
        <div className="bg-gray-100" style={{ display: "flex", height: "100vh", width: "103vw", marginTop: "50px", marginLeft: "-43px" }}>
            <AdminSideBar style={{ flexShrink: 0, width: 250 }} />
            <Box sx={{ flexGrow: 1, p: 3, height: "100vh", overflowY: "auto" }}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                    {/* Search and Date Section */}
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Grid item xs={12} md={3}>
                            <TextField
                                type="date"
                                fullWidth
                                variant="outlined"
                                value={selectedDate}
                                onChange={handleDateChange}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <TextField
                                fullWidth
                                placeholder="Search member by ID or name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ alignItems: "flex-start" }}>
                                            <Search size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={handleSearch}
                            >
                                Search
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Divider between sections */}
                    {isToday && (
                        <>
                            <Box sx={{
                                height: '1px',
                                bgcolor: 'rgba(0, 0, 0, 0.12)',
                                width: '100%',
                                my: 4
                            }} />

                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}></Typography>
                            {/* Member Details Section with improved alignment and text clarity */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography sx={{
                                            mr: 1,
                                            minWidth: '120px',
                                            fontWeight: 'medium',
                                            color: 'rgba(0, 0, 0, 0.87)'
                                        }}>
                                            Member:
                                        </Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={selectedMember.id}
                                            onChange={(e) => {
                                                const selectedId = e.target.value;
                                                // Call the function to update member attendance info
                                                updateMemberAttendanceInfo(selectedId);
                                            }}
                                            SelectProps={{
                                                native: true,
                                            }}
                                        >
                                            <option value="">Select a member</option>
                                            {members.map((member) => (
                                                <option key={member.member_id} value={member.member_id}>
                                                    {member.member_id} - {member.full_name}
                                                </option>
                                            ))}
                                        </TextField>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography sx={{
                                            mr: 1,
                                            minWidth: '120px',
                                            fontWeight: 'medium',
                                            color: 'rgba(0, 0, 0, 0.87)'
                                        }}>
                                            Date:
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={selectedDate}
                                            // disabled
                                            sx={{ color: 'rgba(0, 0, 0, 0.57)', bgcolor: 'rgba(0, 0, 0, 0.04)'  }}
                                        />
                                    </Box>
                                </Grid>

                                {/* Check-in and Check-out in same vertical line */}
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography sx={{
                                            mr: 1,
                                            minWidth: '120px',
                                            fontWeight: 'medium',
                                            color: 'rgba(0, 0, 0, 0.87)'
                                        }}>
                                            Check-in Time:
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={selectedMember.checkIn || 'Not Checked In'}
                                            // disabled
                                            sx={{ color: 'rgba(0, 0, 0, 0.57)', bgcolor: 'rgba(0, 0, 0, 0.04)' }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography sx={{
                                            mr: 1,
                                            minWidth: '120px',
                                            fontWeight: 'medium',
                                            color: 'rgba(0, 0, 0, 0.87)'
                                        }}>
                                            Check-out Time:
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={selectedMember.checkOut || 'Not Checked Out'}
                                            // disabled
                                            sx={{ color: 'rgba(0, 0, 0, 0.57)', bgcolor: 'rgba(0, 0, 0, 0.04)'  }}
                                        />
                                    </Box>
                                </Grid>

                                {/* Action Buttons */}
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={handleCheckIn}
                                            sx={{ mr: 2, minWidth: '140px' }}
                                        >
                                            Check In
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={handleCheckOut}
                                            sx={{ minWidth: '140px' }}
                                        >
                                            Check Out
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Paper>

                {/* Attendance Table */}
                <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Typography variant="h6" sx={{ p: 2, bgcolor: '#f5f5f5', fontWeight: 'bold' }}>
                        Attendance Records - {selectedDate}
                    </Typography>
                    <Box sx={{ overflowX: 'auto' }}>
                        <table className="min-w-full divide-y">
                            <thead className="bg-gray-200 text-black">
                            <tr>
                                <th className="px-6 py-3">Member ID</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Check-in Time</th>
                                <th className="px-6 py-3">Check-out Time</th>
                                <th className="px-6 py-3">Date</th>
                            </tr>
                            </thead>
                            <tbody className="bg-gray-100 divide-y divide-gray-200">
                            {attendanceRecords.length > 0 ? (
                                attendanceRecords.map((record) => (
                                    <tr key={record.attendance_id}>
                                        <td className="px-6 py-4">{record.member_id}</td>
                                        <td className="px-6 py-4">{record.full_name}</td>
                                        <td className="px-6 py-4">{record.checkIn || record.check_in_time}</td>
                                        <td className="px-6 py-4">{record.check_out_time || 'Not Checked Out'}</td>
                                        <td className="px-6 py-4">{new Date(record.attendance_date).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        No records found for {selectedDate}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </Box>
                </Paper>
            </Box>
        </div>
    );
}

export default Attendance;
