import React, { useState } from "react";
import AccountSettings from "./AccountSettings";
import EmailSettings from "./EmailSettings";
import PasswordSettings from "./PasswordSettings";
import AvatarSettings from "./AvatarSettings";
import InterfaceSettings from "./InterfaceSettings";
import DeleteAccountSettings from "./DeleteAccountSettings";
import { useParams } from "react-router-dom";

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("account");
  const { username } = useParams<{ username: string }>();

  console.log(username);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex space-x-4 mb-6 border-b pb-2">
        <button onClick={() => setActiveTab("account")} className={activeTab === "account" ? "font-bold border-b-2 border-blue-500" : ""}>Account</button>
        <button onClick={() => setActiveTab("email")} className={activeTab === "email" ? "font-bold border-b-2 border-blue-500" : ""}>Email</button>
        <button onClick={() => setActiveTab("password")} className={activeTab === "password" ? "font-bold border-b-2 border-blue-500" : ""}>Password</button>
        <button onClick={() => setActiveTab("avatar")} className={activeTab === "avatar" ? "font-bold border-b-2 border-blue-500" : ""}>Avatar</button>
        <button onClick={() => setActiveTab("interface")} className={activeTab === "interface" ? "font-bold border-b-2 border-blue-500" : ""}>Interface</button>
        <button onClick={() => setActiveTab("delete")} className={activeTab === "delete" ? "font-bold border-b-2 border-red-500" : ""}>Delete Account</button>
      </div>

      <div>
        {activeTab === "account" && <AccountSettings />}
        {activeTab === "email" && <EmailSettings />}
        {activeTab === "password" && <PasswordSettings />}
        {activeTab === "avatar" && <AvatarSettings />}
        {activeTab === "interface" && <InterfaceSettings />}
        {activeTab === "delete" && <DeleteAccountSettings />}
      </div>
    </div>
  );
};

export default SettingsPage;
