import React from "react";
import "../../styles/volunteer/profileVol.css";
import UserProfile from "../../components/main/UserProfile";
function ProfilePage() {
  return (
    <div>
      <UserProfile name="Linda Opolo" avatar="" className="prof" size={100} />
      <div className="profilePage">
        <form action="">
          <div className="flex">
            <div className="left-content">
              <label htmlFor="name">
                Full Name
                <input type="text" />
              </label>
              <label htmlFor="name">
                Email
                <input type="email" />
              </label>
              <label htmlFor="name">
                Phone Number
                <input type="tel" />
              </label>
            </div>
            <div className="right-content">
              <label htmlFor="name">
                Gender
                <select name="gender" id="gender">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
              <label htmlFor="country">
                Country
                <input type="text" />
              </label>
              <label htmlFor="bio">
                Bio
                <textarea name="" id=""></textarea>
              </label>
            </div>
          </div>

          <button className="save">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
