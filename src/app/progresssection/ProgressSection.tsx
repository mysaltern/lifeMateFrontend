import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from '../../../config/development';
import './styles.css';
// interface ProgressSectionProps {
//   items: string[];
// }

const ProgressSection: React.FC = () => {

  interface Category {
    id: number;
    categoryName: string;
    icon: string;
    collapsed: boolean; 
  }

  const [categories, setCategories] = useState<Category[]>([]);

  const handleCollapse = (categoryId: number) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId
          ? { ...category, collapsed: !category.collapsed }
          : category
      )
    );
  };
 
  const fetchCategories = async () => {


  
  
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({

        }),
      });

      const data = await response.json();
      setCategories(data);
    }
    catch
    {

    }
  }

  useEffect(() => {

    
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({

          }),
        });

        const data = await response.json();
        setCategories(data.response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []); // Empty dependency array ensures the effect runs once on mount


  return (
    <div className='mt-20 pl-10'>

      <span className=''>Progress</span>
      <br />
      <br />
      {categories.map((category) => (
        <div key={category.id} className='mt-5 relative'>
          <FontAwesomeIcon
            icon={(icons as Record<string, any>)[category.icon]}
            className='text-gray-400 w-5 mx-auto absolute'
          />
          <span className='relative ml-8 bottom-1'>{category.categoryName}</span>
          <FontAwesomeIcon
            icon={category.collapsed ? icons.faChevronDown : icons.faChevronUp}
            id='collapse'
            className='text-gray-400 w-5 absolute left-36 cursor-pointer'
            onClick={() => handleCollapse(category.id)}
          />
          <div className={`flex flex-col pt-5 ${category.collapsed ? 'ItemsCollapsed' : 'ItemsOpen'}`}>
          <span className='ml-8 lineLeft'>Age</span>
            <span className='ml-8 lineLeft'>Sex</span>
            <span className='ml-8'>Relationn</span>
          
          </div>
          
        </div>
        
      ))}

    </div>
  );
};

export default ProgressSection;
