import React, { useState } from "react";
import Header from "../components/Header";
import PostBox from "../components/PostBox";
import NovoPost from "../components/ModalPost";
import { FiPlus } from "react-icons/fi";

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
                className="fixed bottom-4 right-4 bg-[#FF6F61] text-white text-xl p-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
                onClick={() => setIsModalOpen(true)}
            >
                <FiPlus />
            </button>

            <NovoPost 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    );
};

export default MainPage;
