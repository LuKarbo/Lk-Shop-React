import { Users } from 'lucide-react';

const GroupCard = ({ 
    group, 
    isLoggedIn, 
    isMember,
    isOwner,
    onJoin, 
    onLeave,
    onDelete,
    size = 'default'
}) => {
    const imageHeight = size === 'small' ? 'h-[180px]' : 'h-[250px]';
    const titleSize = size === 'small' ? 'text-lg' : 'text-2xl';
    const contentPadding = size === 'small' ? 'p-4' : 'p-6';
    const memberSize = size === 'small' ? 'text-xs' : 'text-sm';
    const descriptionSize = size === 'small' ? 'text-sm' : 'text-base';
    const buttonPadding = size === 'small' ? 'py-3 px-4' : 'py-4 px-5';

    return (
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg bg-white flex flex-col">
            <div className={`relative w-full ${imageHeight} overflow-hidden`}>
                <img
                    src={group.image}
                    alt={group.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>
            
            <div className={`${contentPadding} flex-grow flex flex-col`}>
                <div className="flex justify-between items-start mb-3">
                    <h3 className={`${titleSize} font-bold text-black m-0`}>{group.name}</h3>
                    <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                        <Users size={size === 'small' ? 14 : 16} className="text-gray-600" />
                        <span className={`${memberSize} text-gray-600`}>
                            {group.members.toLocaleString()}
                        </span>
                    </span>
                </div>
                
                <p className={`${descriptionSize} text-gray-600 mb-4 flex-grow leading-relaxed`}>
                    {group.description}
                </p>
                
                {group.categories && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {group.categories.map((category) => (
                            <span 
                                key={category} 
                                className={`${memberSize} bg-gray-100 px-2 py-1 rounded-md text-gray-600`}
                            >
                                {category}
                            </span>
                        ))}
                    </div>
                )}
                
                {isLoggedIn ? (
                    isMember ? (
                        isOwner ? (
                            <button
                                onClick={() => onDelete(group)}
                                className={`w-full ${buttonPadding} bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium`}
                            >
                                Eliminar Grupo
                            </button>
                        ) : (
                            <button
                                onClick={() => onLeave(group)}
                                className={`w-full ${buttonPadding} bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium`}
                            >
                                Salir del Grupo
                            </button>
                        )
                    ) : (
                        <button
                            onClick={() => onJoin(group)}
                            className={`w-full ${buttonPadding} bg-[#0B132B] hover:bg-[#1C2541] text-white rounded-lg transition-colors duration-200 font-medium`}
                        >
                            Unirse al Grupo
                        </button>
                    )
                ) : (
                    <button
                        onClick={() => onJoin(group)}
                        className={`w-full ${buttonPadding} bg-[#0B132B] hover:bg-[#1C2541] text-white rounded-lg transition-colors duration-200 font-medium`}
                    >
                        Unirse al Grupo
                    </button>
                )}
            </div>
        </div>
    );
};

export default GroupCard;