import React, { useState } from "react";
import Header from "../components/Header";
import PostBox from "../components/PostBox";
import NovoPost from "../components/ModalPost";

const MainPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); 

    return (
        <>         
            <Header onSearch={setSearchTerm} />

            <div className="pt-24 px-4">
                <PostBox searchTerm={searchTerm} />
            </div>

            <button
                className={`fixed bottom-4 right-4 bg-[#FF6F61] text-white text-2xl p-4 rounded-full shadow-lg transition-transform duration-200
                ${isModalOpen ? "scale-75" : "scale-100"}`}
                onClick={() => setIsModalOpen(true)}
            >
                Novo post
            </button>

            <NovoPost 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    );
};

export default MainPage;
