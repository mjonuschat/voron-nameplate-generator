import { DownOutlined } from "@ant-design/icons";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity, useGetLocale, useSetLocale } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Avatar,
  Button,
  Col,
  Dropdown,
  MenuProps,
  Row,
  Space,
  Switch,
  Typography,
  theme,
} from "antd";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ColorModeContext } from "../../contexts/color-mode";

const { Title } = Typography;

const { useToken } = theme;

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky,
}) => {
  const { token } = useToken();
  const { i18n } = useTranslation();
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();
  const { data: user } = useGetIdentity<IUser>();
  const { mode, setMode } = useContext(ColorModeContext);

  const currentLocale = locale();

  const menuItems: MenuProps["items"] = [...(i18n.languages || [])]
    .sort()
    .map((lang: string) => ({
      key: lang,
      onClick: () => changeLanguage(lang),
      icon: (
        <span style={{ marginRight: 8 }}>
          <Avatar size={16} src={`/images/flags/${lang}.svg`} />
        </span>
      ),
      label: lang === "en" ? "English" : "German",
    }));

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    // display: "flex",
    // alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <Row style={{ backgroundColor: token.colorBgElevated }}>
        <Col flex="auto">
          <Space size={"large"}>
            <svg style={{ display: 'inline', verticalAlign: 'middle', height: '3rem' }} version="1.1" viewBox="0 0 93.887 108.41" xml: space="preserve" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(-88.748 -222.49)">
                <g transform="matrix(2.4841 0 0 2.4841 261.36 -2597.1)">
                  <path d="m-50.589 1135.1-18.898 10.91v21.821l18.898 10.91 18.898-10.91v-21.821zm-6.6844 9.7768h5.4554l-6.954 12.044h-5.4551zm10.911 0h5.4554l-13.908 24.089h-5.4551zm3.9567 12.044h5.4554l-6.954 12.044h-5.4551z" fill="#ed3023" />
                  <path transform="translate(2.0967e-7 -1.3419e-5)" d="m-31.691 1167.8v-21.821l-18.898-10.91-18.898 10.91v21.821l18.898 10.911z" fill="#ed3023" />
                  <path d="m-42.406 1156.9h5.4553l-6.9538 12.044h-5.4553z" fill="#fff" />
                  <path d="m-64.227 1156.9 6.9538-12.044h5.4553l-6.9538 12.044z" fill="#fff" />
                  <path d="m-40.907 1144.8-13.908 24.089h-5.4553l13.908-24.089z" fill="#fff" />
                </g>
              </g>
            </svg>
            <Typography>
              <Title style={{ display: 'inline', verticalAlign: 'middle', height: '3rem' }}>VORON Nameplate Generator</Title>
            </Typography>
          </Space>
        </Col>
        <Col flex={2} style={{ justifyContent: 'flex-end', display: 'flex' }}>
          <Space>
            <Dropdown
              menu={{
                items: menuItems,
                selectedKeys: currentLocale ? [currentLocale] : [],
              }}
            >
              <Button type="text">
                <Space>
                  <Avatar size={16} src={`/images/flags/${currentLocale}.svg`} />
                  {currentLocale === "en" ? "English" : "German"}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            <Switch
              checkedChildren="🌛"
              unCheckedChildren="🔆"
              onChange={() => setMode(mode === "light" ? "dark" : "light")}
              defaultChecked={mode === "dark"}
            />
          </Space>

        </Col>
      </Row>
    </AntdLayout.Header>
  );
};
