// Configuração web pública do Firebase (pode ficar no código; a segurança vem das firestore.rules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
export const firebaseConfig={apiKey:'AIzaSyBp9Quq4nYaNyYj98akdAo9N0uS25L54Tw',authDomain:'fsantos-portfolio.firebaseapp.com',projectId:'fsantos-portfolio',storageBucket:'fsantos-portfolio.firebasestorage.app',messagingSenderId:'28933176927',appId:'1:28933176927:web:0f7adbd92544e9f1dce5ea',measurementId:'G-JR5WX4TE7Z'};
export const ADMIN_EMAIL="leyfps@gmail.com";
export const app=initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const auth=getAuth(app);
export const FB="https://www.gstatic.com/firebasejs/10.14.1/";
// Login Google robusto: evita clique duplo, ignora janela fechada/cancelada e usa redirecionamento se o popup for bloqueado
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
let _busy=false;
export async function googleLogin(onErr){if(_busy)return null;_busy=true;const pr=new GoogleAuthProvider();
  try{return await signInWithPopup(auth,pr)}
  catch(e){const c=e&&e.code||"";
    if(c==="auth/popup-closed-by-user"||c==="auth/cancelled-popup-request"||c==="auth/user-cancelled")return null;
    if(c==="auth/popup-blocked"||c==="auth/operation-not-supported-in-this-environment"){try{await signInWithRedirect(auth,pr);return null}catch(e2){onErr&&onErr(e2);return null}}
    onErr&&onErr(e);return null}
  finally{_busy=false}}
// conclui um login feito por redirecionamento (silencioso se não houver)
getRedirectResult(auth).catch(e=>console.warn("getRedirectResult:",e.code||e.message));
