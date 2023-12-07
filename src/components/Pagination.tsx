"use client"
interface PaginationProps {
    itemsPerPage: number;
    totalItems: number;
    paginate: (pageNumber: number) => void;
    currentPage: number;
  }
  
export const Pagination: React.FC<PaginationProps> = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    return (
      <nav>
        <ul className='flex justify-center space-x-2'>
          {pageNumbers.map(number => (
            <li key={number}>
              <button 
                onClick={() => paginate(number)} 
                className={`px-3 py-1 border rounded ${currentPage === number ? 'bg-blue-500 text-white' : ''}`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };