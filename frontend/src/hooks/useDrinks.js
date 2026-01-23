import { useState, useEffect } from 'react';
import { drinksApi } from '../api';

/**
 * Custom hook for drinks with pagination and filters
 * @param {Object} initialParams - Initial query parameters
 * @returns {Object} - {drinks, loading, error, pagination, setParams, refetch}
 */
const useDrinks = (initialParams = {}) => {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchDrinks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await drinksApi.getAllDrinks(params);
      
      if (response.status === 'success') {
        setDrinks(response.data.drinks || []);
        setPagination(response.data.pagination || null);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch drinks');
      setDrinks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const refetch = () => {
    fetchDrinks();
  };

  const updateParams = (newParams) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  return { 
    drinks, 
    loading, 
    error, 
    pagination, 
    params,
    setParams: updateParams, 
    refetch 
  };
};

export default useDrinks;
