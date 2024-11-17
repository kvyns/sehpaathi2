import React, { useState } from "react";
import {
  CircleUser,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  X,
  Camera,
  Calendar,
  Mail,
  School,
  Book,
  GraduationCap,
  User,
  Phone,
} from "lucide-react";

const Profile = ({ userName, handleLogOut }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("notifications");
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New study material available", isRead: false },
    { id: 2, text: "Assignment deadline reminder", isRead: false },
    { id: 3, text: "Grade updated for Math quiz", isRead: false },
  ]);

  const [userProfile, setUserProfile] = useState({
    name: userName,
    username: "student123",
    email: "student@example.com",
    phone: "+1 234 567 8900",
    dob: "1999-06-15",
    profilePhoto: "/api/placeholder/150/150",
    studentInfo: {
      rollNumber: "2024CS101",
      course: "Computer Science",
      semester: "6th",
      batch: "2021-2025",
      cgpa: "3.8",
    },
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    updates: false,
    grades: true,
    assignments: true,
  });

  const toggleNotificationSetting = (key) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const toggleSidebar = (panel) => {
    setActivePanel(panel);
    setIsSidebarOpen(true);
  };

  const handlePhotoUpload = () => {
    // Photo upload logic would go here
    // console.log("Photo upload triggered");
  };

  // Custom Toggle Switch Component
  const Toggle = ({ checked, onChange }) => (
    <button
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        checked ? "bg-blue-600" : "bg-gray-200"
      }`}
      onClick={onChange}
    >
      <span
        className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  return (
    <div className="relative">
      {/* Header Icons */}
      <div className="flex items-center gap-4">
        <button
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => toggleSidebar("notifications")}
        >
          <Bell className="w-6 h-6 text-gray-600" />
          {notifications.some((n) => !n.isRead) && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => toggleSidebar("profile")}
          className="flex items-center ring-1 ring-black  hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <img
            src="/assets/logo.png"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium text-gray-700">{userProfile.name}</span>
        </button>
      </div>

      {/* Sliding Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <button
            onClick={() =>
              setActivePanel(
                activePanel === "notifications" ? "profile" : "notifications"
              )
            }
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
            {activePanel === "notifications" ? "Profile" : "Notifications"}
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content Container */}
        <div className="relative h-[calc(100%-4rem)] overflow-hidden">
          {/* Profile Panel */}
          <div
            className={`absolute inset-0 transition-transform duration-300 bg-white ${
              activePanel === "profile" ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-4 overflow-y-auto h-full space-y-6">
              {/* Profile Photo Section */}
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src="/assets/logo.png"
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                  />
                  <button
                    onClick={handlePhotoUpload}
                    className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-800">
                  {userProfile.name}
                </h2>
                <p className="text-gray-500">@{userProfile.username}</p>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 border-b pb-2">
                  Personal Information
                </h3>
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-gray-800">{userProfile.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800">{userProfile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-800">{userProfile.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="text-gray-800">{userProfile.dob}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 border-b pb-2">
                  Academic Information
                </h3>
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <School className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Roll Number</p>
                      <p className="text-gray-800">
                        {userProfile.studentInfo.rollNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Book className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Course</p>
                      <p className="text-gray-800">
                        {userProfile.studentInfo.course}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Semester & Batch</p>
                      <p className="text-gray-800">
                        {userProfile.studentInfo.semester} Semester •{" "}
                        {userProfile.studentInfo.batch}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                <button className="w-full px-4 py-2 flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </button>
                <button className="w-full px-4 py-2 flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <HelpCircle className="w-4 h-4" />
                  Help & Support
                </button>
                <button
                  onClick={handleLogOut}
                  className="w-full px-4 py-2 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Notifications Panel */}
          <div
            className={`absolute inset-0 transition-transform duration-300 bg-white ${
              activePanel === "notifications"
                ? "translate-x-0"
                : "-translate-x-full"
            }`}
          >
            <div className="p-4 overflow-y-auto h-full">
              <h3 className="font-semibold mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Email Notifications</span>
                  <Toggle
                    checked={notificationSettings.email}
                    onChange={() => toggleNotificationSetting("email")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Push Notifications</span>
                  <Toggle
                    checked={notificationSettings.push}
                    onChange={() => toggleNotificationSetting("push")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Grade Updates</span>
                  <Toggle
                    checked={notificationSettings.grades}
                    onChange={() => toggleNotificationSetting("grades")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Assignment Reminders</span>
                  <Toggle
                    checked={notificationSettings.assignments}
                    onChange={() => toggleNotificationSetting("assignments")}
                  />
                </div>
              </div>

              <h3 className="font-semibold mt-8 mb-4">Recent Notifications</h3>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.isRead ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <p className="text-sm text-gray-700">{notification.text}</p>
                    {!notification.isRead && (
                      <button
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Profile;
