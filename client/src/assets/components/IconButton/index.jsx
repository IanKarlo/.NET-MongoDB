import React from 'react';

import './index.css';

import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';

const getType = (type) => {
  switch(type) {
    case 'edit': return <EditIcon className="v-midle"/>;
    case 'del': return <DeleteForeverIcon className="v-midle"/>;
    default: return <AddIcon className="v-midle"/>;
  }
} 

const IconButton = ({type, onClick, children}) => {
  return (
    <span onClick={onClick} className={type ? 'icon-btn-s' : 'icon-btn'}>
      {children}
      {getType(type)}
    </span>
  );
}

export default IconButton;