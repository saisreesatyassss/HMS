 
// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { auth, db } from "@/components/Auth/firebaseConfig";
// import { onAuthStateChanged, signOut, User } from "firebase/auth";
// import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// const ProfilePage = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [userData, setUserData] = useState<any>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const router = useRouter();

//   // Form state for creating/editing profile
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     bloodGroup: "",
//     allergies: "",
//     medicalHistory: "",
//   });

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);

//         // Check if user profile exists
//         const docRef = doc(db, "users", currentUser.uid);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           setUserData(docSnap.data());
//         } else {
//           setUserData(null); // No profile exists
//         }
//       } else {
//         setUser(null);
//         router.push("/signin");
//       }
//     });

//     return () => unsubscribe();
//   }, [router]);

//   const handleLogout = async () => {
//     await signOut(auth);
//     router.push("/signin");
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleProfileSave = async () => {
//     if (user) {
//       const docRef = doc(db, "users", user.uid);

//       if (userData) {
//         // Update existing profile
//         await updateDoc(docRef, formData);
//       } else {
//         // Create new profile
//         await setDoc(docRef, formData);
//       }

//       setUserData(formData); // Update local state
//       setIsEditing(false); // Exit editing mode
//     }
//   };

//   if (!user) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen">
//         <h1 className="text-xl font-bold">You are not logged in</h1>
//         <button
//           className="mt-5 px-6 py-3 bg-blue-500 text-white rounded-md"
//           onClick={() => router.push("/signin")}
//         >
//           Login
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
//       <h1 className="text-2xl font-semibold mb-4">Profile Page</h1>

//       {userData && !isEditing ? (
//         <div>
//           <h2 className="text-lg font-bold">Personal Information</h2>
//           <p>Name: {userData.name}</p>
//           <p>Email: {user.email}</p>
//           <p>Phone: {userData.phone || "Not Provided"}</p>

//           <h2 className="text-lg font-bold mt-4">Medical Information</h2>
//           <p>Blood Group: {userData.bloodGroup || "Not Provided"}</p>
//           <p>Allergies: {userData.allergies || "None"}</p>
//           <p>Medical History: {userData.medicalHistory || "None"}</p>

//           <button
//             className="mt-4 px-6 py-3 bg-green-500 text-white rounded-md"
//             onClick={() => setIsEditing(true)}
//           >
//             Edit Profile
//           </button>
//           <button
//             className="mt-4 ml-4 px-6 py-3 bg-red-500 text-white rounded-md"
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         </div>
//       ) : (
//         <div>
//           <h2 className="text-lg font-bold">
//             {userData ? "Edit Profile" : "Create Profile"}
//           </h2>
//           <div className="mt-4">
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className="mb-4 w-full px-4 py-2 border rounded"
//             />
//             <input
//               type="text"
//               name="phone"
//               placeholder="Phone"
//               value={formData.phone}
//               onChange={handleInputChange}
//               className="mb-4 w-full px-4 py-2 border rounded"
//             />
//             <input
//               type="text"
//               name="bloodGroup"
//               placeholder="Blood Group"
//               value={formData.bloodGroup}
//               onChange={handleInputChange}
//               className="mb-4 w-full px-4 py-2 border rounded"
//             />
//             <input
//               type="text"
//               name="allergies"
//               placeholder="Allergies"
//               value={formData.allergies}
//               onChange={handleInputChange}
//               className="mb-4 w-full px-4 py-2 border rounded"
//             />
//             <input
//               type="text"
//               name="medicalHistory"
//               placeholder="Medical History"
//               value={formData.medicalHistory}
//               onChange={handleInputChange}
//               className="mb-4 w-full px-4 py-2 border rounded"
//             />
//             <button
//               className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-md"
//               onClick={handleProfileSave}
//             >
//               Save
//             </button>
//             <button
//               className="mt-4 ml-4 px-6 py-3 bg-gray-500 text-white rounded-md"
//               onClick={() => setIsEditing(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;


"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db ,storage} from "@/components/Auth/firebaseConfig";
// import { storage } from "@/components/Auth/firebaseStorageConfig";  
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    allergies: "",
    medicalHistory: "",
  });
//   const [reports, setReports] = useState([]);

const [reports, setReports] = useState<{ name: string; url: string; uploadedAt: string }[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setReports(docSnap.data().medicalReports || []);
        } else {
          setUserData(null);
        }
      } else {
        setUser(null);
        router.push("/signin");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/signin");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async () => {
    if (user) {
      const docRef = doc(db, "users", user.uid);

      if (userData) {
        await updateDoc(docRef, formData);
      } else {
        await setDoc(docRef, { ...formData, medicalReports: [] });
      }

      setUserData({ ...formData, medicalReports: reports });
      setIsEditing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

    const handleFileUpload = async () => {
        if (user && file) {
        const fileRef = ref(storage, `medicalReports/${user.uid}/${file.name}`);
        await uploadBytes(fileRef, file);

        const fileURL = await getDownloadURL(fileRef);

        const docRef = doc(db, "users", user.uid);
        const newReport = { name: file.name, url: fileURL, uploadedAt: new Date().toISOString() };

        await updateDoc(docRef, {
            medicalReports: arrayUnion(newReport),
        });

        setReports((prev) => [...prev, newReport]);
        setFile(null);
        }
    };
const handleDeleteReport = async (reportName: string) => {
  if (user) {
    const fileRef = ref(storage, `medicalReports/${user.uid}/${reportName}`);
    await deleteObject(fileRef); // Delete the file from storage

    const docRef = doc(db, "users", user.uid);
    const updatedReports = reports.filter((report) => report.name !== reportName);

    await updateDoc(docRef, {
      medicalReports: updatedReports,
    });

    setReports(updatedReports);
  }
};

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Profile Page</h1>

      {userData && !isEditing ? (
        <div>
          <h2 className="text-lg font-bold">Personal Information</h2>
          <p>Name: {userData.name}</p>
          <p>Email: {user?.email}</p>
          <p>Phone: {userData.phone || "Not Provided"}</p>

          <h2 className="text-lg font-bold mt-4">Medical Information</h2>
          <p>Blood Group: {userData.bloodGroup || "Not Provided"}</p>
          <p>Allergies: {userData.allergies || "None"}</p>
          <p>Medical History: {userData.medicalHistory || "None"}</p>

          {/* <h2 className="text-lg font-bold mt-4">Medical Reports</h2> */}
          {/* <ul>
            {reports.map((report: any, index: number) => (
              <li key={index}>
                <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  {report.name}
                </a>
                <span className="text-gray-500"> (Uploaded: {new Date(report.uploadedAt).toLocaleString()})</span>
              </li>
            ))}
          </ul> */}

<div>
  <h2 className="text-lg font-bold mt-4">Medical Reports</h2>
  {reports.map((report) => (
    <div key={report.name} className="flex items-center justify-between mt-2">
      <div>
        <p>{report.name}</p>
        <a
          href={report.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          View Report
        </a>
      </div>
      <button
        onClick={() => handleDeleteReport(report.name)}
        className="px-4 py-2 bg-red-500 text-white rounded-md"
      >
        Delete
      </button>
    </div>
  ))}
</div>
          <input type="file" onChange={handleFileChange} className="mt-4" />
          <button
            className="mt-2 px-6 py-3 bg-blue-500 text-white rounded-md"
            onClick={handleFileUpload}
          >
            Upload Report
          </button>


          <button
            className="mt-4 px-6 py-3 bg-green-500 text-white rounded-md"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
          <button
            className="mt-4 ml-4 px-6 py-3 bg-red-500 text-white rounded-md"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold">{userData ? "Edit Profile" : "Create Profile"}</h2>
          <div className="mt-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="mb-4 w-full px-4 py-2 border rounded"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mb-4 w-full px-4 py-2 border rounded"
            />
            <input
              type="text"
              name="bloodGroup"
              placeholder="Blood Group"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              className="mb-4 w-full px-4 py-2 border rounded"
            />
            <input
              type="text"
              name="allergies"
              placeholder="Allergies"
              value={formData.allergies}
              onChange={handleInputChange}
              className="mb-4 w-full px-4 py-2 border rounded"
            />
            <input
              type="text"
              name="medicalHistory"
              placeholder="Medical History"
              value={formData.medicalHistory}
              onChange={handleInputChange}
              className="mb-4 w-full px-4 py-2 border rounded"
            />
            <button
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-md"
              onClick={handleProfileSave}
            >
              Save
            </button>
            <button
              className="mt-4 ml-4 px-6 py-3 bg-gray-500 text-white rounded-md"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
