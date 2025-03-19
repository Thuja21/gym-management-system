// import TrainerSideBar from "../Trainer/TrainerSideBar.jsx"
// import React from 'react';
// import { Activity, Users, Calendar, TrendingUp } from 'lucide-react';
//
// const TrainerDashboard = () => {
//     const stats = [
//         { title: 'Active Clients', value: '24', icon: Users, color: 'bg-blue-500' },
//         { title: 'Sessions Today', value: '8', icon: Calendar, color: 'bg-green-500' },
//         { title: 'Total Hours', value: '156', icon: Activity, color: 'bg-purple-500' },
//         { title: 'Client Progress', value: '87%', icon: TrendingUp, color: 'bg-yellow-500' },
//     ];
//
//     return (
//         <div>
//             <TrainerSideBar/>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ml-60">
//                 {stats.map((stat) => (
//                     <div key={stat.title} className="bg-white rounded-lg shadow p-16">
//                         <div className="flex items-center">
//                             <div className={`${stat.color} p-3 rounded-lg`}>
//                                 <stat.icon className="h-6 w-6 text-white" />
//                             </div>
//                             <div className="ml-4">
//                                 <h3 className="text-gray-500 text-sm">{stat.title}</h3>
//                                 <p className="text-2xl font-semibold">{stat.value}</p>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ml-60">
//                 <div className="bg-white rounded-lg shadow p-6">
//                     <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
//                     <div className="space-y-4">
//                         {[1, 2, 3].map((session) => (
//                             <div key={session} className="flex items-center justify-between border-b pb-4">
//                                 <div>
//                                     <p className="font-medium">John Doe</p>
//                                     <p className="text-sm text-gray-500">Strength Training</p>
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="text-sm font-medium">2:00 PM</p>
//                                     <p className="text-sm text-gray-500">45 mins</p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//
//                 <div className="bg-white rounded-lg shadow p-6">
//                     <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
//                     <div className="space-y-4">
//                         {[1, 2, 3].map((activity) => (
//                             <div key={activity} className="flex items-center space-x-4">
//                                 <div className="bg-gray-100 p-2 rounded-full">
//                                     <Activity className="h-5 w-5 text-gray-600" />
//                                 </div>
//                                 <div>
//                                     <p className="font-medium">New workout plan created</p>
//                                     <p className="text-sm text-gray-500">2 hours ago</p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default TrainerDashboard;

import React from 'react';
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

const TrainerDashboard = () => {
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'cardio',
        max_capacity: 20,
        schedules: [{
            start_time: '',
            end_time: ''
        }]
    })

    useEffect(() => {
        fetchTrainerClasses()
    }, [])

    const fetchTrainerClasses = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) throw new Error('Not authenticated')

            const { data, error } = await supabase
                .from('classes')
                .select(`
          *,
          class_schedules(*)
        `)
                .eq('trainer_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error

            setClasses(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleScheduleChange = (index, field, value) => {
        setFormData(prev => {
            const newSchedules = [...prev.schedules]
            newSchedules[index] = {
                ...newSchedules[index],
                [field]: value
            }
            return {
                ...prev,
                schedules: newSchedules
            }
        })
    }

    const addScheduleField = () => {
        setFormData(prev => ({
            ...prev,
            schedules: [...prev.schedules, { start_time: '', end_time: '' }]
        }))
    }

    const removeScheduleField = (index) => {
        setFormData(prev => ({
            ...prev,
            schedules: prev.schedules.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) throw new Error('Not authenticated')

            // Create class
            const { data: classData, error: classError } = await supabase
                .from('classes')
                .insert([{
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    max_capacity: formData.max_capacity,
                    trainer_id: user.id
                }])
                .select()
                .single()

            if (classError) throw classError

            // Create schedules
            const schedulesData = formData.schedules.map(schedule => ({
                class_id: classData.id,
                start_time: schedule.start_time,
                end_time: schedule.end_time
            }))

            const { error: scheduleError } = await supabase
                .from('class_schedules')
                .insert(schedulesData)

            if (scheduleError) throw scheduleError

            // Reset form and refresh data
            setFormData({
                title: '',
                description: '',
                category: 'cardio',
                max_capacity: 20,
                schedules: [{ start_time: '', end_time: '' }]
            })
            setShowForm(false)
            fetchTrainerClasses()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-light py-32">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Classes</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary"
                    >
                        {showForm ? 'Cancel' : 'Create New Class'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-lg p-6 mb-8"
                    >
                        <h2 className="text-2xl font-bold mb-6">Create New Class</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Class Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="cardio">Cardio</option>
                                        <option value="strength">Strength</option>
                                        <option value="mind-body">Mind & Body</option>
                                        <option value="hiit">HIIT</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Maximum Capacity
                                    </label>
                                    <input
                                        type="number"
                                        name="max_capacity"
                                        value={formData.max_capacity}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Class Schedules</h3>
                                    <button
                                        type="button"
                                        onClick={addScheduleField}
                                        className="text-primary hover:underline"
                                    >
                                        + Add Schedule
                                    </button>
                                </div>

                                {formData.schedules.map((schedule, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Start Time
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={schedule.start_time}
                                                onChange={(e) => handleScheduleChange(index, 'start_time', e.target.value)}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                required
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-gray-700 font-medium mb-2">
                                                End Time
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={schedule.end_time}
                                                onChange={(e) => handleScheduleChange(index, 'end_time', e.target.value)}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                required
                                            />
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeScheduleField(index)}
                                                    className="absolute right-0 top-0 text-red-500 hover:text-red-700"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary"
                                >
                                    {loading ? 'Creating...' : 'Create Class'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((classItem) => (
                        <motion.div
                            key={classItem.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-lg p-6"
                        >
                            <h3 className="text-xl font-bold mb-2">{classItem.title}</h3>
                            <p className="text-primary font-medium mb-2 capitalize">{classItem.category}</p>
                            <p className="text-gray-600 mb-4">{classItem.description}</p>

                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Schedules:</h4>
                                <ul className="space-y-2">
                                    {classItem.class_schedules?.map((schedule) => (
                                        <li key={schedule.id} className="text-sm text-gray-600">
                                            {format(new Date(schedule.start_time), 'PPP p')} - {format(new Date(schedule.end_time), 'p')}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Max Capacity: {classItem.max_capacity}
                </span>
                                <button className="text-primary hover:underline">
                                    Edit Class
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {loading && classes.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading classes...</p>
                    </div>
                )}

                {!loading && classes.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No classes created yet. Create your first class!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TrainerDashboard