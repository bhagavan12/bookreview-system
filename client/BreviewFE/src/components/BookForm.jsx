// // import React, { useState } from 'react';

// // const BookForm = ({ onSubmit }) => {
// //   const [title, setTitle] = useState("");
// //   const [author, setAuthor] = useState("");
// //   const [coverUrl, setCoverUrl] = useState("");
// //   const [description, setDescription] = useState("");
// //   const [genre, setGenre] = useState("");

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     const newBook = { title, author, coverUrl, description, genre,userId:JSON.parse(localStorage.getItem('user'))._id };
// //     onSubmit(newBook);
// //   };

// //   return (
// //     <form onSubmit={handleSubmit}>
// //       <h3>Add a New Book</h3>
// //       <div>
// //         <input
// //           type="text"
// //           value={title}
// //           onChange={(e) => setTitle(e.target.value)}
// //           placeholder="Book Title"
// //           required
// //         />
// //       </div>
// //       <div>
// //         <input
// //           type="text"
// //           value={author}
// //           onChange={(e) => setAuthor(e.target.value)}
// //           placeholder="Author"
// //           required
// //         />
// //       </div>
// //       <div>
// //         <input
// //           type="text"
// //           value={coverUrl}
// //           onChange={(e) => setCoverUrl(e.target.value)}
// //           placeholder="Cover URL"
// //         />
// //       </div>
// //       <div>
// //         <textarea
// //           value={description}
// //           onChange={(e) => setDescription(e.target.value)}
// //           placeholder="Description"
// //           required
// //         />
// //       </div>
// //       <div>
// //         <input
// //           type="text"
// //           value={genre}
// //           onChange={(e) => setGenre(e.target.value)}
// //           placeholder="Genre"
// //         />
// //       </div>
// //       <button type="submit">Add Book</button>
// //     </form>
// //   );
// // };

// // export default BookForm;


// import React, { useState } from "react";
// import { storage } from "../firebase"; // Import Firebase storage
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// const BookForm = ({ onSubmit }) => {
//   const [title, setTitle] = useState("");
//   const [author, setAuthor] = useState("");
//   const [coverUrl, setCoverUrl] = useState("");
//   const [coverFile, setCoverFile] = useState(null);
//   const [description, setDescription] = useState("");
//   const [genre, setGenre] = useState("");
//   const [uploading, setUploading] = useState(false);

//   const handleFileChange = (e) => {
//     setCoverFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let imageUrl = coverUrl; // Use coverUrl if provided manually

//     if (coverFile) {
//       try {
//         setUploading(true);
//         const storageRef = ref(storage, `book_covers/${coverFile.name}`);
//         await uploadBytes(storageRef, coverFile);
//         imageUrl = await getDownloadURL(storageRef);
//         setUploading(false);
//       } catch (error) {
//         console.error("Error uploading image:", error);
//         setUploading(false);
//         return;
//       }
//     }

//     const newBook = {
//       title,
//       author,
//       coverUrl: imageUrl,
//       description,
//       genre,
//       userId: JSON.parse(localStorage.getItem("user"))._id,
//     };

//     onSubmit(newBook);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h3>Add a New Book</h3>

//       <div>
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Book Title"
//           required
//         />
//       </div>

//       <div>
//         <input
//           type="text"
//           value={author}
//           onChange={(e) => setAuthor(e.target.value)}
//           placeholder="Author"
//           required
//         />
//       </div>

//       <div>
//         <input
//           type="text"
//           value={coverUrl}
//           onChange={(e) => setCoverUrl(e.target.value)}
//           placeholder="Cover Image URL (optional)"
//         />
//       </div>

//       <div>
//         <input type="file" onChange={handleFileChange} accept="image/*" />
//       </div>

//       {uploading && <p>Uploading Image...</p>}

//       <div>
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Description"
//           required
//         />
//       </div>

//       <div>
//         <input
//           type="text"
//           value={genre}
//           onChange={(e) => setGenre(e.target.value)}
//           placeholder="Genre"
//         />
//       </div>

//       <button type="submit" disabled={uploading}>
//         {uploading ? "Uploading..." : "Add Book"}
//       </button>
//     </form>
//   );
// };

// export default BookForm;

//v1 - 10-2-25 
import React, { useState } from "react";
import Modal from 'react-modal';
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Upload, Image, Loader } from 'lucide-react';
import '../styles/BookForm.css';
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
// import { Textarea } from "primereact/textarea";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputTextarea } from "primereact/inputtextarea";
// import { Button } from "primereact/button";


const BookForm = ({ isOpen, onRequestClose, onSubmit }) => {
  const customStyles = {
    content: {
      top: '60%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    // setCoverFile(e.target.files[0]);
    const file = e.files[0];
    setCoverFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = coverUrl;

    if (coverFile) {
      try {
        setUploading(true);
        const storageRef = ref(storage, `book_covers/${coverFile.name}`);
        await uploadBytes(storageRef, coverFile);
        imageUrl = await getDownloadURL(storageRef);
        setUploading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploading(false);
        return;
      }
    }

    const newBook = {
      title,
      author,
      coverUrl: imageUrl,
      description,
      genre,
      userId: JSON.parse(localStorage.getItem("user"))._id,
    };

    onSubmit(newBook);
  };

  return (
    //   <Modal
    //   isOpen={isOpen}
    //   onRequestClose={onRequestClose}
    //   style={customStyles}
    //   contentLabel="Add Book Modal"
    // >
    <Dialog
      header="Add a New Book"
      visible={isOpen}
      style={{ width: "40vw" }}
      modal
      onHide={onRequestClose}
    >
      <form className="book-form" onSubmit={handleSubmit}>
        <div className="p-field">
          <label>Book Title</label>
          <InputText
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="p-inputtext w-full"
          />
        </div>

        <div className="p-field">
          <label>Author</label>
          <InputText
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="p-inputtext w-full"
          />
        </div>

        <div className="p-field">
          <label>Cover Image URL (Optional)</label>
          <InputText
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            className="p-inputtext w-full"
          />
        </div>

        <div className="p-field">
          <label>Upload Cover Image</label>
          <FileUpload
            mode="basic"
            accept="image/*"
            maxFileSize={1000000}
            customUpload
            onSelect={handleFileChange}
            chooseLabel="Select Image"
          />
        </div>

        {uploading && (
          <div className="uploading">
            <ProgressSpinner />
            <span>Uploading Image...</span>
          </div>
        )}

        <div className="p-field">
          <label>Description</label>
          <InputTextarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="p-textarea w-full"
          />
        </div>

        <div className="p-field">
          <label>Genre</label>
          <InputText
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="p-inputtext w-full"
          />
        </div>

        <Button
          type="submit"
          disabled={uploading}
          label={uploading ? "Uploading..." : "Add Book"}
          icon={uploading ? "pi pi-spin pi-spinner" : "pi pi-check"}
          className="p-button-success w-full"
        />
      </form>
    </Dialog>
  );
};

export default BookForm;
  //   <Dialog
  //   header="Add a New Book"
  //   visible={isOpen}
  //   style={{ width: "50vw" }}
  //   modal
  //   onHide={onRequestClose}
  // >
  //   <form className="book-form" onSubmit={handleSubmit}>
  //     <h3>Add a New Book</h3>
  //     <div className="grpp">
  //       <div className="form-group">
  //         <InputText
  //           type="text"
  //           value={title}
  //           onChange={(e) => setTitle(e.target.value)}
  //           placeholder="Book Title"
  //           required
  //           className="form-input"
  //         />
  //       </div>

  //       <div className="form-group">
  //         <InputText
  //           type="text"
  //           value={author}
  //           onChange={(e) => setAuthor(e.target.value)}
  //           placeholder="Author"
  //           required
  //           className="form-input"
  //         />
  //       </div>

  //       <div className="form-group">
  //         <InputText
  //           type="text"
  //           value={coverUrl}
  //           onChange={(e) => setCoverUrl(e.target.value)}
  //           placeholder="Cover Image URL (optional)"
  //           className="form-input"
  //         />
  //         <div className="form-group file-upload">
  //           <label className="file-label">
  //             <InputText
  //               type="file"
  //               onChange={handleFileChange}
  //               accept="image/*"
  //               className="file-input"
  //             />
  //             <span className="file-button">
  //               <Image size={20} />
  //               Choose Cover Image
  //             </span>
  //           </label>
  //           {coverFile && <span className="file-name">{coverFile.name}</span>}
  //         </div>
  //       </div>


  //       {uploading && (
  //         <div className="uploading">
  //           <Loader className="spin" />
  //           <span>Uploading Image...</span>
  //         </div>
  //       )}

  //       <div className="form-group">
  //         <InputTextarea
  //           value={description}
  //           onChange={(e) => setDescription(e.target.value)}
  //           placeholder="Description"
  //           required
  //           className="form-textarea"
  //         />
  //       </div>

  //       <div className="form-group">
  //         <InputText
  //           type="text"
  //           value={genre}
  //           onChange={(e) => setGenre(e.target.value)}
  //           placeholder="Genre"
  //           className="form-input"
  //         />
  //       </div>

  //       <Button type="submit" disabled={uploading} className="submit-button">
  //         {uploading ? (
  //           <>
  //             <Loader className="spin" />
  //             <span>Uploading...</span>
  //           </>
  //         ) : (
  //           <>
  //             <Upload size={20} />
  //             <span>Add Book</span>
  //           </>
  //         )}
  //       </Button>
  //     </div>
  //   </form>
  //   </Dialog>