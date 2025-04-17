import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";
import Loading from "../components/Loading";
import { postDataAPI } from "../utils/fetchData";

export default function BlockDeviceAccess() {
  const [loading, setLoading] = useState(true);

  const { userId, deviceId } = useParams();

  const { token, user } = useSelector((state) => state?.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: "Vui lòng đăng nhập để tiếp tục",
        },
      });

      navigate("/login");

      return;
    }

    if (user?._id !== userId) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: {
          error: "Bạn không có quyền truy cập vào nội dung này !",
        },
      });

      navigate("/");
    }
  }, [user, userId, deviceId]);

  useEffect(() => {
    const blockDeviceAccess = async () => {
      if (!userId || !deviceId || !user) return;

      setLoading(true);
      try {
        await postDataAPI(
          `block-device-access/${userId}/${deviceId}`,
          {},
          token
        );

        setLoading(false);
      } catch (error) {
        

        dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: {
            error: error.response.data.msg,
          },
        });
      }
    };

    blockDeviceAccess();
  }, [userId, deviceId, user, token]);

  return (
    <div
      className="block_device"
      style={{
        marginLeft: "-250px",
      }}
    >
      <div
        style={{
          marginTop: "100px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <Loading />
        ) : (
          <div>
            <div
              style={{
                borderRadius: "16px",
                padding: "48px",
                textAlign: "center",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                maxWidth: "650px",
              }}
            >
              <i
                className="fa-solid fa-circle-check"
                style={{
                  fontSize: "48px",
                  marginBottom: "24px",
                  color: "var(--primary-color)",
                }}
              ></i>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#202124",
                  marginBottom: "10px",
                }}
              >
                Xác minh danh tính thành công
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "#666",
                  marginBottom: "30px",
                }}
              >
                Bạn đã xác minh thiết bị vừa truy cập không phải là bạn. Mọi
                truy cập từ thiết bị trên sẽ bị chặn lại trên tài khoản của bạn
                cho đến khi bạn mở khóa.
              </p>
              <button
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "#ffffff",
                  padding: "8px 24px",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
                onClick={() => navigate("/")}
              >
                Quay lại trang chủ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
