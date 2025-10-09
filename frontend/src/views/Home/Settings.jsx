import React, { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { authService } from '@services/AuthService';

const Settings = () => {
  const { authUser } = useAuth();






  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordMessageColor, setPasswordMessageColor] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userInfo, setUserInfo] = useState(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);

  const [newName, setNewName] = useState('');
  const [newPhoto, setNewPhoto] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);

  const toggleShowPassword = (field) => {
    switch (field) {
      case 'oldPassword':
        setShowOldPassword(!showOldPassword);
        break;
      case 'newPassword':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirmPassword':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match');
      setPasswordMessageColor('text-red-500');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordMessage('');
    setPasswordMessageColor('');

    try {
      await authService.updatePassword(authUser.token, oldPassword, newPassword);
      setPasswordMessage('Password updated successfully');
      setPasswordMessageColor('text-green-500');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordMessage(error.message || 'An error occurred while updating your password');
      setPasswordMessageColor('text-red-500');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const updatedUser = { name: newName };

      await authService.updateProfile(authUser.token, updatedUser);

      setUserInfo((prev) => ({
        ...prev,
        name: newName || prev.name,
      }));

      setNewName('');
      setPasswordMessage('Profile updated successfully');
      setPasswordMessageColor('text-green-500');
    } catch (error) {
      setPasswordMessage('Error updating profile: ' + error.message);
      setPasswordMessageColor('text-red-500');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    if (!newPhoto) {
      alert('Please select a photo');
      return;
    }

    const fileData = { file: newPhoto };

    setIsUpdatingPhoto(true);

    try {
      const response = await authService.updateUserPhoto(authUser?.token, fileData);
      alert('Photo updated successfully');
    } catch (error) {
      alert(`Error uploading photo: ${error.message}`);
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await authService.getUserInfo(authUser.token);
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user info:', error.message);
      } finally {
        setLoadingUserInfo(false);
      }
    };

    if (authUser?.token) {
      fetchUserInfo();
    }
  }, [authUser?.token, newName, newPhoto]);

  return (
    <div className="container mx-auto px-4 h-full flex items-center justify-center">
      <div className="w-full lg:w-6/12 px-4">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
          <div className="flex-auto px-4 lg:px-10 py-10">
            <div className="text-blue-600 text-center mb-3 font-bold">Account Settings</div>

            <hr className="my-6 border-gray-300" />

            {/* User Info Section */}
            {loadingUserInfo ? (
              <div className="text-center text-gray-500">Loading user information...</div>
            ) : (
              userInfo && (
                <div className="mb-6">
                  <div className="text-center font-bold text-lg mb-3">User Information</div>

                  {/* User Photo and Name Section */}
                  <div className="flex justify-center items-center mb-4 space-x-6">
                    {/* User Photo */}
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-blue-500">
                      {userInfo.photoPath ? (
                        <img src={userInfo.photoPath} alt="User Photo" className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-xl text-gray-600">No Photo</span>
                      )}
                    </div>

                    {/* User Details */}
                    <div className="flex flex-col justify-center text-gray-700 space-y-1">
                      <p className="text-xl font-semibold">{userInfo.name}</p>
                      <p className="text-sm text-gray-500">{userInfo.email}</p>
                    </div>
                  </div>

                  {/* {userInfo.photoPath && (
        <p className="text-sm text-gray-500"><strong>Photo:</strong> {userInfo.photoPath}</p>
      )} */}
                </div>
              )
            )}


            <hr className="my-6 border-gray-300" />

            {/* Profile Update Form */}
            <form onSubmit={handleProfileSubmit}>
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="newName">
                  New Name
                </label>
                <input
                  type="text"
                  id="newName"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="border border-gray-300 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-400 w-full transition-all"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className={`bg-blue-500 text-white font-bold uppercase px-6 py-3 rounded shadow hover:bg-blue-600 focus:outline-none w-full transition-all ${isUpdatingProfile ? 'bg-gray-400 cursor-not-allowed' : 'hover:shadow-lg'}`}
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? (
                    <div className="loader"></div> // Show a loader while updating
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </form>

            <hr className="my-6 border-gray-300" />

            {/* Password Update Form */}
            <form onSubmit={handlePasswordSubmit}>
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="oldPassword">
                  Current Password
                </label>
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="border border-gray-300 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-400 w-full transition-all"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                  onClick={() => toggleShowPassword('oldPassword')}
                >
                  {showOldPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border border-gray-300 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-400 w-full transition-all"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                  onClick={() => toggleShowPassword('newPassword')}
                >
                  {showNewPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border border-gray-300 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-400 w-full transition-all"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                  onClick={() => toggleShowPassword('confirmPassword')}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {passwordMessage && (
                <div className={`text-center font-bold mb-4 ${passwordMessageColor}`}>
                  {passwordMessage}
                </div>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  className={`bg-blue-500 text-white font-bold uppercase px-6 py-3 rounded shadow hover:bg-blue-600 focus:outline-none w-full transition-all ${isUpdatingPassword ? 'bg-gray-400 cursor-not-allowed' : 'hover:shadow-lg'}`}
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? (
                    <div className="loader"></div> // Show a loader while updating
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>

            <hr className="my-6 border-gray-300" />

            {/* Photo Update Form */}
            <form onSubmit={handlePhotoSubmit}>
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="newPhoto">
                  New Photo
                </label>
                <input
                  type="file"
                  id="newPhoto"
                  accept="image/*"
                  onChange={(e) => setNewPhoto(e.target.files[0])}
                  className="border border-gray-300 px-3 py-3 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-400 w-full transition-all"
                />
              </div>

              {newPhoto && (
                <div className="text-center font-bold text-gray-500 mt-2">
                  <span>{newPhoto.name}</span>
                </div>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  className={`bg-blue-500 text-white font-bold uppercase px-6 py-3 rounded shadow hover:bg-blue-600 focus:outline-none w-full transition-all ${isUpdatingPhoto ? 'bg-gray-400 cursor-not-allowed' : 'hover:shadow-lg'}`}
                  disabled={isUpdatingPhoto}
                >
                  {isUpdatingPhoto ? (
                    <div className="loader"></div> // Show a loader while updating
                  ) : (
                    'Update Photo'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
