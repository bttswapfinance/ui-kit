import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import throttle from "lodash/throttle";
import { PancakeRoundIcon, CogIcon, SvgProps } from "../../components/Svg";
import Overlay from "../../components/Overlay/Overlay";
import { Flex } from "../../components/Flex";
import { useMatchBreakpoints } from "../../hooks";
import Skeleton from "../../components/Skeleton/Skeleton";
import Button from "../../components/Button/Button";
import Logo from "./Logo";
import Panel from "./Panel";
import Text from "../../components/Text/Text";
import { LanguageIcon } from "./icons";
import MenuButton from "./MenuButton";
import UserBlock from "./UserBlock";
import Dropdown from "../../components/Dropdown/Dropdown"
import { MoreIcon } from "./icons";
import { NavProps } from "./types";
import { MENU_HEIGHT, SIDEBAR_WIDTH_REDUCED, SIDEBAR_WIDTH_FULL } from "./config";
import Avatar from "./Avatar";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledNav = styled.nav<{ showMenu: boolean }>`
  position: fixed;
  top: ${({ showMenu }) => (showMenu ? 0 : `-${MENU_HEIGHT}px`)};
  left: 0;
  transition: top 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 8px;
  padding-right: 16px;
  width: 100%;
  height: ${MENU_HEIGHT}px;
  background: ${({ theme }) => theme.colors.navBar};
  border-bottom: solid 2px rgba(133, 133, 133, 0.1);
  z-index: 20;
  transform: translate3d(0, 0, 0);
`;

const BodyWrapper = styled.div`
  position: relative;
  display: flex;
`;

const Inner = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  flex-grow: 1;
  margin-top: ${({ showMenu }) => (showMenu ? `${MENU_HEIGHT}px` : 0)};
  transition: margin-top 0.2s;
  transform: translate3d(0, 0, 0);
  ${({ theme }) => theme.mediaQueries.nav} {
    margin-left: ${({ isPushed }) => `${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`};
  }
`;

const MobileOnlyOverlay = styled(Overlay)`
  position: fixed;
  height: 100%;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`;

const Head = styled.a`

cursor:pointer;
padding: 0 1rem 0 1rem;
color: ${({ theme }) => theme.colors.text};
font-size: 1.3rem;
padding: 1rem;  
 
  `;

const T = styled(Text)`
  cursor: pointer;
  @-webkit-keyframes hvr-hang {
    0% {
      -webkit-transform: translateY(8px);
      transform: translateY(8px);
    }
    50% {
      -webkit-transform: translateY(4px);
      transform: translateY(4px);
    }
    100% {
      -webkit-transform: translateY(8px);
      transform: translateY(8px);
    }
    }
    @keyframes hvr-hang {
    0% {
      -webkit-transform: translateY(8px);
      transform: translateY(8px);
    }
    50% {
      -webkit-transform: translateY(4px);
      transform: translateY(4px);
    }
    100% {
      -webkit-transform: translateY(8px);
      transform: translateY(8px);
    }
    }
    @-webkit-keyframes hvr-hang-sink {
    100% {
      -webkit-transform: translateY(8px);
      transform: translateY(8px);
    }
    }
    @keyframes hvr-hang-sink {
    100% {
      -webkit-transform: translateY(8px);
      transform: translateY(8px);
    }
    }
    
    
    
      -webkit-transform: perspective(1px) translateZ(0);
      transform: perspective(1px) translateZ(0);
      box-shadow: 0 0 1px rgba(0, 0, 0, 0);
      position: relative;
      overflow: hidden;
    
    // &:before {
    //   content: "";
    //   position: absolute;
    //   z-index: -1;
    //   left: 0;
    //   right: 100%;
    //   top: 0;
    //   background:  linear-gradient(to right, #fc00ff, #00dbde);
    //   height: 4px;
    //   -webkit-transition-property: right;
    //   transition-property: right;
    //   -webkit-transition-duration: 0.3s;
    //   transition-duration: 0.3s;
    //   -webkit-transition-timing-function: ease-out;
    //   transition-timing-function: ease-out;
    // }
    &:hover, &:focus, &:active {
      right: 0;
      background:#000;
      padding-left:12px;
      padding-right:12px;
      padding-top:5px;
      padding-bottom:5px;
      border-radius:20px;
      color:#fff;

    }
    
    
    
    -webkit-transform: perspective(1px) translateZ(0);
        transform: perspective(1px) translateZ(0);
        box-shadow: 0 0 1px rgba(0, 0, 0, 0);
        -webkit-transition-duration: 0.3s;
        transition-duration: 0.3s;
        -webkit-transition-property: transform;
        transition-property: transform;
      
      &:hover, &:focus, &:active {
        -webkit-transform: translateX(8px);
        transform: translateX(8px);
      }
    
`
const Price = styled.div`
  
`
const PriceLink = styled.a`
  display: flex;
  align-items: center;
  svg {
    transition: transform 0.3s;
  }
  :hover {
    svg {
      transform: scale(1.2);
    }
  }
`;

const UpdatedFlex = styled(Flex)`
  width: 20rem;
  justify-content: space-between;
  display: none;
  margin-left: 0rem;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
    margin-left: 2rem;
  }
`;

const UpdatedFlex2 = styled(Flex)`
  justify-content: space-between;
  display: none;
  margin-left: 0rem;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
    margin-left: 2rem;
  }
`;

const Menu: React.FC<NavProps> = ({
  account,
  login,
  logout,
  isDark,
  toggleTheme,
  langs,
  setLang,
  currentLang,
  cakePriceUsd,
  links,
  priceLink,
  profile,
  children,
}) => {
  const { isXl } = useMatchBreakpoints();
  const isMobile = isXl === false;
  const [isPushed, setIsPushed] = useState(!isMobile);
  const [showMenu, setShowMenu] = useState(true);
  const refPrevOffset = useRef(window.pageYOffset);

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset;
      const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight;
      const isTopOfPage = currentOffset === 0;
      // Always show the menu when user reach the top
      if (isTopOfPage) {
        setShowMenu(true);
      }
      // Avoid triggering anything at the bottom because of layout shift
      else if (!isBottomOfPage) {
        if (currentOffset < refPrevOffset.current) {
          // Has scroll up
          setShowMenu(true);
        } else {
          // Has scroll down
          setShowMenu(false);
        }
      }
      refPrevOffset.current = currentOffset;
    };
    const throttledHandleScroll = throttle(handleScroll, 200);

    window.addEventListener("scroll", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, []);

  // Find the home link if provided
  const homeLink = links.find((link) => link.label === "Home");

  return (
    <Wrapper>
      <StyledNav showMenu={showMenu}>
        <Flex>
          <Logo
            isPushed={isPushed}
            togglePush={() => setIsPushed((prevState: boolean) => !prevState)}
            isDark={isDark}
            href={homeLink?.href ?? "/"}
          />
          <UpdatedFlex alignItems="center">
            {/* <Dropdown target={
              <T>Trade</T>
            }>
              <T>Exchange</T>
              <T>Liquidity</T>
            </Dropdown> */}
            <T ><a href="/#/swap">Exchange</a></T>
            <T><a href="/#/pool">Liquidity</a></T>
            <T ><a href="/#/comingsoon">Farms</a></T>
            <T ><a href="/#/comingsoon">Pools</a></T>
            {/* <T ><a href="/#/comingsoon">Info Dashboard</a></T> */}

            <T><a href="https://forms.gle/6hptTipA7d4oFRRp6" target="_blank" rel="noreferrer">Get Listed</a></T>
            {/* <Dropdown target={
              <T><MoreIcon /></T>
            }>
              <T>Bird Software</T>
              <T>Solution</T>
            </Dropdown> */}
          </UpdatedFlex>
        </Flex>

        <Flex alignItems="center">
          <UpdatedFlex2 alignItems="center">
            {/* <Price>
          {cakePriceUsd ? (
            <PriceLink >    
              <PancakeRoundIcon width="42px" mr="8px" />
              <Text color="textSubtle" bold fontSize="2rem">{`$${cakePriceUsd.toFixed(3)}`}</Text>
            </PriceLink>
          ) : (
            <Skeleton width={80} height={24} />
          )}
        </Price> */}
            {/* <Dropdown
         
          target={
            <Button style={{padding:"0 0.5rem",margin:"0 1rem"}} variant="text" startIcon={<LanguageIcon color="textSubtle" width="24px" />}>
              <Text color="textSubtle">{currentLang?.toUpperCase()}</Text>
            </Button>
          }
        >
          {langs.map((lang) => (
            <MenuButton
              key={lang.code}
              fullWidth
              onClick={() => setLang(lang)}
              // Safari fix
              style={{ minHeight: "32px", height: "auto" }}
            >
              {lang.language}
            </MenuButton>
          ))}
        </Dropdown>  */}
          </UpdatedFlex2>
          <Flex>
            <UserBlock account={account} login={login} logout={logout} />
            {profile && <Avatar profile={profile} />}
          </Flex>
        </Flex>
      </StyledNav>
      <BodyWrapper>
        <Panel
          isPushed={isPushed}
          isMobile={isMobile}
          showMenu={showMenu}
          isDark={isDark}
          toggleTheme={toggleTheme}
          langs={langs}
          setLang={setLang}
          currentLang={currentLang}
          cakePriceUsd={cakePriceUsd}
          pushNav={setIsPushed}
          links={links}
          priceLink={priceLink}
        />
        <Inner isPushed={isPushed} showMenu={showMenu}>
          {children}
        </Inner>
        <MobileOnlyOverlay show={isPushed} onClick={() => setIsPushed(false)} role="presentation" />
      </BodyWrapper>
    </Wrapper>
  );
};

export default Menu;
