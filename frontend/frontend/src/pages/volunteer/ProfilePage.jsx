import React, { useState, useEffect } from "react";
import "../../styles/volunteer/profileVol.css";
import UserProfile from "../../components/main/UserProfile";

function ProfilePage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    country: "",
    bio: "",
    avatar: "", // <-- add avatar field
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser((prev) => ({
        ...prev,
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        gender: parsedUser.gender || "",
        country: parsedUser.country || "",
        bio: parsedUser.bio || "",
        avatar: parsedUser.avatar || "", // load saved avatar
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUser((prev) => ({ ...prev, avatar: reader.result }));
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, avatar: reader.result })
        );
      };
      reader.readAsDataURL(file); // convert image to base64 string
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify(user));
    alert("Profile updated!");
  };

  return (
    <div className="profilePage">
      <div className="profile">
        <UserProfile
          name={user.name}
          avatar={user.avatar}
          className="prof"
          size={100}
        />
        <input
          type="file"
          id="avatarInput"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleAvatarChange}
        />
        <button onClick={() => document.getElementById("avatarInput").click()}>
          Update Avatar
        </button>
        <button
          onClick={() => {
            setUser((prev) => ({ ...prev, avatar: "" }));
            localStorage.setItem(
              "user",
              JSON.stringify({ ...user, avatar: "" })
            );
          }}
        >
          Delete Avatar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="fit">
          <div className="flex">
            <div className="left-content">
              <label>
                Full Name
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  readOnly
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  readOnly
                />
              </label>

              <label>
                Phone Number
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={user.phone}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="right-content">
              <label>
                Gender
                <select
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>

              <label>
                Country
                <input
                  type="text"
                  name="country"
                  value={user.country}
                  placeholder="Enter your country"
                  onChange={handleChange}
                />
              </label>

              <label>
                Date of Birth
                <input
                  type="date"
                  name="date"
                  value={user.date}
                  placeholder="Enter your Date of Birth"
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>
          <label className="bio">
            Bio
            <textarea
              name="bio"
              value={user.bio}
              placeholder=""
              onChange={handleChange}
            ></textarea>
          </label>
        </div>
        <button className="save" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;
