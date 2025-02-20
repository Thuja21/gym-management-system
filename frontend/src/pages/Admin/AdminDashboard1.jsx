import React, { useState } from "react";
import { Container, Row, Col, Navbar, Nav, Card } from "react-bootstrap";
import { FaDumbbell, FaUsers, FaUserTie, FaDollarSign, FaCalendarCheck, FaSignOutAlt, FaBars } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const GymDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="d-flex" style={{ width: "100vw", height: "100vh" }}>
            {/* Sidebar */}
            <div
                className={`sidebar bg-dark text-white p-3 d-flex flex-column ${sidebarOpen ? "w-250" : "w-80"}`}
                style={{ width: sidebarOpen ? "250px" : "80px", transition: "0.3s", height: "100vh" }}
            >
                <div className="d-flex align-items-center justify-content-between">
                    {sidebarOpen && <h5>Gym Admin</h5>}
                    <FaBars className="cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)} />
                </div>
                <Nav className="flex-column mt-3 flex-grow-1">
                    <Nav.Link href="#" className="text-white d-flex align-items-center">
                        <FaDumbbell className="me-2" /> {sidebarOpen && "Dashboard"}
                    </Nav.Link>
                    <Nav.Link href="#" className="text-white d-flex align-items-center">
                        <FaUsers className="me-2" /> {sidebarOpen && "Members"}
                    </Nav.Link>
                    <Nav.Link href="#" className="text-white d-flex align-items-center">
                        <FaUserTie className="me-2" /> {sidebarOpen && "Trainers"}
                    </Nav.Link>
                    <Nav.Link href="#" className="text-white d-flex align-items-center">
                        <FaCalendarCheck className="me-2" /> {sidebarOpen && "Bookings"}
                    </Nav.Link>
                </Nav>

                {/* Logout Button - Sticks to Bottom */}
                <Nav.Link href="#" className="logout text-danger d-flex align-items-center">
                    <FaSignOutAlt className="me-2" /> {sidebarOpen && "Logout"}
                </Nav.Link>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 bg-light" style={{ width: "calc(100vw - 250px)", height: "100vh", overflowY: "auto" }}>
                {/* Topbar */}
                <Navbar bg="white" className="shadow-sm px-4 d-flex justify-content-between">
                    <h5>Dashboard</h5>
                    <div className="d-flex align-items-center">
                        <span>Welcome, Admin</span>
                        <FaSignOutAlt className="ms-3 text-danger" />
                    </div>
                </Navbar>

                {/* Dashboard Content */}
                <Container fluid className="p-4">
                    <Row className="g-4">
                        <Col md={3}>
                            <Card className="shadow-lg border-0 p-3 text-center">
                                <Card.Body>
                                    <FaUsers className="text-primary fs-1" />
                                    <Card.Title className="fw-bold mt-2">Total Members</Card.Title>
                                    <h2>320</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="shadow-lg border-0 p-3 text-center">
                                <Card.Body>
                                    <FaUserTie className="text-success fs-1" />
                                    <Card.Title className="fw-bold mt-2">Total Trainers</Card.Title>
                                    <h2>15</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="shadow-lg border-0 p-3 text-center">
                                <Card.Body>
                                    <FaDollarSign className="text-warning fs-1" />
                                    <Card.Title className="fw-bold mt-2">Total Earnings</Card.Title>
                                    <h2>$45,000</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="shadow-lg border-0 p-3 text-center">
                                <Card.Body>
                                    <FaCalendarCheck className="text-danger fs-1" />
                                    <Card.Title className="fw-bold mt-2">Bookings</Card.Title>
                                    <h2>120</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default GymDashboard;
