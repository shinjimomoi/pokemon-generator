import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from "./firebase";

const useFetchBalance = () => {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const db = getDatabase();
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      const userUID = currentUser.uid;
      const balanceRef = ref(db, `users/${userUID}/balance`);

      const unsubscribe = onValue(balanceRef, (snapshot) => {
        const balanceValue = snapshot.val();
        console.log(balanceValue, "balanceRef");
        setBalance(balanceValue);
      });

      return () => unsubscribe();
    }
  }, [setBalance]);

  return balance;
};

export default useFetchBalance;