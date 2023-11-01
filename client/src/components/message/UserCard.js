import React from "react";
import Avatar from "../sideBar/Avatar";
import { Link } from "react-router-dom";
export const UserCard = ({ childen, user, border, isInModal, indexActive, setIndexActive , index}) => {
 const handleOnClick = (e) => {
    if (isInModal) {
      e.preventDefault();
 
      
      indexActive!==-1 && setIndexActive(index)
    }
 }
  return (
    <div className={ `card-message ${!isInModal ? 'hover' : ''} w-100 ${isInModal && indexActive && index === indexActive ? 'click' : ''}`} >
      <div className="p-2">
        <Link to={`/message/${user?.id}`} className="d-flex align-items-center" onClick={handleOnClick}>
          <Avatar
            src={
               user?.avatar ||
              "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png" 
                
            }
            size="avatar-md"
          />
          <div className="ml-1 card-message-fullname-username" style={{ transform: "translateY(-2px)" }}>
            <span className="card-message_fullname d-block">{user?.fullname || "Nguyễn Hoàng Phúc"  }</span>
            <small className="card-message_username" style={{ opacity: 0.7 }}>
              {user?.username || "hoangphuc_seiza"  }
            </small>
          </div>
        </Link>
      </div>
      {childen}
    </div>
  );
};
export default UserCard;
