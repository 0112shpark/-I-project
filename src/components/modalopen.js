import React from "react";
import "./modalopen.css";

const Modalopen = ({ setModal }) => {
  return (
    <div className="presentation" role="presentation">
      <div className="wrapper-modal">
        <div className="modal">
          <span onClick={() => setModal(false)} className="modal-close">
            X
          </span>
          <p>좋아요 누른 내 친구목록</p>
        </div>
      </div>
    </div>
  );
};

export default Modalopen;
