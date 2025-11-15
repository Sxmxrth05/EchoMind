// src/utils/userService.ts
import type { UserResource } from "@clerk/types";

// Backend API URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export interface UserData {
  username: string;
  email: string;
  clerkUserId: string;
  age: number;
}

export interface ClerkUserData {
  username: string;
  email: string;
  clerkUserId: string;
  age: number;
}

// Extract user data from Clerk user object
export const extractClerkUserData = (user: UserResource): ClerkUserData => {
  // Get the primary email
  const primaryEmail = user.emailAddresses.find(
    (email: any) => email.id === user.primaryEmailAddressId
  );

  // Get username (fallback to first name + last name if username not available)
  const username =
    user.username ||
    (user.firstName && user.lastName
      ? `${user.firstName}${user.lastName}`
      : "") ||
    primaryEmail?.emailAddress.split("@")[0] ||
    "user";

  // Get age from user metadata (you'll need to collect this during signup)
  const age =
    (user.publicMetadata?.age as number) ||
    // (user.privateMetadata?.age as number) ||
    18; // Default age

  return {
    username,
    email: primaryEmail?.emailAddress || "",
    clerkUserId: user.id,
    age,
  };
};

// Send user data to your backend
export const createUserInDatabase = async (
  userData: ClerkUserData,
  sessionToken?: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(sessionToken && { "Authorization": `Bearer ${sessionToken}` }),
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        clerkUserId: userData.clerkUserId,
        age: userData.age,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("User created successfully:", result);
    return true;
  } catch (error) {
    console.error("Error creating user in database:", error);
    return false;
  }
};

// Alternative: Send user data with Clerk user ID for better identification
// export const syncUserWithBackend = async (
//   user: UserResource
// ): Promise<boolean> => {
//   try {
//     const userData = extractClerkUserData(user);

//     const response = await fetch(`${BACKEND_URL}/api/users/sync`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         clerkUserId: user.id, // Clerk's unique user ID
//         username: userData.username,
//         email: userData.email,
//         age: userData.age,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         imageUrl: user.imageUrl,
//         lastSignInAt: user.lastSignInAt,
//         createdAt: user.createdAt,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const result = await response.json();
//     console.log("User synced successfully:", result);
//     return true;
//   } catch (error) {
//     console.error("Error syncing user with backend:", error);
//     return false;
//   }
// };
