import React, { useState } from "react";
import { api } from "../services/api";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const NovoPost = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState([]); // array de arquivos

  const token = Cookies.get("Authorization");

  if (!isOpen) return null;

  const handleCreate = async () => {
    let postId;

    try {
      const res = await api.post(
        "/posts",
        { title, content, category },
        {
          headers: {
            Authorization: `${token}`,
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
      const status = err?.status;

      if (status == 400) {
        Swal.fire("Erro", err.response.data.message, "error");
      } else {
        Swal.fire("Erro", "Erro ao criar o post. Tente novamente.", "error");
      }

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
              Authorization: `${token}`,
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
        Swal.fire(
          "Sucesso",
          "Todas as imagens foram enviadas com sucesso!",
          "success"
        );
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

        <label className="block text-sm font-medium mb-2">
          Imagens (opcional)
        </label>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
          }}
          className="border-2 border-dashed border-gray-400 rounded-lg p-4 text-center hover:border-blue-500 transition-colors"
        >
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            id="file-upload"
            onChange={(e) =>
              setFiles((prev) => [...prev, ...Array.from(e.target.files)])
            }
          />

          {files.length === 0 ? (
            <label htmlFor="file-upload" className="block cursor-pointer">
              <p className="text-gray-600">
                Arraste e solte imagens aqui ou clique para selecionar
              </p>
              <span className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                Selecionar imagens
              </span>
            </label>
          ) : (
            <div>
              <div className="grid grid-cols-3 gap-3">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="w-full h-32 object-cover rounded-lg shadow-md border hover:scale-105 transition-transform duration-200"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, i) => i !== index))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 text-sm underline hover:text-blue-800"
                >
                  Adicionar mais imagens
                </label>

                <button
                  type="button"
                  onClick={() => setFiles([])}
                  className="text-red-600 text-sm underline hover:text-red-800"
                >
                  Remover todas
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
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
