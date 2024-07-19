import React, { useState, useEffect } from 'react';
import { Button, message, Steps, theme } from 'antd';
import { BookOutlined, LikeOutlined, ShareAltOutlined } from '@ant-design/icons';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase-config';
import './recipe.css';

const Recipe = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [exists, setExists] = useState(false);
  const [steps, setSteps] = useState([]);

  // Function to fetch data
  const fetchData = async () => {
    try {
      const urlSearchString = window.location.pathname;
      const uid = urlSearchString.split('/')[urlSearchString.split('/').length - 2];
      let title = urlSearchString.split('/')[urlSearchString.split('/').length - 1];
      
      // Replace all "%20" with space
      title = title.replace(/%20/g, " ");
      
      const docRef = doc(db, `users/${uid}/posts/${title}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(docSnap.data());

        const newSteps = docSnap.data().directions.map((direction) => ({
          title: direction.heading,
          content: direction.description
        }));

        setSteps(newSteps);
        setExists(true);
      } else {
        setExists(false);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Call fetchData when component mounts
  useEffect(() => {
    fetchData();
  }, []);

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
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  const likeRecipe = async () => {
    var u = localStorage.getItem('user');
    var uid;

    if(u != "null")
    {
      u = JSON.parse(u);

      if(u.uid == undefined)
        uid = u.user.uid;

      else
        uid = u.uid;

        var title = window.location.pathname.split('/')[window.location.pathname.split('/').length-1];
        title = title.replace(/%20/g, " ");
        const randomString = Math.random().toString(36).slice(2, 15);

      await setDoc(doc(db, "users", uid, "posts", randomString), {
        type: "liked",
        link: window.location.pathname,
        title: title,
        uid: uid
      });
      
      alert("liked");
    }

    else
    {
      alert("sign in first");
    }
  };

  const saveRecipe = async () => {

    var u = localStorage.getItem('user');
    var uid;

    if(u != "null")
    {
      u = JSON.parse(u);
      if(u.uid == undefined)
        uid = u.user.uid;

      else
        uid = u.uid;
      
        var title = window.location.pathname.split('/')[window.location.pathname.split('/').length-1]
        title = title.replace(/%20/g, " ");
        const randomString = Math.random().toString(36).slice(2, 15);

      await setDoc(doc(db, "users", uid, "posts", randomString), {
        type: "saved",
        link: window.location.pathname,
        title: title,
        uid: uid
      });

      alert("saved");
    }

    else
    {
      alert("sign in first");
    }
  };

  return (
    !exists ? (
      <div>Loading...</div> // Display a loading message while fetching data
    ) : (
      <div className='recipeHolder'>
        <div className='recipeImage'></div>

        <div className='stepsHolder'>
          <Steps current={current} items={items} />
          <div className='stepsContent' style={contentStyle}>{steps[current]?.content}</div>
          <div className='nextandPrev' style={{ marginTop: 24 }}>
            {current < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={() => message.success('Recipe finished!')}>
                Done
              </Button>
            )}
            {current > 0 && (
              <Button type='primary' onClick={prev}>
                Previous
              </Button>
            )}
          </div>
        </div>

        <div className='recipeActions'>
          <div className='recipeActionsItems'>
            <LikeOutlined onClick={ likeRecipe } />
          </div>
          <div className='recipeActionsItems'>
            <BookOutlined onClick={ saveRecipe } />
          </div>
        </div>
      </div>
    )
  );
};

export default Recipe;
