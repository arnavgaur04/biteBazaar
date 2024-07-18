import { useNavigate } from 'react-router-dom';
import './addRecipe.css';
import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Flex, Input, Tag, theme, Tooltip, List, Image, Upload, Button } from 'antd';

const { TextArea } = Input;

const tagInputStyle = {
  width: 64,
  height: 22,
  marginInlineEnd: 8,
  verticalAlign: 'top',
};

const PostTags = () => {
  const { token } = theme.useToken();
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);
  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);
  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };
  const handleEditInputChange = (e) => {
    setEditInputValue(e.target.value);
  };
  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');
  };
  const tagPlusStyle = {
    height: 22,
    borderStyle: 'dashed',
  };
  return (
    <Flex gap="4px 0" wrap>
      {tags.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              size="small"
              style={tagInputStyle}
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }
        const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag
            key={tag}
            closable={index >= 0}
            style={{
              userSelect: 'none',
            }}
            onClose={() => handleClose(tag)}
          >
            <span
              onDoubleClick={(e) => {
                if (index !== 0) {
                  setEditInputIndex(index);
                  setEditInputValue(tag);
                  e.preventDefault();
                }
              }}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={tagInputStyle}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag style={tagPlusStyle} icon={<PlusOutlined />} onClick={showInput}>
          New Tag
        </Tag>
      )}
    </Flex>
  );
};

function PostRecipe()
{
    var user = localStorage.getItem('user');
    const [value, setValue] = useState('');

    if(user == "null")
        user = null;
    else
        user = JSON.parse(user);

    return (
            <div className='addPost'>
                <div className='addPostLeft'>
                    <div className='postHeadingContainer'>
                        <div className='postHeading'>
                            Title
                            <Input style={{backgroundColor: 'transparent', color: 'black', borderColor: 'black'}} placeholder="Title" />
                        </div>
                        <div className='postHeadingDesc'>
                                Description
                                <TextArea
                                    style={{backgroundColor: 'transparent', color: 'black', borderColor: 'black'}}
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="Description"
                                    autoSize={{
                                    minRows: 3,
                                    maxRows: 5,
                                    }}
                                />
                        </div>
                        <div className='postTags'>
                            Add tags
                            <PostTags />
                        </div>
                    </div>

                    <PostDirections />
                </div>

                <div className='addPostRight'>
                        <AddRows />
                        <AddImage />
                </div>
            </div>
    )
}


function PostDirections() {
  const [directions, setDirections] = useState([
    { stepNumber: 1, heading: '', description: '' },
  ]);

  const addDirection = () => {
    const newDirection = {
      stepNumber: directions.length + 1,
      heading: '',
      description: '',
    };
    setDirections([...directions, newDirection]);
  };

  const handleHeadingChange = (index, event) => {
    const updatedDirections = [...directions];
    updatedDirections[index].heading = event.target.value;
    setDirections(updatedDirections);
  };

  const handleDescriptionChange = (index, event) => {
    const updatedDirections = [...directions];
    updatedDirections[index].description = event.target.value;
    setDirections(updatedDirections);
  };

  const removeDirection = (index) => {
    if (directions.length > 1) { // Prevent removing the only direction
      const updatedDirections = [...directions];
      updatedDirections.splice(index, 1);
      setDirections(updatedDirections);
    }
  };

  return (
    <div className='postDirectionsHolderHolder'>
        <div className='postDirectionsHolder'>
        {directions.map((direction, index) => (
            <div className='postDirections' key={index}>
            <div className='postDirectionsHeadingHolder'>
                <div>
                {index+1}.
                </div>
                <div className='postDirectionsHeading'>
                <Input
                    style={{ backgroundColor: 'transparent', color: 'black', borderColor: 'black' }}
                    placeholder="Step heading"
                    value={direction.heading}
                    onChange={(e) => handleHeadingChange(index, e)}
                />
                </div>
                    <Button type='primary' onClick={() => removeDirection(index)} danger>x</Button>
            </div>
            <div className='postDirectionsDescription'>
                <TextArea
                style={{ backgroundColor: 'transparent', color: 'black', borderColor: 'black' }}
                value={direction.description}
                onChange={(e) => handleDescriptionChange(index, e)}
                placeholder="Describe step"
                autoSize={{ minRows: 3, maxRows: 5 }}
                />
            </div>
                
            </div>
        ))}
        </div>
        <Button type='primary' onClick={addDirection}>Add Direction</Button>
    </div>
  );
}

function AddRows() {
    const [items, setItems] = useState([]);
    const [val, setVal] = useState("");
  
    const addItem = () => {
        if(val != "")
            setItems([...items, { value: val, id: Math.random().toString(36).substring(2, 15) }]);
        else
            alert("Cannot be empty");
    };
  
    const removeItem = (id) => {
      setItems(items.filter((item) => item.id !== id));
    };
  
    const handleChange = (event, index) => {
      const updatedItems = [...items];
      updatedItems[index].value = event.target.value;
      setItems(updatedItems);
    };
  
    return (
      <div className='IngHolder'>
        <div>
            Ingredients
        </div>
        <List
        style={{backgroundColor: 'transparent', color: 'black', borderColor: 'black'}}
        className='IngList'
        bordered
        dataSource={items}
        renderItem={(item, index) => (
            <List.Item className='IngListItems' key={item.id}>
                <div className='postIngIndex'>
                    {index}
                </div>

                <div className='postIngName'>
                    {item.value}
                </div>

                <Button onClick={() => removeItem(item.id)} type="primary" danger>x</Button>
            </List.Item>
        )}
        />
        <div className='postIngToBeAdded'>
            <Input style={{backgroundColor: 'transparent', borderColor: 'black'}} onChange={(e)=>setVal(e.target.value)}/>
        </div>
        <div className='addIngBtnHolder'>
            <Button type='primary' onClick={addItem}>+</Button>
        </div>
      </div>
    );
}



const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AddImage = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
        color: 'black'
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <div className='uploadImage'>
      <Upload
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: 'none',
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

function AddRecipe() {
    var user = localStorage.getItem('user');

    if(user == "null")
        user = null;
    else
        user = JSON.parse(user);
  
    return (
      user ? (
        <PostRecipe />
      ) : (
        <>
            navigate('/home')
        </>
      )
    );
  }

export default AddRecipe;