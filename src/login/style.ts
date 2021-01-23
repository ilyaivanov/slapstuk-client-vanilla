import { cls, colors, cssClass, cssClassOnHover, styles } from "../infra";

cssClass(cls.loginContainer, {
  height: "100vh",
  width: "100vw",
  backgroundColor: colors.gallery,
  ...styles.flexCenter,
});

cssClass(cls.loginForm, {
  color: "white",
  backgroundColor: colors.menu,
  width: "375px",
  height: "250px",
  padding: "35px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: "4px",
  boxShadow: "black 0px 0px 3px 2px",
  transition: "box-shadow 200ms",
});

cssClassOnHover(cls.loginForm, {
  boxShadow: "white 0px 0px 5px 4px",
});

//   .login-button {
//     box-shadow: rgba(0, 0, 0, 0.2) 1px 1px 3px 0;
//     background-color: #e7e7e7;
//     height: 36px;
//     border-radius: 4px;
//     line-height: 16px;
//     font-size: 14px;
//     margin-bottom: 5px;
//     align-self: stretch;
//     display: flex;
//     flex-direction: row;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     font-weight: bold;
//     border: none;
//   }
//   .login-button:hover {
//     background-color: white;
//   }
//   .login-button:active {
//     background-color: #dadada;
//   }
//   .login_google-logo {
//     width: 18px;
//     margin-right: 6px;
//   }

//   .login-logo {
//     align-self: center;
//     margin-bottom: 20px;
//   }
//   .login-text {
//     margin-top: 40px;
//     text-align: center;
//   }

//   .paint-button {
//     position: absolute;
//     top: 10px;
//     right: 10px;
//   }

//   .google-wait-text {
//     animation: animateText 2000ms linear infinite;
//   }

//   @keyframes animateText {
//     0%,
//     100% {
//       color: var(--text-color);
//     }
//     50% {
//       color: var(--focus-shadow);
//     }
//   }
