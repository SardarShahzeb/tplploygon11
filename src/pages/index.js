import { useState } from "react";
import Navbar from "./component/navbar";
import dynamic from 'next/dynamic';
const Banner = dynamic(() => import('./component/banner'), {
  ssr: false
});

export default function Home() {
  const [user, setUser] = useState(null);
  return (
    <>
      <Navbar setUser={setUser} user={user} />
      <Banner setUser={setUser} user={user} />
    </>
  );
}
