import React, { useEffect } from 'react'
import router from "next/router";
import { useDispatch } from "react-redux";
import {removeToken } from "../../services/LocalStorageService";
import { unsetUserInfo } from "../../features/userSlice";
import { unSetUserToken } from '../../features/authSlice';

export const Logout = () => {
  const perform = () => {
    const dispatch = useDispatch();
    dispatch(
      unsetUserInfo({ id: "", first_name: "", last_name: "", email: "", phone_number: "", type: "" })
    );
    dispatch(unSetUserToken({ access_token: null }));
    removeToken();
    useEffect( ()=>{
      router.push("/");
    })
  };

  return (<div> {perform()} </div > );

};
