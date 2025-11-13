import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FiEdit, FiCheck, FiX, FiTrash2 } from "react-icons/fi";
import ModalConfirmar from "./ModalConfirmar";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const formatRelativeTime = (dateString) => {
  if (!dateString) return "Data não disponível";
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  } catch (error) {
    return "Data inválida";
  }
};

const PostBox = ({ searchTerm }) => {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemType, setItemType] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const token = Cookies.get("Authorization");

  useEffect(() => {
    api
      .get("/posts")
      .then((res) => {
        const fetchedPosts = res.data.reverse();
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);

        const email = JSON.parse(Cookies.get("user") || "{}");
        setUserEmail(email);
        setIsLoggedIn(!!token);
      })
      .catch((err) => {
        Swal.fire("Erro", "Erro ao buscar posts");
        console.log("Erro ao buscar posts: ", err.response);
      });
  }, []);

  useEffect(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    setFilteredPosts(
      posts.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerCaseSearch) ||
          post.content.toLowerCase().includes(lowerCaseSearch)
      )
    );
  }, [searchTerm, posts]);


  // Função para adicionar novo comentario a um post
  const handleNewComment = (e, postID) => {
    e.preventDefault();
    api
      .post(
        `/comments/${postID}`,
        { content: newComment },
        {
          headers: { Authorization: token },
        }
      )
      .then(() => window.location.reload())
      .catch((err) => {
        Swal.fire({
          icon: "warning",
          title:
            err.response?.status === 401
              ? "Você precisa estar logado para comentar!"
              : "Erro ao comentar!",
        });
        console.error("Erro ao adicionar comentário:", err.response);
      });
    setNewComment("");
  };

  // Função para habilitar campos editaveis nos posts
  const handleEditPost = (post) => {
    setEditingPost(post.id);
    setEditedContent(post.content);
    setEditedTitle(post.title);
    setEditedCategory(post.category);
  };

  // Função para atualizar os posts
  const savePostEdit = (post) => {
    if (
      editedTitle === post.title &&
      editedContent === post.content &&
      editedCategory === post.category
    ) {
      Swal.fire("Aviso", "Nenhuma mudança foi feita.", "info");
      setEditingPost(null);
      return;
    }

    api
      .put(
        `/posts/${post.id}`,
        {
          title: editedTitle || post.title,
          content: editedContent || post.content,
          category: editedCategory || post.category,
        },
        {
          headers: { Authorization: token },
        }
      )
      .then(() => window.location.reload())
      .catch((err) => {
        Swal.fire("Erro", "Erro ao editar post", "error");
        console.log("Erro ao editar post: ", err);
      });
  };

  // função para habilitar campos editaveis nos comentarios
  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditedCommentContent(comment.content);
  };

  // Função para salvar os comentarios depois de editados
  const saveCommentEdit = (comment) => {
    if (editedCommentContent === comment.content) {
      Swal.fire("Aviso", "Nenhuma mudança foi feita.", "info");
      setEditingComment(null);
      return;
    }

    api
      .put(
        `/comments/${comment.id}`,
        {
          content: editedCommentContent || comment.content,
        },
        {
          headers: { Authorization: token },
        }
      )
      .then(() => window.location.reload())
      .catch(() => Swal.fire("Erro", "Erro ao editar comentário", "error"));
  };

  // Função para deletar o post
  const deletePost = () => {
    if (itemToDelete && itemType === "post") {
      api
        .delete(`/posts/${itemToDelete.id}`, {
          headers: { Authorization: token },
        })
        .then(() => {
          setIsModalOpen(false);
          window.location.reload();
        })
        .catch((err) => {
          if (err.response?.status === 409) {
            Swal.fire(
              "Erro",
              "Não é possível deletar um post que ainda tem comentários",
              "error"
            );
          } else {
            Swal.fire("Erro", "Erro ao excluir post", "error");
          }
        });
    }
  };


  // Função para deletar um comentario
  const deleteComment = () => {
    if (itemToDelete && itemType === "comment") {
      api
        .delete(`/comments/${itemToDelete.id}`, {
          headers: { Authorization: token },
        })
        .then(() => {
          setIsModalOpen(false);
          window.location.reload();
        })
        .catch(() => Swal.fire("Erro", "Erro ao excluir comentário", "error"));
    }
  };


  // Função para deletar uma imagem
  const handleDeleteImage = async (imgId) => {
    try {
      const confirm = await Swal.fire({
        title: "Remover imagem?",
        text: "Tem certeza que deseja deletar esta imagem?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, deletar!",
        cancelButtonText: "Cancelar",
      });

      if (!confirm.isConfirmed) return;

      await api.delete("/images", {
        data: [imgId],
        headers: { Authorization: token },
      });

      Swal.fire("Deletado!", "Imagem removida com sucesso!", "success");
      setDeletedImages((prev) => [...prev, imgId]);
    } catch (err) {
      console.error("Erro ao deletar imagem:", err);
      Swal.fire("Erro", "Não foi possível deletar a imagem!", "error");
    }
  };

  // Função para adicionar mais imagens aos posts
  const handleAddImages = async (e, postId) => {
    const token = Cookies.get("Authorization");
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const failedFiles = [];

    try {
      const confirm = await Swal.fire({
        title: "Adicionar imagens?",
        text: `Você está prestes a adicionar ${files.length} imagem(ns) ao post.`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sim, enviar!",
        cancelButtonText: "Cancelar",
      });

      if (!confirm.isConfirmed) return;

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
          console.error(`Falha ao enviar ${files[i].name}:`, err);
          failedFiles.push(files[i].name);
        }
      }

      if (failedFiles.length > 0) {
        Swal.fire(
          "Aviso",
          `Algumas imagens não puderam ser enviadas:\n${failedFiles.join(
            "\n"
          )}`,
          "warning"
        );
      } else {
        Swal.fire("Sucesso!", "Imagens adicionadas com sucesso!", "success");
      }
      
      window.location.reload();
    } catch (err) {
      console.error("Erro geral ao enviar imagens:", err);
      Swal.fire("Erro", "Não foi possível enviar as imagens!", "error");
    }
  };

  // Função para fechar modal de novo post
  const handleModalClose = () => {
    setIsModalOpen(false);
    setItemToDelete(null);
    setItemType("");
  };

  // Função para chamar modal de confirmação
  const handleConfirmDelete = () => {
    if (itemType === "post") deletePost();
    else if (itemType === "comment") deleteComment();
  };

  return (
    <div className="space-y-6">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-300 mb-6"
          >
            {/* Header */}
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{post.authorName}</span>
              </div>
              <span className="text-xs text-gray-500 ml-2">
                {formatRelativeTime(post.dateTime)}
              </span>
              {isLoggedIn &&
                (post.authorEmail?.toLowerCase() === userEmail?.toLowerCase() ||
                  post.authorName?.toLowerCase() ===
                    userEmail?.toLowerCase()) && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="text-blue-500 text-sm"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => {
                        setItemToDelete(post);
                        setItemType("post");
                        setIsModalOpen(true);
                      }}
                      className="text-red-500 text-sm flex items-center"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )}
            </div>

            {/* Título */}
            <h1 className="text-2xl font-bold text-[#333333] mb-4">
              {editingPost === post.id ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              ) : (
                post.title
              )}
            </h1>

            {/* Conteúdo */}
            {editingPost === post.id ? (
              <div>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                ></textarea>

                <button
                  onClick={() => savePostEdit(post)}
                  className="text-green-500 mx-2"
                >
                  <FiCheck />
                </button>
                <button
                  onClick={() => setEditingPost(null)}
                  className="text-red-500"
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <p className="mb-4 text-gray-700">{post.content}</p>
            )}

            {/* Galeria de imagens */}
            {post.imagesIds && post.imagesIds.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {post.imagesIds.map(
                  (imgId) =>
                    !deletedImages.includes(imgId) && (
                      <div key={imgId} className="relative group">
                        <img
                          // src={`https://graceful-corly-sant422-5dd649ae.koyeb.app/images/${imgId}`}
                          src={`http://localhost:8080/images/${imgId}`}
                          alt={`Imagem ${imgId}`}
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        {editingPost === post.id && (
                          <button
                            onClick={() => handleDeleteImage(imgId)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                            title="Excluir imagem"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>
                    )
                )}
              </div>
            )}

            {editingPost === post.id && (
              <div className="mt-4">
                <label className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition">
                  <span>Adicionar imagem</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleAddImages(e, post.id)}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Comentários */}
            <div className="bg-gray-100 p-4 rounded-lg mt-6 border-t-2 border-gray-300">
              <h2 className="text-lg font-semibold text-[#333333] mb-4">
                Comentários
              </h2>
              <div className="space-y-4">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <div
                      key={comment.id || comment.dateTime}
                      className="border-b border-gray-300 pb-4"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800">
                          {comment.authorName}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatRelativeTime(comment.dateTime)}
                        </span>
                        {isLoggedIn &&
                          (comment.authorEmail?.toLowerCase() ===
                            userEmail?.toLowerCase() ||
                            comment.authorName?.toLowerCase() ===
                              userEmail?.toLowerCase()) && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditComment(comment)}
                                className="text-blue-500 text-sm"
                              >
                                <FiEdit />
                              </button>
                              <button
                                onClick={() => {
                                  setItemToDelete(comment);
                                  setItemType("comment");
                                  setIsModalOpen(true);
                                }}
                                className="text-red-500 text-sm"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          )}
                      </div>
                      {editingComment === comment.id ? (
                        <div>
                          <textarea
                            value={editedCommentContent}
                            onChange={(e) =>
                              setEditedCommentContent(e.target.value)
                            }
                            className="w-full p-2 border rounded-lg"
                          ></textarea>
                          <button
                            onClick={() => saveCommentEdit(comment)}
                            className="text-green-500 mx-2"
                          >
                            <FiCheck />
                          </button>
                          <button
                            onClick={() => setEditingComment(null)}
                            className="text-red-500"
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : (
                        <p className="text-gray-600 mt-2">{comment.content}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">Ainda não há comentários.</p>
                )}
                <form
                  onSubmit={(e) => handleNewComment(e, post.id)}
                  className="mt-4 flex"
                >
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Digite seu comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-[#007BFF] text-white px-4 py-2 rounded-lg ml-2"
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">Carregando Posts! </p>
      )}

      {/* Modal de confirmação */}
      {isModalOpen && (
        <ModalConfirmar
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={handleConfirmDelete}
          message={
            itemType === "post"
              ? "Tem certeza que deseja excluir este post e todos seus comentários?"
              : "Tem certeza que deseja excluir este comentário?"
          }
        />
      )}
    </div>
  );
};

export default PostBox;
