import { GLOBAL_TYPES } from "./globalTypes";
import axios from "axios";
import { fileUpload } from "../../utils/fileUpload";

const serverURL = "http://localhost:8000/api";

export const sendMail = (mail) => async (dispatch) => {
  let files = [];
  dispatch({
    type: GLOBAL_TYPES.LOADING,
    payload: true,
  });

  try {
    if (mail.attachFiles.length > 0) files = await fileUpload(mail.attachFiles);

    await axios.post(`${serverURL}/sendMail`, {
      ...mail,
      attachFiles:
        mail.attachFiles.map((file, index) => ({
          name: file.name,
          url: files[index].url,
        })) || [],
    });

    dispatch({
      type: GLOBAL_TYPES.LOADING,
      payload: false,
    });

    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        type: "success",
        title: "Gửi Email thành công.",
      },
    });

  } catch (error) {
    dispatch({
      type: GLOBAL_TYPES.LOADING,
      payload: false,
    });
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: {
        type: "failure",
        title: "Gửi Email thất bại.",
      },
    });
  }
};
