import React, { useEffect, useState } from "react";
import "./ProfilePage.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    location: { lat: "", long: "" }
  });
  const [profileImage, setProfileImage] = useState(null);
  const [storageError, setStorageError] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    // Load profile image from localStorage if it exists
    try {
      const savedImage = localStorage.getItem(`profile_image_${userId}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.error("Error loading profile image from localStorage:", error);
    }

    if (userId) {
      fetch(`http://localhost:5000/api/get-user/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            setFormData({
              name: data.user.name || "",
              phone: data.user.phone || "",
              address: data.user.address || "",
              location: {
                lat: data.user.location_lat || "",
                long: data.user.location_long || ""
              },
            });
          }
        })
        .catch((err) => console.error("Error fetching user data:", err));
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "lat" || name === "long") {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Function to get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          location: {
            lat: position.coords.latitude.toFixed(6),
            long: position.coords.longitude.toFixed(6)
          }
        }));
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("User denied the request for geolocation");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable");
            break;
          case error.TIMEOUT:
            setLocationError("The request to get user location timed out");
            break;
          case error.UNKNOWN_ERROR:
            setLocationError("An unknown error occurred");
            break;
          default:
            setLocationError("Error getting location");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Function to resize and compress image
  const resizeAndCompressImage = (file, maxWidth, maxHeight, quality) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          // Determine new dimensions
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          
          // Create canvas and draw resized image
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed data URL
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(dataUrl);
        };
        img.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setStorageError(false);
      
      // Resize and compress the image (max dimensions 300x300, quality 0.7)
      const compressedImage = await resizeAndCompressImage(file, 300, 300, 0.7);
      
      // Set the image preview
      setProfileImage(compressedImage);
      
      // Try to save to localStorage
      try {
        localStorage.setItem(`profile_image_${userId}`, compressedImage);
      } catch (err) {
        console.error("Failed to save image to localStorage:", err);
        setStorageError(true);
      }
    } catch (err) {
      console.error("Error processing image:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/update-user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, ...formData }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
      })
      .catch((err) => console.error("Error updating user:", err));
  };

  return (
    <div className="profile-container">
      <div className="glass-card">
        <h2>User Profile</h2>
        
        <div className="profile-picture-container">
          <div className="profile-picture">
            {profileImage ? (
              <img src={profileImage} alt="Profile" />
            ) : (
              <div className="profile-placeholder">
                {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
          <label htmlFor="profile-upload" className="upload-btn">
            Change Photo
          </label>
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          {storageError && (
            <p className="storage-error">
              Note: Your image is displayed but could not be saved for future sessions due to storage limitations.
            </p>
          )}
        </div>

        {user ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="location-group">
              <div className="location-header">
                <h3>Location</h3>
                <button 
                  type="button" 
                  onClick={getCurrentLocation} 
                  className="location-btn"
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? "Getting location..." : "Get My Location"}
                </button>
              </div>
              
              {locationError && (
                <p className="location-error">{locationError}</p>
              )}
              
              <div className="coordinates-display">
                {formData.location.lat && formData.location.long ? (
                  <p>
                    Coordinates: {formData.location.lat}, {formData.location.long}
                  </p>
                ) : (
                  <p>No location set</p>
                )}
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Update Profile
            </button>
          </form>
        ) : (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading user data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;