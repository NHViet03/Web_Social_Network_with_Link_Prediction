import React from "react";

function Footer() {
  return (
    <div className="d-flex justify-content-between">
      <p className="mb-0">
        © 2023, made with <i class="fa-solid fa-heart" /> by{" "}
        <span className="fw-medium">Dreamers Team</span>.
      </p>
      <div className="d-flex align-items-center gap-4">
        <p className="fw-medium mb-0">Dreamers Team</p>
        <a href="/">
          <i
            class="fa-brands fa-github"
            style={{
              fontSize: "24px",
              cursor: "pointer",
              color: "#000",
            }}
          />
        </a>
        <a href="/">
          <i
            class="fa-brands fa-linkedin"
            style={{
              fontSize: "24px",
              cursor: "pointer",
              color: "#000",
            }}
          />
        </a>
      </div>
    </div>
  );
}

export default Footer;
