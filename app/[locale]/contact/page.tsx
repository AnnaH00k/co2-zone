'use client';
import React from "react";
import { useTranslations } from 'next-intl'


export default function ContactPage() {
  const t = useTranslations('ContactPage')

  return (
    <div>
      <div className=" mt-[5vh] flex flex-col justify-center items-center">
        <h1 className="text-blueExtraLight text-4xl  m-4 "> 
          {t('header1')}
        </h1>
      </div>
      <div className="text-blueExtraLight container mx-auto px-4">
        <p className="text-lg mb-4">
        {"If you have any questions, suggestions, or feedback, please feel free to contact us using the information below. We'd love to hear from you!"} 
        </p>
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2"> {"Adress"} </h3>
          <p> {"CO2zone GmbH"} 
            <br/> {"Street Address"}  <br/> {"City, Postal Code"}  <br /> {"Country"}
          
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2"> {"Phone"} </h3>
          <p> {"+123456789"} </p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2"> {"Email"} </h3>
          <p> {"info@co2zone.com"} </p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2"> {"Social Media"} </h3>
          <p> {"Connect with us on social media platforms:"}  </p>
          <ul className="list-disc list-inside">
            <li> {"Twitter:"}
             <a href="https://twitter.com/co2zone" >@co2zone</a>
            </li>
            <li> {" Facebook:"}
              <a href="https://www.facebook.com/co2zone">CO2zone</a>
            </li>
            <li> 
              {" Instagram:"}
              <a href="https://www.instagram.com/co2zone">@co2zone</a>
            </li>
          </ul>
        </div>
        <p className="text-lg mb-4"> 
        {"We typically respond to inquiries within 24-48 hours. Thank you for reaching out!"}    
        </p>
      </div>
    </div>
  );
}