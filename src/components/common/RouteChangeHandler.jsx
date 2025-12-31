import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useModal } from "../../context/ModalContext";

const RouteChangeHandler = () => {
  const location = useLocation();
  const { closeModal, modalContent } = useModal();
  const prevPathnameRef = useRef(location.pathname);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPathnameRef.current = location.pathname;
      return;
    }

    if (prevPathnameRef.current !== location.pathname) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      if (modalContent) {
        closeModal();
      }

      prevPathnameRef.current = location.pathname;
    }
  }, [location.pathname, closeModal, modalContent]);

  return null;
};

export default RouteChangeHandler;

