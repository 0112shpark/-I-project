import React, { useRef } from "react";
import "./modalopen.css";
import useOnClickOutside from "../hooks/useOutside";

const Modalopen = ({ setModal, usernames }) => {
  const ref = useRef();

  useOnClickOutside(ref, () => {
    setModal(false);
  });
  return (
    <div className="presentation" role="presentation">
      <div className="wrapper-modal">
        <div className="modal" ref={ref}>
          <span onClick={() => setModal(false)} className="modal-close">
            X
          </span>
          <p>좋아요 누른 내 친구목록</p>
          <span
            style={{
              fontSize: "15px",
              fontWeight: "bold",
              verticalAlign: "middle",
            }}
          >
            {Array.isArray(usernames)
              ? usernames.map((name) => (
                  <React.Fragment key={name}>
                    {name}
                    <br />
                  </React.Fragment>
                ))
              : usernames}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Modalopen;
