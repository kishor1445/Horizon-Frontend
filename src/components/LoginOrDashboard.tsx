import React, { useEffect } from 'react'

const LoginOrDashboard: React.FC = () => {

    useEffect(() => {
        if (localStorage.getItem("ACM_SIST_TOKEN") != null) {
            window.location.href = "/admin/dashboard";
        } else {
            window.location.href = "/admin/login";
        }
    }, []);

  return (
    <></>
  )
}

export default LoginOrDashboard