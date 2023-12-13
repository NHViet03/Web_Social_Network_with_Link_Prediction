import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// import { useDispatch } from "react-redux";
// import { sendMail } from "../redux/actions/mailAction";

const ModalSendMail = ({ customer, setShowModal }) => {
  const [email, setEmail] = useState({
    from: "dreamtechuit@gmail.com",
    to: customer.email,
    subject: "DreamTech - ",
    html: `<h4>Xin chào quý khách ${customer.name},</h4>
    <p>
      Chúng tôi là DreamTech,
    <p>
    <br/>
    <h5><em>Mọi chi tiết xin vui lòng liên hệ qua website <u>dreametech.com</u> hoặc số điện thoại <u>+84 123 456 789.</u></em>
    </h5>
    <p>Trân trọng,<br/>Đội ngũ Dreamers Team
    </p>`,
    attachFiles: [],
  });

  // const dispatch = useDispatch();

  const handleClose = () => {
    setShowModal(false);
  };

  const handleChange = (value) => {
    setEmail({
      ...email,
      html: value,
    });
  };

  const handleAttachFile = (e) => {
    const files = e.target.files;
    const newAttachFiles = [];
    for (let i = 0; i < files.length; i++) {
      if (!files[i]) return;
      newAttachFiles.push(files[i]);
    }

    setEmail({
      ...email,
      attachFiles: [...email.attachFiles, ...newAttachFiles],
    });
  };

  const handleRemoveFile = (index) => {
    const newAttachFiles = [...email.attachFiles];
    newAttachFiles.splice(index, 1);
    setEmail({
      ...email,
      attachFiles: newAttachFiles,
    });
  };

  const handleSendMail =  () => {
    //  dispatch(sendMail(email));
  };

  return (
    <div className="modal_custom">
      <div
        className="modal_content"
        style={{
          width: "600px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center modal_header">
          <h6 className="fw-medium">
            <i className="fa-solid fa-caret-right me-2" />
            Email tới {customer.name}
          </h6>
          <button
            className="btn "
            onClick={handleClose}
            style={{
              border: "none",
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="modal_body">
          <div className="d-flex align-items-center modal_border_bottom">
            <p className="me-2 fs-6">Từ</p>
            <p className="mt-0 fw-medium">{email.from}</p>
          </div>
          <div className="d-flex align-items-center modal_border_bottom">
            <p className="me-2 fs-6">Tới</p>
            <p className="mt-0 fw-medium">{email.to}</p>
          </div>
          <div className="d-flex align-items-center modal_border_bottom">
            <p className="me-2 fs-6">Tiêu đề</p>
            <input
              className="form-control"
              value={email.subject}
              placeholder="Nhập tiêu đề"
              onChange={(e) =>
                setEmail({
                  ...email,
                  subject: e.target.value,
                })
              }
            />
          </div>
          <ReactQuill
            theme="snow"
            value={email.html}
            style={{
              minHeight: "200px",
            }}
            onChange={handleChange}
          />

          <div className="my-4 d-flex flex-wrap gap-3">
            {email.attachFiles.map((file, index) => (
              <div
                style={{
                  color: "var(--primary-color)",
                }}
              >
                <span>{file.name}</span>
                <i
                  className="fa-regular fa-circle-xmark ms-2"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleRemoveFile(index)}
                />
              </div>
            ))}
          </div>
          <div
            className="fw-medium"
            style={{
              color: "var(--primary-color)",
            }}
          >
            <i className="fa-solid fa-paperclip me-1" />
            <label
              htmlFor="email_file"
              style={{
                cursor: "pointer",
              }}
            >
              Đính kèm file
            </label>
            <input
              id="email_file"
              type="file"
              className="d-none"
              multiple
              onChange={handleAttachFile}
            />
          </div>
        </div>
        <div
          className="modal_footer"
          style={{
            marginRight: "12px",
          }}
        >
          <button
            className="btn btn_normal btn_accept px-2"
            onClick={handleSendMail}
          >
            Gửi email
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSendMail;
