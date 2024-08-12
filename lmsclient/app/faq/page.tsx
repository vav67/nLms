"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ/FAQ";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(4);
  const [route, setRoute] = useState("Login");
  const[ profilepage, setProfilepage] = useState(false) //это не профайл пэйдж
  const [pagedatauser, setPagedatauser] = useState(null);

  
  return (
    <div className="min-h-screen">
      <Heading
        title="FAQ - Elearning"
        description="Elearning is a learning management system for helping programmers."
        keywords="programming,mern"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
 
        profilepage = {profilepage}
        userData ={pagedatauser}
     //  refetch={refetch}

      />
      <br />
      <FAQ />  
      <Footer />
    </div>
  );
};

export default Page;
