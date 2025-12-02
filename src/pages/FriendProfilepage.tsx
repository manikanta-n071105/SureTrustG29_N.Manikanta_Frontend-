import React from 'react'
import { useParams } from 'react-router-dom';

const FriendProfilepage = () => {
    const { _id } = useParams();

  return (
    <div>
      {`Friend Profile Page for user with ID: ${_id}`}
    </div>
  )
}

export default FriendProfilepage
