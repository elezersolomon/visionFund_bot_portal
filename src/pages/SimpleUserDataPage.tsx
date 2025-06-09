import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux';

const SimpleUserDataPage: React.FC = () => {
  // Get user state from Redux
  const user = useSelector((state: RootState) => state.user);

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Data from Redux</h2>
      <pre style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px',
        whiteSpace: 'pre-wrap'
      }}>
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
};

export default SimpleUserDataPage; 