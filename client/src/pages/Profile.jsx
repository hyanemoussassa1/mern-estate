import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ref, getStorage, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase'
import { updateUserFailure, updateUserSuccess, updateUserStart, 
  deleteUserFailure, deleteUserSuccess, deleteUserStart,
  signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef();
  const dispatch = useDispatch();
  const {currentUser, loading, error} = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [successfulUpdate, setSuccessfulUpdate] = useState(false);
  console.log(formData);
  console.log(currentUser) 

  useEffect(() => {
    if (file){
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = async (file) => {
    setFileUploadError(false);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress));
    },
    (error) => {
      setFileUploadError(true);
    },
    ()=> {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setFormData({...formData, avatar: downloadURL});
      });
    });
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setSuccessfulUpdate(false)
    try {
      console.log(formData);
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setSuccessfulUpdate(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success == false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }

  };

  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success == false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleUpdateUser} src="" alt="" className='flex flex-col gap-4'>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef} hidden accept='image/*'/>
        <img 
          src={formData.avatar || currentUser?.avatar} 
          onClick={()=> fileRef.current.click()}
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          alt="" 
        />
        <p className='text-sm self-center'>
          {fileUploadError ? 
            (<span className='text-red-700'>Error uploading file (image must be less than 2mb)</span>) 
            : filePerc > 0 && filePerc < 100 ? 
              (<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>) : 
                filePerc === 100 && fileUploadError == false ?
                (<span className='text-green-700'>Image uploaded successfully</span>)
                : ('')           
          }
        </p>
        <input 
          type="text" 
          id = 'username'
          placeholder='username' 
          className = 'border p-3 rounded-lg'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input 
          type="text" 
          id = 'email'
          placeholder='email' 
          defaultValue={currentUser.email}
          onChange={handleChange}
          className = 'border p-3 rounded-lg'
        />
        <input 
          type="password" 
          id = 'password'
          placeholder='password' 
          onChange={handleChange}
          className = 'border p-3 rounded-lg'
        />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-80 uppercase'>
          {loading ? 'Loading...' : 'Update'}
        </button>
       <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to="/create-listing" >
        Create Listing
        </Link>
      </form>
      <p className='self-center'>{successfulUpdate ? <span className='text-green-700'> Successfully updated user</span> : ''}</p>
      <p className='text-red-700 self-center'>{error ? error : ''}</p>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignout} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}
