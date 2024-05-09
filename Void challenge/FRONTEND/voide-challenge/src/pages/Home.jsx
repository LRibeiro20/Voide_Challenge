import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { Form, FormControl, Button, Modal, Dropdown } from "react-bootstrap";
function Home() {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    post_id: "",
  });

  const [showPostModal, setShowPostModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  const handlePostModalClose = () => setShowPostModal(false);
  const handlePostModalShow = (data = {}) =>{ 
    setPost(data);
    setShowPostModal(true)};

  const handleGalleryModalClose = () => setShowGalleryModal(false);
  const handleGalleryModalShow = () => setShowGalleryModal(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleChangeUpdate = (e) => {
    const { name, value } = e.target;
    setPost((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDelete = async (post_id) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/posts/"+post_id, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      const data = await response.json();
      fetchData();
      console.log("Post created:", data);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleUpdate = async () => {
    const offlinePosts = JSON.parse(localStorage.getItem("offlinePosts")) || [];

    try {
      if (navigator.onLine) {
        const response = await fetch("http://127.0.0.1:5000/posts/"+post.post_id, {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(post),
        });
        const data = await response.json();

        console.log(data)
        fetchData();
        // alert("Postagem Atualizada ocom sucesso");

      } else {
        // O usuário está offline, então a postagem é salva localmente
        offlinePosts.push(post);
        localStorage.setItem("offlinePosts", JSON.stringify(offlinePosts));

        // Alertar ao usuário que a postagem foi salva localmente
        alert(
          "Você está offline. Sua postagem será enviada quando você estiver online novamente."
        );
      }

      handlePostModalClose();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/posts", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      // Adicionar os dados da requisição no localStorage
      localStorage.setItem("postsData", JSON.stringify(data));

      // Definir os posts com os dados recebidos da API
      setPosts(data);
    } catch (error) {
      // Se ocorrer um erro, tentar obter os dados do localStorage
      const dataFromStorage = localStorage.getItem("postsData");

      if (dataFromStorage) {
        // Se houver dados no localStorage, definir os posts com esses dados
        setPosts(JSON.parse(dataFromStorage));
      } else {
        // Se não houver dados no localStorage, mostrar um erro
        console.error("Error fetching data from api:", error);
      }
    }
  };

  useEffect(() => {
  
    fetchData();
  }, []);

  function getDate(full_date) {
    let date = new Date(full_date);

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
  return (
    <div>
      <NavBar />
      <div className="container pb-5">
        {posts.map((post) => (
          <div className=" my-3 " key={post.post_id}>
            <hr />
            <div className="d-flex justify-content-between mb-4">
              <div className="d-flex align-items-center">
                <div className="mr-2">
                  <img width={50} src={post.avatar} />
                </div>
                <div>
                  <h6 className="py-0 my-0">{post.username}</h6>
                  <p className="py-0 my-0">{getDate(post.created_at)}</p>
                </div>
              </div>
              <div className="d-flex align-items-center">
              <i className="fa-solid fa-share-from-square mr-3"></i>
                <Dropdown>
                  <Dropdown.Toggle variant="link" id="dropdown-basic">
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={()=>handlePostModalShow(post)}>
                      Atualizar
                    </Dropdown.Item>
                    <Dropdown.Item onClick={()=>handleDelete(post.post_id)}>Apagar</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                
              </div>
            </div>
            {/* <h5>{post.title}</h5> */}
            <p className="text-ellipsis-2">{post.content}</p>
          </div>
        ))}
      </div>

      <Modal show={showPostModal} onHide={handlePostModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="postTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter title"
                value={post.title}
                onChange={handleChangeUpdate}
              />
            </Form.Group>
            <Form.Group controlId="postContent">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                rows={3}
                placeholder="Enter content"
                value={post.content}
                onChange={handleChangeUpdate}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePostModalClose}>
            Close
          </Button>
          <Button type="submit" variant="primary" onClick={handleUpdate}>
            Atualizar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showGalleryModal} onHide={handleGalleryModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="imageUpload">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter title"
                value={formData.title}
                onChange={handleChange}
              />
              <Form.Label>Choose Image</Form.Label>
              <FormControl
                type="file"
                name="image"
                className="form-control"
                onChange={formData.imageUrl}
                placeholder="Upload File"
              />
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                rows={3}
                placeholder="Enter content"
                value={formData.content}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleGalleryModalClose}>
            Close
          </Button>
          <Button type="submit" variant="primary" onClick={handleUpdate}>
            Atualizar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;
