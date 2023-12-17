import React,{useEffect} from 'react';

const Toast = ({msg, handleShow, bgColor}) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      handleShow()
    }, 3000);

    return () => clearTimeout(timer);
  }, [handleShow]);

  return (
    <div className={`toast show position-fixed text-light ${bgColor}`}
      style={{
        top: '10px',
        right: '5px',
        zIndex: 50,
        minWidth: '200px',
        color: 'white',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
       
      }}
    >
      <div className={`toast-header text-light ${bgColor}`} style={{  borderBottom: '1px solid rgba(255, 255, 255, 0.2)', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <strong style={{ color: 'white' }}>{msg.title}</strong>
        <button style={{ color: 'white', background: 'none', border: 'none',  alignItems: 'flex-end', fontSize: '20px'  }}
        data-dismiss="toast"
        onClick={handleShow}
        >&times;
        </button>
      </div>
      <div className={`toast-body text-light ${bgColor}`}
      style={{ color: 'white' }}
      >
       {msg.body}
      </div>
    </div>
  );
}

export default Toast;
