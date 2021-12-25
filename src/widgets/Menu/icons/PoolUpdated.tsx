import React from "react";
import Svg from "../../../components/Svg/Svg";
import { SvgProps } from "../../../components/Svg/types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" {...props} height="32px" width="32px" enable-background="new 0 0 50 50" id="Layer_1" version="1.1" viewBox="0 0 50 50" ><path d="M33,35c4,0,7-3,7-7s-2.8-7-7-7c-0.2,0,0,0-1,0c-0.7-3.4-3-6-8-6c-4.2,0-7,3-7,6v1  c0,0-7,0-7,6c0,4.1,2,7,6,7C16,35,32.9,35,33,35z" fill="#1F86CC" id="Cloud__x2601_"/><path d="M25,1C11.7,1,1,11.7,1,25s10.7,24,24,24s24-10.7,24-24S38.3,1,25,1z M25,44C14.5,44,6,35.5,6,25S14.5,6,25,6  s19,8.5,19,19S35.5,44,25,44z" fill="#1F86CC"/></Svg>
  );
};

export default Icon;





