
import type { WalkthroughStep } from './types';

export const MOCK_PR_DIFF = `
diff --git a/src/components/UserProfile.tsx b/src/components/UserProfile.tsx
index 8f4e2d9..5f7g8h1 100644
--- a/src/components/UserProfile.tsx
+++ b/src/components/UserProfile.tsx
@@ -1,5 +1,6 @@
 import React from 'react';
 import { useUserData } from '../hooks/useUserData';
+import { Avatar } from './Avatar';
 
 interface UserProfileProps {
   userId: string;
@@ -11,7 +12,10 @@
   }
 
   return (
-    <div>
+    <div className="user-profile-card">
+      <Avatar src={user.avatarUrl} alt={user.name} />
       <h1>{user.name}</h1>
       <p>{user.email}</p>
     </div>
   );
 }
diff --git a/src/hooks/useUserData.ts b/src/hooks/useUserData.ts
new file mode 100644
index 0000000..ab12cd3
--- /dev/null
+++ b/src/hooks/useUserData.ts
@@ -0,0 +1,15 @@
+import { useState, useEffect } from 'react';
+
+const fetchUser = (userId: string) => Promise.resolve({
+  name: 'John Doe',
+  email: 'john.doe@example.com',
+  avatarUrl: \`https://picsum.photos/seed/\${userId}/100\`
+});
+
+export const useUserData = (userId: string) => {
+  const [user, setUser] = useState(null);
+
+  useEffect(() => {
+    fetchUser(userId).then(setUser);
+  }, [userId]);
+
+  return user;
+};
`;

export const MOCK_WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 1,
    title: 'New Hook: `useUserData`',
    description: 'A new custom hook was created to encapsulate user data fetching logic.',
    file: 'src/hooks/useUserData.ts',
    line: 10,
  },
  {
    id: 2,
    title: 'Component Update: `UserProfile`',
    description: 'The UserProfile component was updated to use the new `useUserData` hook.',
    file: 'src/components/UserProfile.tsx',
    line: 6,
  },
  {
    id: 3,
    title: 'UI Enhancement: Added Avatar',
    description: 'A new Avatar component is now used in UserProfile to display the user\'s image.',
    file: 'src/components/UserProfile.tsx',
    line: 12,
  },
];
