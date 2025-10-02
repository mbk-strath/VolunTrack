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
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser((prev) => ({
        ...prev,
        name: parsedUser.name || "",
        email: parsedUser.email || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save changes (send to API or update localStorage)
    localStorage.setItem("user", JSON.stringify(user));
    alert("Profile updated!");
  };

  return (
    <div>
      <div className="profile">
        <UserProfile name={user.name} avatar="" className="prof" size={100} />
        <button>Update Avatar</button>
        <button>Delete Avatar</button>
      </div>

      <div className="profilePage">
        <form onSubmit={handleSubmit}>
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
                  onChange={handleChange}
                />
              </label>

              <label>
                Bio
                <textarea
                  name="bio"
                  value={user.bio}
                  onChange={handleChange}
                ></textarea>
              </label>
            </div>
          </div>

          <button className="save" type="submit">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
