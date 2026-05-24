import React from "react"; 
import AdminLayout from "../components/AdminLayout"; 
import ImportForm from "./ImportForm"; 

const AnimeImportPage: React.FC = () => {
  return (
    <div className="px-8 py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Jikan Anime Import
      </h1>

      <ImportForm />
    </div>
  );
};

export default AnimeImportPage;
