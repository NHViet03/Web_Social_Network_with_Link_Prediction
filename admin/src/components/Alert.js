import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";

function Alert() {
  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();
  
  const handleClose = useCallback(() => {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: false,
    });
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, alert.duration ? alert.duration : 3000);

    return () => clearTimeout(timer);
  }, [alert, handleClose]);

  return (
    <>
      {alert && (
        <div
          class="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{
            display: "block",
            top: "80px",
            right: "4px",
            position: "fixed",
            zIndex:'9999',
            marginTop: "8px",
            maxWidth: "350px",
          }}
        >
          <div class="toast-header">
            <strong
              class={`me-auto ${
                alert.type === "success" ? "text-success" : "text-danger"
              }`}
            >
              {alert.title}
            </strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div class="toast-body">{alert.data && alert.data}</div>
        </div>
      )}
    </>
  );
}

export default Alert;
