import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { getDataAPI, postDataAPI } from "../utils/fetchData";
import { GLOBAL_TYPES } from "../redux/actions/globalTypes";
import Loading from "../components/Loading";

const deviceId = localStorage.getItem("deviceId");

const Activity = () => {
  const [activities, setActivities] = useState({
    activeDevices: [],
    blockedDevices: [],
  });

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetActivities = async () => {
      if (loading) return;

      try {
        setLoading(true);
        const results = await getDataAPI(
          `get_device_access/${user._id}`,
          token
        );

        setActivities(results.data.data);
      } catch (error) {
        dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: { error: error.response.data.msg },
        });
      } finally {
        setLoading(false);
      }
    };

    fetActivities();
  }, [user._id, token]);

  const handleUnBlockDevice = async (deviceId) => {
    try {
      const results = await postDataAPI(
        `unblock-device-access/${user._id}/${deviceId}`,
        {},
        token
      );

      setActivities((prev) => ({
        ...prev,
        blockedDevices: prev.blockedDevices.filter(
          (device) => device.deviceId !== deviceId
        ),
      }));
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { success: results.data.msg },
      });
    } catch (error) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: error.response.data.msg },
      });
    }
  };

  return (
    <div className="activity_container">
      <div className="activity_header">
        <div className="activity_header-text">{`${user?.username} • Dreamers`}</div>
      </div>
      <div className="activity_title">Hoạt động đăng nhập tài khoản</div>
      <div className="activity_subtitle">
        Bạn đã đăng nhập trên các thiết bị này:
      </div>

      {loading && <Loading />}

      {activities?.activeDevices?.map((device, key) => (
        <div className="activity_device-box" key={device._id}>
          <button
            className="btn"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#collapseActive_${key}`}
          >
            <div className="activity_device-name">{device.deviceName}</div>
            <div className="activity_device-location">{`${device.city}, ${device.country}`}</div>
            {deviceId === device.deviceId ? (
              <div className="activity_current-device">Thiết bị này</div>
            ) : (
              <div className="activity_device-time">
                {moment(device.accessDate).fromNow()}
              </div>
            )}
          </button>
          <div className="collapse" id={`collapseActive_${key}`}>
            <div className="card card-body">
              <ul>
                <li>Địa chỉ mạng: {device.networkIp}</li>
                <li>Trình duyệt: {device.browserInfo}</li>
              </ul>
            </div>
          </div>
        </div>
      ))}

      <div className="activity_section-title">
        Các thiết bị đã bị chặn truy cập:
      </div>
      {activities?.blockedDevices?.map((device, key) => (
        <div className="activity_device-box block" key={device._id}>
          <button
            className="btn"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#collapseBlock_${key}`}
          >
            <div className="activity_device-name">{device.deviceName}</div>
            <div className="activity_device-location">{`${device.city}, ${device.country}`}</div>

            <div className="activity_device-time">
              {moment(device.accessDate).fromNow()}
            </div>
          </button>
          <div className="collapse" id={`collapseBlock_${key}`}>
            <div className="card card-body">
              <ul>
                <li>Địa chỉ mạng: {device.networkIp}</li>
                <li>Trình duyệt: {device.browserInfo}</li>
              </ul>
              <button
                className="activity_logout-button"
                onClick={() => handleUnBlockDevice(device.deviceId)}
              >
                Bỏ chặn thiết bị này
              </button>
            </div>
          </div>
        </div>
      ))}

      {activities?.blockedDevices?.length === 0 && (
        <div>
          <p className="activity_no-blocked-device">Không có thiết bị nào</p>
        </div>
      )}
    </div>
  );
};

export default Activity;
