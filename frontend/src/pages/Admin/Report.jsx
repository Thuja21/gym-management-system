import React, { useState } from "react";
import axios from "axios";
import AdminSideBar from "./AdminSideBar.jsx";

function SearchMember() {
    const [memberId, setMemberId] = useState("");
    const [memberData, setMemberData] = useState(null);

    // const handleSearch = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await axios.get(`/api/search/${memberId}`);
    //         setMemberData(response.data);
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     }
    // };

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!memberId.trim()) {
            alert("Please enter a valid Member ID");
            return;
        }

        console.log("Sending request with searchTerm:", memberId); // Debugging

        try {
            const response = await axios.get("http://localhost:5000/api/attendance/search", {
                params: { searchTerm: memberId }, // ✅ Fixes empty request issue
            });

            console.log("Fetched Data:", response.data); // Debugging
            setMemberData(response.data);
        } catch (error) {
            console.error("Error fetching member data:", error);
            setMemberData(null);
        }
    };


    return (
        <div>
            <AdminSideBar/>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Enter Member ID"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {memberData && (
                <div>
                    <h2>Member Details</h2>
                    <p>Name: {memberData.member_id}</p>
                    <p>Email: {memberData.email}</p>
                    {/* Display other member data here */}
                </div>
            )}
        </div>
    );
}

export default SearchMember;
