// src/components/LayoutComponent.tsx
import React from 'react';
import { Button, Layout } from 'antd';
import Home from '../pages/Page.Home';
import { useAuth } from '../context/Context.Auth';
import { useTheme } from '../context/Context.Theme';
import { MoonOutlined, SunOutlined, LogoutOutlined  } from '@ant-design/icons';


const { Header, Content } = Layout;

const layoutStyle: React.CSSProperties = {
  borderRadius: 8,
  width: 'calc(100vw - 18px)',
};

const LayoutComponent: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme, currentTheme } = useTheme();

  const contentStyle: React.CSSProperties = {
    minHeight: 'calc(100vh - 64px)',
    width: '100%',
    wordWrap: 'break-word',
    overflow: 'hidden',
    color: currentTheme.color,
    backgroundColor: currentTheme.backgroundColor,
    padding: '16px',
  };

  const headerStyle: React.CSSProperties = {
    color: currentTheme.backgroundColor,
    height: '64px',
    paddingInline: 16,
    lineHeight: '64px',
    backgroundColor: currentTheme.headerColor,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: currentTheme.buttonColor,
    color: currentTheme.buttonTextColor,
    border: 'none',
  };

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <div>Processo seletivo - Matheus F</div>
        <div>
       
            {isDarkMode ? 
              <Button 
              type="primary" 
              style={{backgroundColor: currentTheme.headerColor}} 
              onClick={toggleTheme} 
              shape="circle" 
              icon={<SunOutlined style={{color: currentTheme.cardBackgroundColor}} />} 
              />
              : 
              <Button 
              type="primary" 
              style={{backgroundColor: currentTheme.headerColor}} 
              onClick={toggleTheme} 
              shape="circle" 
              icon={<MoonOutlined style={{color: currentTheme.cardBackgroundColor}} />} 
              /> 
            }
         
          
            <Button shape="circle"   type="primary" onClick={logout} style={{marginLeft: "16px",backgroundColor: currentTheme.headerColor}} >
              <LogoutOutlined style={{color: currentTheme.cardBackgroundColor}} />
            </Button>
         
        </div>
      </Header>
      <Layout>
        <Content style={contentStyle}>
          <Home />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
