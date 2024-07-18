import { Link } from 'react-router-dom';
import './home.css'
import {  Card, Input, Button } from 'antd';
const { Meta } = Card;
const { Search } = Input;

function Home() {
    const onSearch = (value, _e, info) => console.log(info?.source, value);
      
    return(
        <>
            <div className='homeTop'>
                <div className='homeLogoContainer'>
                    <div className='homeLogo'>BiteBazaar</div>
                </div>
                <div className='searchContainer'>
                    <div className='search'>
                        <Search
                        placeholder="input search text"
                        allowClear
                        onSearch={onSearch}
                        style={{
                            width: 300,
                        }}
                        />
                    </div>
                </div>

                <div className='postAddContainer'>
                       <Link to='/add'><Button type='primary'>Add</Button></Link>
                </div>
            </div>
            <div className='homeContainer'>
                <div className='postDetails'>
                    <div className='postTop'>
                        <div className='postImg'></div>
                        <div className='postTag'>
                            Start finding great recipes.
                        </div>
                    </div>

                    <div className='post'>
                        <Card
                            style={{
                            width: 300,
                            }}
                            cover={
                            <img
                                alt="example"
                                src="/images/recipe_image.jpg"
                            />
                            }
                        >
                            <Meta
                            title="Card title"
                            description="This is the description"
                            />
                        </Card>

                        <Card
                            style={{
                            width: 300,
                            }}
                            cover={
                            <img
                                alt="example"
                                src="/images/recipe_image.jpg"
                            />
                            }
                        >
                            <Meta
                            title="Card title"
                            description="This is the description"
                            />
                        </Card>

                        <Card
                            style={{
                            width: 300,
                            }}
                            cover={
                            <img
                                alt="example"
                                src="/images/recipe_image.jpg"
                            />
                            }
                        >
                            <Meta
                            title="Card title"
                            description="This is the description"
                            />
                        </Card>

                        <Card
                            style={{
                            width: 300,
                            }}
                            cover={
                            <img
                                alt="example"
                                src="/images/recipe_image.jpg"
                            />
                            }
                        >
                            <Meta
                            title="Card title"
                            description="This is the description"
                            />
                        </Card>

                        <Card
                            style={{
                            width: 300,
                            }}
                            cover={
                            <img
                                alt="example"
                                src="/images/recipe_image.jpg"
                            />
                            }
                        >
                            <Meta
                            title="Card title"
                            description="This is the description"
                            />
                        </Card>

                        <Card
                            style={{
                            width: 300,
                            }}
                            cover={
                            <img
                                alt="example"
                                src="/images/recipe_image.jpg"
                            />
                            }
                        >
                            <Meta
                            title="Card title"
                            description="This is the description"
                            />
                        </Card>

                        <Card
                            style={{
                            width: 300,
                            }}
                            cover={
                            <img
                                alt="example"
                                src="/images/recipe_image.jpg"
                            />
                            }
                        >
                            <Meta
                            title="Card title"
                            description="This is the description"
                            />
                        </Card>

                        <Card
                            style={{
                            width: 300,
                            }}
                            cover={
                            <img
                                alt="example"
                                src="/images/recipe_image.jpg"
                            />
                            }
                        >
                            <Meta
                            title="Card title"
                            description="This is the description"
                            />
                        </Card>

                        <Card
                            style={{
                            width: 300,
                            }}
                            cover={
                            <img
                                alt="example"
                                src="/images/recipe_image.jpg"
                            />
                            }
                        >
                            <Meta
                            title="Card title"
                            description="This is the description"
                            />
                        </Card>
                        
                    </div>
                </div>                
            </div>
        </>
    )
}

export default Home;
