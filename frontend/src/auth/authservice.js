import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

const googleProvider = new GoogleAuthProvider();

// Helper function to convert Firestore data to serializable format
const convertTimestamps = (obj) => {
  if (!obj) return obj;
  const converted = { ...obj };

  // Convert Timestamp to milliseconds
  if (converted.createdAt instanceof Timestamp) {
    converted.createdAt = converted.createdAt.toMillis();
  }

  return converted;
};

export const authService = {
  // Helper function to get user profile
  async getUserProfile(uid) {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return convertTimestamps(userDoc.data());
    }
    return null;
  },

  // Email Sign Up
  async signUpWithEmail(email, password, role, name) {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const profile = {
        uid: user.uid,
        email: user.email,
        role,
        name,
        createdAt: Date.now(), // Store as milliseconds timestamp
      };

      // Create user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        ...profile,
        createdAt: Timestamp.fromMillis(profile.createdAt), // Convert to Firestore Timestamp for storage
      });

      return {
        user: {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
        },
        profile,
      };
    } catch (error) {
      throw error;
    }
  },

  // Email Sign In
  async signInWithEmail(email, password) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const profile = await this.getUserProfile(user.uid);

      return {
        user: {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
        },
        profile,
      };
    } catch (error) {
      throw error;
    }
  },

  // Google Sign In/Sign Up
  async signInWithGoogle(defaultRole = "user") {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      let profile = await this.getUserProfile(user.uid);

      if (!profile) {
        // Only create new profile with default role if user doesn't exist
        profile = {
          uid: user.uid,
          email: user.email,
          role: defaultRole,
          name: user.displayName || "",
          createdAt: Date.now(), // Store as milliseconds timestamp
        };

        await setDoc(doc(db, "users", user.uid), {
          ...profile,
          createdAt: Timestamp.fromMillis(profile.createdAt), // Convert to Firestore Timestamp for storage
        });
      }

      return {
        user: {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
        },
        profile,
      };
    } catch (error) {
      throw error;
    }
  },

  // Sign Out
  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },
};
