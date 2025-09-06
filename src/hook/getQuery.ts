import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useGetQuery = (queryParam?: string) => {
  const router = useRouter();
  const [updateId, setUpdateId] = useState<string | null>(null);

  useEffect(() => {
    const queryID = router?.query?.id as string;
    const isUpdate = queryID?.startsWith("update");
    const q = queryParam ? `${queryParam}-` : ''

    const onlyID = isUpdate
      ? queryID.replace(q || "update-", "")
      : null;
    setUpdateId(onlyID);
  }, [router?.query]);

  return { id: updateId };
};

export default useGetQuery;
