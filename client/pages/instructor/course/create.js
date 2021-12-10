import SkeletonImage from "antd/lib/skeleton/Image";
import axios from "axios";
import { useState } from "react";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";

import CourseCreateForm from "../../../components/forms/CourseCreateForm";
import InstructorRoute from "../../../components/routes/InstructorRoute";

function CourseCreate() {
  const initState = {
    name: "",
    description: "",
    price: "44.44",
    upload: false,
    paid: false,
    category: "",
    loading: false,
  };

  const [values, setValues] = useState(initState);
  const [preView, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload");
  const [image, setImage] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleImage = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, upload: true });

    //resize
    Resizer.imageFileResizer(
      file,
      720,
      500,
      "JPEG",
      100,
      0,
      async (url) => {
        try {
          let { data } = await axios.post("/api/course/upload-image", {
            image: url,
          });
          setImage(data);
          setValues({ ...values, loading: false });
        } catch (error) {
          setValues({ ...values, loading: false });
          toast("Image uploads failed. Try later");
        }
      },
      "base64",
      200,
      200
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(values);
  };

  const handleRemoveImage = async () => {
    try {
      setValues({ ...values, loading: true });
      const res = await axios.post("/api/course/remove-image", { image });
      setImage({});
      setPreview("");
      setUploadButtonText("Upload Image");
      setValues({ ...values, loading: false });
    } catch (error) {
      console.log(error);
      setValues({ ...values, loading: false });
      toast("Cannot remove image");
    }
  };
  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Create course</h1>

      <div className="py-3">
        {
          <CourseCreateForm
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleImage={handleImage}
            values={values}
            setValues={setValues}
            preView={preView}
            uploadButtonText={uploadButtonText}
            handleRemoveImage={handleRemoveImage}
          />
        }
      </div>
      <pre>{JSON.stringify(values, null, 4)}</pre>
    </InstructorRoute>
  );
}

export default CourseCreate;
