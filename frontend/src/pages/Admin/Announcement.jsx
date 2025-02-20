import AdminSideBar from "./AdminSideBar.jsx";
import React, { useState } from 'react';
import { format } from 'date-fns';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiMessageSquare } from 'react-icons/fi';
import { Dialog, Transition } from '@headlessui/react';

const INITIAL_ANNOUNCEMENTS = [
    {
        id: 1,
        title: 'New Yoga Classes Starting',
        content: 'Join our new yoga classes every Monday and Wednesday at 8 AM.',
        priority: 'high',
        date: '2023-10-15',
    },
    {
        id: 2,
        title: 'Holiday Hours',
        content: 'The gym will have modified hours during the upcoming holiday season.',
        priority: 'medium',
        date: '2023-10-14',
    },
    {
        id: 3,
        title: 'Equipment Maintenance',
        content: 'Regular maintenance will be performed on cardio equipment this weekend.',
        priority: 'low',
        date: '2023-10-13',
    },
];

function Announcement() {
    const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        priority: 'medium',
        date: format(new Date(), 'yyyy-MM-dd'),
    });

    const handleOpenModal = (announcement = null) => {
        if (announcement) {
            setEditingAnnouncement(announcement);
            setFormData(announcement);
        } else {
            setEditingAnnouncement(null);
            setFormData({
                title: '',
                content: '',
                priority: 'medium',
                date: format(new Date(), 'yyyy-MM-dd'),
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAnnouncement(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingAnnouncement) {
            setAnnouncements(announcements.map(a =>
                a.id === editingAnnouncement.id ? { ...formData, id: a.id } : a
            ));
        } else {
            setAnnouncements([
                { ...formData, id: Date.now() },
                ...announcements,
            ]);
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            setAnnouncements(announcements.filter(a => a.id !== id));
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminSideBar/>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Announcements</h1>
                            <p className="text-gray-600 mt-1">Manage gym announcements and updates</p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <FiPlus className="mr-2" />
                            New Announcement
                        </button>
                    </div>

                    {/* Announcements List */}
                    <div className="space-y-4">
                        {announcements.map((announcement) => (
                            <div
                                key={announcement.id}
                                className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <h2 className="text-xl font-semibold text-gray-800">
                                                {announcement.title}
                                            </h2>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                      </span>
                                        </div>
                                        <p className="text-gray-600 mt-2">{announcement.content}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Posted on {format(new Date(announcement.date), 'MMMM d, yyyy')}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() => handleOpenModal(announcement)}
                                            className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                                        >
                                            <FiEdit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(announcement.id)}
                                            className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors"
                                        >
                                            <FiTrash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Transition show={isModalOpen} as={React.Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={handleCloseModal}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                        </Transition.Child>

                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
              &#8203;
            </span>

                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                                    </Dialog.Title>
                                    <button
                                        onClick={handleCloseModal}
                                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        <FiX className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Content
                                        </label>
                                        <textarea
                                            required
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Priority
                                        </label>
                                        <select
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            {editingAnnouncement ? 'Update' : 'Create'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default Announcement;