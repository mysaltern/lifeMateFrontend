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

  interface SubCategory {
    id: number;
    subcategoryName: string;
    categoryId: number;
    progress_users: Array<ProgressUser>;
  }

  interface ProgressUser {
    userId: number;
    statusId: number;
  }


  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);

  const handleCollapse = (categoryId: number) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId
          ? { ...category, collapsed: !category.collapsed }
          : category
      )
    );
  };


  useEffect(() => {


    const fetchDataCategories = async () => {
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


    const fetchDataSubCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/subcategories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "userID": "1"
          }),
        });

        const data = await response.json();
        setSubcategories(data.response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataCategories();
    fetchDataSubCategories();

  }, []); // Empty dependency array ensures the effect runs once on mount


  return (
    <div className='mt-20 pl-10'>

      <span className=''>Progress</span>
      <br />
      <br />
      {categories.map((category) => (
        <div key={category.id} className='mt-3 relative'>
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
            {subcategories
              .filter(subcategory => subcategory.categoryId === category.id)
              .map(subcategory => {
                const statusId = subcategory.progress_users.length > 0 ? subcategory.progress_users[0].statusId : null;

                let className = 'progressLine'; // Default class
            
                if (statusId === 3) {
                  className = 'lineLeftCompleted';
                } else if (statusId === 5) {
                  className = 'progressLine';
                } else if (statusId === 6) {
                  className = 'progressLineDenied';
                }
                return (
                  <span key={subcategory.id} className={`pb-1 ml-8 ${className}`}>
                  {subcategory.subcategoryName}
                </span>
                );
              })}
          </div>

        </div>

      ))}

    </div>
  );
};

export default ProgressSection;
