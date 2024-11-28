import { useState, useEffect } from 'react';
import { useAuth } from '../../../BackEnd/Auth/AuthContext';
import { GroupsApi } from '../../../BackEnd/API/GroupsAPI';
import GroupCard from '../../Groups/GroupCard';
import './TopGroups.css';

const TopGroups = () => {
    const { isLoggedIn} = useAuth();
    const [toast, setToast] = useState(null);
    const [myGroups, setMyGroups] = useState([]);
    const [topGroups, setTopGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('user');

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const allGroupsResponse = await GroupsApi.getAllGroups();
                
                if (allGroupsResponse.success) {
                    const sortedGroups = allGroupsResponse.data
                        .sort((a, b) => b.members - a.members)
                        .slice(0, 3);
                    
                    setTopGroups(sortedGroups);
                }
                
                if (isLoggedIn) {
                    const userGroupsResponse = await GroupsApi.getUserGroups(userId);
                    
                    if (userGroupsResponse.success) {
                        const userGroupIds = userGroupsResponse.data.map(group => group.id_group);
                        setMyGroups(userGroupIds);
                    }
                }
            } catch (error) {
                showToast('Error al cargar grupos');
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [isLoggedIn]);

    const handleJoinGroup = async (group) => {
        if (!isLoggedIn) {
            showToast('Debe estar logeado para unirse');
            return;
        }
        console.log(group);
        try {
            const response = await GroupsApi.joinGroup(group.id, userId);
            
            if (response.success) {
                const updatedMyGroups = [...myGroups, group.id];
                setMyGroups(updatedMyGroups);
                showToast(`Te has unido al grupo ${group.name}`);
            } else {
                showToast(response.message || 'Error al unirse al grupo');
            }
        } catch (error) {
            showToast('Error al unirse al grupo');
        }
    };

    const handleLeaveGroup = async (group) => {
        try {
            const response = await GroupsApi.leaveGroup(group.id, userId);
            
            if (response.success) {
                const updatedMyGroups = myGroups.filter(id => id !== group.id);
                setMyGroups(updatedMyGroups);
                showToast(`Has dejado el grupo ${group.name}`);
            } else {
                showToast(response.message || 'Error al salir del grupo');
            }
        } catch (error) {
            showToast('Error al salir del grupo');
        }
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    if (loading) {
        return <div>Cargando grupos...</div>;
    }

    return (
        <div className="top-groups-container">
            <div className="section-header">
                <h2 className="group-title">Grupos Más Populares</h2>
            </div>
            
            <div className="top-groups-grid">
                {topGroups.map(group => (
                    <GroupCard
                        key={group.id_group}
                        group={{
                            id: group.id_group,
                            name: group.group_name,
                            description: group.group_description || 'Grupo sin descripción',
                            image: group.groupbanner || "https://via.placeholder.com/800x600",
                            members: group.member_count || 0,
                            categories: group.categories ? group.categories.split(',') : []
                        }}
                        isLoggedIn={isLoggedIn}
                        isMember={myGroups.includes(group.id_group)}
                        onJoin={handleJoinGroup}
                        onLeave={handleLeaveGroup}
                        size="small"
                    />
                ))}
            </div>
            {toast && (
                <div className={`contact-toast ${toast ? 'contact-toast-show' : ''}`}>
                    {toast}
                </div>
            )}
        </div>
    );
};

export default TopGroups;