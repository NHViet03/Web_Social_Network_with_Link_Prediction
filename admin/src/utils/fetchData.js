import axios from 'axios';

const target ='http://localhost:5031';


export const getDataAPI=async(url)=>{
    const res=await axios.get(`${target}/${url}`)
    return res;
}

export const postDataAPI=async(url,post)=>{
    const res=await axios.post(`${target}/${url}`,post)
    return res;
}

export const putDataAPI=async(url,post)=>{
    const res=await axios.put(`${target}/${url}`,post)
    return res;
}

export const patchDataAPI=async(url,post)=>{
    const res=await axios.patch(`${target}/${url}`,post)
    return res;
}

export const deleteDataAPI=async(url,post)=>{
    const res=await axios.delete(`${target}/${url}`,post)
    return res;
}