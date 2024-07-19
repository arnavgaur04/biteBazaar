import { useState, useEffect } from "react";
import { Button, Divider, List, Typography } from 'antd';
import { collection, query, orderBy, limit, startAfter, getDocs, collectionGroup, where } from 'firebase/firestore';
import { auth, db } from './firebase-config';
import { signOut } from "firebase/auth";
import './profile.css';
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastLikedDoc, setLastLikedDoc] = useState(null);
  const [lastSavedDoc, setLastSavedDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [dataLiked, setDataLiked] = useState([]);
  const [dataSaved, setDataSaved] = useState([]);

  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser !== "null") {
      if(JSON.parse(storedUser).uid == undefined)
        setUser(JSON.parse(storedUser).user);
      else
      setUser(JSON.parse(storedUser));
    }

    fetchInitialData();
  }, []);

  const fetchInitialData = async () =>
  {
    setLoading(true);
    try {

        var u = localStorage.getItem('user');
        u = JSON.parse(u);
        var uid;

        if(u.uid == undefined)
            uid = u.user.uid;

        else
            uid = u.uid;
        console.log(uid);

        const q = query(collectionGroup(db, 'posts'), where("type", "==", "liked"), where("uid", "==", uid),limit(10));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setDataLiked([...items]);
        setLastLikedDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(!querySnapshot.empty);
        console.log(items);
    } catch (error) {
        console.error("Error fetching more documents: ", error);
    }

    setLoading(true);
    try {

        console.log(uid);
        const q = query(collectionGroup(db, 'posts'), where("type", "==", "saved"), where("uid", "==", uid),limit(10));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setDataSaved([...items]);
        setLastSavedDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(!querySnapshot.empty);
        console.log(items);
    } catch (error) {
        console.error("Error fetching more documents: ", error);
    }

    setLoading(false);
  }

  const fetchLikedData = async () =>
  {
    if (!lastLikedDoc || !hasMore) return;
    setLoading(true);
    try {
        const q = query(collectionGroup(db, 'posts'),where("type", "==", "liked"),startAfter(lastLikedDoc),limit(10));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setDataLiked([...dataLiked, ...items]);
        setLastLikedDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(!querySnapshot.empty);
        console.log(items);
    } catch (error) {
        console.error("Error fetching more documents: ", error);
    }

    setLoading(false);
  }

  const fetchSavedData = async () =>
  {
    if (!lastSavedDoc || !hasMore) return;
    setLoading(true);
    
    try {
        const q = query(collectionGroup(db, 'posts'),where("type", "==", "saved"), startAfter(lastSavedDoc),limit(10));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setDataSaved([...dataSaved, ...items]);
        setLastSavedDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(!querySnapshot.empty);
        console.log(items);
    } catch (error) {
        console.error("Error fetching more documents: ", error);
    }

    setLoading(false);
  }

  const signO = async () =>
  {
    signOut(auth).then(() => {
        setUser(null);
        localStorage.setItem('user', "null");
      }).catch((error) => {
        console.log(error);
    });
  }

  return (
    user ? (
        <div className='profileHolder'>
            <div className="profileNameHolder profileActions">
                <div className='profileName'>
                    Hello { user.displayName }
                </div>
                <div className="profileSignOut profileActions">
                    <Button onClick={signO} type="primary" danger>
                        Sign Out
                    </Button>
                </div>
            </div>

            <div className="profileLiked profileActions">
                <div>Liked recipes: </div>
                <List
                size="small"
                bordered
                dataSource={dataLiked}
                renderItem={(item, index) => (
                <List.Item className="likedList listItems">
                    <div>{ index+1 }</div>
                    <div>{ item.title }</div>
                    <Link to={item.link}><div>here</div></Link>
                </List.Item>
                )}
                />
            </div>

            <div className="profileSaved profileActions">
                <div>Saved recipes: </div>
                <List
                size="small"
                bordered
                dataSource={dataSaved}
                renderItem={(item, index) => (
                    <List.Item className="likedSaved listItems">
                        <div>{ index+1 }</div>
                        <div>{ item.title }</div>
                        <Link to={item.link}><div>here</div></Link>
                    </List.Item>
                )}
                />
            </div>

            
        </div>
    ) : (
      <>
        no user
      </>
    )
  );
}

export default Profile;