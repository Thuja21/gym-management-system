import React from 'react';
import { UserCircle2 } from 'lucide-react';

export function MemberList({ members, onSelectMember }) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Your Members</h2>
            <div className="grid gap-4">
                {members.map((member) => (
                    <button
                        key={member.id}
                        onClick={() => onSelectMember(member)}
                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {member.profileImage ? (
                            <img
                                src={member.profileImage}
                                alt={member.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <UserCircle2 className="w-12 h-12 text-gray-400" />
                        )}
                        <div className="ml-4 text-left">
                            <h3 className="font-semibold text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
