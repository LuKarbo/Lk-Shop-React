import { Pencil, Trash2 } from 'lucide-react';
import { Pagination } from '../Functions/Pagination';

const GamesTable = ({ 
    paginatedGames, 
    getDiscountInfo, 
    getDiscountBadgeStyle, 
    handleOpenEditModal, 
    handleOpenDeleteModal,
    gamePage,
    setGamePage,
    filteredGames,
    ITEMS_PER_PAGE
  }) => {
    return (
      <div className="mb-10">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-600">ID</th>
                  <th className="px-6 py-3 text-left text-gray-600">Título</th>
                  <th className="px-6 py-3 text-left text-gray-600">Precio</th>
                  <th className="px-6 py-3 text-left text-gray-600">Precio Original</th>
                  <th className="px-6 py-3 text-left text-gray-600">Valoración</th>
                  <th className="px-6 py-3 text-left text-gray-600">Categoría</th>
                  <th className="px-6 py-3 text-left text-gray-600">Editorial</th>
                  <th className="px-6 py-3 text-left text-gray-600">Copias</th>
                  <th className="px-6 py-3 text-left text-gray-600">Descuento</th>
                  <th className="px-6 py-3 text-left text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedGames.map((game) => (
                  <tr key={game.id_game} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{game.id_game}</td>
                    <td className="px-6 py-4">{game.game_name}</td>
                    <td className="px-6 py-4">${game.precio_con_descuento || game.precio_original}</td>
                    <td className="px-6 py-4">${game.precio_original}</td>
                    <td className="px-6 py-4">{game.puntaje}/10</td>
                    <td className="px-6 py-4">{game.categorias}</td>
                    <td className="px-6 py-4">{game.editor_nombre}</td>
                    <td className="px-6 py-4">{game.copias_disponibles}/{game.copias_cantidad}</td>
                    <td className="px-6 py-4">
                      {game.id_descuento ? (
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getDiscountBadgeStyle(game.id_descuento)}`}>
                          {getDiscountInfo(game.id_descuento)}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          Sin descuento
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(game)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(game)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={gamePage}
            totalItems={filteredGames.length}
            setPage={setGamePage}
            ITEMS_PER_PAGE={ITEMS_PER_PAGE}
          />
        </div>
      </div>
    );
  };
  
  export default GamesTable;