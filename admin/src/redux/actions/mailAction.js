import { GLOBAL_TYPES } from "./globalTypes";
import { postDataAPI } from "../../utils/fetchData";
import { fileUpload } from "../../utils/fileUpload";

export const sendMail =
  ({ email, auth }) =>
  async (dispatch) => {
    let files = [];
    dispatch({
      type: GLOBAL_TYPES.LOADING,
      payload: true,
    });

    try {
      if (email.attachFiles.length > 0)
        files = await fileUpload(email.attachFiles);

      await postDataAPI(
        `admin/send_mail`,
        {
          ...email,
          attachFiles:
            email.attachFiles.map((file, index) => ({
              name: file.name,
              url: files[index].url,
            })) || [],
        },
        auth.token
      );

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
          type: "error",
          title: "Gửi Email thất bại.",
        },
      });
    }
  };
