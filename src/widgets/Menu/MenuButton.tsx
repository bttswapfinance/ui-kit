import styled from "styled-components";
import Button from "../../components/Button/Button";

const MenuButton = styled(Button)`
  color: ${({ theme }) => theme.colors.text};
  padding: 0 8px;
  border-radius: 8px;
  margin-top: 0.65rem;
  display: none;
`;
MenuButton.defaultProps = {
  variant: "text",
  size: "sm",
};

export default MenuButton;
