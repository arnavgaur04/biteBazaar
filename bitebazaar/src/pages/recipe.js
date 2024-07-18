import React, { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import { BookOutlined, LikeOutlined, ShareAltOutlined } from '@ant-design/icons';
import './recipe.css';

const steps = [
  {
    title: 'First',
    content: 'First-content',
  },
  {
    title: 'Second',
    content: 'Second-content',
  },
  {
    title: 'Last',
    content: 'Last-content',
  },
];
const Recipe = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };
  return (
    <div className='recipeHolder'>
        <div className='recipeImage'></div>

        <div className='stepsHolder'>
            <Steps current={current} items={items} />
            <div style={contentStyle}>{steps[current].content}</div>
            <div
                style={{
                marginTop: 24,
                }}
            >
                {current < steps.length - 1 && (
                <Button style={{backgroundColor: 'black', borderColor: 'black'}} type="primary" onClick={() => next()}>
                    Next
                </Button>
                )}
                {current === steps.length - 1 && (
                <Button style={{backgroundColor: 'black', borderColor: 'black'}} type="primary" onClick={() => message.success('Recipe finished!')}>
                    Done
                </Button>
                )}
                {current > 0 && (
                <Button
                    style={{
                    margin: '0 8px',
                    backgroundColor: 'black',
                    color: "white",
                    borderColor: 'black'
                    }}
                    onClick={() => prev()}
                >
                    Previous
                </Button>
                )}
            </div>
        </div>

        <div className='recipeActions'>
            <div className='recipeActionsItems'>
                <LikeOutlined />
            </div>

            <div className='recipeActionsItems'>
                <BookOutlined />
            </div>

            <div className='recipeActionsItems'>
                <ShareAltOutlined />
            </div>
        </div>
    </div>
  );
};

export default Recipe;

