export const GLOBAL_TYPES = {
    AUTH: 'AUTH',
    ALERT: 'ALERT',
    POST_DETAIL: 'POST_DETAIL',
    SHARE_POST: 'SHARE_POST',
    ADD_POST_MODAL:'ADD_POST_MODAL',
    THEME: 'THEME',
    SOCKET:'SOCKET',
    MODAL: 'MODAL',
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE',
}

export const EditData = (data,id, post)=> {
    const newData = data.map(item=> (item._id === id ? post : item))
    return newData;
}

export const DeleteData = (data, id) => {
    const newData = data.filter(item => (item._id !== id))
    return newData;
}