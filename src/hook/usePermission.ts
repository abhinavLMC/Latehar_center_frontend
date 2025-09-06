import { LOCAL_FORAGE_PERMISSION_KEY } from "@constants/AppConstant";
import localforage from "localforage";
import { useEffect, useState } from "react";

interface RecordTypes {
  [key: string]: string[];
}

const usePermission = (page_name: string) => {
  const [permissionArr, setPermissionArr] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Default permissions for pages that should have automatic access
  const DEFAULT_PERMISSIONS: RecordTypes = {
    consultation_management: ['view', 'edit', 'create'],
    // Add other default permissions here if needed
  };

  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    try {
      let prmsnObj = (await localforage.getItem(
        LOCAL_FORAGE_PERMISSION_KEY
      )) as RecordTypes;

      // If no permissions object exists, create one with defaults
      if (!prmsnObj) {
        prmsnObj = { ...DEFAULT_PERMISSIONS };
        await localforage.setItem(LOCAL_FORAGE_PERMISSION_KEY, prmsnObj);
      }

      // If specific page permission doesn't exist but we have a default, add it
      if (!prmsnObj[page_name] && DEFAULT_PERMISSIONS[page_name]) {
        prmsnObj[page_name] = DEFAULT_PERMISSIONS[page_name];
        await localforage.setItem(LOCAL_FORAGE_PERMISSION_KEY, prmsnObj);
      }
      setPermissionArr(prmsnObj?.[page_name] || []);
    } catch (err) {
      // This code runs if there were any errors.
      console.error("Permission error:", err);
      
      // Fallback: Use default permissions if available
      if (DEFAULT_PERMISSIONS[page_name]) {
        setPermissionArr(DEFAULT_PERMISSIONS[page_name]);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    canView: permissionArr?.includes("view") ? true : false,
    canEdit: permissionArr?.includes("edit") ? true : false,
    canCreate: permissionArr?.includes("create") ? true : false,
    canModify: permissionArr?.length >= 2 ? true : false,
    loading,
  };
};

export default usePermission;
