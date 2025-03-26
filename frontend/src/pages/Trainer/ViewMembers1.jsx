import React, { useState } from 'react';
import { MemberList } from './MemberList.jsx';
import { ProgressForm } from './ProgressForm';
// import { ProgressHistory } from './ProgressHistory';
import TrainerSideBar from "./TrainerSideBar.jsx";


const members = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
];

function ViewMember() {
    const [selectedMember, setSelectedMember] = useState(null);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <TrainerSideBar />
            <div className="max-w-5xl mx-auto p-6 w-full">
                <MemberList members={members} onSelectMember={setSelectedMember} />
                {selectedMember && <ProgressForm member={selectedMember} />}
            </div>
        </div>
    );
}

export default ViewMember;
