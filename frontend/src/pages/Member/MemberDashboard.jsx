import React from "react";

import AdminSideBar from "../Admin/AdminSideBar.jsx";
import dashBarImg from "../../assets/images/dashBarImg.png";
import TopBar from "../../components/TopBar.jsx";
import {Box} from "@mui/material";


const MemberDashboard = () => {
    return (
        <div
            style={{
                //backgroundColor: "#1f1f1f", // Change this to your desired background color
                //backgroundColor: "#16171c",
                backgroundColor: "#0a0a0a",
                //backgroundColor: "#1e272e",
                minHeight: "100vh", // Ensures it covers the entire viewport height
                width: "100vw",
                padding: "20px", // Optional padding for spacing
                fontWeight: "bold",
            }}
        >
            <AdminSideBar />
            <TopBar/>

            <Box
                sx={{
                    width: "2550px",
                    height: "5px",
                    backgroundColor: "#1a1c23",
                    border: "none",
                    position: "absolute",
                    marginTop: "60px",
                    marginLeft: "-20px",

                }}
            />

            <Box
                sx={{
                    width: "1242px",
                    height: "90px",
                    //background:"linear-gradient(to right, #3d0404, #f2546b)",
                    background:"linear-gradient(to right, rgba(61, 4, 4, 1.8), rgba(178, 4, 34, 0.7), rgba(255, 0, 0, 0.7))",
                    //background:"linear-gradient(to right, rgba(61, 4, 4, 1.5), rgba(61, 4, 4, 0.3))",
                    border: "none",
                    margin: "90px 0 6px 245px", // Adjust margins to move the image
                    borderRadius: 8,

                }}

            />


            <img
                src={dashBarImg}
                alt="description"
                style={{
                    width: "auto",
                    height: "auto",
                    margin: "-93px 0 0 -515px", // Adjust margins to move the image
                    position: "absolute",
                    padding: "0",
                    borderRadius: "32px",
                }}
            />

            <Box
                sx={{
                    width: "290px",
                    height: "120px",
                    backgroundColor: "#1a1b23",
                    border: "none",
                    margin: "35px 0 6px 245px", // Adjust margins to move the image
                    borderRadius: 8,
                }}
            />

            <Box
                sx={{
                    width: "290px",
                    height: "120px",
                    backgroundColor: "#1a1b23",
                    border: "none",
                    margin: "-123px 0 6px 565px", // Adjust margins to move the image
                    borderRadius: 8,
                }}
            />

            <Box
                sx={{
                    width: "290px",
                    height: "120px",
                    backgroundColor: "#1a1b23",
                    border: "none",
                    margin: "-125px 0 6px 880px", // Adjust margins to move the image
                    borderRadius: 8,
                }}
            />

            <Box
                sx={{
                    width: "290px",
                    height: "120px",
                    backgroundColor: "#1a1b23",
                    border: "none",
                    margin: "-125px 0 6px 1195px", // Adjust margins to move the image
                    borderRadius: 8,
                }}
            />

            <Box
                sx={{
                    width: "490px",
                    height: "340px",
                    backgroundColor: "#1a1b23",
                    border: "none",
                    margin: "21px 0 6px 246px", // Adjust margins to move the image
                    borderRadius: 8,
                }}
            />

            <Box
                sx={{
                    width: "725px",
                    height: "340px",
                    backgroundColor: "#1a1b23",
                    border: "none",
                    margin: "-344px 0 6px 760px", // Adjust margins to move the image
                    borderRadius: 8,
                }}
            />
            {/*<div*/}
            {/*    style={{*/}
            {/*        position: "absolute", // Use absolute positioning*/}
            {/*        top: "140px", // Adjust the vertical position*/}
            {/*        left: "500px", // Adjust the horizontal position*/}
            {/*        transform: "translate(-50%, -50%)", // Center offset if needed*/}


            {/*    }}*/}
            {/*>*/}
            {/*    <h3>Welcome Back</h3>*/}

            {/*</div>*/}



        </div>
    );
};

export default MemberDashboard;
