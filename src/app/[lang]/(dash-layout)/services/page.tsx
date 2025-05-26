"use client"
import { apiCall } from '@/services/apiCall'
import { login } from '@/stores/authSlice'
import { useRouter } from 'next/router';
import React from 'react'
import { useDispatch } from 'react-redux'

export default function services() {
  const dispatch = useDispatch();
  const router = useRouter()
  

  const handleLogin = () => {
    apiCall.post("/auth/login").then((res) => {
      dispatch(login(res))
      router.push('/')
    }).catch((err) => {
      dispatch(login(err));
    })
  }
  return (
    <>
    </>
  );
}
