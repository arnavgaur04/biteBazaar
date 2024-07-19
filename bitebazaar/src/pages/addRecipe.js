import './addRecipe.css';
import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Flex, Input, Tag, theme, Tooltip, List, Image, Upload, Button, message, Alert } from 'antd';
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from './firebase-config';

const { TextArea } = Input;

const tagInputStyle = {
  width: 64,
  height: 22,
  marginInlineEnd: 8,
  verticalAlign: 'top',
};

const PostTags = ({ tags, setTags }) => {
  const { token } = theme.useToken();
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

function PostRecipe() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    directions: [],
    ingredients: [],
    images: [],
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if(formData.ingredients.length == 0)
    {
      alert("Add Ingredients");
    }

    else
    {
      if(formData.title == "")
        alert("Add title");
      
      else
      {
        if(formData.directions.length == 0)
          alert("Add Instructions");
    
        else
        {
          var c = 0;
          for(var i = 0; i < formData.directions.length; i++)
          {
            if(formData.directions[i].heading == "" || formData.directions[i].heading.description == "")
            {
              c++;
              alert("Enter Instructions properly");
            }
          }

          if(c == 0)
          {
            var user = localStorage.getItem('user');
            user = JSON.parse(user);
            var uid;

            if(user.uid != undefined)
              uid = user.uid;

            else
              uid = user.user.uid;

            var ing = [];

            for(var i = 0; i < formData.ingredients.length; i++)
            {
              ing.push(formData.ingredients[i].value);
            }

            await setDoc(doc(db, "users", uid, "posts", formData.title), {
              description: formData.description,
              directions: formData.directions,
              images: formData.images,
              ingredients: ing,
              tags: formData.tags,
              title: formData.title,
              uid: uid,
              type: "post"
            });

            for(var i = 0; i < formData.tags.length; i++)
            {
              await setDoc(doc(db, "tags", formData.tags[i], uid, formData.title), {
                description: formData.description,
                directions: formData.directions,
                images: formData.images,
                ingredients: ing,
                tags: formData.tags,
                title: formData.title,
                uid: uid
              });

              console.log("data inserted to tag");
            }
            
            const storage = getStorage();
            // const mountainsRef = ref(storage, ima);
            console.log(img);
            console.log("data inserted");
          }
        }
      }
    }

    console.log('Collected Form Data:', formData);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className='addPost'>
        <div className='addPostLeft'>
          <div className='postHeadingContainer'>
            <div className='postHeading'>
              Title
              <Input
                style={{ backgroundColor: 'transparent', color: 'black', borderColor: 'black' }}
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className='postHeadingDesc'>
              Description
              <TextArea
                style={{ backgroundColor: 'transparent', color: 'black', borderColor: 'black' }}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </div>
            <div className='postTags'>
              Add tags
              <PostTags
                tags={formData.tags}
                setTags={(newTags) => setFormData({ ...formData, tags: newTags })}
              />
            </div>
          </div>

          <PostDirections
            directions={formData.directions}
            setDirections={(newDirections) => setFormData({ ...formData, directions: newDirections })}
          />
        </div>

        <div className='addPostRight'>
          <AddRows
            ingredients={formData.ingredients}
            setIngredients={(newIngredients) => setFormData({ ...formData, ingredients: newIngredients })}
          />
          <AddImage
            // images={formData.images}
            setImages={(newImages) => setFormData({ ...formData, images: newImages })}
          />
        </div>
      </div>
      <Button type='primary' htmlType='submit'>Submit</Button>
    </form>
  )
}

function PostDirections({ directions, setDirections }) {
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
    if (directions.length > 1) {
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
                {index + 1}.
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

function AddRows({ ingredients, setIngredients }) {
  const [val, setVal] = useState("");

  const addItem = () => {
    if (val !== "") {
      setIngredients([...ingredients, { value: val, id: Math.random().toString(36).substring(2, 15) }]);
      setVal('');
    } else {
      alert("Cannot be empty");
    }
  };

  const removeItem = (id) => {
    setIngredients(ingredients.filter((item) => item.id !== id));
  };

  const handleChange = (event, index) => {
    const updatedItems = [...ingredients];
    updatedItems[index].value = event.target.value;
    setIngredients(updatedItems);
  };

  return (
    <div className='IngHolder'>
      <div>Ingredients</div>
      <List
        style={{ backgroundColor: 'transparent', color: 'black', borderColor: 'black' }}
        className='IngList'
        bordered
        dataSource={ingredients}
        renderItem={(item, index) => (
          <List.Item className='IngListItems' key={item.id}>
            <div className='postIngIndex'>
              {index+1}
            </div>
            <div className='postIngName'>
              {item.value}
            </div>
            <Button onClick={() => removeItem(item.id)} type="primary" danger>x</Button>
          </List.Item>
        )}
      />
      <div className='postIngToBeAdded'>
        <Input
        placeholder='add ingredient'
          style={{ backgroundColor: 'transparent', borderColor: 'black' }}
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
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

var img = [];

// const AddImage = ({ images }) => {
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState('');
//   const [fileList, setFileList] = useState(images || []);
//   const handlePreview = async (file) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }
//     setPreviewImage(file.url || file.preview);
//     setPreviewOpen(true);
//   };
//   const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  
//   const uploadButton = (
//     <button
//       style={{
//         border: 0,
//         background: 'none',
//         color: 'black'
//       }}
//       type="button"
//     >
//       <PlusOutlined />
//       <div style={{ marginTop: 8 }}>
//         Upload
//       </div>
//     </button>
//   );

//   return (
//     <div className='uploadImage'>
//       <Upload
//         action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
//         listType="picture-card"
//         fileList={fileList}
//         onPreview={handlePreview}
//         onChange={handleChange}
//       >
//         {fileList.length >= 8 ? null : uploadButton}
//       </Upload>
//       {previewImage && (
//         <Image
//           wrapperStyle={{ display: 'none' }}
//           preview={{
//             visible: previewOpen,
//             onVisibleChange: (visible) => setPreviewOpen(visible),
//             afterOpenChange: (visible) => !visible && setPreviewImage(''),
//           }}
//           src={previewImage}
//         />
//       )}
//     </div>
//   );
// };

// const AddImage = () => {
//   const [fileList, setFileList] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const handleUpload = () => {
//     const formData = new FormData();
//     fileList.forEach((file) => {
//       formData.append('files[]', file);
//       img.push(file);
//     });
//   };
//   const props = {
//     onRemove: (file) => {
//       const index = fileList.indexOf(file);
//       const newFileList = fileList.slice();
//       newFileList.splice(index, 1);
//       setFileList(newFileList);
//     },
//     beforeUpload: (file) => {
//       setFileList([...fileList, file]);
//       return false;
//     },
//     fileList,
//   };
//   return (
//     <>
//       <Upload {...props}>
//         <Button icon={<UploadOutlined />}>Select File</Button>
//       </Upload>
//       <Button
//         type="primary"
//         onClick={handleUpload}
//         disabled={fileList.length === 0}
//         loading={uploading}
//         style={{
//           marginTop: 16,
//         }}
//       >
//         {uploading ? 'Uploading' : 'Start Upload'}
//       </Button>
//     </>
//   );
// };

const AddImage = ({ setImages }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const storage = getStorage();

  // Upload file function
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('No files selected.');
      return;
    }

    setUploading(true);

    try {
      // Create an array of promises for uploading files
      var user = localStorage.getItem('user');
      user = JSON.parse(user);
      user = user.user;
      console.log(user);
      var uid = user.uid;

      const uploadPromises = fileList.map(file => {
        const storageRef = ref(storage, `images/${uid}/images/${file.name}`);
        return uploadBytes(storageRef, file).then(snapshot => {
          return getDownloadURL(snapshot.ref); // Get the URL of the uploaded file
        });
      });

      // Wait for all uploads to complete
      const uploadedFileUrls = await Promise.all(uploadPromises);
      
      // Update the parent component with the URLs of the uploaded images
      setImages(uploadedFileUrls);
      message.success('Upload successful.');
    } catch (error) {
      message.error('Upload failed.');
    } finally {
      setUploading(false);
      setFileList([]); // Clear the file list after upload
    }
  };

  // Handle file change event
  const handleChange = ({ file, fileList: newFileList }) => {
    if (file.status === 'done') {
      message.success(`${file.name} file uploaded successfully.`);
    } else if (file.status === 'error') {
      message.error(`${file.name} file upload failed.`);
    }
    setFileList(newFileList);
  };

  // Properties for the Upload component
  const uploadProps = {
    onRemove: (file) => {
      setFileList(prevFileList => prevFileList.filter(item => item.uid !== file.uid));
    },
    beforeUpload: (file) => {
      setFileList(prevFileList => [...prevFileList, file]);
      return false; // Prevent automatic upload
    },
    fileList,
  };

  return (
    <div className='uploadBtns'>
      <Upload
        {...uploadProps}
        listType="picture"
        fileList={fileList}
        onChange={handleChange}
      >
        <Button type='primary' icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? 'Uploading' : 'Start Upload'}
      </Button>
    </div>
  );
};

function AddRecipe() {
  var user = localStorage.getItem('user');
  if (user == "null") user = null;
  else user = JSON.parse(user);

  return (
    user ? (
      <PostRecipe />
    ) : (
      <>home</>
    )
  );
}

export default AddRecipe;