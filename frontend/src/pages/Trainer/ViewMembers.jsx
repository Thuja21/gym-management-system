import React, { useEffect, useState } from "react";
import TrainerSideBar from "./TrainerSideBar.jsx";
import { Search, Plus, LineChart, BarChart, Calendar, TrendingUp, Activity, FileText, User } from "lucide-react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, Box, IconButton, Grid, MenuItem, Select,
    InputLabel, FormControl, Tabs, Tab, Tooltip, Avatar, Chip,
    Card, CardContent, Divider, CircularProgress, Badge, Alert
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    ChartTooltip,
    Legend,
    Filler
);

// Styled components
const StyledTableHead = styled(TableHead)(({ theme }) => ({
    '& th': {
        backgroundColor: "#d8d9dc",
        color: "black",
        fontWeight: 'bold',
        fontSize: '0.75rem',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
        cursor: 'pointer',
    },
    transition: 'background-color 0.2s ease',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    fontWeight: 'bold',
    '&.Mui-selected': {
        color: theme.palette.primary.main,
    },
}));

const MetricCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[8],
    },
}));

const TrackMemberProgress = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);
    const [progressDialogOpen, setProgressDialogOpen] = useState(false);
    const [progressHistory, setProgressHistory] = useState([]);
    const [progressLoading, setProgressLoading] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveFail, setSaveFail] = useState(false);
    const [saveFailMessage, setSaveFailMessage] = useState("");

    const [newProgress, setNewProgress] = useState({
        weight: "",
        bodyFat: "",
        chestSize: "",
        waistSize: "",
        armSize: "",
        legSize: "",
        notes: "",
        date: new Date().toISOString().split('T')[0]
    });

    // Fetch members from backend
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch("http://localhost:8800/api/members/all");
                if (!response.ok) {
                    throw new Error("Failed to fetch members.");
                }
                const data = await response.json();
                setMembers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, [loading]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleOpenProgressDialog = (member) => {
        setSelectedMember(member);
        setProgressDialogOpen(true);
        fetchMemberProgress(member.member_id);
    };

    const handleCloseProgressDialog = () => {
        setProgressDialogOpen(false);
        setSelectedMember(null);
        setProgressHistory([]);
        setNewProgress({
            weight: "",
            bodyFat: "",
            chestSize: "",
            waistSize: "",
            armSize: "",
            legSize: "",
            notes: "",
            date: new Date().toISOString().split('T')[0]
        });
        setSaveSuccess(false);
        setSaveFail(false);
        setSaveFailMessage("")
    };

    const fetchMemberProgress = async (memberId) => {
        setProgressLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await axios.get(`http://localhost:8800/api/progress/get/${memberId}`);
            setProgressHistory(response.data || []);
        } catch (error) {
            console.error("Error fetching progress history:", error);
        } finally {
            setProgressLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProgress({
            ...newProgress,
            [name]: value
        });
    };

    const handleAddProgress = async () => {
        setSaveLoading(true);
        try {
            // Replace with your actual API endpoint
            await axios.post(`http://localhost:8800/api/progress/add/${selectedMember.member_id}`, {
                ...newProgress,
                member_id: selectedMember.member_id
            });

            // Refresh progress data
            fetchMemberProgress(selectedMember.member_id);

            // Reset form
            setNewProgress({
                weight: "",
                bodyFat: "",
                chestSize: "",
                waistSize: "",
                armSize: "",
                legSize: "",
                notes: "",
                date: new Date().toISOString().split('T')[0]
            });

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);

        } catch (error) {
            console.error("Error adding progress:", error);
            // Reset form
            setNewProgress({
                weight: "",
                bodyFat: "",
                chestSize: "",
                waistSize: "",
                armSize: "",
                legSize: "",
                notes: "",
                date: new Date().toISOString().split('T')[0]
            });
            setSaveFail(true);
            setSaveFailMessage(error.response?.data || "An unexpected error occurred.");
            setTimeout(() => {
                setSaveFail(false)
                setSaveFailMessage("")
            }, 6000);
        } finally {
            setSaveLoading(false);
        }
    };

    const filteredMembers = members.filter(member =>
        member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.contact_no?.includes(searchTerm) ||
        member.member_id?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate progress changes
    const getProgressChange = (metric) => {
        if (progressHistory.length < 2) return null;

        const sortedData = [...progressHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
        const latestValue = parseFloat(sortedData[sortedData.length - 1][metric]);
        const previousValue = parseFloat(sortedData[sortedData.length - 2][metric]);

        if (isNaN(latestValue) || isNaN(previousValue)) return null;

        const change = latestValue - previousValue;
        const percentChange = (change / previousValue) * 100;

        return {
            change,
            percentChange,
            isPositive:
                (metric === 'weight' || metric === 'bodyFat' || metric === 'waistSize')
                    ? change < 0
                    : change > 0
        };
    };

    // Prepare chart data
    const getChartData = (metric) => {
        if (!progressHistory.length) return null;

        const sortedData = [...progressHistory].sort((a, b) => new Date(a.date) - new Date(b.date));

        return {
            labels: sortedData.map(record => {
                const date = new Date(record.date);
                return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            }),
            datasets: [
                {
                    label: metric === 'weight' ? 'Weight (kg)' :
                        metric === 'bodyFat' ? 'Body Fat %' :
                            metric === 'chestSize' ? 'Chest (cm)' :
                                metric === 'waistSize' ? 'Waist (cm)' :
                                    metric === 'armSize' ? 'Arms (cm)' : 'Legs (cm)',
                    data: sortedData.map(record => record[metric]),
                    fill: true,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        };
    };

    // Get latest metrics
    const getLatestMetrics = () => {
        if (!progressHistory.length) return null;

        const sortedData = [...progressHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
        return sortedData[0];
    };

    const latestMetrics = getLatestMetrics();

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <TrainerSideBar style={{ flexShrink: 0, width: 250 }} />
            <div style={{ flexGrow: 1, padding: "20px", height: "100vh", width: "1300px", overflowY: "auto", marginLeft: "-45px", marginTop: "10px" }}>
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                    <TrendingUp size={32} color="#1976d2" style={{ marginRight: 16 }} />
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        MEMBER PROGRESS TRACKING
                    </Typography>
                </Box>

                <Paper
                    elevation={1}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 2,
                        background: 'linear-gradient(to right, #f5f7fa, #ffffff)'
                    }}
                >
                    <div className="flex flex-col md:flex-row md:items-center gap-4 rounded-xl">
                        <div className="relative flex-1">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search members by name or phone number..."
                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ fontSize: '1rem', transition: 'all 0.3s ease' }}
                            />
                        </div>
                    </div>
                </Paper>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ my: 2 }}>
                        {error}
                    </Alert>
                )}

                {!loading && !error && (
                    <Paper
                        elevation={3}
                        sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}
                    >
                        <TableContainer
                            sx={{
                                height: "calc(100vh - 280px)",
                                width: "100%",
                                scrollbarWidth: "thin",
                                "&::-webkit-scrollbar": {
                                    width: "8px",
                                },
                                "&::-webkit-scrollbar-track": {
                                    background: "#f1f1f1",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    background: "#888",
                                    borderRadius: "4px",
                                },
                                "&::-webkit-scrollbar-thumb:hover": {
                                    background: "#555",
                                },
                            }}
                        >
                            <Table stickyHeader>
                                <StyledTableHead>
                                    <TableRow className = "text-[10px] font-medium uppercase">
                                        <TableCell align="center">Id</TableCell>
                                        <TableCell align="center">Member</TableCell>
                                        <TableCell align="center">Phone</TableCell>
                                        <TableCell align="center">Age</TableCell>
                                        <TableCell align="center">Gender</TableCell>
                                        <TableCell align="center">Current Weight</TableCell>
                                        <TableCell align="center">Fitness Goal</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </StyledTableHead>
                                <TableBody>
                                    {filteredMembers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                                <Typography variant="body1" color="text.secondary">
                                                    No members found matching your search
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredMembers.map((member) => (
                                            <StyledTableRow key={member.member_id}>
                                                <TableCell align="center">{member.member_id}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: member.gender === 'Male' ? '#6492bc' : '#935c6d',
                                                                mr: 2
                                                            }}
                                                        >
                                                            {member.full_name?.charAt(0)}
                                                        </Avatar>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {member.full_name}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">{member.contact_no}</TableCell>
                                                <TableCell align="center">{member.age}</TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={member.gender}
                                                        // color={member.gender === 'Male' ? 'primary' : 'secondary'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">{member.weight} kg</TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={member.fitness_goal}
                                                        color="default"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        startIcon={<LineChart size={16} />}
                                                        onClick={() => handleOpenProgressDialog(member)}
                                                        sx={{
                                                            borderRadius: '8px',
                                                            textTransform: 'none',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                            '&:hover': {
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                            }
                                                        }}
                                                    >
                                                        Track Progress
                                                    </Button>
                                                </TableCell>
                                            </StyledTableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}

                {/* Progress Dialog */}
                <Dialog
                    open={progressDialogOpen}
                    onClose={handleCloseProgressDialog}
                    maxWidth="lg"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        }
                    }}
                >
                    <DialogTitle sx={{ bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                                sx={{
                                    bgcolor: selectedMember?.gender === 'Male' ? '#438cd5' : '#a8a3a5',
                                    mr: 2,
                                    width: 40,
                                    height: 40
                                }}
                            >
                                {selectedMember?.full_name?.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    {selectedMember ? selectedMember.full_name : 'Member Progress'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {selectedMember?.fitness_goal} • {selectedMember?.age} years • {selectedMember?.gender}
                                </Typography>
                            </Box>
                        </Box>
                    </DialogTitle>

                    <DialogContent sx={{ p: 0 }}>
                        {selectedMember && (
                            <Box sx={{ width: '100%' }}>
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    variant="fullWidth"
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: 'divider',
                                        bgcolor: '#f8f9fa',
                                    }}
                                >
                                    <StyledTab
                                        icon={<Plus size={18} />}
                                        iconPosition="start"
                                        label="Add Progress"
                                    />
                                    <StyledTab
                                        icon={<FileText size={18} />}
                                        iconPosition="start"
                                        label="Progress History"
                                    />
                                    <StyledTab
                                        icon={<Activity size={18} />}
                                        iconPosition="start"
                                        label="Progress Charts"
                                    />
                                </Tabs>

                                {/* Add Progress Tab */}
                                {tabValue === 0 && (
                                    <Box sx={{ p: 3 }}>
                                        {saveSuccess && (
                                            <Alert severity="success" sx={{ mb: 3 }}>
                                                Progress data saved successfully!
                                            </Alert>
                                        )}

                                        {saveFail && (
                                            <Alert severity="error" sx={{ mb: 3 }}>
                                                {`Failed to save progress data. ${saveFailMessage}`}
                                            </Alert>
                                        )}

                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Date"
                                                    type="date"
                                                    name="date"
                                                    value={newProgress.date}
                                                    onChange={handleInputChange}
                                                    InputLabelProps={{ shrink: true }}
                                                    variant="outlined"
                                                    inputProps={{
                                                        max: new Date().toISOString().split("T")[0]  // today's date
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Weight (kg)"
                                                    type="number"
                                                    name="weight"
                                                    value={newProgress.weight}
                                                    onChange={handleInputChange}
                                                    variant="outlined"
                                                    inputProps={{
                                                        min: 0,
                                                    }}
                                                    InputProps={{
                                                        endAdornment: <Typography color="text.secondary">kg</Typography>
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Body Fat (%)"
                                                    type="number"
                                                    name="bodyFat"
                                                    value={newProgress.bodyFat}
                                                    onChange={handleInputChange}
                                                    variant="outlined"
                                                    inputProps={{
                                                        min: 0,
                                                    }}
                                                    InputProps={{
                                                        endAdornment: <Typography color="text.secondary">%</Typography>
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Chest Size (cm)"
                                                    type="number"
                                                    name="chestSize"
                                                    value={newProgress.chestSize}
                                                    onChange={handleInputChange}
                                                    variant="outlined"
                                                    inputProps={{
                                                        min: 0,
                                                    }}
                                                    InputProps={{
                                                        endAdornment: <Typography color="text.secondary">cm</Typography>
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Waist Size (cm)"
                                                    type="number"
                                                    name="waistSize"
                                                    value={newProgress.waistSize}
                                                    inputProps={{
                                                        min: 0,
                                                    }}
                                                    onChange={handleInputChange}
                                                    variant="outlined"
                                                    InputProps={{
                                                        endAdornment: <Typography color="text.secondary">cm</Typography>
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Arm Size (cm)"
                                                    type="number"
                                                    name="armSize"
                                                    value={newProgress.armSize}
                                                    onChange={handleInputChange}
                                                    variant="outlined"
                                                    inputProps={{
                                                        min: 0,
                                                    }}
                                                    InputProps={{
                                                        endAdornment: <Typography color="text.secondary">cm</Typography>
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Leg Size (cm)"
                                                    type="number"
                                                    name="legSize"
                                                    value={newProgress.legSize}
                                                    onChange={handleInputChange}
                                                    variant="outlined"
                                                    inputProps={{
                                                        min: 0,
                                                    }}
                                                    InputProps={{
                                                        endAdornment: <Typography color="text.secondary">cm</Typography>
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Notes"
                                                    multiline
                                                    rows={4}
                                                    name="notes"
                                                    value={newProgress.notes}
                                                    onChange={handleInputChange}
                                                    variant="outlined"
                                                    placeholder="Add notes about diet, workout intensity, or any other observations..."
                                                />
                                            </Grid>
                                        </Grid>
                                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleAddProgress}
                                                disabled={saveLoading}
                                                startIcon={saveLoading ? <CircularProgress size={20} /> : <Plus size={20} />}
                                                sx={{
                                                    py: 1.5,
                                                    px: 3,
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {saveLoading ? 'Saving...' : 'Save Progress'}
                                            </Button>
                                        </Box>
                                    </Box>
                                )}

                                {/* Progress History Tab */}
                                {tabValue === 1 && (
                                    <Box sx={{ p: 3 }}>
                                        {progressLoading ? (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                                <CircularProgress />
                                            </Box>
                                        ) : progressHistory.length === 0 ? (
                                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                                <FileText size={48} color="#9e9e9e" style={{ margin: '0 auto 16px' }} />
                                                <Typography variant="h6" color="text.secondary">
                                                    No progress records found
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    Start tracking this member's progress by adding their first record
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{ mt: 2 }}
                                                    onClick={() => setTabValue(0)}
                                                >
                                                    Add First Record
                                                </Button>
                                            </Box>
                                        ) : (
                                            <>
                                                {/* Summary Cards */}
                                                {latestMetrics && (
                                                    <Box sx={{ mb: 4 }}>
                                                        <Typography variant="h6" gutterBottom>
                                                            Latest Measurements
                                                        </Typography>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6} md={4} lg={2}>
                                                                <MetricCard>
                                                                    <CardContent>
                                                                        <Typography color="text.secondary" gutterBottom>
                                                                            Weight
                                                                        </Typography>
                                                                        <Typography variant="h5" component="div" fontWeight="bold">
                                                                            {latestMetrics.weight} kg
                                                                        </Typography>
                                                                        {getProgressChange('weight') && (
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                                <Chip
                                                                                    size="small"
                                                                                    label={`${getProgressChange('weight').change.toFixed(1)} kg`}
                                                                                    color={getProgressChange('weight').isPositive ? "success" : "error"}
                                                                                    icon={
                                                                                        getProgressChange('weight').isPositive ?
                                                                                            <TrendingUp size={14} /> :
                                                                                            <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} />
                                                                                    }
                                                                                />
                                                                            </Box>
                                                                        )}
                                                                    </CardContent>
                                                                </MetricCard>
                                                            </Grid>
                                                            <Grid item xs={6} md={4} lg={2}>
                                                                <MetricCard>
                                                                    <CardContent>
                                                                        <Typography color="text.secondary" gutterBottom>
                                                                            Body Fat
                                                                        </Typography>
                                                                        <Typography variant="h5" component="div" fontWeight="bold">
                                                                            {latestMetrics.bodyFat}%
                                                                        </Typography>
                                                                        {getProgressChange('bodyFat') && (
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                                <Chip
                                                                                    size="small"
                                                                                    label={`${getProgressChange('bodyFat').change.toFixed(1)}%`}
                                                                                    color={getProgressChange('bodyFat').isPositive ? "success" : "error"}
                                                                                    icon={
                                                                                        getProgressChange('bodyFat').isPositive ?
                                                                                            <TrendingUp size={14} /> :
                                                                                            <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} />
                                                                                    }
                                                                                />
                                                                            </Box>
                                                                        )}
                                                                    </CardContent>
                                                                </MetricCard>
                                                            </Grid>
                                                            <Grid item xs={6} md={4} lg={2}>
                                                                <MetricCard>
                                                                    <CardContent>
                                                                        <Typography color="text.secondary" gutterBottom>
                                                                            Chest
                                                                        </Typography>
                                                                        <Typography variant="h5" component="div" fontWeight="bold">
                                                                            {latestMetrics.chestSize} cm
                                                                        </Typography>
                                                                        {getProgressChange('chestSize') && (
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                                <Chip
                                                                                    size="small"
                                                                                    label={`${getProgressChange('chestSize').change.toFixed(1)} cm`}
                                                                                    color={getProgressChange('chestSize').isPositive ? "success" : "error"}
                                                                                    icon={
                                                                                        getProgressChange('chestSize').isPositive ?
                                                                                            <TrendingUp size={14} /> :
                                                                                            <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} />
                                                                                    }
                                                                                />
                                                                            </Box>
                                                                        )}
                                                                    </CardContent>
                                                                </MetricCard>
                                                            </Grid>
                                                            <Grid item xs={6} md={4} lg={2}>
                                                                <MetricCard>
                                                                    <CardContent>
                                                                        <Typography color="text.secondary" gutterBottom>
                                                                            Waist
                                                                        </Typography>
                                                                        <Typography variant="h5" component="div" fontWeight="bold">
                                                                            {latestMetrics.waistSize} cm
                                                                        </Typography>
                                                                        {getProgressChange('waistSize') && (
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                                <Chip
                                                                                    size="small"
                                                                                    label={`${getProgressChange('waistSize').change.toFixed(1)} cm`}
                                                                                    color={getProgressChange('waistSize').isPositive ? "success" : "error"}
                                                                                    icon={
                                                                                        getProgressChange('waistSize').isPositive ?
                                                                                            <TrendingUp size={14} /> :
                                                                                            <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} />
                                                                                    }
                                                                                />
                                                                            </Box>
                                                                        )}
                                                                    </CardContent>
                                                                </MetricCard>
                                                            </Grid>
                                                            <Grid item xs={6} md={4} lg={2}>
                                                                <MetricCard>
                                                                    <CardContent>
                                                                        <Typography color="text.secondary" gutterBottom>
                                                                            Arms
                                                                        </Typography>
                                                                        <Typography variant="h5" component="div" fontWeight="bold">
                                                                            {latestMetrics.armSize} cm
                                                                        </Typography>
                                                                        {getProgressChange('armSize') && (
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                                <Chip
                                                                                    size="small"
                                                                                    label={`${getProgressChange('armSize').change.toFixed(1)} cm`}
                                                                                    color={getProgressChange('armSize').isPositive ? "success" : "error"}
                                                                                    icon={
                                                                                        getProgressChange('armSize').isPositive ?
                                                                                            <TrendingUp size={14} /> :
                                                                                            <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} />
                                                                                    }
                                                                                />
                                                                            </Box>
                                                                        )}
                                                                    </CardContent>
                                                                </MetricCard>
                                                            </Grid>
                                                            <Grid item xs={6} md={4} lg={2}>
                                                                <MetricCard>
                                                                    <CardContent>
                                                                        <Typography color="text.secondary" gutterBottom>
                                                                            Legs
                                                                        </Typography>
                                                                        <Typography variant="h5" component="div" fontWeight="bold">
                                                                            {latestMetrics.legSize} cm
                                                                        </Typography>
                                                                        {getProgressChange('legSize') && (
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                                <Chip
                                                                                    size="small"
                                                                                    label={`${getProgressChange('legSize').change.toFixed(1)} cm`}
                                                                                    color={getProgressChange('legSize').isPositive ? "success" : "error"}
                                                                                    icon={
                                                                                        getProgressChange('legSize').isPositive ?
                                                                                            <TrendingUp size={14} /> :
                                                                                            <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} />
                                                                                    }
                                                                                />
                                                                            </Box>
                                                                        )}
                                                                    </CardContent>
                                                                </MetricCard>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                )}

                                                <Typography variant="h6" gutterBottom>
                                                    Progress History
                                                </Typography>
                                                <TableContainer
                                                    component={Paper}
                                                    elevation={0}
                                                    variant="outlined"
                                                    sx={{ maxHeight: 400 }}
                                                >
                                                    <Table stickyHeader>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>Weight (kg)</TableCell>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>Body Fat (%)</TableCell>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>Chest (cm)</TableCell>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>Waist (cm)</TableCell>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>Arms (cm)</TableCell>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>Legs (cm)</TableCell>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>Notes</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {[...progressHistory]
                                                                .sort((a, b) => new Date(b.date) - new Date(a.date))
                                                                .map((record, index) => (
                                                                    <TableRow key={index} hover>
                                                                        <TableCell>
                                                                            {new Date(record.date).toLocaleDateString()}
                                                                        </TableCell>
                                                                        <TableCell>{record.weight}</TableCell>
                                                                        <TableCell>{record.bodyFat}</TableCell>
                                                                        <TableCell>{record.chestSize}</TableCell>
                                                                        <TableCell>{record.waistSize}</TableCell>
                                                                        <TableCell>{record.armSize}</TableCell>
                                                                        <TableCell>{record.legSize}</TableCell>
                                                                        <TableCell>
                                                                            <Tooltip title={record.notes || "No notes"}>
                                        <span>
                                          {record.notes
                                              ? record.notes.length > 30
                                                  ? record.notes.substring(0, 30) + "..."
                                                  : record.notes
                                              : "No notes"}
                                        </span>
                                                                            </Tooltip>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </>
                                        )}
                                    </Box>
                                )}

                                {/* Progress Charts Tab */}
                                {tabValue === 2 && (
                                    <Box sx={{ p: 3 }}>
                                        {progressLoading ? (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                                <CircularProgress />
                                            </Box>
                                        ) : progressHistory.length < 2 ? (
                                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                                <Activity size={48} color="#9e9e9e" style={{ margin: '0 auto 16px' }} />
                                                <Typography variant="h6" color="text.secondary">
                                                    Not enough data to generate charts
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    Add at least two progress records to see progress charts
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{ mt: 2 }}
                                                    onClick={() => setTabValue(0)}
                                                >
                                                    Add More Data
                                                </Button>
                                            </Box>
                                        ) : (
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <Paper
                                                        elevation={0}
                                                        variant="outlined"
                                                        sx={{ p: 2, height: '100%', borderRadius: 2 }}
                                                    >
                                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                                                            Weight Progress
                                                        </Typography>
                                                        <Divider sx={{ mb: 2 }} />
                                                        <Box sx={{ height: 300 }}>
                                                            <Line
                                                                data={getChartData('weight')}
                                                                options={{
                                                                    responsive: true,
                                                                    maintainAspectRatio: false,
                                                                    plugins: {
                                                                        legend: { position: 'top' },
                                                                        tooltip: {
                                                                            backgroundColor: 'rgba(0,0,0,0.8)',
                                                                            padding: 12,
                                                                            titleFont: { size: 14 },
                                                                            bodyFont: { size: 13 },
                                                                            displayColors: false,
                                                                        }
                                                                    },
                                                                    scales: {
                                                                        y: {
                                                                            title: {
                                                                                display: true,
                                                                                text: 'Weight (kg)'
                                                                            }
                                                                        },
                                                                        x: {
                                                                            title: {
                                                                                display: true,
                                                                                text: 'Date'
                                                                            }
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        </Box>
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Paper
                                                        elevation={0}
                                                        variant="outlined"
                                                        sx={{ p: 2, height: '100%', borderRadius: 2 }}
                                                    >
                                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                                                            Body Fat Progress
                                                        </Typography>
                                                        <Divider sx={{ mb: 2 }} />
                                                        <Box sx={{ height: 300 }}>
                                                            <Line
                                                                data={getChartData('bodyFat')}
                                                                options={{
                                                                    responsive: true,
                                                                    maintainAspectRatio: false,
                                                                    plugins: {
                                                                        legend: { position: 'top' },
                                                                        tooltip: {
                                                                            backgroundColor: 'rgba(0,0,0,0.8)',
                                                                            padding: 12,
                                                                            titleFont: { size: 14 },
                                                                            bodyFont: { size: 13 },
                                                                            displayColors: false,
                                                                        }
                                                                    },
                                                                    scales: {
                                                                        y: {
                                                                            title: {
                                                                                display: true,
                                                                                text: 'Body Fat (%)'
                                                                            }
                                                                        },
                                                                        x: {
                                                                            title: {
                                                                                display: true,
                                                                                text: 'Date'
                                                                            }
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        </Box>
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Paper
                                                        elevation={0}
                                                        variant="outlined"
                                                        sx={{ p: 2, height: '100%', borderRadius: 2 }}
                                                    >
                                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                                                            Chest & Waist Progress
                                                        </Typography>
                                                        <Divider sx={{ mb: 2 }} />
                                                        <Box sx={{ height: 300 }}>
                                                            <Line
                                                                data={{
                                                                    labels: getChartData('chestSize')?.labels,
                                                                    datasets: [
                                                                        {
                                                                            label: 'Chest (cm)',
                                                                            data: getChartData('chestSize')?.datasets[0].data,
                                                                            fill: false,
                                                                            backgroundColor: 'rgba(54, 162, 235, 1)',
                                                                            borderColor: 'rgba(54, 162, 235, 1)',
                                                                            tension: 0.4,
                                                                            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                                                                            pointBorderColor: '#fff',
                                                                            pointRadius: 5,
                                                                        },
                                                                        {
                                                                            label: 'Waist (cm)',
                                                                            data: getChartData('waistSize')?.datasets[0].data,
                                                                            fill: false,
                                                                            backgroundColor: 'rgba(255, 99, 132, 1)',
                                                                            borderColor: 'rgba(255, 99, 132, 1)',
                                                                            tension: 0.4,
                                                                            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                                                                            pointBorderColor: '#fff',
                                                                            pointRadius: 5,
                                                                        }
                                                                    ]
                                                                }}
                                                                options={{
                                                                    responsive: true,
                                                                    maintainAspectRatio: false,
                                                                    plugins: {
                                                                        legend: { position: 'top' },
                                                                        tooltip: {
                                                                            backgroundColor: 'rgba(0,0,0,0.8)',
                                                                            padding: 12,
                                                                            titleFont: { size: 14 },
                                                                            bodyFont: { size: 13 },
                                                                        }
                                                                    },
                                                                    scales: {
                                                                        y: {
                                                                            title: {
                                                                                display: true,
                                                                                text: 'Size (cm)'
                                                                            }
                                                                        },
                                                                        x: {
                                                                            title: {
                                                                                display: true,
                                                                                text: 'Date'
                                                                            }
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        </Box>
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Paper
                                                        elevation={0}
                                                        variant="outlined"
                                                        sx={{ p: 2, height: '100%', borderRadius: 2 }}
                                                    >
                                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                                                            Arms & Legs Progress
                                                        </Typography>
                                                        <Divider sx={{ mb: 2 }} />
                                                        <Box sx={{ height: 300 }}>
                                                            <Line
                                                                data={{
                                                                    labels: getChartData('armSize')?.labels,
                                                                    datasets: [
                                                                        {
                                                                            label: 'Arms (cm)',
                                                                            data: getChartData('armSize')?.datasets[0].data,
                                                                            fill: false,
                                                                            backgroundColor: 'rgba(75, 192, 192, 1)',
                                                                            borderColor: 'rgba(75, 192, 192, 1)',
                                                                            tension: 0.4,
                                                                            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                                                                            pointBorderColor: '#fff',
                                                                            pointRadius: 5,
                                                                        },
                                                                        {
                                                                            label: 'Legs (cm)',
                                                                            data: getChartData('legSize')?.datasets[0].data,
                                                                            fill: false,
                                                                            backgroundColor: 'rgba(153, 102, 255, 1)',
                                                                            borderColor: 'rgba(153, 102, 255, 1)',
                                                                            tension: 0.4,
                                                                            pointBackgroundColor: 'rgba(153, 102, 255, 1)',
                                                                            pointBorderColor: '#fff',
                                                                            pointRadius: 5,
                                                                        }
                                                                    ]
                                                                }}
                                                                options={{
                                                                    responsive: true,
                                                                    maintainAspectRatio: false,
                                                                    plugins: {
                                                                        legend: { position: 'top' },
                                                                        tooltip: {
                                                                            backgroundColor: 'rgba(0,0,0,0.8)',
                                                                            padding: 12,
                                                                            titleFont: { size: 14 },
                                                                            bodyFont: { size: 13 },
                                                                        }
                                                                    },
                                                                    scales: {
                                                                        y: {
                                                                            title: {
                                                                                display: true,
                                                                                text: 'Size (cm)'
                                                                            }
                                                                        },
                                                                        x: {
                                                                            title: {
                                                                                display: true,
                                                                                text: 'Date'
                                                                            }
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        </Box>
                                                    </Paper>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e0e0e0' }}>
                        <Button
                            onClick={handleCloseProgressDialog}
                            variant="outlined"
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                        >
                            Close
                        </Button>
                        {tabValue === 1 && progressHistory.length > 0 && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setTabValue(0)}
                                sx={{ borderRadius: 2, textTransform: 'none' }}
                            >
                                Add New Progress
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default TrackMemberProgress;
