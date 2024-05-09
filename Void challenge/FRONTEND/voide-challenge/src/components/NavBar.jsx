import React, { useState } from "react";
import { Container, Navbar, Form, FormControl, Nav, Button, Modal } from "react-bootstrap";

const NavBar = () => {
    const [showPostModal, setShowPostModal] = useState(false);
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        imageUrl: "",
        user_id: 1
    });

    const handlePostModalClose = () => setShowPostModal(false);
    const handlePostModalShow = () => setShowPostModal(true);

    const handleGalleryModalClose = () => setShowGalleryModal(false);
    const handleGalleryModalShow = () => setShowGalleryModal(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

    const handlePostSubmit = async () => {
        const offlinePosts = JSON.parse(localStorage.getItem("offlinePosts")) || [];

        try {
            if (navigator.onLine) {
                const response = await fetch("http://127.0.0.1:5000/posts", {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                const data = await response.json();

                console.log("Post created:", data);
                alert('Postagem criada com sucesso');
            } else {
                // O usuário está offline, então a postagem é salva localmente
                offlinePosts.push(formData);
                localStorage.setItem("offlinePosts", JSON.stringify(offlinePosts));

                // Alertar ao usuário que a postagem foi salva localmente
                alert('Você está offline. Sua postagem será enviada quando você estiver online novamente.');
            }

            handlePostModalClose();
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <>
            <Navbar bg="light" expand="md" className="shadow py-0 mb-5 " style={{ width: "100%", zIndex: 3, opacity: 0.9}}>
                <Container>
                    <Navbar.Brand href="/" className="font-weight-bold text-secondary">HOME</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarCollapse" />
                    <Navbar.Collapse id="navbarCollapse">
                        <Nav className="font-weight-bold mx-auto py-0" style={{ padding: "20px 15px"}}>
                            <Form className="p-2">
                                <FormControl type="text" placeholder="Begin posting" className="mr-sm-2" style={{ borderRadius: "10px", width: "500px"}} />
                            </Form>
                            <Button style={{ margin: "5px", width: "40px", height: "40px"}} onClick={handlePostModalShow}><i className="fas fa-plus-square"></i></Button>
                            <Button style={{ margin: "5px", width: "40px", height: "40px", background: "green"}} onClick={handleGalleryModalShow}><i className="fa-regular fa-image" style={{ color: "white"}}></i></Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Modal show={showPostModal} onHide={handlePostModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="postTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title" placeholder="Enter title" value={formData.title} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="postContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control as="textarea" name="content" rows={3} placeholder="Enter content" value={formData.content} onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handlePostModalClose}>Close</Button>
                    <Button type="submit" variant="primary" onClick={handlePostSubmit}>Add Post</Button>
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
                            <Form.Control type="text" name="title" placeholder="Enter title" value={formData.title} onChange={handleChange} />
                            <Form.Label>Choose Image</Form.Label>
                            <FormControl type="file" name="image" className="form-control" onChange={formData.imageUrl} placeholder="Upload File" />
                            <Form.Label>Content</Form.Label>
                            <Form.Control as="textarea" name="content" rows={3} placeholder="Enter content" value={formData.content} onChange={handleChange}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleGalleryModalClose}>Close</Button>
                    <Button type="submit" variant="primary">Upload</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default NavBar;
