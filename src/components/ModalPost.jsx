import React, { useState } from "react";
import { api } from "../services/api";
import Swal from "sweetalert2";

const NovoPost = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState([]); // array de arquivos

  if (!isOpen) return null;

  const handleCreate = async () => {
    let postId;

    try {
      const res = await api.post(
        "/posts",
        { title, content, category },
        {
          headers: {
            Authorization: `${localStorage.getItem("Authorization")}`,
          },
        }
      );

      postId = res.data.postId;

      Swal.fire({
        title: "Sucesso!",
        text: "Post criado com sucesso!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.log(err);
      Swal.fire("Erro", "Erro ao criar o post. Tente novamente.", "error");
      return;
    }

    if (files.length > 0) {
      const failedFiles = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("files", files[i]);
        formData.append("postId", postId);

        try {
          await api.post("/images", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${localStorage.getItem("Authorization")}`,
            },
          });
        } catch (err) {
          console.log(`Falha ao enviar ${files[i].name}:`, err);
          failedFiles.push(files[i].name);
        }
      }

      if (failedFiles.length > 0) {
        Swal.fire(
          "Atenção",
          `O post foi criado, mas as seguintes imagens não puderam ser enviadas:\n${failedFiles.join(
            "\n"
          )}`,
          "warning"
        );
      } else {
        Swal.fire("Sucesso", "Todas as imagens foram enviadas com sucesso!", "success");
      }
    }

    // Limpar campos
    setTitle("");
    setContent("");
    setCategory("");
    setFiles([]);
    onClose();
    onCreate();
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

        {/* <label className="block text-sm font-medium">Categoria</label>
        <input
          type="text"
          className="w-full border p-2 rounded mb-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        /> */}

        <label className="block text-sm font-medium">Imagens (opcional)</label>
        <input
          type="file"
          className="w-full mb-3"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
        />

        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>
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
