import Axios from 'axios';

const url = "https://localhost:5001"

export const getAll = async () => {
  const ret = await Axios.get(`${url}/infectado`);
  return ret.data;
}

export const update = async (id, data) => {
  try {
    await Axios.put(`${url}/infectado/${id}`,data);
    return true;
  } catch(err) {
    return false;
  }
}

export const remove = async (id) => {
  try {
    await Axios.delete(`${url}/infectado/${id}`);
    return true;
  } catch(err) {
    return false;
  }
}

export const create = async (data) => {
  try {
    await Axios.post(`${url}/infectado`,data, {
      headers: {
        'Content-Type' : 'application/json',
      }  
    });
    return true;
  } catch(err) {
    return false;
  }
}