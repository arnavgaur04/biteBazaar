import { Link } from 'react-router-dom';
import { Card, Input, Button, Dropdown, message, Space, Tooltip, Avatar } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { collection, query, orderBy, limit, startAfter, getDocs, collectionGroup, where } from 'firebase/firestore';
import { db } from './firebase-config';
import { useState, useEffect } from 'react';
import './home.css';

const { Meta } = Card;
const { Search } = Input;

const PaginatedComponent = () => {
    const [data, setData] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true); // Track if there's more data to fetch

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const q = query(collectionGroup(db, 'posts'), where("type", "==", "post"), limit(10));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log('No matching documents.');
                setHasMore(false);
                setLoading(false);
                return;
            }

            const items = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setData(items);
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
            console.log('Fetched items:', items);
        } catch (error) {
            console.error("Error fetching documents: ", error);
        }
        setLoading(false);
    };

    const fetchMoreData = async () => {
        if (!lastDoc || !hasMore) return;
        setLoading(true);
        try {
            const q = query(collectionGroup(db, 'posts'),startAfter(lastDoc),limit(10));
            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setData(prevData => [...prevData, ...items]);
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
            setHasMore(!querySnapshot.empty);
            console.log(items);
        } catch (error) {
            console.error("Error fetching more documents: ", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    return (
        <div className='postLoop'>
            <div className='postCardsHolder'>
                {data.map(item => (
                    <Link style={{textDecoration: 'none'}} to={`/post/${item.uid}/${encodeURIComponent(item.id)}`} key={item.id}>
                        <Card
                            style={{ width: 300 }}
                            cover={<img alt="example" src="/images/recipe_image.jpg" />}
                        >
                            <Meta
                                title={item.title}
                                description={item.description}
                            />
                        </Card>
                    </Link>
                ))}
            </div>
            {loading && <p>Loading...</p>}
            <Button type='primary' onClick={fetchMoreData} disabled={loading || !hasMore}>
                Load More
            </Button>
        </div>
    );
};

const SearchComponent = (props) => {
    const [data, setData] = useState(props.data);
    const [lastDoc, setLastDoc] = useState(props.lastDoc);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    console.log(lastDoc);

    const fetchMoreData = async () => {
        if (!lastDoc || !hasMore) return;
        setLoading(true);
        try {
            const q = query(collectionGroup(db, 'posts'),startAfter(lastDoc),limit(10));
            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(prevData => [...prevData, ...items]);
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
            setHasMore(!querySnapshot.empty);
            console.log(items);
            
        } catch (error) {
            console.error("Error fetching more documents: ", error);
        }
        setLoading(false);
    };

    return (
        data.length?
        (<div className='postLoop'>
            <div className='postCardsHolder'>
                {data.map(item => (
                    <Link style={{textDecoration: 'none'}} to={`/post/${item.uid}/${encodeURIComponent(item.id)}`} key={item.id}>
                        <Card
                            style={{ width: 300 }}
                            cover={<img alt="example" src="/images/recipe_image.jpg" />}
                        >
                            <Meta
                                title={item.title}
                                description={item.description}
                            />
                        </Card>
                    </Link>
                ))}
            </div>
            {loading && <p>Loading...</p>}
            <Button type='primary' onClick={fetchMoreData} disabled={loading || !hasMore}>
                Load More
            </Button>
        </div>) : (
            <>
                no results
            </>
        )
    );
};

function Home() {
    const [loader, setLoader] = useState(false);
    const [dataB, setDataB] = useState(false);
    const [data, setData] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const [val, setVal] = useState(null);
    const [tag, setTag] = useState(true);

    const handleMenuClick = (e) => {
        if(e.key == "1")
            setTag(true);
        else
            setTag(false);
    };

    const items = [
        {
          label: 'Tag',
          key: '1',
        },
        {
            label: 'Ingredients',
            key: '2',
          }
      ];

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    const onSearch = async (value, _e, info) => {
        setData([]);
        console.log(value);
        setVal(value);
        setLoader(true);

        if(tag)
        {
            const q = query(collectionGroup(db, 'posts'), where("tags", "array-contains", value), limit(10));
            const querySnapshot = await getDocs(q);
    
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(prevData => [...prevData, ...items]);
    
            querySnapshot.forEach((doc) => {
                console.log("Document ID:", doc.id);
                console.log("Document data:", doc.data());
            });
    
            if(!querySnapshot.empty)
                setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }

        else
        {
            
            const q = query(collectionGroup(db, 'posts'), where("ingredients", "array-contains", value), limit(10));
            const querySnapshot = await getDocs(q);
    
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(prevData => [...prevData, ...items]);
    
            querySnapshot.forEach((doc) => {
                console.log("Document ID:", doc.id);
                console.log("Document data:", doc.data());
            });
    
            if(!querySnapshot.empty)
                setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }


        setDataB(true);
        setLoader(false);
    };

    return (
        loader?
        (<>
            loading
        </>) :
        (
        <>
            <div className='homeTop'>
                <div className='homeLogoContainer'>
                    <div className='homeLogo'>BiteBazaar</div>
                </div>
                <div className='searchContainer'>
                    <div className='search'>
                        <Dropdown menu={menuProps}>
                            <Button>
                            <Space>
                                { tag? (<>Tag</>) : (<>Ingredients</>) }
                                <DownOutlined />
                            </Space>
                            </Button>
                        </Dropdown>

                        <Search
                            placeholder="search"
                            allowClear
                            onSearch={onSearch}
                            style={{ width: 300 }}
                        />
                    </div>
                </div>

                <div className='postAddContainer'>
                    <Link to='/add'><Button type='primary'>Add</Button></Link>
                </div>

                <div className='postAddContainer'>
                    <Link to='/profile'><Avatar size={32} icon={<UserOutlined />} /></Link>
                </div>
            </div>
            {
                dataB?
                (
                    <div className='homeContainer'>
                        <div className='postDetails'>
                            <div> search results for : { val } </div>
                            <SearchComponent data = {data} lastDoc = { lastDoc } />
                            <div className='post'>
                            </div>
                        </div>
                    </div>
                ) : 
                (
                    <div className='homeContainer'>
                        <div className='postDetails'>
                            <div className='postTop'>
                                <div className='postImg'></div>
                                <div className='postTag'>
                                    Start finding great recipes.
                                </div>
                            </div>

                            <div className='post'>
                                <PaginatedComponent />
                            </div>
                        </div>
                    </div>
                )
            }
        </>)
    );
}

export default Home;
