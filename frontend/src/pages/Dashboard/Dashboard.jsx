import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut, selectUserName } from "../../features/user/userSlice";
import { FileText, Link, Video, Image, File } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import QuickAccess from "../../components/QuickAccess,jsx/QuickAccess";
import AIAssistant from "../../components/AI/Assistant";
import ResourceManager from "../../components/ResourceManager/ResourceManager";
import MaterialBrowser from "../../components/Materials/MaterialsBrowser";
import { branches, semesters, materialTypes, subjects } from "../../constants";
import { Loader2 } from "lucide-react";
import { onAuthStateChanged} from "firebase/auth";
import { auth } from "../../auth/firebase";
import { collection } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { db } from "../../auth/firebase";
import { onSnapshot } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import { query, where } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userName = useSelector(selectUserName);
  const [user, setUser] = useState(null)

  // Sidebar state
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRole, setSelectedRole] = useState('dashboard');

  // AI Assistant state
  const [messages, setMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');

  // Resources state
  const [resources, setResources] = useState([]);
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    type: '',
    title: '',
    url: '',
    file: null
  });

  // Materials state
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  // Handlers
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setMessages([])
    setTimeout(() => {
      setMessages([
        {
          text: "Hello there! I am Sehpaathi, how may I assist you?",
          sender: "ai",
        },
      ]);
    }, 500);
  };

  const handleLogOut = () => {
    dispatch(signOut());
    navigate('/signin');
  };

  const [uploading, setUploading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // const handleSendMessage = () => {
  //   if (!aiInput.trim()) return;

  //   const newMessage = {
  //     text: aiInput,
  //     sender: 'user'
  //   };

  //   setMessages([...messages, newMessage]);
  //   setAiInput('');

  //   // Simulate AI response
  //   setTimeout(() => {
  //     const aiResponse = {
  //       text: 'I\'m here to help you with your studies. What would you like to know?',
  //       sender: 'ai'
  //     };
  //     setMessages(prev => [...prev, aiResponse]);
  //   }, 1000);
  // };
  // console.log(user);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in
        setUser(currentUser);
        const resourcesCollection = collection(
          db,
          `users/${currentUser.uid}/resources`
        );

        const unsubscribeResources = onSnapshot(
          resourcesCollection,
          (snapshot) => {
            const resourceList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setResources(resourceList);
          }
        );

        // Cleanup listener for resources
        return () => unsubscribeResources();
      } else {
        // User is signed out
        setUser(null); 
      }
    });
  
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (!aiInput.trim()) return;

    // Add user message to chat
    const newMessage = {
      text: aiInput,
      sender: "user",
    };
    setMessages([...messages, newMessage]);
    setAiInput("");

    try {
      // console.log(aiInput);
      setIsTyping(true)
      // console.log(`${import.meta.env.VITE_BACKEND_URL}/api/chat/message`)
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: aiInput }),
      });

      const data = await response.json();

      // console.log(data);
      if (data.data.message) {
        const aiResponse = {
          text: data.data.message.text,
          sender: 'ai'
        };
        // console.log(aiResponse);
        setMessages((msgs) => [...msgs, aiResponse]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Optionally add error handling UI
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (user, resource) => {
    setUploading(true);
    try {
      const [idToken, googleUser] = await Promise.all([
        user.getIdToken(),
        user.getIdTokenResult(true)
      ]);

      const googleProvider = user.providerData.find(
        (provider) => provider.providerId === 'google.com'
      );

      if (!googleProvider) {
        throw new Error('Please sign in with Google to upload files');
      }

      const formData = new FormData();
      formData.append('file', resource.file);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(error.message);
    } finally {
      setUploading(false);
      setIsAddResourceModalOpen(false);
    }
  };

  const handleFetchFiles = async (user) => {
    const token = await user.getIdToken();
    // console.log(token)
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/files/list`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      if (data.success) {
        // setFilesList(data.files);
        return data.files;
        // setFolderUrl(data.folderUrl);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      alert('Failed to fetch files: ' + error.message);
    }
  };

  const handleAddResource = async () => {
    try {
      if (!newResource.title || !newResource.type) return;
  
      const resource = {
        id: Date.now(),
        ...newResource
      };
  
      if (resource.type === 'file') {
        // Start file upload
        await handleFileUpload(user, resource);
        
        // Wait for the file URL to be available
        const files = await handleFetchFiles(user);
        
        if (!files || files.length === 0) {
          console.error("No files fetched or files array is empty");
          return;
        }
        
        // Update resource with the new file URL
        resource.url = files[0].viewUrl;
      }
  
      // Prepare resource data for Firestore
      const resourceData = {
        type: resource.type,
        title: resource.title,
        url: resource.url,
        id: resource.id,
        createdBy: user.uid,
        createdAt: serverTimestamp()
      };
  
      // Create user-specific collection path
      const userResourcesCollection = collection(
        db,
        `users/${user.uid}/resources`
      );

      // Add document to Firestore
      await addDoc(userResourcesCollection, resourceData);
  
      // Update local state and reset form
      setResources(prev => [...prev, resource]);
      setNewResource({ type: '', title: '', url: '', file: null });
      setIsAddResourceModalOpen(false);
    } catch (error) {
      console.error("Error adding resource:", error);
    }
  };

  const handleDeleteResource = async (id) => {
    try {
      const userResourcesCollection = collection(
        db,
        `users/${user.uid}/resources`
      );

      // Query to find the document with matching id
      const q = query(userResourcesCollection, where("id", "==", id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.error("Resource not found");
        return;
      }
      
      // Delete the document from Firestore
      const docRef = querySnapshot.docs[0].ref;
      await deleteDoc(docRef);
      
      // Update local state
      setResources((prevResources) =>
        prevResources.filter((resource) => resource.id !== id)
      );
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case "note":
        return <FileText size={20} className="text-blue-500" />;
      case "bookmark":
        return <Link size={20} className="text-purple-500" />;
      case "video":
        return <Video size={20} className="text-red-500" />;
      case "media":
        return <Image size={20} className="text-green-500" />;
      default:
        return <File size={20} className="text-gray-500" />;
    }
  };


  return (
    <>
      {!user ? (
        <div className='h-screen w-screen flex justify-center items-center'>
          <Loader2 className="w-16 h-16 animate-spin text-neutral-400" />
        </div>
      ) : (
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setSidebarOpen={setSidebarOpen}
            selectedRole={selectedRole}
            handleSelectRole={handleSelectRole}
            handleLogOut={handleLogOut}
          />

          <main className="flex-1 p-8 h-screen overflow-auto">
            <DashboardHeader userName={userName}
            selectedRole={selectedRole} />

            {selectedRole === 'dashboard' && (
              <QuickAccess handleSelectRole={handleSelectRole} />
            )}

            {selectedRole === 'sehpaathi' && (
              <AIAssistant
                messages={messages}
                aiInput={aiInput}
                setAiInput={setAiInput}
                handleSendMessage={handleSendMessage}
                isTyping = {isTyping}
              />
            )}

            {selectedRole === 'resources' && (
              <ResourceManager
                resources={resources}
                isAddResourceModalOpen={isAddResourceModalOpen}
                setIsAddResourceModalOpen={setIsAddResourceModalOpen}
                newResource={newResource}
                setNewResource={setNewResource}
                handleAddResource={handleAddResource}
                handleDeleteResource={handleDeleteResource}
                getIconForType={getIconForType}
                uploading={uploading}
              />
            )}

            {selectedRole === 'materials' && (
              <MaterialBrowser
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
                selectedSemester={selectedSemester}
                setSelectedSemester={setSelectedSemester}
                branches={branches}
                subjects={subjects}
                semesters={semesters}
                materialTypes={materialTypes}
              />
            )}
          </main>
        </div>
      )}
    </>
  );
};

export default Dashboard;
