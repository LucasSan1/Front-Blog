import React, { useState } from "react";
import { api } from "../services/api";
import Swal from "sweetalert2";

const NovoPost= ({ isOpen, onClose, onCreate }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");

    if (!isOpen) return null;

    const handleCreate = () => {

        api.post("/posts", {
            title: title,
            content: content,
            category: category,

        }, {
            headers: {
                Authorization: `${localStorage.getItem('Authorization')}`
            }
        })
        .then((res) => {
            Swal.fire({
                title: "Sucesso!",
                text: res.data,
                icon: "success",
                confirmButtonText: "OK"
            })
            setTitle(""); 
            setContent(""); 
            setCategory("");
            onClose(); 
            window.location.reload();

        }) .catch((err) =>{
           Swal.fire("Erro", "Erro ao criar a post. Tente novamente.", "error");
            console.log(err)
        })
    
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center mt-12">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                <h2 className="text-2xl font-bold mb-4">Criar Novo Post</h2>
                
                <label className="block text-sm font-medium">Título</label>
                <input
                    type="text"
                    className="w-full border p-2 rounded mb-3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                
                <label className="block text-sm font-medium">Conteúdo</label>
                <textarea
                    className="w-full border p-2 rounded mb-3 h-24"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                
                <label className="block text-sm font-medium">Categoria</label>
                <input
                    type="text"
                    className="w-full border p-2 rounded mb-3"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                
                <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancelar</button>
                    <button 
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={handleCreate}
                    >
                        Criar Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NovoPost;
